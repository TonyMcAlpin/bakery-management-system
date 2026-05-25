function RecipeCostBreakdown({
  costData,
}) {
  if (!costData) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Recipe Cost
      </h2>

      <div className="space-y-2 mb-6">
        <div className="text-lg">
          Total Recipe Cost:
          <span className="font-bold ml-2">
            $
            {
              costData.totalRecipeCost
            }
          </span>
        </div>

        <div className="text-lg">
          Cost Per Item:
          <span className="font-bold ml-2">
            $
            {costData.costPerItem}
          </span>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-2">
              Ingredient
            </th>

            <th className="pb-2">
              Quantity
            </th>

            <th className="pb-2">
              Unit Cost
            </th>

            <th className="pb-2">
              Ingredient Cost
            </th>
          </tr>
        </thead>

        <tbody>
          {costData.breakdown.map(
            (item, index) => (
              <tr
                key={index}
                className="border-b"
              >
                <td className="py-3">
                  {item.ingredient}
                </td>

                <td>
                  {item.quantity}
                </td>

                <td>
                  $
                  {item.unitCost}
                </td>

                <td>
                  $
                  {
                    item.ingredientCost
                  }
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecipeCostBreakdown;