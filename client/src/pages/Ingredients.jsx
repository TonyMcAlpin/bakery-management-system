import {
  useEffect,
  useState,
} from "react";

import IngredientForm from "../components/inventory/IngredientForm";
import IngredientTable from "../components/inventory/IngredientTable";

import {
  getIngredients,
  addIngredient,
  deleteIngredient,
  updateIngredient,
} from "../services/ingredientService";

function Ingredients() {
  const [ingredients, setIngredients] =
    useState([]);

  const [
    editingIngredient,
    setEditingIngredient,
  ] = useState(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  async function loadIngredients() {
    try {
      const data =
        await getIngredients();

      setIngredients(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddIngredient(
    ingredient
  ) {
    try {
      await addIngredient(ingredient);

      loadIngredients();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete ingredient?"
    );

    if (!confirmed) return;

    try {
      await deleteIngredient(id);

      loadIngredients();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(ingredient) {
    setEditingIngredient(ingredient);
  }

  async function handleUpdateIngredient(
    id,
    ingredient
  ) {
    try {
      await updateIngredient(
        id,
        ingredient
      );

      setEditingIngredient(null);

      loadIngredients();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        Ingredients
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <IngredientForm
          onAddIngredient={
            handleAddIngredient
          }
          editingIngredient={
            editingIngredient
          }
          onUpdateIngredient={
            handleUpdateIngredient
          }
        />

        <IngredientTable
          ingredients={ingredients}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}

export default Ingredients;