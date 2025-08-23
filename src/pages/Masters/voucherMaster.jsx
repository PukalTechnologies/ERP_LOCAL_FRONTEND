import React, { useState, useEffect, Fragment } from "react";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { fetchLink } from "../../Components/fetchComponent";
import FilterableTable, { createCol } from "../../Components/filterableTable2";
import Layout from "../../Components/Layout";

const initialState = {
  Voucher_Type_Id: "",
  Voucher_Type: "",
  Voucher_Code: "",
  Branch_Id: "",
  Type: "",
  Voucher_Group_Id: "",
};

function VoucherMaster() {
  const [voucherData, setVoucherData] = useState([]);
  const [reload, setReload] = useState(false);

  // delete confirm modal
  const [open, setOpen] = useState(false);

  // create modal
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // edit modal
  const [editUser, setEditUser] = useState(false);

  const [inputValue, setInputValue] = useState(initialState);

  const [voucherType, setVoucherType] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [types, setTypes] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherGroup, setVoucherGroup] = useState([]);
  const [selectedVoucherGroup, setSelectedVoucherGroup] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.UserId;

  useEffect(() => {
    fetchLink({ address: `masters/voucher` })
      .then((data) => {
        if (data.success) setVoucherData(data.data);
      })
      .catch((e) => console.error(e));

    fetchLink({ address: `masters/branch/dropDown` })
      .then((data) => {
        if (data.success) setDistricts(data.data);
      })
      .catch((e) => console.error(e));

    fetchLink({ address: `masters/voucherGroup` })
      .then((data) => {
        if (data.success) setVoucherGroup(data.data);
      })
      .catch((e) => console.error(e));
  }, [reload]);

  // =================== DELETE ===================
  const handleDelete = () => {
    fetchLink({
      address: `masters/voucher`,
      method: "DELETE",
      bodyData: {
        Voucher_Type_Id: Number(inputValue.Voucher_Type_Id), // force number
      },
    })
      .then((data) => {
        if (data.success) {
          setReload(!reload);
          setOpen(false);
          toast.success("Voucher Type deleted successfully!");
        } else {
          toast.error("Failed to delete voucher: " + data.message);
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error("Error deleting voucher");
      });
  };

  // =================== CREATE ===================
  const handleCreate = () => {
    if (!selectedBranch || !voucherType || !types || !voucherCode || !selectedVoucherGroup) {
      toast.error("Please fill all fields");
      return;
    }
    fetchLink({
      address: `masters/voucher`,
      method: "POST",
      bodyData: {
        Voucher_Type: voucherType,
        Branch_Id: Number(selectedBranch),
        Type: types,
        Voucher_Code: voucherCode,
        Voucher_Group_Id: Number(selectedVoucherGroup),
        Created_By: userId,
      },
    })
      .then((data) => {
        if (data.success) {
          setIsCreateDialogOpen(false);
          setReload(!reload);
          toast.success(data.message);
          setVoucherType("");
          setSelectedBranch("");
          setTypes("");
          setVoucherCode("");
          setSelectedVoucherGroup("");
        } else {
          toast.error(data.message);
        }
      })
      .catch((e) => console.error(e));
  };

  // =================== EDIT ===================
  const editRow = (user) => {
    setEditUser(true);
    setInputValue({
      Voucher_Type_Id: Number(user.Voucher_Type_Id),
      Voucher_Type: user.Voucher_Type,
      Branch_Id: Number(user.Branch_Id),
      Voucher_Code: user.Voucher_Code,
      Type: user.Type,
      Voucher_Group_Id: Number(user.Voucher_Group_Id),
    });
    setSelectedBranch(user.Branch_Id);
    setSelectedVoucherGroup(user.Voucher_Group_Id);
  };

  const editFun = () => {
    fetchLink({
      address: `masters/voucher`,
      method: "PUT",
      bodyData: {
        Voucher_Type_Id: Number(inputValue.Voucher_Type_Id),
        Voucher_Type: inputValue.Voucher_Type,
        Branch_Id: Number(inputValue.Branch_Id),
        Voucher_Code: inputValue.Voucher_Code,
        Type: inputValue.Type,
        Voucher_Group_Id: Number(inputValue.Voucher_Group_Id),
        Alter_By: userId,
      },
    })
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          setReload(!reload);
          setEditUser(false);
        } else {
          toast.error(data.message);
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <Layout>
       <div className="page-content">
       <div
      style={{
        flex: 1,
        height: "100vh",
        overflowY: "auto",
        padding: "16px",
        background: "#f9f9f9",
      }}
    >
        <div className="card-header bg-white fw-bold d-flex align-items-center justify-content-between">
          Voucher Master
          <div className="text-end">
            <Button
              className="rounded-5 px-3 py-1 fa-13 btn-primary shadow"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create Voucher
            </Button>
          </div>
        </div>

        <FilterableTable
          dataArray={voucherData}
          EnableSerialNumber={true}
          isExpendable={true}
          maxHeightOption
          columns={[
            createCol("Voucher_Type", "string", "Voucher Type"),
            createCol("Type", "string", "Type"),
            createCol("BranchName", "string", "Branch Name"),
            createCol("Voucher_Code", "string", "Voucher Code"),
            createCol("Group_Name", "string", "Voucher Group"),
            {
              ColumnHeader: "Actions",
              isVisible: 1,
              isCustomCell: true,
              Cell: ({ row }) => (
                <td className="fa-12" style={{ minWidth: "80px" }}>
                  <IconButton onClick={() => editRow(row)} size="small">
                    <Edit className="fa-in" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpen(true);
                      setInputValue({ Voucher_Type_Id: Number(row.Voucher_Type_Id) }); // number fix
                    }}
                    size="small"
                    color="error"
                  >
                    <Delete className="fa-in " />
                  </IconButton>
                </td>
              ),
            },
          ]}
        />
      </div>

      {/* Create Modal */}
      <Modal show={isCreateDialogOpen} onHide={() => setIsCreateDialogOpen(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Voucher Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="mb-3">
              <label className="form-label">Voucher Name</label>
              <input
                type="text"
                onChange={(e) => setVoucherType(e.target.value)}
                value={voucherType}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="form-control"
              >
                <option value="">Select Branch</option>
                {districts.map((d) => (
                  <option key={d.BranchId} value={d.BranchId}>
                    {d.BranchName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Voucher Group</label>
              <select
                value={selectedVoucherGroup}
                onChange={(e) => setSelectedVoucherGroup(e.target.value)}
                className="form-control"
              >
                <option value="">Select Voucher Group</option>
                {voucherGroup.map((vou) => (
                  <option key={vou.Voucher_Group_Id} value={vou.Voucher_Group_Id}>
                    {vou.Group_Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Voucher Code</label>
              <input
                type="text"
                onChange={(e) => setVoucherCode(e.target.value)}
                value={voucherCode}
                className="form-control"
              />
            </div>
            <div className="mb-0">
              <label className="form-label">Type</label>
              <input
                type="text"
                onChange={(e) => setTypes(e.target.value)}
                value={types}
                className="form-control"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreate}>CREATE</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={editUser} onHide={() => setEditUser(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Voucher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="mb-3">
              <label className="form-label">Voucher Type</label>
              <input
                type="text"
                onChange={(e) => setInputValue({ ...inputValue, Voucher_Type: e.target.value })}
                value={inputValue.Voucher_Type}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setInputValue({ ...inputValue, Branch_Id: Number(e.target.value) });
                }}
                className="form-control"
              >
                <option value="">Select Branch</option>
                {districts.map((d) => (
                  <option key={d.BranchId} value={d.BranchId}>
                    {d.BranchName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Voucher Group</label>
              <select
                value={selectedVoucherGroup}
                onChange={(e) => {
                  setSelectedVoucherGroup(e.target.value);
                  setInputValue({ ...inputValue, Voucher_Group_Id: Number(e.target.value) });
                }}
                className="form-control"
              >
                <option value="">Select Voucher Group</option>
                {voucherGroup.map((vou) => (
                  <option key={vou.Voucher_Group_Id} value={vou.Voucher_Group_Id}>
                    {vou.Group_Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Voucher Code</label>
              <input
                type="text"
                onChange={(e) => setInputValue({ ...inputValue, Voucher_Code: e.target.value })}
                value={inputValue.Voucher_Code}
                className="form-control"
              />
            </div>
            <div className="mb-0">
              <label className="form-label">Type</label>
              <input
                type="text"
                onChange={(e) => setInputValue({ ...inputValue, Type: e.target.value })}
                value={inputValue.Type}
                className="form-control"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditUser(false)}>Cancel</Button>
          <Button variant="success" onClick={editFun}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation */}
      <Modal show={open} onHide={() => setOpen(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>Do you want to delete the Voucher?</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
      </div>
    </Layout>
  );
}

export default VoucherMaster;
