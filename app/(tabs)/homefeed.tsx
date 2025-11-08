import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  colors,
  commonStyles,
  recipeStyles,
  searchStyles,
} from "../../styles/styles";

const image1 = require("../../assets/carbonara.png");
const image2 = require("../../assets/pumpkin.png");
const image3 = require("../../assets/wonton.png");

interface Recipe {
  id: string;
  title: string;
  image: any;
  isSaved: boolean;
}

const HomeFeedScreen: React.FC = () => {
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? colors.dark : colors.light;

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: "1",
      title: "Marry Me Chicken Pot Pie",
      image: image1,
      isSaved: false,
    },
    { id: "2", title: "One Pot Wonton Soup", image: image2, isSaved: false },
    { id: "3", title: "Creamy Pasta Carbonara", image: image3, isSaved: false },
  ]);

  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? recipes.filter((r) => r.title.toLowerCase().includes(q))
      : recipes;
  }, [recipes, query]);

  const toggleSave = (id: string) =>
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r))
    );

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
            { backgroundColor: theme.inputBg, color: theme.text },
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
          const imageUri = Image.resolveAssetSource(recipe.image).uri;

          return (
            <Link
              key={recipe.id}
              href={{
                pathname: "/recipe/[id]",
                params: {
                  id: recipe.id,
                  title: recipe.title,
                  imageUri,
                  totalTime: "35 mins",
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
                  source={recipe.image}
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
