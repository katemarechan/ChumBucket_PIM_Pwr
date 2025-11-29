// app/edit-recipe/[id].tsx
import { db } from "@/FirebaseConfig";
import { useThemeManager } from "@/context/ThemeContext";
import { colors, commonStyles, searchStyles } from "@/styles/styles";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";

import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

import React, { useEffect, useMemo, useState } from "react";
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

export default function EditRecipeScreen() {
  const { current } = useThemeManager();
  const theme = colors[current];

  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");

  // 🔥 Загружаем рецепт из Firestore
  useEffect(() => {
    async function load() {
      if (!id) return;

      setLoading(true);

      const snap = await getDoc(doc(db, "recipes", id));
      if (!snap.exists()) {
        Alert.alert("Error", "Recipe not found");
        router.back();
        return;
      }

      const data = snap.data() as any;

      setTitle(data.title ?? "");
      setImageUrl(data.image ?? "");
      setDescription(data.description ?? "");
      setIngredients(Array.isArray(data.ingredients) ? data.ingredients : []);
      setInstructions(
        Array.isArray(data.instructions)
          ? data.instructions.join("\n")
          : data.instructions ?? ""
      );

      setLoading(false);
    }
    load();
  }, [id]);

  const addIngredient = () => {
    const v = ingredientInput.trim();
    if (!v) return;
    setIngredients((p) => [...p, v]);
    setIngredientInput("");
  };

  const removeIngredient = (i: number) => {
    setIngredients((p) => p.filter((_, idx) => idx !== i));
  };

  const pickFromDevice = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Need access to your photos.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!res.canceled && res.assets?.length > 0) {
      setImageUrl(res.assets[0].uri);
    }
  };

  const canSubmit = useMemo(
    () =>
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      instructions.trim().length > 0,
    [title, description, instructions]
  );

  const onSave = async () => {
    if (!canSubmit) return;

    try {
      await updateDoc(doc(db, "recipes", id!), {
        title: title.trim(),
        image: imageUrl.trim(),
        description: description.trim(),
        ingredients,
        instructions: instructions.trim(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Success", "Recipe updated!");

      router.replace(`/recipe/${id}`);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to update recipe");
    }
  };

  if (loading) {
    return (
      <View
        style={[
          commonStyles.container,
          { backgroundColor: theme.background, justifyContent: "center" },
        ]}
      >
        <Text style={{ color: theme.text, fontSize: 18 }}>Loading…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[commonStyles.scrollContainer]}
        contentContainerStyle={[
          commonStyles.contentContainer,
          { paddingBottom: 120, paddingHorizontal: 20 },
        ]}
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
          Edit Recipe
        </Text>

        {/* Title */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={theme.textSecondary}
            style={[
              searchStyles.searchInput,
              { backgroundColor: theme.inputBg, color: theme.text },
            ]}
          />
        </View>

        {/* Image */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Image URL or pick from device
          </Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://example.com/photo.jpg"
              placeholderTextColor={theme.textSecondary}
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
                backgroundColor: theme.primary,
              }}
            >
              <Text style={{ color: "#fff" }}>Pick</Text>
            </TouchableOpacity>
          </View>

          {!!imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={{
                width: "100%",
                height: 180,
                marginTop: 10,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Description */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Short description..."
            placeholderTextColor={theme.textSecondary}
            style={[
              searchStyles.searchInput,
              { backgroundColor: theme.inputBg, color: theme.text },
            ]}
          />
        </View>

        {/* Ingredients */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Ingredients
          </Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={ingredientInput}
              onChangeText={setIngredientInput}
              placeholder="e.g. 200g pasta"
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
                backgroundColor: theme.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>Add</Text>
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

        {/* Instructions */}
        <View style={{ marginBottom: 18 }}>
          <Text style={{ color: theme.textSecondary, marginBottom: 6 }}>
            Instructions
          </Text>
          <TextInput
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Step-by-step instructions..."
            placeholderTextColor={theme.textSecondary}
            multiline
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

        {/* Save */}
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={onSave}
          style={{
            backgroundColor: canSubmit ? theme.primary : theme.cardBorder,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: canSubmit ? "#fff" : theme.textSecondary,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
