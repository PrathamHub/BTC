// import React, { useState } from "react";
// import axios from "axios";
// const products = [
//   { id: 1, name: "Fena 5kg", sellingPrice: 7500 },
//   { id: 2, name: "Fena 3kg", sellingPrice: 4600 },
//   { id: 3, name: "Fena 2kg", sellingPrice: 3100 },
//   { id: 4, name: "Fena 1kg", sellingPrice: 1550 },
//   { id: 5, name: "Fena 500g", sellingPrice: 800 },
//   { id: 6, name: "Washing Soap Rs 10", sellingPrice: 10 },
//   { id: 7, name: "Washing Soap Rs 5", sellingPrice: 5 },
//   { id: 8, name: "Utensil Cleaning Soap Rs 5", sellingPrice: 5 },
//   { id: 9, name: "Utensil Cleaning Soap Rs 10", sellingPrice: 10 },
//   { id: 10, name: "Utensil Cleaning Soap Rs 30", sellingPrice: 30 },
//   { id: 11, name: "Premium Bar 200g", sellingPrice: 200 },
//   { id: 12, name: "Premium Bar 300g", sellingPrice: 300 },
// ];

// const CreateBill = () => {
//   const [billItems, setBillItems] = useState([]);
//   const [freeItems, setFreeItems] = useState([]);
//   const [grandTotal, setGrandTotal] = useState(0);

//   // ------------------------------
//   // Add a product to bill
//   // ------------------------------
//   const addProduct = (product) => {
//     if (billItems.find((item) => item.id === product.id)) return;
//     setBillItems([
//       ...billItems,
//       { ...product, quantity: 1, total: product.sellingPrice },
//     ]);
//   };

//   // ------------------------------
//   // Update quantity or price
//   // ------------------------------
//   const updateItem = (id, field, value) => {
//     const updated = billItems.map((item) =>
//       item.id === id
//         ? {
//             ...item,
//             [field]: Number(value),
//             total:
//               field === "quantity"
//                 ? Number(value) * item.sellingPrice
//                 : item.quantity * Number(value),
//           }
//         : item
//     );
//     setBillItems(updated);
//     calculateTotal(updated);
//   };

//   // ------------------------------
//   // Remove product from bill
//   // ------------------------------
//   const removeItem = (id) => {
//     const updated = billItems.filter((i) => i.id !== id);
//     setBillItems(updated);
//     calculateTotal(updated);
//   };

//   // ------------------------------
//   // Calculate total
//   // ------------------------------
//   const calculateTotal = (items) => {
//     const total = items.reduce((sum, i) => sum + i.total, 0);
//     setGrandTotal(total);
//   };

//   // ------------------------------
//   // Add free product
//   // ------------------------------
//   const addFreeItem = () => {
//     setFreeItems([...freeItems, { name: "", quantity: 1 }]);
//   };

//   const updateFreeItem = (index, field, value) => {
//     const updated = [...freeItems];
//     updated[index][field] = value;
//     setFreeItems(updated);
//   };

//   const removeFreeItem = (index) => {
//     const updated = freeItems.filter((_, i) => i !== index);
//     setFreeItems(updated);
//   };

//   // ------------------------------
//   // Generate Bill (later connect backend)
//   // ------------------------------
//   const generateBill = () => {
//     const billData = {
//       items: billItems,
//       freeItems,
//       grandTotal,
//     };
//     console.log("🧾 Final Bill:", billData);
//     alert("Bill generated! Check console for details.");
//   };
//   const handleGenerateBill = async () => {
//     const items = selectedItems.map((p) => ({
//       productId: p.id, // backend should match this ID with Product._id
//       quantity: selected[p.id].quantity,
//     }));

//     const totalAmount = calculateTotal();

//     try {
//       const res = await axios.post("http://localhost:5000/api/customers", {
//         name: "Customer A",
//         amount: totalAmount,
//         items, // send product data for dispatch
//       });

//       alert("✅ Bill Created and Stock Updated Successfully!");
//       console.log(res.data);
//       setSelected({});
//       setGrandTotal(0);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to create bill.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-center mb-6">
//           🧾 FENA BILLING SYSTEM
//         </h1>

//         {/* Product Selection */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           {products.map((p) => (
//             <button
//               key={p.id}
//               onClick={() => addProduct(p)}
//               className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm"
//             >
//               + {p.name}
//             </button>
//           ))}
//         </div>

//         {/* Bill Table */}
//         <table className="w-full border-collapse border border-gray-300">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="border p-2">Product</th>
//               <th className="border p-2 w-24">Price (₹)</th>
//               <th className="border p-2 w-24">Quantity</th>
//               <th className="border p-2 w-24">Total (₹)</th>
//               <th className="border p-2 w-16">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {billItems.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="text-center text-gray-500 py-4">
//                   No items added yet
//                 </td>
//               </tr>
//             ) : (
//               billItems.map((item) => (
//                 <tr key={item.id} className="text-center">
//                   <td className="border p-2">{item.name}</td>
//                   <td className="border p-2">
//                     <input
//                       type="number"
//                       value={item.sellingPrice}
//                       onChange={(e) =>
//                         updateItem(item.id, "sellingPrice", e.target.value)
//                       }
//                       className="w-20 border rounded-md text-center"
//                     />
//                   </td>
//                   <td className="border p-2">
//                     <input
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         updateItem(item.id, "quantity", e.target.value)
//                       }
//                       className="w-20 border rounded-md text-center"
//                     />
//                   </td>
//                   <td className="border p-2">{item.total}</td>
//                   <td className="border p-2">
//                     <button
//                       onClick={() => removeItem(item.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       ✕
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* Grand Total */}
//         <div className="text-right mt-4 text-xl font-bold text-green-700">
//           Grand Total: ₹{grandTotal}
//         </div>

//         {/* Free Items Section */}
//         <div className="mt-8 border-t pt-4">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-lg font-semibold">🎁 Free Items</h2>
//             <button
//               onClick={addFreeItem}
//               className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
//             >
//               + Add Free Item
//             </button>
//           </div>

//           {freeItems.length === 0 ? (
//             <p className="text-gray-500">No free items added.</p>
//           ) : (
//             <table className="w-full border-collapse border border-gray-300">
//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="border p-2">Product</th>
//                   <th className="border p-2">Quantity</th>
//                   <th className="border p-2 w-16">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {freeItems.map((item, index) => (
//                   <tr key={index} className="text-center">
//                     <td className="border p-2">
//                       <input
//                         type="text"
//                         value={item.name}
//                         onChange={(e) =>
//                           updateFreeItem(index, "name", e.target.value)
//                         }
//                         placeholder="Enter product name"
//                         className="w-full border rounded-md text-center"
//                       />
//                     </td>
//                     <td className="border p-2">
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         onChange={(e) =>
//                           updateFreeItem(index, "quantity", e.target.value)
//                         }
//                         className="w-20 border rounded-md text-center"
//                       />
//                     </td>
//                     <td className="border p-2">
//                       <button
//                         onClick={() => removeFreeItem(index)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         ✕
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Generate Bill Button */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={generateBill}
//             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
//           >
//             Generate Bill
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateBill;
