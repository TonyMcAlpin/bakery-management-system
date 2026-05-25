import {
  useEffect,
  useState,
} from "react";

function IngredientForm({
  onAddIngredient,
  editingIngredient,
  onUpdateIngredient,
}) {
  const [formData, setFormData] =
    useState({
      name: "",
      quantity: "",
      baseUnit: "",
      costPerUnit: "",
      supplier: "",
      minimumStock: "",
      unit: "",
    });

  useEffect(() => {
    if (editingIngredient) {
      setFormData({
        name:
          editingIngredient.name ||
          "",

        quantity:
          editingIngredient.quantity ||
          "",

        baseUnit:
          editingIngredient.base_unit ||
          "",

        costPerUnit:
          editingIngredient.cost_per_unit ||
          "",

        supplier:
          editingIngredient.supplier ||
          "",

        minimumStock:
          editingIngredient.minimum_stock ||
          "",

        unit:
          editingIngredient.unit ||
          "",
      });
    }
  }, [editingIngredient]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    try {
      if (
        editingIngredient
      ) {
        await onUpdateIngredient(
          editingIngredient.id,
          formData
        );
      } else {
        await onAddIngredient(
          formData
        );
      }

      setFormData({
        name: "",
        quantity: "",
        baseUnit: "",
        costPerUnit: "",
        supplier: "",
        minimumStock: "",
        unit: "",
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        {editingIngredient
          ? "Edit Ingredient"
          : "Add Ingredient"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Ingredient Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <select
          name="baseUnit"
          value={formData.baseUnit}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="">
            Select Base Unit
          </option>

          <option value="g">
            g
          </option>

          <option value="kg">
            kg
          </option>

          <option value="oz">
            oz
          </option>

          <option value="lb">
            lb
          </option>

          <option value="ml">
            ml
          </option>

          <option value="l">
            l
          </option>

          <option value="item">
            item
          </option>

          <option value="dozen">
            dozen
          </option>
        </select>

        <input
          type="number"
          name="costPerUnit"
          placeholder="Cost Per Unit"
          value={
            formData.costPerUnit
          }
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="supplier"
          placeholder="Supplier"
          value={formData.supplier}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="number"
          name="minimumStock"
          placeholder="Minimum Stock"
          value={
            formData.minimumStock
          }
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-stone-900 text-white py-3 rounded-lg"
        >
          {editingIngredient
            ? "Update Ingredient"
            : "Save Ingredient"}
        </button>
      </form>
    </div>
  );
}

export default IngredientForm;