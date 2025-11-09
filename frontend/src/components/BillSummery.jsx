import React from "react";

const BillSummary = ({
  grandTotal,
  totalBags,
  totalPieces,
  dispatchDetails,
  onGenerate,
}) => {
  return (
    <div className="mt-8 text-center">
      <div className="text-left text-sm mb-3 bg-gray-50 p-2 rounded-md">
        <h2 className="font-semibold text-gray-700 mb-2">
          📦 Dispatch Summary:
        </h2>
        {dispatchDetails.map(
          (item) =>
            (item.totalBags > 0 || item.totalPieces > 0) && (
              <div
                key={item.name}
                className="flex justify-between text-gray-600"
              >
                <span>{item.name}</span>
                <span>
                  {item.totalBags} Bags, {item.totalPieces} Pieces
                </span>
              </div>
            )
        )}
      </div>

      <div className="text-right text-lg font-semibold text-blue-700 mb-2">
        Total Dispatched: {totalBags} Bags, {totalPieces} Pieces
      </div>
      <div className="text-right text-xl font-bold text-green-700 mb-4">
        Grand Total: ₹{grandTotal}
      </div>

      <button
        onClick={onGenerate}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Generate Bill
      </button>
    </div>
  );
};

export default BillSummary;
