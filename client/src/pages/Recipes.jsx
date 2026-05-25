import { useEffect, useState } from "react";

import RecipeForm from "../components/recipes/RecipeForm";
import RecipeTable from "../components/recipes/RecipeTable";
import RecipeCostBreakdown from "../components/recipes/RecipeCostBreakdown";

import {
  getRecipes,
  addRecipe,
  deleteRecipe,
  updateRecipe,
  getRecipeById,
  getRecipeCost,
} from "../services/recipeService";

function Recipes() {
  const [recipes, setRecipes] =
    useState([]);

  const [editingRecipe, setEditingRecipe] =
    useState(null);

  const [costData, setCostData] =
    useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      const data = await getRecipes();

      setRecipes(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddRecipe(
    recipe
  ) {
    try {
      await addRecipe(recipe);

      loadRecipes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete recipe?"
    );

    if (!confirmed) return;

    try {
      await deleteRecipe(id);

      loadRecipes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEdit(recipe) {
    try {
      const fullRecipe =
        await getRecipeById(recipe.id);

      setEditingRecipe(fullRecipe);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateRecipe(
    id,
    recipe
  ) {
    try {
      await updateRecipe(id, recipe);

      setEditingRecipe(null);

      loadRecipes();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleViewCost(
    recipeId
  ) {
    try {
      const data =
        await getRecipeCost(recipeId);

      setCostData(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        Recipes
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <RecipeForm
          onAddRecipe={handleAddRecipe}
          editingRecipe={editingRecipe}
          onUpdateRecipe={
            handleUpdateRecipe
          }
        />

        <RecipeTable
          recipes={recipes}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onViewCost={
            handleViewCost
          }
        />

        <RecipeCostBreakdown
          costData={costData}
        />
      </div>
    </div>
  );
}

export default Recipes;