import { useRecipes } from "@/context/RecipesContext";
import { useThemeManager } from "@/context/ThemeContext";
import {
  colors,
  commonStyles,
  recipeDetailStyles,
  recipeStyles,
} from "@/styles/styles";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const RecipeDetailScreen: React.FC = () => {
  const { current } = useThemeManager();
  const theme = colors[current];

  const { recipes, toggleSave } = useRecipes();
  const params = useLocalSearchParams<{ id: string }>();

  const recipeId = params.id?.toString() ?? "";
  const recipe = recipes.find((r) => r.id === recipeId);

  if (!recipe) {
    return (
      <View
        style={[
          commonStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: theme.text }}>Recipe not found</Text>
      </View>
    );
  }

  const parsedIngredients: string[] = recipe.ingredients ?? [];

  const parsedSteps: string[] = recipe.instructions
    ? recipe.instructions
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <View
      style={[commonStyles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
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
            Unknown
          </Text>
        </View>

        <View style={recipeStyles.recipeHero}>
          {!!recipe.image && (
            <Image
              source={{ uri: recipe.image.toString() }}
              style={recipeStyles.recipeHeroImg}
              resizeMode="cover"
            />
          )}
          <TouchableOpacity
            style={[
              recipeStyles.saveBtn,
              recipe.isSaved && {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => toggleSave(recipe.id)}
            activeOpacity={0.9}
          >
            <Text style={recipeStyles.saveBtnText}>
              {recipe.isSaved ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[recipeDetailStyles.recipeContent]}>
          <Text
            style={[commonStyles.title, { color: theme.text, marginBottom: 8 }]}
          >
            {recipe.title}
          </Text>

          {recipe.description ? (
            <Text
              style={[
                recipeDetailStyles.originalRecipe,
                { color: theme.textSecondary, marginBottom: 12 },
              ]}
            >
              {recipe.description}
            </Text>
          ) : null}

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
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
