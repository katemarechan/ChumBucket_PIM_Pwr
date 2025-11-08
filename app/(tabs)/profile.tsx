import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useThemeManager } from "@/context/ThemeContext";
import { auth, db, storage } from "@/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState(false);
  const [themeModal, setThemeModal] = useState(false);
  const { theme, current, changeTheme } = useThemeManager();
  const user = auth.currentUser;

  const palette = useMemo(() => Colors[current], [current]);

  async function ensureUserDoc(uid: string) {
    const r = doc(db, "users", uid);
    const s = await getDoc(r);
    if (!s.exists()) {
      const fallbackUsername =
        user?.email && user.email.includes("@")
          ? `@${user.email.split("@")[0]}`
          : "@user";
      await setDoc(
        r,
        {
          uid,
          email: user?.email ?? null,
          name: user?.displayName ?? "User",
          username: fallbackUsername,
          username_lower: fallbackUsername.toLowerCase(),
          theme: "system",
          photoURL: user?.photoURL ?? null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  }

  useEffect(() => {
    (async () => {
      if (!user) return;
      await ensureUserDoc(user.uid);

      const refDoc = doc(db, "users", user.uid);
      const snap = await getDoc(refDoc);

      if (snap.exists()) {
        const data = snap.data() as any;
        setName(data.name || user.displayName || "User");
        const fallback = user?.email ? `@${user.email.split("@")[0]}` : "@user";
        setUsername((data.username as string) || fallback);
        if (data.photoURL) setImage(data.photoURL);
        if (data.theme) changeTheme(data.theme);
      }
      setLoading(false);
    })();
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && user) {
      const uri = result.assets[0].uri;
      setImage(uri);
      try {
        const blob = await (await fetch(uri)).blob();
        const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        await setDoc(
          doc(db, "users", user.uid),
          { photoURL: downloadURL, updatedAt: serverTimestamp() },
          { merge: true }
        );
        setImage(downloadURL);
      } catch (e: any) {
        console.error(e);
        Alert.alert("Upload error", e?.message ?? "Failed to upload image");
      }
    }
  };

  const saveUsername = async () => {
    if (!user) return;
    const raw = username.trim();
    if (!raw) return;

    const normalized = raw.startsWith("@") ? raw : `@${raw}`;
    const lower = normalized.toLowerCase();

    try {
      setSavingUsername(true);
      const q = query(
        collection(db, "users"),
        where("username_lower", "==", lower)
      );
      const snap = await getDocs(q);
      const takenByOther = snap.docs.some((d) => d.id !== user.uid);

      if (takenByOther) {
        Alert.alert("Username taken", "This username is already in use.");
        const cur = await getDoc(doc(db, "users", user.uid));
        const old = (cur.exists() && (cur.data() as any).username) || username;
        setUsername(old);
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          username: normalized,
          username_lower: lower,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setUsername(normalized);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", e?.message ?? "Failed to save username");
    } finally {
      setSavingUsername(false);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/");
  };

  const myRecipes = [
    { id: "1", title: "Spaghetti Carbonara" },
    { id: "2", title: "Pancakes" },
  ];
  const savedRecipes = [
    { id: "3", title: "Greek Salad" },
    { id: "4", title: "Tomato Soup" },
  ];

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <ThemedText>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container]}>
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor:
              current === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",
            borderColor: palette.icon + "33",
          },
        ]}
      >
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              image
                ? { uri: image }
                : require("@/assets/images/defaultAvatar.jpg")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <ThemedText type="title" style={styles.name}>
            {name}
          </ThemedText>

          <TextInput
            value={username}
            onChangeText={setUsername}
            onBlur={saveUsername}
            placeholder="@username"
            placeholderTextColor={palette.icon}
            style={[
              styles.usernameInput,
              {
                color: palette.text,
                borderColor: palette.icon,
              },
            ]}
          />
          {savingUsername ? (
            <Text style={{ color: palette.icon, marginTop: 4 }}>Saving…</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.themeButton,
            {
              backgroundColor:
                current === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
            },
          ]}
          onPress={() => setThemeModal(true)}
        >
          <Text style={{ color: palette.text }}>🌓</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Your Recipes
        </ThemedText>
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                current === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
              borderColor: palette.icon + "33",
            },
          ]}
        >
          <FlatList
            data={myRecipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ThemedText style={styles.recipeItem}>• {item.title}</ThemedText>
            )}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Saved Recipes
        </ThemedText>
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                current === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
              borderColor: palette.icon + "33",
            },
          ]}
        >
          <FlatList
            data={savedRecipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ThemedText style={styles.recipeItem}>• {item.title}</ThemedText>
            )}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        style={[
          styles.signOutBtn,
          { backgroundColor: "#9C27B0", shadowColor: "#000" },
        ]}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Modal visible={themeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: palette.background,
                borderColor: palette.icon + "33",
              },
            ]}
          >
            <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
              Choose Theme
            </ThemedText>

            {(["light", "dark", "system"] as const).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.option,
                  {
                    backgroundColor: theme === opt ? "#9C27B0" : "transparent",
                    borderColor: palette.icon + "33",
                  },
                ]}
                onPress={async () => {
                  changeTheme(opt);
                  if (user) {
                    await setDoc(
                      doc(db, "users", user.uid),
                      { theme: opt, updatedAt: serverTimestamp() },
                      { merge: true }
                    );
                  }
                  setThemeModal(false);
                }}
              >
                <Text
                  style={{
                    color: theme === opt ? "#fff" : palette.text,
                    fontSize: 16,
                    textTransform: "capitalize",
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setThemeModal(false)}
            >
              <Text style={{ color: "#9C27B0", fontSize: 15 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 18,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 14,
    backgroundColor: "#ccc",
  },
  name: { fontSize: 22, marginBottom: 4 },

  usernameInput: {
    fontSize: 15,
    borderBottomWidth: 1,
    paddingVertical: 2,
    width: 180,
  },

  section: { marginBottom: 18 },
  sectionTitle: { marginBottom: 10 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
  },
  recipeItem: { fontSize: 16, marginVertical: 6 },

  themeButton: { padding: 8, borderRadius: 10 },

  signOutBtn: {
    marginTop: 18,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 2,
  },
  signOutText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "82%",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
  },
  option: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
  },
  closeBtn: { marginTop: 6 },
});
