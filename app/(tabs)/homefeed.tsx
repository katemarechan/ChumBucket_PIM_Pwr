// app/(tabs)/homefeed.tsx
import { Colors } from "@/constants/theme";
import { useRecipes } from "@/context/RecipesContext";
import { useThemeManager } from "@/context/ThemeContext";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { commonStyles, recipeStyles, searchStyles } from "../../styles/styles";

const getImageSource = (img: number | string) =>
  typeof img === "string" ? { uri: img } : img;

const getImageUri = (img: number | string) =>
  typeof img === "string" ? img : Image.resolveAssetSource(img).uri;

const HomeFeedScreen: React.FC = () => {
  const { current } = useThemeManager();
  const theme = Colors[current];

  const { recipes, toggleSave } = useRecipes();

  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? recipes.filter((r) => r.title.toLowerCase().includes(q))
      : recipes;
  }, [recipes, query]);

  return (
    <View
      style={[commonStyles.container, { backgroundColor: theme.background }]}
    >
      <View style={searchStyles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          style={[
            searchStyles.searchInput,
            {
              backgroundColor: theme.inputBg,
              color: theme.text,
              marginTop: 30,
            },
          ]}
          placeholder="🔍 Search recipes..."
          placeholderTextColor={theme.textSecondary}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <ScrollView
        style={commonStyles.scrollContainer}
        contentContainerStyle={[
          commonStyles.contentContainer,
          { paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((recipe) => {
          const imgSrc = getImageSource(recipe.image);
          const imageUri = getImageUri(recipe.image);

          console.log("SUDDAAAA" + recipe.description);

          return (
            <Link
              key={recipe.id}
              href={{
                pathname: "/recipe/[id]",
                params: {
                  id: recipe.id,
                  title: recipe.title,
                  imageUri,
                  description: recipe.description ?? "",
                  ingredients: JSON.stringify(recipe.ingredients ?? []),
                  instructions: recipe.instructions ?? "",
                  isSaved: String(recipe.isSaved),
                  totalTime: "45 mins",
                  author: "Joe Goldberg",
                },
              }}
              asChild
            >
              <TouchableOpacity
                style={[
                  recipeStyles.recipeCard,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                  },
                ]}
                activeOpacity={0.9}
              >
                <Image
                  source={imgSrc}
                  style={recipeStyles.recipeImage}
                  resizeMode="cover"
                />
                <View style={recipeStyles.recipeInfo}>
                  <Text
                    style={[recipeStyles.recipeTitle, { color: theme.text }]}
                  >
                    {recipe.title}
                  </Text>
                  <TouchableOpacity
                    style={[
                      recipeStyles.saveIcon,
                      {
                        backgroundColor: recipe.isSaved
                          ? theme.primary
                          : "rgba(255,255,255,0.3)",
                        borderColor: recipe.isSaved
                          ? theme.primary
                          : "rgba(255,255,255,0.5)",
                      },
                    ]}
                    onPress={() => toggleSave(recipe.id)}
                  >
                    <Text style={recipeStyles.saveIconText}>
                      {recipe.isSaved ? "❤️" : "🤍"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Link>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HomeFeedScreen;
