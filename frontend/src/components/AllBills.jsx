import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllBills,
  deleteBill as deleteBillAPI,
  updateBillAPI,
} from "../services/api";

const AllBills = () => {
  const [bills, setBills] = useState([]);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // options: "today", "week", "month", "custom"
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const fetchBills = async () => {
    try {
      const data = await getAllBills();
      // Sort bills by date (latest first)
      const sortedBills = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];
      setBills(sortedBills);
      console.log(bills.notes);
    } catch (error) {
      toast.error("❌ Failed to fetch bills from server!", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDeleteBill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    try {
      await deleteBillAPI(id);
      toast.success("✅ Bill deleted successfully!");
      setBills(bills.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast.error("❌ Failed to delete bill!");
    }
  };

  // Filter bills by today's date if showTodayOnly is true
  const filteredBills = bills.filter((bill) => {
    const billDate = new Date(bill.date);
    const today = new Date();

    switch (dateFilter) {
      case "today":
        return (
          billDate.getDate() === today.getDate() &&
          billDate.getMonth() === today.getMonth() &&
          billDate.getFullYear() === today.getFullYear()
        );

      case "week": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday
        return billDate >= startOfWeek && billDate <= endOfWeek;
      }

      case "month":
        return (
          billDate.getMonth() === today.getMonth() &&
          billDate.getFullYear() === today.getFullYear()
        );

      case "custom": {
        if (!customRange.start || !customRange.end) return true;
        const start = new Date(customRange.start);
        const end = new Date(customRange.end);
        return billDate >= start && billDate <= end;
      }

      default:
        return true;
    }
  });

  const handleSaveNote = async (id) => {
    try {
      await updateBillAPI(id, { note: newNote });
      setBills((prev) =>
        prev.map((bill) =>
          bill._id === id ? { ...bill, note: newNote } : bill
        )
      );
      setEditingNoteId(null);
      toast.success("📝 Note updated successfully!");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("❌ Failed to update note!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        {/* ✅ Header and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">
            All Bills
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Bills</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === "custom" && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) =>
                    setCustomRange((prev) => ({
                      ...prev,
                      start: e.target.value,
                    }))
                  }
                  className="p-2 border rounded-md shadow-sm"
                />
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="p-2 border rounded-md shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* ✅ Desktop / Tablet Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center">
                <th className="border px-4 py-3">#</th>
                <th className="border px-4 py-3">Customer Name</th>
                <th className="border px-4 py-3">Total Amount</th>
                <th className="border px-4 py-3">Items</th>
                <th className="border px-4 py-3">Free Items</th>
                <th className="border px-4 py-3">Notes</th>
                <th className="border px-4 py-3">Date</th>
                <th className="border px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map((bill, idx) => (
                  <tr
                    key={bill._id || idx}
                    className="text-center hover:bg-blue-50 transition-all duration-150"
                  >
                    <td className="border px-4 py-2">{idx + 1}</td>
                    <td className="border px-4 py-2 font-semibold text-gray-800">
                      {bill.customerName}
                    </td>
                    <td className="border px-4 py-2 text-green-600 font-bold">
                      ₹{bill.totalAmount}
                    </td>

                    <td className="border px-4 py-2 text-left text-gray-700">
                      {bill.items.map((item, i) => (
                        <div key={i}>
                          {item.name} - {item.bags || 0} Bags,{" "}
                          {item.pieces || 0} Pieces
                        </div>
                      ))}
                    </td>

                    <td className="border px-4 py-2 text-left text-gray-700">
                      {bill.freeItems && bill.freeItems.length > 0 ? (
                        bill.freeItems.map((item, i) => (
                          <div key={i}>
                            {item.name} - {item.bags || 0} Bags,{" "}
                            {item.pieces || 0} Pieces
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="border px-4 py-2">
                      {editingNoteId === bill._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="border px-2 py-1 rounded w-full focus:ring focus:ring-blue-300"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNote(bill._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNoteId(bill._id);
                            setNewNote(bill.note || "");
                          }}
                          className="cursor-pointer text-blue-600 hover:underline"
                        >
                          {bill.note || (
                            <span className="text-gray-400">Add note...</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="border px-4 py-2 text-gray-700">
                      {new Date(bill.date).toLocaleString()}
                    </td>

                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDeleteBill(bill._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-600">
                    No bills found for the selected date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile Card View */}
        <div className="grid grid-cols-1 gap-4 md:hidden mt-4">
          {filteredBills.length > 0 ? (
            filteredBills.map((bill, idx) => (
              <div
                key={bill._id || idx}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-gray-800 text-lg">
                    {bill.customerName}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(bill.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-1">
                  <strong>Total:</strong>{" "}
                  <span className="text-green-600 font-semibold">
                    ₹{bill.totalAmount}
                  </span>
                </p>

                <div className="text-sm mb-1">
                  <strong>Items:</strong>
                  <ul className="list-disc pl-5 text-gray-700">
                    {bill.items.map((item, i) => (
                      <li key={i}>
                        {item.name} - {item.bags || 0} Bags, {item.pieces || 0}{" "}
                        Pieces
                      </li>
                    ))}
                  </ul>
                </div>

                {bill.freeItems?.length > 0 && (
                  <div className="text-sm mb-1">
                    <strong>Free Items:</strong>
                    <ul className="list-disc pl-5 text-gray-600">
                      {bill.freeItems.map((item, i) => (
                        <li key={i}>
                          {item.name} - {item.bags || 0} Bags,{" "}
                          {item.pieces || 0} Pieces
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-2">
                  {editingNoteId === bill._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="border px-2 py-1 rounded w-full focus:ring focus:ring-blue-300"
                      />
                      <button
                        onClick={() => handleSaveNote(bill._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p
                      onClick={() => {
                        setEditingNoteId(bill._id);
                        setNewNote(bill.note || "");
                      }}
                      className="text-blue-600 cursor-pointer text-sm mt-1"
                    >
                      {bill.note ? (
                        <>📝 {bill.note}</>
                      ) : (
                        <span className="text-gray-400">Add note...</span>
                      )}
                    </p>
                  )}
                </div>

                <div className="mt-3 text-right">
                  <button
                    onClick={() => handleDeleteBill(bill._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No bills found for the selected date.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBills;
