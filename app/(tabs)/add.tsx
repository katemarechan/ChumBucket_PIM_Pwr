import { useRecipes } from "@/context/RecipesContext";
import { useThemeManager } from "@/context/ThemeContext";
import { colors, commonStyles, searchStyles } from "@/styles/styles";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddScreen() {
  const { current } = useThemeManager();
  const theme = colors[current];

  const router = useRouter();
  const { addRecipe } = useRecipes();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [totalTime, setTotalTime] = useState(""); 

  const addIngredient = () => {
    const val = ingredientInput.trim();
    if (!val) return;
    setIngredients((prev) => [...prev, val]);
    setIngredientInput("");
  };

  const removeIngredient = (idx: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const pickFromDevice = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow photo library access to pick an image."
      );
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!res.canceled && res.assets && res.assets.length > 0) {
      setImageUrl(res.assets[0].uri);
    }
  };

  const canSubmit = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      instructions.trim().length > 0
    );
  }, [title, description, instructions]);

  const onSubmit = () => {
    if (!canSubmit) return;

    const id = Date.now().toString();
    const normalizedImage = imageUrl.trim().length > 0 ? imageUrl.trim() : "";

    addRecipe({
      id,
      title: title.trim(),
      image: normalizedImage,
      ingredients: [...ingredients],
      description: description.trim(),
      instructions: instructions.trim(),
      totalTime: parseInt(totalTime) || 0,
    });

    setTitle("");
    setImageUrl("");
    setIngredientInput("");
    setIngredients([]);
    setDescription("");
    setInstructions("");

    router.replace("/(tabs)/homefeed");
  };

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={commonStyles.scrollContainer}
        contentContainerStyle={[
          commonStyles.contentContainer,
          { paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            marginTop: 20,
            marginBottom: 14,
            color: theme.text,
          }}
        >
          Add Recipe
        </Text>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Spicy Tuna Bowl"
            placeholderTextColor={theme.textSecondary}
            style={[
              searchStyles.searchInput,
              { backgroundColor: theme.inputBg, color: theme.text },
            ]}
            returnKeyType="next"
          />
        </View>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Image (URL or pick from device)
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://example.com/recipe.jpg"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                searchStyles.searchInput,
                { backgroundColor: theme.inputBg, color: theme.text, flex: 1 },
              ]}
            />
            <TouchableOpacity
              onPress={pickFromDevice}
              style={{
                paddingHorizontal: 16,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.primaryButton,
              }}
              activeOpacity={0.9}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Pick</Text>
            </TouchableOpacity>
          </View>

          {!!imageUrl && (
            <View
              style={{ marginTop: 10, borderRadius: 12, overflow: "hidden" }}
            >
              <Image
                source={{ uri: imageUrl }}
                style={{ width: "100%", height: 180 }}
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="A quick sentence about this recipe..."
            placeholderTextColor={theme.textSecondary}
            style={[
              searchStyles.searchInput,
              { backgroundColor: theme.inputBg, color: theme.text },
            ]}
          />
        </View>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Total Time (minutes)
          </Text>
          <TextInput
            value={totalTime}
            onChangeText={setTotalTime}
            placeholder="e.g. 45"
            keyboardType="numeric"
            placeholderTextColor={theme.textSecondary}
            style={[
              searchStyles.searchInput,
              { backgroundColor: theme.inputBg, color: theme.text },
            ]}
            returnKeyType="next"
          />
        </View>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Ingredients
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={ingredientInput}
              onChangeText={setIngredientInput}
              placeholder="e.g. 200g spaghetti"
              placeholderTextColor={theme.textSecondary}
              style={[
                searchStyles.searchInput,
                { backgroundColor: theme.inputBg, color: theme.text, flex: 1 },
              ]}
              onSubmitEditing={addIngredient}
            />
            <TouchableOpacity
              onPress={addIngredient}
              style={{
                paddingHorizontal: 16,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.primary,
              }}
              activeOpacity={0.9}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Add</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 10,
            }}
          >
            {ingredients.map((ing, idx) => (
              <TouchableOpacity
                key={`${ing}-${idx}`}
                onPress={() => removeIngredient(idx)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  borderWidth: 1,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: theme.text }}>{ing} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 18 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Instructions
          </Text>
          <TextInput
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Write the full recipe steps..."
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
            style={[
              searchStyles.searchInput,
              {
                backgroundColor: theme.inputBg,
                color: theme.text,
                minHeight: 140,
                paddingTop: 12,
              },
            ]}
          />
        </View>

        <TouchableOpacity
          onPress={onSubmit}
          disabled={!canSubmit}
          style={{
            backgroundColor: canSubmit ? theme.primaryButton : theme.cardBorder,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
          activeOpacity={0.9}
        >
          <Text
            style={{
              color: canSubmit ? "#fff" : theme.textSecondary,
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Add Recipe
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
