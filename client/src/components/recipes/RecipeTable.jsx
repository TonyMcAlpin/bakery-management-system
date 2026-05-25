function RecipeTable({
  recipes,
  onDelete,
  onEdit,
  onViewCost,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Recipes
      </h2>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-2">
              Name
            </th>

            <th className="pb-2">
              Yield
            </th>

            <th className="pb-2">
              Ingredients
            </th>

            <th className="pb-2">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {recipes.map((recipe) => (
            <tr
              key={recipe.id}
              className="border-b"
            >
              <td className="py-3">
                {recipe.name}
              </td>

              <td>
                {recipe.yield_quantity}
              </td>

              <td>
                {
                  recipe.ingredient_count
                }{" "}
                ingredients
              </td>

              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onViewCost(
                        recipe.id
                      )
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Cost
                  </button>

                  <button
                    onClick={() =>
                      onEdit(recipe)
                    }
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(recipe.id)
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

export default RecipeTable;