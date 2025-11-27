import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BillDetails() {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    const res = await axios.get(`${API}/bills/${billId}`);
    setBill(res.data);
  };

  const updateField = (itemId, field, value) => {
    const updatedItems = bill.items.map((it) =>
      it.id === itemId ? { ...it, [field]: value } : it
    );
    setBill({ ...bill, items: updatedItems });
  };

  const saveChanges = async () => {
    await axios.put(`${API}/bills/${billId}`, bill);
    alert("Bill Updated Successfully!");
  };

  if (!bill) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Bill #{billId}</h2>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Product</th>
            <th className="border p-2 text-center">Price</th>
            <th className="border p-2 text-center">Qty</th>
            <th className="border p-2 text-center">Total</th>
          </tr>
        </thead>

        <tbody>
          {bill.items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  className="border p-1 rounded w-20 text-center"
                  value={item.price}
                  onChange={(e) =>
                    updateField(item.id, "price", Number(e.target.value))
                  }
                />
              </td>

              <td className="border p-2 text-center">
                <input
                  type="number"
                  className="border p-1 rounded w-20 text-center"
                  value={item.quantity}
                  onChange={(e) =>
                    updateField(item.id, "quantity", Number(e.target.value))
                  }
                />
              </td>

              <td className="border p-2 text-center font-medium">
                ₹{(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={saveChanges}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
