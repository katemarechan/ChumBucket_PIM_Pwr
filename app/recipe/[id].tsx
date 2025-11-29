import { useRecipes } from "@/context/RecipesContext";
import { useThemeManager } from "@/context/ThemeContext";
import {
  colors,
  commonStyles,
  recipeDetailStyles,
  recipeStyles,
} from "@/styles/styles";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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

const RecipeDetailScreen: React.FC = () => {
  const { current } = useThemeManager();
  const theme = colors[current];

  const { recipes, toggleSave } = useRecipes();
  const params = useLocalSearchParams<RouteParams>();

  const recipeId = (params.id ?? "").toString();
  const recipeFromContext = recipes.find((r) => r.id === recipeId);

  const parsedIngredients: string[] = useMemo(() => {
    try {
      const val = params.ingredients ?? "[]";
      const arr = JSON.parse(val as string);
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch {
      return [];
    }
  }, [params.ingredients]);

  const parsedSteps: string[] = useMemo(() => {
    const raw = (params.instructions ?? "").toString();
    return raw
      .split(/\r?\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [params.instructions]);

  const imageUri =
    (params.imageUri as string | undefined) ||
    (typeof recipeFromContext?.image === "string"
      ? (recipeFromContext.image as string)
      : "");

  const title =
    (params.title as string | undefined) ||
    recipeFromContext?.title ||
    "Recipe";
  const description =
    (params.description as string | undefined) ||
    recipeFromContext?.description ||
    "";
  const totalTime = (params.totalTime as string | undefined) || "—";
  const author = (params.author as string | undefined) || "Unknown";

  const isSaved = recipeFromContext?.isSaved ?? false;

  return (
    <View
      style={[commonStyles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={recipeDetailStyles.userHeader}>
          <View
            style={[
              commonStyles.avatarMedium,
              { backgroundColor: theme.primary },
            ]}
          >
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
          <Text style={[recipeDetailStyles.userName, { color: theme.text }]}>
            {author}
          </Text>
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
            activeOpacity={0.9}
          >
            <Text style={recipeStyles.saveBtnText}>
              {isSaved ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={recipeDetailStyles.recipeContent}>
          <Text
            style={[commonStyles.title, { color: theme.text, marginBottom: 8 }]}
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
  );
};

export default RecipeDetailScreen;
