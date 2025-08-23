import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import ProductsMaster from "./pages/Masters/newProduct";
import RetailersMaster from "./pages/UserModule/retailer/Retailer";
import Dashboard from "./pages/Dashboard";
import SaleInvoiceList from "./pages/Sales/SalesInvoice/salesInvoiceList";
import CreateSalesInvoice from "./pages/Sales/SalesInvoice/salesInvoiceCreation";
import VoucherMaster from "./pages/Masters/voucherMaster";


export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path= "/newProduct" element={<ProductsMaster />} />
        <Route path="/retailer" element={<RetailersMaster/>} />
        <Route path="/sales-invoice" element={<SaleInvoiceList/>}/>
        <Route path="/sales-invoice/create" element={<CreateSalesInvoice/>}/>
        <Route path="/voucher" element={<VoucherMaster/>}/>
      </Routes>
    </BrowserRouter>
  );
}
