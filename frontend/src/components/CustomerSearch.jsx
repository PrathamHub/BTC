import { useState, useEffect } from "react";
import { searchCustomerAPI } from "../services/api"; // <-- API function

const CustomerSearch = ({ onSearch, onClear }) => {
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!name.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await searchCustomerAPI(name);
        setSuggestions(res);
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [name]);

  const handleSelect = (customerName) => {
    setName(customerName);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-5 relative">
      {/* Input */}
      <div className="w-full relative">
        <input
          type="text"
          placeholder="Search Customer by Name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        />

        {/* Dropdown suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border w-full mt-1 rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
            {suggestions.map((item) => (
              <li
                key={item._id}
                onClick={() => handleSelect(item.name)}
                className="p-3 cursor-pointer hover:bg-gray-200"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={() => onSearch(name)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md"
      >
        Search
      </button>

      {/* Clear Button */}
      <button
        onClick={() => {
          setName("");
          setSuggestions([]);
          onClear();
        }}
        className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg shadow-md"
      >
        Clear
      </button>
    </div>
  );
};

export default CustomerSearch;
