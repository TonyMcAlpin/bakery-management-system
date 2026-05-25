function RecipeIngredientSelector({
  row,
  ingredients,
  onChange,
}) {
  const selectedIngredient =
    ingredients.find(
      (ingredient) =>
        ingredient.id ===
        Number(row.ingredientId)
    );

  return (
    <div className="grid grid-cols-3 gap-4">
      <select
        value={row.ingredientId}
        onChange={(e) =>
          onChange(
            row.id,
            "ingredientId",
            e.target.value
          )
        }
        className="border p-3 rounded-lg"
      >
        <option value="">
          Select Ingredient
        </option>

        {ingredients.map((ingredient) => (
          <option
            key={ingredient.id}
            value={ingredient.id}
          >
            {ingredient.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={row.quantity}
        onChange={(e) =>
          onChange(
            row.id,
            "quantity",
            e.target.value
          )
        }
        className="border p-3 rounded-lg"
      />

      <input
        type="text"
        value={
          selectedIngredient
            ?.base_unit || ""
        }
        disabled
        className="border p-3 rounded-lg bg-gray-100"
      />
    </div>
  );
}

export default RecipeIngredientSelector;