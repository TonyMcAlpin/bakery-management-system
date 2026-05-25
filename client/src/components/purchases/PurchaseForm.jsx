import { useEffect, useState } from "react";

import PurchaseItemRow from "./PurchaseItemRow";

import {
  getIngredients,
} from "../../services/ingredientService";

function PurchaseForm({
  onAddPurchase,
}) {
  const [ingredients, setIngredients] =
    useState([]);

  const [purchaseData, setPurchaseData] =
    useState({
      supplier: "",
      purchaseDate: "",
    });

  const [items, setItems] = useState([
    {
      id: 1,
      ingredientId: "",
      quantity: "",
      unit: "",
      cost: "",
    },
  ]);

  useEffect(() => {
    loadIngredients();
  }, []);

  async function loadIngredients() {
    try {
      const data = await getIngredients();

      setIngredients(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handlePurchaseChange(
    event
  ) {
    setPurchaseData({
      ...purchaseData,
      [event.target.name]:
        event.target.value,
    });
  }

  function handleItemChange(
    rowId,
    field,
    value
  ) {
    setItems(
      items.map((item) =>
        item.id === rowId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItemRow() {
    setItems([
      ...items,
      {
        id: Date.now(),
        ingredientId: "",
        quantity: "",
        unit: "",
        cost: "",
      },
    ]);
  }

  function calculateTotal() {
    return items
      .reduce(
        (sum, item) =>
          sum + Number(item.cost || 0),
        0
      )
      .toFixed(2);
  }

  function handleSubmit(event) {
    event.preventDefault();

    onAddPurchase({
      ...purchaseData,
      items,
    });

    setPurchaseData({
      supplier: "",
      purchaseDate: "",
    });

    setItems([
      {
        id: 1,
        ingredientId: "",
        quantity: "",
        unit: "",
        cost: "",
      },
    ]);
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Add Purchase
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          name="supplier"
          placeholder="Supplier"
          value={purchaseData.supplier}
          onChange={
            handlePurchaseChange
          }
          className="border p-3 rounded-lg"
        />

        <input
          type="date"
          name="purchaseDate"
          value={purchaseData.purchaseDate}
          onChange={
            handlePurchaseChange
          }
          className="border p-3 rounded-lg"
        />

        <div className="flex flex-col gap-3">
          {items.map((row) => (
            <PurchaseItemRow
              key={row.id}
              row={row}
              ingredients={ingredients}
              onChange={
                handleItemChange
              }
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addItemRow}
          className="bg-stone-300 py-3 rounded-lg"
        >
          Add Item
        </button>

        <div className="text-xl font-bold">
          Total: $
          {calculateTotal()}
        </div>

        <button
          type="submit"
          className="bg-stone-900 text-white py-3 rounded-lg"
        >
          Save Purchase
        </button>
      </form>
    </div>
  );
}

export default PurchaseForm;