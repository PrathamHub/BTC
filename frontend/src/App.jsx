import { ToastContainer } from "react-toastify";
import "./App.css";
import Navbar from "./components/Navbar";
import CreateBill from "./pages/CreateBill";
import { Route, Routes } from "react-router-dom";
import GetAllStock from "./components/stock/GetAllStock";
import UpdateStock from "./components/stock/UpdateStock";
import AllBills from "./components/AllBills";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CreateBill />} />
        <Route path="/bills" element={<AllBills />} />
        <Route path="/stocks" element={<GetAllStock />} />
        <Route path="/stocks/update" element={<UpdateStock />} />
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
