import { useEffect, useState } from "react";

import PurchaseForm from "../components/purchases/PurchaseForm";
import PurchaseTable from "../components/purchases/PurchaseTable";

import {
  getPurchases,
  addPurchase,
  deletePurchase,
} from "../services/purchaseService";

function Purchases() {
  const [purchases, setPurchases] =
    useState([]);

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    try {
      const data =
        await getPurchases();

      setPurchases(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddPurchase(
    purchase
  ) {
    try {
      await addPurchase(purchase);

      loadPurchases();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
  const confirmed = window.confirm(
    "Delete purchase?"
  );

  if (!confirmed) return;

  try {
    await deletePurchase(id);

    loadPurchases();
  } catch (error) {
    console.error(error);
  }
}

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        Purchases
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <PurchaseForm
          onAddPurchase={
            handleAddPurchase
          }
        />

        <PurchaseTable
            purchases={purchases}
            onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default Purchases;