function PurchaseItemRow({
  row,
  ingredients,
  onChange,
}) {
  return (
    <div className="grid grid-cols-4 gap-4">
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
        placeholder="Unit"
        value={row.unit}
        onChange={(e) =>
          onChange(
            row.id,
            "unit",
            e.target.value
          )
        }
        className="border p-3 rounded-lg"
      />

      <input
        type="number"
        placeholder="Cost"
        value={row.cost}
        onChange={(e) =>
          onChange(
            row.id,
            "cost",
            e.target.value
          )
        }
        className="border p-3 rounded-lg"
      />
    </div>
  );
}

export default PurchaseItemRow;