import { useEffect, useState } from "react";

import RecipeIngredientSelector from "./RecipeIngredientSelector";

import {
  getIngredients,
} from "../../services/ingredientService";

function createIngredientRow() {
  return {
    id: crypto.randomUUID(),
    ingredientId: "",
    quantity: "",
    unit: "",
  };
}

function RecipeForm({
  onAddRecipe,
  editingRecipe,
  onUpdateRecipe,
}) {
  const [ingredients, setIngredients] =
    useState([]);

  const [recipeData, setRecipeData] =
    useState({
      name: "",
      yieldQuantity: "",
      instructions: "",
    });

  const [ingredientRows, setIngredientRows] =
    useState([
      createIngredientRow(),
    ]);

  useEffect(() => {
    loadIngredients();
  }, []);

  useEffect(() => {
    if (editingRecipe) {
      setRecipeData({
        name: editingRecipe.name,
        yieldQuantity:
          editingRecipe.yield_quantity,
        instructions:
          editingRecipe.instructions,
      });

      setIngredientRows(
        editingRecipe.ingredients.map(
          (ingredient) => ({
            id:
              ingredient.id ||
              crypto.randomUUID(),

            ingredientId:
              ingredient.ingredientId,

            quantity:
              ingredient.quantity,

            unit:
              ingredient.unit || "",
          })
        )
      );
    }
  }, [editingRecipe]);

  async function loadIngredients() {
    try {
      const data =
        await getIngredients();

      setIngredients(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleRecipeChange(event) {
    setRecipeData({
      ...recipeData,
      [event.target.name]:
        event.target.value,
    });
  }

  function handleIngredientChange(
    rowId,
    field,
    value
  ) {
    setIngredientRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== rowId) {
          return row;
        }

        const updatedRow = {
          ...row,
          [field]: value,
        };

        if (
          field === "ingredientId"
        ) {
          const ingredient =
            ingredients.find(
              (ingredient) =>
                ingredient.id ===
                Number(value)
            );

          updatedRow.unit =
            ingredient?.base_unit ||
            "";
        }

        return updatedRow;
      })
    );
  }

  function addIngredientRow() {
    setIngredientRows((prevRows) => [
      ...prevRows,
      createIngredientRow(),
    ]);
  }

  function resetForm() {
    setRecipeData({
      name: "",
      yieldQuantity: "",
      instructions: "",
    });

    setIngredientRows([
      createIngredientRow(),
    ]);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const filteredIngredients =
      ingredientRows.filter(
        (ingredient) =>
          ingredient.ingredientId &&
          ingredient.quantity
      );

    const recipePayload = {
      ...recipeData,
      ingredients:
        filteredIngredients,
    };

    if (editingRecipe) {
      onUpdateRecipe(
        editingRecipe.id,
        recipePayload
      );
    } else {
      onAddRecipe(recipePayload);
    }

    resetForm();
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        {editingRecipe
          ? "Edit Recipe"
          : "Add Recipe"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Recipe Name"
          value={recipeData.name}
          onChange={
            handleRecipeChange
          }
          className="border p-3 rounded-lg"
        />

        <input
          type="number"
          name="yieldQuantity"
          placeholder="Yield Quantity"
          value={
            recipeData.yieldQuantity
          }
          onChange={
            handleRecipeChange
          }
          className="border p-3 rounded-lg"
        />

        <textarea
          name="instructions"
          placeholder="Instructions"
          value={
            recipeData.instructions
          }
          onChange={
            handleRecipeChange
          }
          className="border p-3 rounded-lg"
        />

        <div className="flex flex-col gap-3">
          {ingredientRows.map((row) => (
            <RecipeIngredientSelector
              key={row.id}
              row={row}
              ingredients={
                ingredients
              }
              onChange={
                handleIngredientChange
              }
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addIngredientRow}
          className="bg-stone-300 py-3 rounded-lg"
        >
          Add Ingredient
        </button>

        <button
          type="submit"
          className="bg-stone-900 text-white py-3 rounded-lg"
        >
          {editingRecipe
            ? "Update Recipe"
            : "Save Recipe"}
        </button>
      </form>
    </div>
  );
}

export default RecipeForm;