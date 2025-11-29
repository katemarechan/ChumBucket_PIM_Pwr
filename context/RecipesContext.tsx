import { auth, db, storage } from "@/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Recipe = {
  id: string;
  title: string;
  image: string | number; 
  description?: string;
  ingredients?: string[];
  instructions?: string;
  totalTime?: number;
  isSaved: boolean;
  user_uid?: string | null;
};

type RecipesContextType = {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, "user_uid" | "isSaved">) => Promise<void>;
  toggleSave: (id: string) => void;
  loading: boolean;
};

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

type RecipeBase = Omit<Recipe, "isSaved">;

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const [recipesBase, setRecipesBase] = useState<RecipeBase[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "recipes");

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs: RecipeBase[] = snapshot.docs.map((d) => {
          const data = d.data() as any;

          return {
            id: d.id,
            title: data.title ?? "",
            image: data.image ?? "",
            description: data.description ?? "",
            ingredients: Array.isArray(data.ingredients)
              ? data.ingredients.map(String)
              : [],
            instructions: Array.isArray(data.instructions)
              ? data.instructions.map(String).join("\n")
              : data.instructions ?? "",
            totalTime:
              typeof data.totalTime === "number" ? data.totalTime : 0,
            user_uid: data.user_uid ?? null,
          };
        });

        setRecipesBase(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading recipes:", err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLikedIds([]);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const unsubscribeUser = onSnapshot(
        userRef,
        (snap) => {
          const data = snap.data() as any | undefined;
          const arr = Array.isArray(data?.likedRecipes)
            ? data!.likedRecipes.map(String)
            : [];
          setLikedIds(arr);
        },
        (err) => {
          console.error("Error listening user likedRecipes:", err);
        }
      );

      return unsubscribeUser;
    });

    return unsubscribeAuth;
  }, []);

  const recipes: Recipe[] = useMemo(
    () =>
      recipesBase.map((r) => ({
        ...r,
        isSaved: likedIds.includes(r.id),
      })),
    [recipesBase, likedIds]
  );

  const addRecipe = async (recipe: Omit<Recipe, "user_uid" | "isSaved">) => {
    const user = auth.currentUser;
    const userUid = user?.uid ?? null;

    let imageUrl = "";
    if (typeof recipe.image === "string" && recipe.image.trim().length > 0) {
      const img = recipe.image.trim();

      if (img.startsWith("http")) {
        imageUrl = img;
      } else {
        try {
          const response = await fetch(img);
          const blob = await response.blob();

          const imageRef = ref(storage, `recipes/${recipe.id}.jpg`);
          await uploadBytes(imageRef, blob);
          imageUrl = await getDownloadURL(imageRef);
        } catch (err) {
          console.error("Image upload failed, storing local path instead", err);
          imageUrl = img;
        }
      }
    }

    const totalTime =
      typeof recipe.totalTime === "number" ? recipe.totalTime : 0;

    const recipeWithUser: RecipeBase = {
      ...recipe,
      image: imageUrl,
      user_uid: userUid,
      totalTime,
    };

    setRecipesBase((prev) => [...prev, recipeWithUser]);

    await setDoc(doc(db, "recipes", recipe.id), {
      uid: recipe.id,
      user_uid: userUid,
      title: recipe.title,
      image: imageUrl,
      description: recipe.description ?? "",
      ingredients: recipe.ingredients ?? [],
      instructions: (recipe.instructions ?? "")
        .split(/\r?\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
      totalTime,
    });
  };

  const toggleSave = (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    setLikedIds((prev) => {
      const already = prev.includes(id);
      const next = already ? prev.filter((x) => x !== id) : [...prev, id];

      updateDoc(doc(db, "users", user.uid), {
        likedRecipes: next,
      }).catch((e) => console.error("update likedRecipes failed", e));

      return next;
    });
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        addRecipe,
        toggleSave,
        loading,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error("useRecipes must be used within RecipesProvider");
  return ctx;
};
