import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import ProductsMaster from "./pages/Masters/newProduct";
import RetailersMaster from "./pages/UserModule/retailer/Retailer";
import Dashboard from "./pages/Dashboard";
import SaleInvoiceList from "./pages/Sales/SalesInvoice/salesInvoiceList";
import CreateSalesInvoice from "./pages/Sales/SalesInvoice/salesInvoiceCreation";
import VoucherMaster from "./pages/Masters/voucherMaster";
import ProtectedRoute from "./Components/ProtectedRoute";
import Godown from "./pages/Masters/Godown";
import PurchaseOrderList from "./pages/Purchase/purchaseInvoices";
import PurchaseInvoiceManagement from "./pages/Purchase/purchaseinvoicemanagement";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newProduct"
          element={
            <ProtectedRoute>
              <ProductsMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/retailer"
          element={
            <ProtectedRoute>
              <RetailersMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-invoice"
          element={
            <ProtectedRoute>
              <SaleInvoiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-invoice/create"
          element={
            <ProtectedRoute>
              <CreateSalesInvoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voucher"
          element={
            <ProtectedRoute>
              <VoucherMaster />
            </ProtectedRoute>
          }
        />
        <Route 
         path= "/godown"
          element={
            <ProtectedRoute>
              <Godown/>
            </ProtectedRoute>
          }
        />
        <Route 
        path= "/purchase-invoice"
        element={
          <ProtectedRoute>
            <PurchaseOrderList/>
          </ProtectedRoute>
        }
        />
         <Route
          path="/purchase-invoice/create"
          element={
            <ProtectedRoute>
              <PurchaseInvoiceManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
