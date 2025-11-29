import { db } from "@/FirebaseConfig";
import { useRecipes } from "@/context/RecipesContext";
import { useThemeManager } from "@/context/ThemeContext";
import {
  colors,
  commonStyles,
  recipeDetailStyles,
  recipeStyles,
} from "@/styles/styles";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
      } catch {
      }
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

  const imageUri =
    (params.imageUri as string | undefined) ||
    (typeof recipeFromContext?.image === "string"
      ? recipeFromContext.image
      : "");

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

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

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
              ) : (
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
