import { useEffect, useState } from "react";

import SaleItemRow from "./SaleItemRow";

import {
  getRecipes,
} from "../../services/recipeService";

function createSaleRow() {
  return {
    id: crypto.randomUUID(),
    recipeId: "",
    quantity: "",
    salePrice: "",
    recipeCost: 0,
    lineRevenue: 0,
    lineProfit: 0,
    averageSalePrice: 0,
  };
}

function SalesForm({
  onAddSale,
}) {
  const [recipes, setRecipes] =
    useState([]);

  const [saleDate, setSaleDate] =
    useState("");

  const [items, setItems] = useState([
    createSaleRow(),
  ]);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      const data =
        await getRecipes();

      setRecipes(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(
    rowId,
    field,
    value
  ) {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== rowId) {
          return item;
        }

        const updatedItem = {
          ...item,
          [field]: value,
        };

        const recipe =
          recipes.find(
            (recipe) =>
              recipe.id ===
              Number(
                updatedItem.recipeId
              )
          );

        const recipeCost =
          Number(
            recipe?.costPerItem || 0
          );

        const quantity =
          Number(
            updatedItem.quantity || 0
          );

        const totalSales =
          Number(
            updatedItem.salePrice || 0
          );

        const averageSalePrice =
          quantity > 0
            ? totalSales /
              quantity
            : 0;

        updatedItem.recipeCost =
          recipeCost;

        updatedItem.averageSalePrice =
          averageSalePrice;

        updatedItem.lineRevenue =
          totalSales;

        updatedItem.lineProfit =
          totalSales -
          recipeCost * quantity;

        return updatedItem;
      })
    );
  }

  function addItemRow() {
    setItems((prev) => [
      ...prev,
      createSaleRow(),
    ]);
  }

  function calculateTotals() {
    let revenue = 0;
    let profit = 0;

    items.forEach((item) => {
      revenue +=
        item.lineRevenue || 0;

      profit +=
        item.lineProfit || 0;
    });

    return {
      revenue:
        revenue.toFixed(2),

      profit:
        profit.toFixed(2),
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const filteredItems =
      items.filter(
        (item) =>
          item.recipeId &&
          item.quantity
      );

    onAddSale({
      saleDate,
      items: filteredItems,
    });

    setSaleDate("");

    setItems([createSaleRow()]);
  }

  const totals =
    calculateTotals();

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Record Sales
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          type="date"
          value={saleDate}
          onChange={(e) =>
            setSaleDate(
              e.target.value
            )
          }
          className="border p-3 rounded-lg"
        />

        <div className="flex flex-col gap-3">
          {items.map((row) => (
            <SaleItemRow
              key={row.id}
              row={row}
              recipes={recipes}
              onChange={handleChange}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addItemRow}
          className="bg-stone-300 py-3 rounded-lg"
        >
          Add Product
        </button>

        <div className="text-lg font-bold">
          Revenue: $
          {totals.revenue}
        </div>

        <div className="text-lg font-bold">
          Profit: $
          {totals.profit}
        </div>

        <button
          type="submit"
          className="bg-stone-900 text-white py-3 rounded-lg"
        >
          Save Sale
        </button>
      </form>
    </div>
  );
}

export default SalesForm;