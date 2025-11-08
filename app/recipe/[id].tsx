import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  colors,
  commonStyles,
  recipeDetailStyles,
  recipeStyles,
} from "../../styles/styles";

interface Ingredient {
  id: string;
  text: string;
}
interface Instruction {
  id: string;
  step: number;
  text: string;
}
interface RecipeData {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  authorAvatar: string;
  totalTime: string;
  isSaved: boolean;
  ingredients: Ingredient[];
  instructions: Instruction[];
  hashtags: string[];
}

const DEFAULT_INGREDIENTS: Ingredient[] = [
  { id: "1", text: "½ pound bacon, cut into small pieces" },
  { id: "2", text: "4 large eggs, at room temperature" },
  { id: "3", text: "¼ cup heavy cream, at room temperature" },
  { id: "4", text: "1 cup grated Parmesan cheese" },
];

const DEFAULT_INSTRUCTIONS: Instruction[] = [
  { id: "1", step: 1, text: "Cook bacon until crisp; drain." },
  { id: "2", step: 2, text: "Beat eggs and cream, add Parmesan." },
  { id: "3", step: 3, text: "Boil pasta to al dente; drain." },
  { id: "4", step: 4, text: "Combine all; season and serve." },
];

const RecipeDetailScreen: React.FC = () => {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    imageUri?: string;
    totalTime?: string;
    author?: string;
  }>();

  const initial: RecipeData = useMemo(
    () => ({
      id: params.id ?? "0",
      title: params.title ?? "Recipe",
      imageUrl: params.imageUri ?? "",
      author: params.author ?? "Unknown",
      authorAvatar: "👤",
      totalTime: params.totalTime ?? "—",
      isSaved: false,
      ingredients: DEFAULT_INGREDIENTS,
      instructions: DEFAULT_INSTRUCTIONS,
      hashtags: ["#italian", "#pasta", "#dinner", "#comfort-food"],
    }),
    [params]
  );

  const isDark = useColorScheme() === "dark";
  const theme = isDark ? colors.dark : colors.light;

  const [recipe, setRecipe] = useState<RecipeData>(initial);

  const toggleSave = () =>
    setRecipe((prev) => ({ ...prev, isSaved: !prev.isSaved }));

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
              { backgroundColor: theme.primaryDark },
            ]}
          >
            <Text style={{ fontSize: 24 }}>{recipe.authorAvatar}</Text>
          </View>
          <Text style={[recipeDetailStyles.userName, { color: theme.text }]}>
            {recipe.author}
          </Text>
        </View>

        <View style={recipeStyles.recipeHero}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={recipeStyles.recipeHeroImg}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[
              recipeStyles.saveBtn,
              recipe.isSaved && {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              },
            ]}
            onPress={toggleSave}
          >
            <Text style={recipeStyles.saveBtnText}>
              {recipe.isSaved ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={recipeDetailStyles.recipeContent}>
          <Text
            style={[
              commonStyles.title,
              { color: theme.text, marginBottom: 15 },
            ]}
          >
            {recipe.title}
          </Text>

          <View style={recipeDetailStyles.timeInfo}>
            <Text style={{ fontSize: 16 }}>⏱️</Text>
            <Text
              style={[
                recipeDetailStyles.timeInfoText,
                { color: theme.textSecondary },
              ]}
            >
              <Text style={recipeDetailStyles.timeInfoBold}>Total Time:</Text>{" "}
              {recipe.totalTime}
            </Text>
          </View>

          <Text
            style={[recipeDetailStyles.sectionTitle, { color: theme.text }]}
          >
            Ingredients
          </Text>
          <Text
            style={[
              recipeDetailStyles.originalRecipe,
              { color: theme.primary },
            ]}
          >
            Original recipe
          </Text>
          <View style={recipeDetailStyles.ingredientList}>
            {recipe.ingredients.map((i) => (
              <View
                key={i.id}
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
                  {i.text}
                </Text>
              </View>
            ))}
          </View>

          <Text
            style={[recipeDetailStyles.sectionTitle, { color: theme.text }]}
          >
            Instructions
          </Text>
          <View>
            {recipe.instructions.map((s) => (
              <View
                key={s.id}
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
                    {s.step}.
                  </Text>{" "}
                  {s.text}
                </Text>
              </View>
            ))}
          </View>

          <View style={recipeDetailStyles.hashtags}>
            {recipe.hashtags.map((tag, idx) => (
              <View
                key={idx}
                style={[
                  recipeDetailStyles.hashtag,
                  {
                    backgroundColor: isDark
                      ? "rgba(139,71,137,0.2)"
                      : "rgba(143,188,143,0.2)",
                  },
                ]}
              >
                <Text
                  style={[
                    recipeDetailStyles.hashtagText,
                    { color: theme.text },
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
