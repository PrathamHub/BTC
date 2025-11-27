import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CustomerInput = ({ customerName, setCustomerName }) => {
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  const handleChange = async (value) => {
    setCustomerName(value);
    setHighlightedIndex(-1); // Reset highlighted index

    if (value.trim() === "") {
      setCustomerSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/customers/search?q=${value}`
      );
      setCustomerSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching customer suggestions", err);
    }
  };

  const handleKeyDown = (e) => {
    if (!customerSuggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < customerSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : customerSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (
        highlightedIndex >= 0 &&
        highlightedIndex < customerSuggestions.length
      ) {
        const selected = customerSuggestions[highlightedIndex];
        setCustomerName(selected.name);
        setCustomerSuggestions([]);
        setHighlightedIndex(-1);
      }
    } else if (e.key === "Escape") {
      setCustomerSuggestions([]);
      setHighlightedIndex(-1);
    }
  };

  // Scroll into view the highlighted item
  useEffect(() => {
    if (highlightedIndex >= 0) {
      const element = document.getElementById(
        `customer-suggestion-${highlightedIndex}`
      );
      if (element) element.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div className="mb-6 relative">
      <label className="block text-base sm:text-lg font-medium mb-2 text-gray-700">
        Customer Name
      </label>
      <input
        ref={inputRef}
        type="text"
        value={customerName}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter customer name"
        className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {customerSuggestions.length > 0 && (
        <ul className="absolute z-50 bg-white border w-full max-h-48 overflow-y-auto mt-1 rounded-md shadow-md">
          {customerSuggestions.map((c, idx) => (
            <li
              id={`customer-suggestion-${idx}`}
              key={idx}
              className={`px-3 py-2 cursor-pointer text-sm sm:text-base ${
                highlightedIndex === idx
                  ? "bg-blue-200 font-semibold"
                  : "hover:bg-blue-100"
              }`}
              onMouseEnter={() => setHighlightedIndex(idx)}
              onClick={() => {
                setCustomerName(c.name);
                setCustomerSuggestions([]);
                setHighlightedIndex(-1);
              }}
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerInput;
