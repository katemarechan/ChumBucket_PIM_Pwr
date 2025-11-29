import { auth, db } from "@/FirebaseConfig";
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

    const recipeWithUser: RecipeBase = {
      ...recipe,
      user_uid: userUid,
    };

    setRecipesBase((prev) => [...prev, recipeWithUser]);

    await setDoc(doc(db, "recipes", recipe.id), {
      uid: recipe.id,
      user_uid: userUid,
      title: recipe.title,
      image: recipe.image,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      totalTime: 0,
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
