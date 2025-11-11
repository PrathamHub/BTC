import { ToastContainer } from "react-toastify";
import "./App.css";
import Navbar from "./components/Navbar";
import CreateBill from "./pages/CreateBill";
import { Route, Routes } from "react-router-dom";
import GetAllStock from "./components/stock/GetAllStock";
import UpdateStock from "./components/stock/UpdateStock";
import AllBills from "./components/AllBills";

import Home from "./pages/Home";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/fena"
          element={
            <ProtectedRoute>
              <CreateBill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fena/bills"
          element={
            <ProtectedRoute>
              <AllBills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fena/stocks"
          element={
            <ProtectedRoute>
              <GetAllStock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fena/stocks/update"
          element={
            <ProtectedRoute>
              <UpdateStock />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right" // position of toast
        autoClose={1000} // 1.5 seconds
        hideProgressBar={false} // show/hide progress bar
        newestOnTop={true} // new toast on top
        closeOnClick // close on click
        pauseOnHover={false} // do not pause on hover
        draggable
        theme="colored" // light/dark/colored
      />
    </>
  );
}

export default App;
