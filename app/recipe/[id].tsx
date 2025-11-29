import { useRecipes } from "@/context/RecipesContext";
import { useThemeManager } from "@/context/ThemeContext";
import { auth, db } from "@/FirebaseConfig";
import {
  colors,
  commonStyles,
  recipeDetailStyles,
  recipeStyles,
} from "@/styles/styles";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const fallbackAvatar = require("@/assets/images/defaultAvatar.jpg");

type RouteParams = {
  id?: string;
  title?: string;
  imageUri?: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  totalTime?: string;
  author?: string;
};

type UserProfile = {
  name: string;
  username?: string;
  photoURL?: string | null;
};

const RecipeDetailScreen: React.FC = () => {
  const { current } = useThemeManager();
  const theme = colors[current];

  const router = useRouter();
  const { recipes, toggleSave } = useRecipes();
  const params = useLocalSearchParams<RouteParams>();

  const recipeId = (params.id ?? "").toString();
  const recipeFromContext = recipes.find((r) => r.id === recipeId);

  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const user = auth.currentUser;
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);

  useEffect(() => {
    if (!recipeFromContext?.user_uid) {
      setAuthorProfile(null);
      return;
    }

    const userRef = doc(db, "users", recipeFromContext.user_uid);
    const unsub = onSnapshot(
      userRef,
      (snap) => {
        const data = snap.data() as any | undefined;
        if (data) {
          setAuthorProfile({
            name: data.name ?? "Unknown",
            username: data.username ?? undefined,
            photoURL: data.photoURL ?? null,
          });
        } else {
          setAuthorProfile(null);
        }
      },
      (err) => {
        console.error("Failed to load user profile", err);
        setAuthorProfile(null);
      }
    );

    return unsub;
  }, [recipeFromContext?.user_uid]);

  const parsedIngredients: string[] = useMemo(() => {
    if (params.ingredients) {
      try {
        const arr = JSON.parse(params.ingredients as string);
        return Array.isArray(arr) ? arr.map(String) : [];
      } catch {}
    }
    return recipeFromContext?.ingredients ?? [];
  }, [params.ingredients, recipeFromContext?.ingredients]);

  const parsedSteps: string[] = useMemo(() => {
    const raw =
      (params.instructions as string | undefined)?.toString().trim() ||
      recipeFromContext?.instructions ||
      "";
    return raw
      .split(/\r?\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [params.instructions, recipeFromContext?.instructions]);

  const imageFromContext =
    typeof recipeFromContext?.image === "string"
      ? recipeFromContext.image.trim()
      : "";
  const imageFromParams =
    (params.imageUri as string | undefined)?.toString().trim() || "";

  const imageUri = imageFromContext || imageFromParams;

  const title =
    (params.title as string | undefined) ||
    recipeFromContext?.title ||
    "Recipe";

  const description =
    (params.description as string | undefined) ||
    recipeFromContext?.description ||
    "";

  const totalTime =
    typeof recipeFromContext?.totalTime === "number"
      ? `${recipeFromContext.totalTime} mins`
      : (params.totalTime as string | undefined) || "—";

  const isSaved = recipeFromContext?.isSaved ?? false;

  const authorName =
    authorProfile?.name || (params.author as string | undefined) || "Unknown";
  const authorUsername = authorProfile?.username;

  const avatarSrc =
    !avatarError && authorProfile?.photoURL
      ? { uri: authorProfile.photoURL }
      : fallbackAvatar;

  useEffect(() => {
    (async () => {
      if (!user || !isSaved || parsedIngredients.length === 0) {
        setCheckedIngredients(parsedIngredients.map(() => false));
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const data = snap.exists() ? (snap.data() as any) : {};
        const shoplist: string[] = Array.isArray(data.shoplist)
          ? data.shoplist
          : [];

        const checks = parsedIngredients.map((ing) => shoplist.includes(ing));
        setCheckedIngredients(checks);
      } catch (e) {
        console.error("Failed to load shoplist", e);
        setCheckedIngredients(parsedIngredients.map(() => false));
      }
    })();
  }, [user, isSaved, parsedIngredients]);

  const toggleIngredientChecked = (index: number) => {
    const ingredient = parsedIngredients[index];
    if (!ingredient) return;

    setCheckedIngredients((prev) => {
      const copy = [...prev];
      const newVal = !copy[index];
      copy[index] = newVal;

      if (user && isSaved) {
        const userRef = doc(db, "users", user.uid);
        (async () => {
          try {
            if (newVal) {
              await updateDoc(userRef, {
                shoplist: arrayUnion(ingredient),
                updatedAt: serverTimestamp(),
              });
            } else {
              await updateDoc(userRef, {
                shoplist: arrayRemove(ingredient),
                updatedAt: serverTimestamp(),
              });
            }
          } catch (e) {
            console.error("Failed to update shoplist", e);
          }
        })();
      }

      return copy;
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={[commonStyles.container, { backgroundColor: theme.background }]}
      >
        <ScrollView
          style={commonStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 4,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingVertical: 4, paddingRight: 8 }}
              activeOpacity={0.7}
            >
              <Text style={{ color: theme.text, fontSize: 18 }}>← Back</Text>
            </TouchableOpacity>
          </View>

          <View style={recipeDetailStyles.userHeader}>
            <Image
              source={avatarSrc}
              style={commonStyles.avatarMedium}
              onError={() => setAvatarError(true)}
            />
            <View>
              <Text
                style={[recipeDetailStyles.userName, { color: theme.text }]}
              >
                {authorName}
              </Text>
              {authorUsername && (
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {authorUsername}
                </Text>
              )}
            </View>
          </View>
          <View style={recipeStyles.recipeHero}>
            {!!imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={recipeStyles.recipeHeroImg}
                resizeMode="cover"
              />
            )}

            <TouchableOpacity
              style={[
                recipeStyles.saveBtn,
                isSaved && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => {
                if (recipeId) toggleSave(recipeId);
              }}
              activeOpacity={0.85}
            >
              <Text style={recipeStyles.saveBtnText}>
                {isSaved ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={recipeDetailStyles.recipeContent}>
            <Text
              style={[
                commonStyles.title,
                { color: theme.text, marginBottom: 8 },
              ]}
            >
              {title}
            </Text>

            {description ? (
              <Text
                style={[
                  recipeDetailStyles.originalRecipe,
                  { color: theme.textSecondary, marginBottom: 12 },
                ]}
              >
                {description}
              </Text>
            ) : null}

            <View style={recipeDetailStyles.timeInfo}>
              <Text style={{ fontSize: 16 }}>⏱️</Text>
              <Text
                style={[
                  recipeDetailStyles.timeInfoText,
                  { color: theme.textSecondary },
                ]}
              >
                <Text style={recipeDetailStyles.timeInfoBold}>Total Time:</Text>{" "}
                {totalTime}
              </Text>
            </View>

            <Text
              style={[recipeDetailStyles.sectionTitle, { color: theme.text }]}
            >
              Ingredients
            </Text>

            <View style={recipeDetailStyles.ingredientList}>
              {parsedIngredients.length === 0 ? (
                <Text style={{ color: theme.textSecondary }}>
                  No ingredients provided.
                </Text>
              ) : !isSaved ? (
                parsedIngredients.map((line, idx) => (
                  <View
                    key={`${idx}-${line}`}
                    style={[
                      recipeDetailStyles.ingredientItem,
                      { borderBottomColor: theme.divider },
                    ]}
                  >
                    <Text
                      style={[
                        recipeDetailStyles.ingredientBullet,
                        { color: theme.primary },
                      ]}
                    >
                      •
                    </Text>
                    <Text
                      style={[
                        recipeDetailStyles.ingredientText,
                        { color: theme.text },
                      ]}
                    >
                      {line}
                    </Text>
                  </View>
                ))
              ) : (
                parsedIngredients.map((line, idx) => {
                  const checked = checkedIngredients[idx] ?? false;

                  return (
                    <View
                      key={`${idx}-${line}`}
                      style={[
                        recipeDetailStyles.ingredientItem,
                        {
                          borderBottomColor: theme.divider,
                          paddingVertical: 12,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: theme.text,
                          fontSize: 16,
                          textDecorationLine: "none",
                          opacity: 1,
                          fontWeight: checked ? "700" : "400",
                        }}
                      >
                        {line}
                      </Text>

                      <TouchableOpacity
                        onPress={() => toggleIngredientChecked(idx)}
                        activeOpacity={0.7}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.textSecondary,
                            fontSize: 14,
                          }}
                        >
                          Need to buy
                        </Text>

                        <View
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            borderWidth: 2,
                            borderColor: theme.primary,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: checked
                              ? theme.primary
                              : "transparent",
                          }}
                        >
                          {checked && (
                            <Text style={{ color: "#fff", fontSize: 14 }}>
                              ✓
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>

            <Text
              style={[recipeDetailStyles.sectionTitle, { color: theme.text }]}
            >
              Instructions
            </Text>
            <View>
              {parsedSteps.length === 0 ? (
                <Text style={{ color: theme.textSecondary }}>
                  No instructions provided.
                </Text>
              ) : (
                parsedSteps.map((t, i) => (
                  <View
                    key={`${i}-${t}`}
                    style={[
                      recipeDetailStyles.instructionItem,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        recipeDetailStyles.instructionText,
                        { color: theme.text },
                      ]}
                    >
                      <Text
                        style={[
                          recipeDetailStyles.stepNumber,
                          { color: theme.primary },
                        ]}
                      >
                        {i + 1}.
                      </Text>{" "}
                      {t}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default RecipeDetailScreen;
