import React from "react";
import { products } from "../data/Product";

const ProductSelector = ({ addProduct }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {products.map((p) => (
        <button
          key={p.id}
          onClick={() => addProduct(p)}
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm"
        >
          + {p.name}
        </button>
      ))}
    </div>
  );
};

export default ProductSelector;
