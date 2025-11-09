import React, { useEffect, useState } from "react";
import { getAllStocks } from "../../services/api"; // import API function

const GetAllStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await getAllStocks();
        // assuming backend returns array like: [{ product: { name: "Fena 1kg" }, bags: 100 }]
        setStocks(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to fetch stock data");
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (loading) {
    return <div className="p-8 text-lg">⏳ Loading stock data...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">📦 All Product Stocks</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Product Name</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-center">Available Bags</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length > 0 ? (
              stocks.map((item, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-100 transition-all"
                >
                  <td className="py-3 px-4">{item.product?.name || "N/A"}</td>
                  <td className="py-3 px-4">
                    {item.product?.category || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-center">{item.bags}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No stock data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllStock;
