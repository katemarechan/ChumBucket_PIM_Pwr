import { auth, db } from "@/FirebaseConfig";
import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  setDoc,
} from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
  addRecipe: (recipe: Recipe) => Promise<void>;
  toggleSave: (id: string) => void;
  loading: boolean;
};

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "recipes");

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs: Recipe[] = snapshot.docs.map((d) => {
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
            isSaved: false, 
          };
        });

        setRecipes(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading recipes:", err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const addRecipe = async (recipe: Omit<Recipe, "user_uid">) => {
    const user = auth.currentUser;
    const userUid = user?.uid ?? null;

    const recipeWithUser: Recipe = {
      ...recipe,
      user_uid: userUid,
    };

    setRecipes((prev) => [...prev, recipeWithUser]);

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
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              isSaved: !r.isSaved,
            }
          : r
      )
    );
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
