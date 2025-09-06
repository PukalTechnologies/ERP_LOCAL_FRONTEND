import React from "react";
import Select from "react-select";
import { customSelectStyles } from "../../../Components/tablecolumn";
import { checkIsNumber, isEqualNumber, toArray } from "../../../Components/functions";
import RequiredStar from "../../../Components/requiredStar";

const ManageSalesInvoiceGeneralInfo = ({
  invoiceInfo = {},
  setInvoiceInfo,
  retailers = [],
  voucherType = [],
  branches = [],
  onChangeRetailer,
  stockItemLedgerName = [],
}) => {
  return (
    <>
      <div className="row g-3">
        {/* Party Name */}
        <div className="col-sm-8">
          <label className="form-label">
            Party Name <RequiredStar />
          </label>
          <Select
            value={{
              value: invoiceInfo?.Retailer_Id,
              label: invoiceInfo?.Retailer_Name,
            }}
            onChange={(e) => {
              setInvoiceInfo((pre) => ({
                ...pre,
                Retailer_Id: e.value,
                Retailer_Name: e.label,
              }));
              if (onChangeRetailer) onChangeRetailer();
            }}
            options={[
              { value: "", label: "Search", isDisabled: true },
              ...toArray(retailers).map((obj) => ({
                value: obj?.Retailer_Id,
                label: obj?.Retailer_Name,
              })),
            ]}
            styles={customSelectStyles}
            isSearchable={true}
            placeholder={"Select Vendor"}
            maxMenuHeight={300}
          />
        </div>

        {/* Voucher Type */}
        <div className="col-sm-4">
          <label className="form-label">Voucher Type</label>
          <Select
            value={{
              value: invoiceInfo.Voucher_Type,
              label: toArray(voucherType).find((v) =>
                isEqualNumber(v.Vocher_Type_Id, invoiceInfo.Voucher_Type)
              )?.Voucher_Type,
            }}
            onChange={(e) =>
              setInvoiceInfo((pre) => ({ ...pre, Voucher_Type: e.value }))
            }
            options={[
              { value: "", label: "Search", isDisabled: true },
              ...toArray(voucherType)
                .filter((fil) => fil?.Type === "SALES")
                .map((obj) => ({
                  value: obj?.Vocher_Type_Id,
                  label: obj?.Voucher_Type,
                })),
            ]}
            styles={customSelectStyles}
            isSearchable={true}
            placeholder={"Select Voucher Type"}
            maxMenuHeight={300}
            isDisabled={checkIsNumber(invoiceInfo?.Do_Id)}
          />
        </div>

        {/* Entry Date */}
        <div className="col-md-4 col-sm-6">
          <label className="form-label">
            Entry Date <RequiredStar />
          </label>
          <input
            type="date"
            className="form-control"
            value={invoiceInfo?.Do_Date}
            onChange={(e) =>
              setInvoiceInfo((pre) => ({ ...pre, Do_Date: e.target.value }))
            }
            required
          />
        </div>

        {/* Branch */}
        <div className="col-md-4 col-sm-6">
          <label className="form-label">
            Branch <RequiredStar />
          </label>
          <select
            className="form-select"
            value={invoiceInfo?.Branch_Id}
            onChange={(e) =>
              setInvoiceInfo((pre) => ({ ...pre, Branch_Id: e.target.value }))
            }
            required
          >
            <option value="">Select</option>
            {branches.map((o, i) => (
              <option key={i} value={o?.BranchId}>
                {o?.BranchName}
              </option>
            ))}
          </select>
        </div>

        {/* GST Type */}
        <div className="col-md-4 col-sm-6">
          <label className="form-label">
            GST Type <RequiredStar />
          </label>
          <select
            className="form-select"
            value={invoiceInfo.GST_Inclusive}
            onChange={(e) =>
              setInvoiceInfo((pre) => ({
                ...pre,
                GST_Inclusive: Number(e.target.value),
              }))
            }
            required
          >
            <option value={1}>Inclusive Tax</option>
            <option value={0}>Exclusive Tax</option>
            <option value={2}>Not Taxable</option>
          </select>
        </div>

        {/* Tax Type */}
        <div className="col-md-4 col-sm-6">
          <label className="form-label">Tax Type</label>
          <select
            className="form-select"
            value={invoiceInfo.IS_IGST}
            onChange={(e) =>
              setInvoiceInfo((pre) => ({
                ...pre,
                IS_IGST: Number(e.target.value),
              }))
            }
          >
            <option value="0">GST</option>
            <option value="1">IGST</option>
          </select>
        </div>

        {/* Stock Item Ledger */}
        <div className="col-md-4 col-sm-6">
          <label className="form-label">Stock Item Ledger Name</label>
          <Select
            value={{
              value: invoiceInfo.Stock_Item_Ledger_Name,
              label: invoiceInfo.Stock_Item_Ledger_Name,
            }}
            onChange={(e) =>
              setInvoiceInfo((pre) => ({
                ...pre,
                Stock_Item_Ledger_Name: e.value,
              }))
            }
            options={[
              { value: "", label: "Search", isDisabled: true },
              ...stockItemLedgerName.map((obj) => ({
                value: obj?.Stock_Item_Ledger_Name,
                label: obj?.Stock_Item_Ledger_Name,
              })),
            ]}
            styles={customSelectStyles}
            isSearchable={true}
            placeholder={"Select"}
            maxMenuHeight={300}
            menuPortalTarget={document.body}
          />
        </div>

        {/* Status */}
        <div className="col-md-4 col-sm-6">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={invoiceInfo?.Cancel_status}
            onChange={(e) =>
              setInvoiceInfo((pre) => ({
                ...pre,
                Cancel_status: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select
            </option>
            <option value="1">New</option>
            <option value="2">Progress</option>
            <option value="3">Completed</option>
            <option value="0">Canceled</option>
          </select>
        </div>
      </div>

      {/* Narration */}
      <div className="mt-3">
        <label className="form-label">Narration</label>
        <textarea
          className="form-control"
          rows={2}
          value={invoiceInfo.Narration}
          onChange={(e) =>
            setInvoiceInfo((pre) => ({ ...pre, Narration: e.target.value }))
          }
        />
      </div>
    </>
  );
};

export default ManageSalesInvoiceGeneralInfo;
