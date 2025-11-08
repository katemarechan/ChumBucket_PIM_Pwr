import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Img = number | string;
type Recipe = {
  id: string;
  title: string;
  description?: string;
  image: Img;
  ingredients?: string[];
  instructions?: string;
  isSaved: boolean;
};

type Ctx = {
  recipes: Recipe[];
  addRecipe: (r: Recipe) => void;
  toggleSave: (id: string) => void;
};

const image1 = require('../assets/carbonara.png');
const image2 = require('../assets/marrymepot.png');
const image3 = require('../assets/pumpkin.png');

const RecipesContext = createContext<Ctx | null>(null);

export const RecipesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: "1",
      title: "Marry Me Chicken Pot Pie",
      image: image1,
      ingredients: ["Chicken", "Pie crust", "Cream", "Garlic"],
      description: "Cozy, creamy pot pie that wins hearts at first bite.",
      instructions: "Bake until golden. Let rest 10 minutes. Serve warm.",
      isSaved: false,
    },
    {
      id: "2",
      title: "One Pot Wonton Soup",
      image: image2,
      ingredients: ["Wontons", "Ginger", "Garlic", "Scallions", "Broth"],
      description: "Comforting broth with tender wontons and aromatics.",
      instructions: "Simmer wontons in broth 6–8 min. Finish with scallions.",
      isSaved: false,
    },
    {
      id: "3",
      title: "Creamy Pasta Carbonara",
      image: image3,
      ingredients: ["Spaghetti", "Eggs", "Guanciale", "Pecorino", "Pepper"],
      description: "Silky Roman classic with guanciale and pecorino.",
      instructions:
        "Temper eggs with pasta water. Toss off-heat. Add guanciale & cheese.",
      isSaved: false,
    },
  ]);

  const addRecipe = useCallback((r: Recipe) => {
    setRecipes(prev => [r, ...prev]); 
  }, []);

  const toggleSave = useCallback((id: string) => {
    setRecipes(prev =>
      prev.map(r => (r.id === id ? { ...r, isSaved: !r.isSaved } : r))
    );
  }, []);

  const value = useMemo(() => ({ recipes, addRecipe, toggleSave }), [recipes, addRecipe, toggleSave]);

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
};

export const useRecipes = () => {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider');
  return ctx;
};