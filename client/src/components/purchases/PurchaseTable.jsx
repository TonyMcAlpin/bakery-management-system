function PurchaseTable({
  purchases,
  onDelete,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Purchases
      </h2>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-2">
              Supplier
            </th>

            <th className="pb-2">
              Date
            </th>

            <th className="pb-2">
              Total Cost
            </th>

            <th className="pb-2">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {purchases.map((purchase) => (
            <tr
              key={purchase.id}
              className="border-b"
            >
              <td className="py-3">
                {purchase.supplier}
              </td>

              <td>
                {
                  purchase.purchase_date
                }
              </td>

              <td>
                $
                {purchase.total_cost}
              </td>

              <td>
                <button
                  onClick={() =>
                    onDelete(
                      purchase.id
                    )
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseTable;