function SaleItemRow({
  row,
  recipes,
  onChange,
}) {
  const selectedRecipe =
    recipes.find(
      (recipe) =>
        recipe.id ===
        Number(row.recipeId)
    );

  return (
    <div className="grid grid-cols-5 gap-4">
      <select
        value={row.recipeId}
        onChange={(e) =>
          onChange(
            row.id,
            "recipeId",
            e.target.value
          )
        }
        className="border p-3 rounded-lg"
      >
        <option value="">
          Select Product
        </option>

        {recipes.map((recipe) => (
          <option
            key={recipe.id}
            value={recipe.id}
          >
            {recipe.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Qty Sold"
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
        type="number"
        placeholder="Total Sales"
        value={row.salePrice}
        onChange={(e) =>
          onChange(
            row.id,
            "salePrice",
            e.target.value
          )
        }
        className="border p-3 rounded-lg"
      />

      <input
        type="text"
        disabled
        value={`$${Number(
          row.averageSalePrice || 0
        ).toFixed(2)}`}
        className="border p-3 rounded-lg bg-gray-100"
      />

      <input
        type="text"
        disabled
        value={
          selectedRecipe
            ? `$${Number(
                selectedRecipe.costPerItem || 0
              ).toFixed(2)}`
            : ""
        }
        className="border p-3 rounded-lg bg-gray-100"
      />
    </div>
  );
}

export default SaleItemRow;