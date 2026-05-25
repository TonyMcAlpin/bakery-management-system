function IngredientTable({
  ingredients,
  onDelete,
  onEdit,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Ingredients
      </h2>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-2">Name</th>
            <th className="pb-2">Quantity</th>
            <th className="pb-2">Unit</th>
            <th className="pb-2">Cost</th>
            <th className="pb-2">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {ingredients.map((ingredient) => (
            <tr
              key={ingredient.id}
              className="border-b"
            >
              <td className="py-3">
                {ingredient.name}
              </td>

              <td>
                {ingredient.quantity}
              </td>

              <td>
                {ingredient.base_unit}
              </td>

              <td>
                $
                {
                  ingredient.cost_per_unit
                }
              </td>

              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onEdit(ingredient)
                    }
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(ingredient.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IngredientTable;