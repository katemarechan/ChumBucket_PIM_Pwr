import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "@/FirebaseConfig";
import { useThemeManager } from "@/context/ThemeContext";
import { colors, commonStyles } from "@/styles/styles";
import {
  arrayRemove,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

type ShopItem = string;

const ShoplistScreen: React.FC = () => {
  const { current } = useThemeManager();
  const theme = colors[current];

  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  const loadShoplist = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      const data = snap.exists() ? (snap.data() as any) : {};
      const shoplist: string[] = Array.isArray(data.shoplist)
        ? data.shoplist
        : [];
      setItems(shoplist);
    } catch (e) {
      console.error("Failed to load shoplist", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadShoplist();
    }, [loadShoplist])
  );

  const handleMarkBought = async (name: string) => {
    if (!user) return;

    setItems((prev) => prev.filter((i) => i !== name));

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        shoplist: arrayRemove(name),
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Failed to update shoplist", e);
      loadShoplist();
    }
  };

  if (loading) {
    return (
      <View
        style={[
          commonStyles.container,
          styles.centered,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading shoplist…
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        commonStyles.container,
        {
          backgroundColor: theme.background,
          paddingTop: 40,
          paddingHorizontal: 20,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.title,
            {
              color: theme.text,
            },
          ]}
        >
          Shoplist
        </Text>

        {items.length > 0 && (
          <View
            style={[
              styles.counterBadge,
              {
                borderColor: theme.primary + "55",
                backgroundColor: theme.primary + "22",
              },
            ]}
          >
            <Text
              style={[
                styles.counterText,
                {
                  color: theme.primary,
                },
              ]}
            >
              {items.length} item{items.length === 1 ? "" : "s"}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.subtitle,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        Ingredients you have added to your shoplist
      </Text>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text
            style={[
              styles.emptyTitle,
              {
                color: theme.text,
              },
            ]}
          >
            Your shoplist is empty
          </Text>
          <Text
            style={[
              styles.emptyDescription,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            Mark ingredients as “Need to buy” in a recipe to see them in your
            shop list
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View
              style={[
                styles.itemCard,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View style={styles.itemInfo}>
                <Text
                  style={[
                    styles.itemName,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  {item}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleMarkBought(item)}
                activeOpacity={0.8}
                style={[
                  styles.boughtBtn,
                  {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
              >
                <Text style={styles.boughtText}>Bought</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  counterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  counterText: {
    fontSize: 13,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    marginTop: 48,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: "center",
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 28,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemInfo: {
    flexShrink: 1,
    paddingRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  boughtBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  boughtText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ShoplistScreen;
