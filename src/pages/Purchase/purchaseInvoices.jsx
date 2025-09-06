import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
} from "@mui/material";
import Select from "react-select";
import { Add, Edit, FilterAlt, Search, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../Components/Layout";
import FilterableTable, { createCol } from "../../Components/filterableTable2";
import InvoiceBillTemplate from "../Sales/SalesReportComponent/newInvoiceTemplate";
import { fetchLink } from "../../Components/fetchComponent";
import { customSelectStyles } from "../../Components/tablecolumn";
import {
  getSessionFiltersByPageId,
  setSessionFilters,
  ISOString,
  isEqualNumber,
  toArray,
} from "../../Components/functions";

const PurchaseOrderList = ({
  loadingOn,
  loadingOff,
  EditRights = true,
  AddRights = true,
  DeleteRights = true,
  pageID,
}) => {
  const defaultFilters = {
    Fromdate: ISOString(),
    Todate: ISOString(),
    Retailer: { value: "", label: "ALL" },
    VoucherType: { value: "", label: "ALL" },
    EmployeeType: { value: "", label: "ALL" },
    Employee: { value: "", label: "ALL" },
    filterItems: { value: "", label: "ALL" },
    Cancel_status: "",
  };

  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [voucher, setVoucher] = useState([]);
  const [baseData, setBaseData] = useState({
    Employees: [],
    EmployeeTypes: [],
    products: [],
  });
  const [filters, setFilters] = useState({ ...defaultFilters, reload: false });
  const [dialog, setDialog] = useState({
    filters: false,
    orderDetails: false,
    cancelDialog: false,
    cancelPIN_Id: null,
    isCanceled: null,
  });
  const [viewOrder, setViewOrder] = useState({});
  const navigate = useNavigate();

  // Load session filters
  useEffect(() => {
    const sessionFilter = getSessionFiltersByPageId(pageID);
    setFilters((pre) => ({
      ...pre,
      Fromdate: sessionFilter?.Fromdate || defaultFilters.Fromdate,
      Todate: sessionFilter?.Todate || defaultFilters.Todate,
      Retailer: sessionFilter?.Retailer || defaultFilters.Retailer,
      VoucherType: sessionFilter?.VoucherType || defaultFilters.VoucherType,
      EmployeeType: sessionFilter?.EmployeeType || defaultFilters.EmployeeType,
      Employee: sessionFilter?.Employee || defaultFilters.Employee,
      filterItems: sessionFilter?.filterItems || defaultFilters.filterItems,
      Cancel_status:
        sessionFilter?.Cancel_status ?? defaultFilters.Cancel_status,
    }));
  }, [pageID]);

  // Fetch purchase orders
  useEffect(() => {
    const {
      Fromdate,
      Todate,
      Retailer,
      VoucherType,
      EmployeeType,
      Employee,
      filterItems,
      Cancel_status,
    } = filters;
    fetchLink({
      address: `purchase/purchaseOrder?Fromdate=${Fromdate}&Todate=${Todate}&Retailer_Id=${
        Retailer?.value || ""
      }&VoucherType=${VoucherType?.value || ""}&Cost_Center_Type_Id=${
        EmployeeType?.value || ""
      }&Involved_Emp_Id=${Employee?.value || ""}&filterItems=${
        filterItems?.value || ""
      }&Cancel_status=${Cancel_status}`,
      loadingOn,
      loadingOff,
    })
      .then((data) => {
        if (data.success) setPurchaseOrder(data.data);
      })
      .catch((e) => console.error("Fetch purchaseOrder error:", e));
  }, [filters.reload, pageID]);

  // Fetch dropdown master data
  useEffect(() => {
    // Retailers
    fetchLink({ address: `masters/retailers/dropDown` })
      .then((data) => data.success && setRetailers(data.data))
      .catch((e) => console.error("Fetch retailers error:", e));

    // Products
    fetchLink({ address: `masters/products/dropDown` })
      .then((data) => {
        if (data.success) {
          setBaseData((pre) => ({
            ...pre,
            products: toArray(data.data).map((p) => ({
              value: p.Product_Id,
              label: p.Product_Name,
            })),
          }));
        }
      })
      .catch((e) => console.error("Fetch products error:", e));

    // Voucher types
    fetchLink({ address: `masters/voucher` })
      .then((data) => data.success && setVoucher(data.data))
      .catch((e) => console.error("Fetch voucher error:", e));

    // Employees
    // Involved Staffs - CORRECTED API ENDPOINT
    fetchLink({
      address: `purchase/involvedStaffs`,
      loadingOn,
      loadingOff,
    })
      .then((data) => {
        if (data.success) {
          setBaseData((pre) => ({
            ...pre,
            Employees: data.others.Employees,
            EmployeeTypes: data.others.EmployeeTypes,
          }));
        }
      })
      .catch((e) => console.error("Fetch involvedStaffs error:", e));
  }, []);

  const closeDialog = () =>
    setDialog({
      filters: false,
      orderDetails: false,
      cancelDialog: false,
      cancelPIN_Id: null,
      isCanceled: null,
    });

  const navigateToPageWithState = ({ page = "", stateToTransfer = {} }) =>
    navigate(page, { state: stateToTransfer });

  const cancelPurchaseInvoice = () => {
    fetchLink({
      address: `purchase/purchaseOrder?PIN_Id=${dialog.cancelPIN_Id}`,
      method: "DELETE",
      loadingOn,
      loadingOff,
    })
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          setFilters((pre) => ({ ...pre, reload: !pre.reload }));
          closeDialog();
        } else toast.error(data.message || "Failed to cancel invoice");
      })
      .catch((e) => console.error("Cancel invoice error:", e));
  };

  const purchaseOrderColumn = [
    createCol("Po_Inv_No", "string", "Order ID"),
    createCol("Po_Entry_Date", "date", "Date", "center"),
    createCol("Retailer_Name", "string", "Party"),
    createCol("VoucherTypeGet", "string", "Voucher"),
    // createCol("Total_Before_Tax", "number", "Before Tax", "center"),
    // createCol("Total_Tax", "number", "Tax", "center"),
    createCol("Total_Invoice_value", "number", "Invoice Value", "center"),
    {
      ColumnHeader: "Canceled-?",
      isVisible: 1,
      align: "center",
      isCustomCell: true,
      Cell: ({ row }) => {
        const isCanceled = isEqualNumber(row?.Cancel_status, 1);
        return (
          <Button
            className="fw-bold fa-12 rounded-4 p-1 shadow-0"
            color={isCanceled ? "error" : "primary"}
            variant={isCanceled ? "contained" : "text"}
            disabled={!DeleteRights}
            onClick={() =>
              setDialog({
                ...dialog,
                cancelPIN_Id: row.PIN_Id,
                cancelDialog: true,
                isCanceled,
              })
            }
          >
            {isCanceled ? "Yes" : "No"}
          </Button>
        );
      },
    },
    {
      Field_Name: "Action",
      isVisible: 1,
      isCustomCell: true,
      Cell: ({ row }) => (
        <>
          <Tooltip title="View Order">
            <IconButton
              onClick={() =>
                setViewOrder({
                  orderDetails: row,
                  orderProducts: row?.Products_List || [],
                })
              }
              color="primary"
              size="small"
            >
              <Visibility className="fa-16" />
            </IconButton>
          </Tooltip>
          {EditRights && (
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() =>
                  navigateToPageWithState({
                    page: "create",
                    stateToTransfer: {
                      invoiceInfo: row,
                      orderInfo: row?.Products_List,
                      staffInfo: row?.Staff_List,
                    },
                  })
                }
              >
                <Edit className="fa-16" />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  const ExpendableComponent = ({ row }) => (
    <table className="table">
      <tbody>
        <tr>
          <td className="border p-2 bg-light">Branch</td>
          <td className="border p-2">{row.Branch_Name}</td>
          <td className="border p-2 bg-light">Sales Person</td>
          <td className="border p-2">{row?.Sales_Person_Name}</td>
          <td className="border p-2 bg-light">Round off</td>
          <td className="border p-2">{row.Round_off}</td>
        </tr>
        <tr>
          <td className="border p-2 bg-light">Broker</td>
          <td className="border p-2">
            {row?.Staff_List?.filter((s) => s.Involved_Emp_Type === "Broker")
              .map((s) => s.Involved_Emp_Name)
              .join(", ")}
          </td>
          <td className="border p-2 bg-light">Owners</td>
          <td className="border p-2">
            {row?.Staff_List?.filter((s) => s.Involved_Emp_Type === "Owners")
              .map((s) => s.Involved_Emp_Name)
              .join(", ")}
          </td>
          <td className="border p-2 bg-light">Others</td>
          <td className="border p-2">
            <table className="table table-bordered m-0 fa-12">
              <tbody>
                {row?.Staff_List?.filter(
                  (s) => !["Owners", "Broker"].includes(s.Involved_Emp_Type)
                ).map((s) => (
                  <tr key={s.Involved_Emp_Id}>
                    <td>{s?.Involved_Emp_Name}</td>
                    <td>{s?.Involved_Emp_Type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td className="border p-2 bg-light">Invoice Type</td>
          <td className="border p-2">
            {isEqualNumber(row.GST_Inclusive, 1)
              ? "Inclusive"
              : isEqualNumber(row.GST_Inclusive, 0)
              ? "Exclusive"
              : "Not applicable"}
          </td>
          <td className="border p-2 bg-light">Tax Type</td>
          <td className="border p-2">
            {isEqualNumber(row.IS_IGST, 1) ? "IGST" : "GST"}
          </td>
          <td className="border p-2 bg-light">Sales Person</td>
          <td className="border p-2">{row.Sales_Person_Name}</td>
        </tr>
        <tr>
          <td className="border p-2 bg-light">Narration</td>
          <td className="border p-2" colSpan={5}>
            {row.Narration}
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <Layout>
      <FilterableTable
        dataArray={purchaseOrder}
        columns={purchaseOrderColumn}
        title="Purchase Invoices"
        isExpendable={true}
        tableMaxHeight={550}
        // expandableComp={ExpendableComponent}
        ButtonArea={
          <>
            <Tooltip title="Filters">
              <IconButton
                size="small"
                className="ms-2"
                onClick={() => setDialog({ ...dialog, filters: true })}
              >
                <FilterAlt />
              </IconButton>
            </Tooltip>
            {AddRights && (
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => navigateToPageWithState({ page: "create" })}
              >
                Add
              </Button>
            )}
          </>
        }
      />

      {viewOrder?.orderDetails && (
        <InvoiceBillTemplate
          orderDetails={viewOrder.orderDetails}
          orderProducts={viewOrder.orderProducts}
          download
          actionOpen
          clearDetails={() => setViewOrder({})}
          TitleText="Purchase Order"
        />
      )}

      {/* Filters Dialog */}
      <Dialog
        open={dialog.filters}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <div className="table-responsive pb-4">
            <table className="table">
              <tbody>
                {[
                  { label: "From", field: "Fromdate", type: "date" },
                  { label: "To", field: "Todate", type: "date" },
                ].map(({ label, field, type }) => (
                  <tr key={field}>
                    <td style={{ verticalAlign: "middle" }}>{label}</td>
                    <td>
                      <input
                        type={type}
                        value={filters[field]}
                        onChange={(e) =>
                          setFilters({ ...filters, [field]: e.target.value })
                        }
                        className="cus-inpt"
                      />
                    </td>
                  </tr>
                ))}

                <tr>
                  <td style={{ verticalAlign: "middle" }}>Vendor</td>
                  <td>
                    <Select
                      value={filters.Retailer}
                      onChange={(e) => setFilters({ ...filters, Retailer: e })}
                      options={[
                        { value: "", label: "ALL" },
                        ...retailers.map((r) => ({
                          value: r.Retailer_Id,
                          label: r.Retailer_Name,
                        })),
                      ]}
                      styles={customSelectStyles}
                      menuPortalTarget={document.body}
                      isSearchable
                    />
                  </td>
                </tr>

                <tr>
                  <td style={{ verticalAlign: "middle" }}>Cost Center Type</td>
                  <td>
                    <Select
                      value={filters.EmployeeType}
                      onChange={(e) =>
                        setFilters({ ...filters, EmployeeType: e })
                      }
                      options={[
                        { value: "", label: "ALL" },
                        ...baseData.EmployeeTypes.map((t) => ({
                          value: t.Emp_Type_Id,
                          label: t.Emp_Type_Get,
                        })),
                      ]}
                      styles={customSelectStyles}
                      menuPortalTarget={document.body}
                      isSearchable
                    />
                  </td>
                </tr>

                <tr>
                  <td style={{ verticalAlign: "middle" }}>Cost Center Name</td>
                  <td>
                    <Select
                      value={filters.Employee}
                      onChange={(e) => setFilters({ ...filters, Employee: e })}
                      options={[
                        { value: "", label: "ALL" },
                        ...baseData.Employees.map((emp) => ({
                          value: emp.Emp_Id,
                          label: emp.Emp_Name_Get,
                        })),
                      ]}
                      styles={customSelectStyles}
                      menuPortalTarget={document.body}
                      isSearchable
                    />
                  </td>
                </tr>

                <tr>
                  <td style={{ verticalAlign: "middle" }}>Voucher</td>
                  <td>
                    <Select
                      value={filters.VoucherType}
                      onChange={(e) =>
                        setFilters({ ...filters, VoucherType: e })
                      }
                      options={[
                        { value: "", label: "ALL" },
                        ...voucher
                          .filter((v) => v.Type === "PURCHASE")
                          .map((v) => ({
                            value: v.Vocher_Type_Id,
                            label: v.Voucher_Type,
                          })),
                      ]}
                      styles={customSelectStyles}
                      menuPortalTarget={document.body}
                      isSearchable
                    />
                  </td>
                </tr>

                <tr>
                  <td style={{ verticalAlign: "middle" }}>Product Name</td>
                  <td>
                    <Select
                      value={filters.filterItems}
                      onChange={(e) =>
                        setFilters({ ...filters, filterItems: e })
                      }
                      options={[
                        { value: "", label: "ALL" },
                        ...baseData.products,
                      ]}
                      styles={customSelectStyles}
                      menuPortalTarget={document.body}
                      isSearchable
                    />
                  </td>
                </tr>

                <tr>
                  <td style={{ verticalAlign: "middle" }}>Canceled Order</td>
                  <td>
                    <select
                      value={filters.Cancel_status}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          Cancel_status: e.target.value
                            ? Number(e.target.value)
                            : "",
                        })
                      }
                      className="cus-inpt"
                    >
                      <option value="">ALL</option>
                      <option value={1}>Show</option>
                      <option value={0}>Hide</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
          <Button
            startIcon={<Search />}
            variant="outlined"
            onClick={() => {
              closeDialog();
              setSessionFilters({ ...filters, pageID });
              setFilters((pre) => ({ ...pre, reload: !pre.reload }));
            }}
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={dialog.cancelDialog}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          {dialog.isCanceled
            ? "This invoice has already been canceled. Do you want to restore it?"
            : "Are you sure you want to cancel this invoice? This action can be undone later."}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={cancelPurchaseInvoice}
          >
            {dialog.isCanceled ? "Restore Invoice" : "Cancel Invoice"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default PurchaseOrderList;
