import React, { useState } from "react";
import ProductSelector from "../components/ProductSelector";
import BillTable from "../components/BillTable";
import FreeItems from "../components/FreeItem";
import BillSummary from "../components/BillSummery";
import CustomerInput from "../components/CustomerInput";
import { createBill } from "../services/api";
import { products } from "../data/Product";
import { toast } from "react-toastify";

const CreateBill = () => {
  const [note, setNote] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [freeItems, setFreeItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [focusedProductId, setFocusedProductId] = useState(null);

  // Add product
  const addProduct = (product) => {
    if (billItems.find((item) => item.id === product.id)) return;
    const newItems = [
      ...billItems,
      {
        ...product,
        quantity: 1,
        bags: 0,
        pieces: 0,
        total: product.sellingPrice,
      },
    ];
    setBillItems(newItems);
    setFocusedProductId(product.id);
  };

  // Update item quantity/price
  const updateItem = (id, field, value) => {
    const updated = billItems.map((item) => {
      if (item.id === id) {
        const newValue = Number(value);
        const bags = field === "bags" ? newValue : item.bags || 0;
        const pieces = field === "pieces" ? newValue : item.pieces || 0;
        const price = field === "sellingPrice" ? newValue : item.sellingPrice;
        const quantity = bags > 0 ? bags : pieces;
        const total = price * quantity;

        return { ...item, [field]: newValue, total };
      }
      return item;
    });

    setBillItems(updated);
    calculateTotal(updated);
  };

  const removeItem = (id) => {
    const updated = billItems.filter((i) => i.id !== id);
    setBillItems(updated);
    calculateTotal(updated);
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, i) => sum + i.total, 0);
    setGrandTotal(total);
  };

  // Free Items
  const addFreeItem = () =>
    setFreeItems([...freeItems, { name: "", quantity: 1, bags: 0, pieces: 0 }]);

  const updateFreeItem = (index, field, value) => {
    const updated = [...freeItems];
    updated[index][field] = value;
    setFreeItems(updated);
  };

  const removeFreeItem = (index) =>
    setFreeItems(freeItems.filter((_, i) => i !== index));

  // Total Dispatch
  const totalDispatch = products.map((p) => {
    const bill = billItems.find((i) => i.name === p.name) || {};
    const free = freeItems.find((i) => i.name === p.name) || {};

    return {
      name: p.name,
      totalBags: Number(bill.bags || 0) + Number(free.bags || 0),
      totalPieces: Number(bill.pieces || 0) + Number(free.pieces || 0),
    };
  });

  const totalBags = totalDispatch.reduce((sum, i) => sum + i.totalBags, 0);
  const totalPieces = totalDispatch.reduce((sum, i) => sum + i.totalPieces, 0);

  // Generate Bill
  const handleGenerateBill = async () => {
    if (!customerName.trim()) {
      toast.warning(
        "⚠️ Please enter a customer name before generating the bill."
      );
      return;
    }

    const data = {
      customerName,
      items: billItems,
      freeItems,
      grandTotal,
      totalDispatch,
      note,
    };

    try {
      await createBill(data);
      toast.success("✅ Bill Created Successfully!");
      setBillItems([]);
      setCustomerName("");
      setFreeItems([]);
      setGrandTotal(0);
      setNote("");
    } catch (error) {
      console.error("❌ Failed to create bill:", error);
      toast.error(error.response?.data?.message || "❌ Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          🧾 FENA BILLING SYSTEM
        </h1>

        {/* Customer Input */}
        <CustomerInput
          customerName={customerName}
          setCustomerName={setCustomerName}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ProductSelector addProduct={addProduct} />
            <BillTable
              billItems={billItems}
              updateItem={updateItem}
              removeItem={removeItem}
              focusProductId={focusedProductId}
            />
          </div>

          <div className="space-y-6">
            <FreeItems
              freeItems={freeItems}
              addFreeItem={addFreeItem}
              updateFreeItem={updateFreeItem}
              removeFreeItem={removeFreeItem}
              allProducts={products}
            />
            <BillSummary
              grandTotal={grandTotal}
              totalBags={totalBags}
              totalPieces={totalPieces}
              dispatchDetails={totalDispatch}
              onGenerate={handleGenerateBill}
            />
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-base sm:text-lg font-medium mb-2 text-gray-700">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write any important message for this bill..."
            className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 h-24 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
