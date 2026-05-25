import {
  useEffect,
  useState,
} from "react";

import SalesForm from "../components/sales/SalesForm";

import {
  getSales,
  addSale,
  deleteSale,
} from "../services/saleService";

function Sales() {
  const [sales, setSales] =
    useState([]);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      const data =
        await getSales();

      setSales(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddSale(
    sale
  ) {
    try {
      await addSale(sale);

      loadSales();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
  const confirmed = window.confirm(
    "Delete sale?"
  );

  if (!confirmed) return;

  try {
    await deleteSale(id);

    loadSales();
  } catch (error) {
    console.error(error);
  }
}

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        Sales
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <SalesForm
          onAddSale={
            handleAddSale
          }
        />

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">
            Sales History
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2">
                  Date
                </th>

                <th className="pb-2">
                  Revenue
                </th>

                <th className="pb-2">
                  Cost
                </th>

                <th className="pb-2">
                  Profit
                </th>

                <th className="pb-2">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b"
                >
                  <td className="py-3">
                    {
                      sale.sale_date
                    }
                  </td>

                  <td>
                    $
                    {Number(
                      sale.total_revenue
                    ).toFixed(2)}
                  </td>

                  <td>
                    $
                    {Number(
                      sale.total_cost
                    ).toFixed(2)}
                  </td>

                  <td>
                    $
                    {Number(
                      sale.total_profit
                    ).toFixed(2)}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleDelete(sale.id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;