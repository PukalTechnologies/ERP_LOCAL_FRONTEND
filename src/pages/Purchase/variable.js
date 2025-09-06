import { ISOString, isValidJSON } from "../../Components/functions";

const user = localStorage.getItem("user");
const storage = isValidJSON(user) ? JSON.parse(user) : { UserId: "" };

export const initialInvoiceValue = {
  PIN_Id: '',
  Po_Inv_No: '',
  Branch_Id: '',
  Voucher_Type: 0,
  Ref_Po_Inv_No: '',
  Po_Inv_Date: ISOString(),
  Po_Entry_Date: ISOString(),
  Retailer_Id: '',
  Retailer_Name: '',
  GST_Inclusive: 2,
  IS_IGST: 0,
  Narration: '',
  isConverted: '',
  CSGT_Total: 0,
  SGST_Total: 0,
  IGST_Total: 0,
  Round_off: 0,
  Total_Before_Tax: 0,
  Total_Tax: 0,
  Total_Invoice_value: 0,
  Cancel_status: 0,
  Stock_Item_Ledger_Name: '',
  Created_by: storage?.UserId ?? "",
  Altered_by: storage?.UserId ?? "",
  Created_on: '',
  Alterd_on: '',
  Trans_Type: '',
  Alter_Id: '',
  Approved_By: '',
  Approve_Status: '',
};


// Row details for items
export const itemsRowDetails = {
    Trip_Id: '',
    Trip_Item_SNo: '',
    POI_St_Id: '',
    DeliveryId: '',
    OrderId: '',
    PIN_Id: '',
    Po_Inv_Date: '',
    S_No: '',
    Location_Id: '',
    Item_Id: '',
    Item_Name: '',
    Bill_Qty: 0,
    Act_Qty: 0,
    Item_Rate: 0,
    Bill_Alt_Qty: 0,
    Free_Qty: 0,
    Unit_Id: '',
    Unit_Name: '',
    Batch_No: '',
    Taxable_Rate: 0,
    Amount: 0,
    Total_Qty: 0,
    Taxble: 0,
    HSN_Code: '',
    Taxable_Amount: 0,
    Tax_Rate: 0,
    Cgst: 0,
    Cgst_Amo: 0,
    Sgst: 0,
    Sgst_Amo: 0,
    Igst: 0,
    Igst_Amo: 0,
    Final_Amo: 0,
    Created_on: '',
};

// Row details for sales invoice items
export const salesInvoiceDetailsInfo = { ...itemsRowDetails };

// Row details for staff
export const staffRowDetails = {
    Id: '',
    PIN_Id: '',
    Involved_Emp_Id: '',
    Involved_Emp_Name: 'select',
    Cost_Center_Type_Id: '',
};
