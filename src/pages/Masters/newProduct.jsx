import React, { useState, useEffect } from "react";
import {
    IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Card, Button, Paper, CardContent, Tooltip, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination
} from "@mui/material";
import { Add, AddPhotoAlternate, Edit, Sync, FilterAlt, Search } from "@mui/icons-material";
import Select from "react-select";
import api from '../../API';
import { toast } from 'react-toastify';
import ImagePreviewDialog from "../../Components/imagePreview";
import { fetchLink } from '../../Components/fetchComponent';
import ProductAddEditComp from "./Components/productAddEdit";
import { customTableStyles } from "../../Components/tablecolumn";
import "./Components/productCss.css";
import { indianCurrency } from "../../Components/functions";
import { customSelectStyles } from "../../Components/tablecolumn";
import Layout from "../../Components/Layout.jsx";


const initialInputValue = {
    Product_Id: '',
    Product_Code: '',
    Product_Name: '',
    Short_Name: '',
    Product_Description: '',
    Brand: '',
    Product_Group: '',
    Pack_Id: '',
    UOM_Id: '',
    IS_Sold: '',
    Display_Order_By: '',
    HSN_Code: '',
    Gst_P: '',
    Cgst_P: '',
    Sgst_P: '',
    Igst_P: '',
    ERP_Id: '',
    Product_Image: '',
}


const ProductCard = ({ product, setProductInputValue, setDialog }) => {
    return (
        <div className="row">

            <div className="col-sm-2 p-0">
                <div className="product-card-image d-flex align-items-center flex-column">

                    <ImagePreviewDialog url={product?.productImageUrl}>
                        <img
                            src={product?.productImageUrl}
                            alt={product?.Product_Name}
                            style={{ maxWidth: '150px' }}
                        />
                    </ImagePreviewDialog>

                    <Button
                        onClick={() => {
                            setDialog(pre => ({ ...pre, imageUpload: true }));
                            setProductInputValue(pre => ({ ...pre, Product_Id: product.Product_Id, Product_Name: product?.Product_Name }))
                        }}
                        size="small"
                        variant='outlined'
                        startIcon={<AddPhotoAlternate sx={{ fontSize: '15px' }} />}
                        className="w-100 mt-2"
                    >
                        Change Photo
                    </Button>
                </div>
            </div>

            <div className=" col-sm-10 p-2">
                <div className="product-brand-group">
                    <span>{product?.Brand_Name} - {product?.Pro_Group}</span>
                    <span>
                        <IconButton
                            onClick={() => {
                                setProductInputValue(pre => {
                                    let inputVAL = { ...pre }
                                    Object.entries(product).forEach(([key, value]) => {
                                        inputVAL[key] = value ?? ''
                                    })
                                    return inputVAL
                                });

                                setDialog(pre => ({ ...pre, createAndUpdate: true }));
                            }}
                        ><Edit /></IconButton>
                    </span>
                </div>
                <h6 className="fw-bold fa-18">{product?.Product_Name}</h6>
                <p className="product-description">
                    {product?.Product_Description}
                </p>
                <table style={{ minWidth: '300px', marginBottom: '15px' }}>
                    <tbody>
                        <tr>
                            <td className="border fa-12 p-1 fw-bold">HSN Code</td>
                            <td className="border fa-12 p-1">{product?.HSN_Code ?? '-'}</td>
                            <td className="border fa-12 p-1 fw-bold">ERP Id</td>
                            <td className="border fa-12 p-1">{product?.ERP_Id ?? '-'}</td>
                        </tr>
                        <tr>
                            <td className="border fa-12 p-1 fw-bold">Tax</td>
                            <td className="border fa-12 p-1">{product?.Gst_P ?? 0}(%)</td>
                            <td className="border fa-12 p-1 fw-bold">Is Salable?</td>
                            <td className="border fa-12 p-1">
                                {(() => {
                                    switch (product?.IS_Sold) {
                                        case 0: {
                                            return 'Not Salable'
                                        }
                                        case 1: {
                                            return 'Salable'
                                        }
                                        default: {
                                            return 'Unknown'
                                        }
                                    }
                                })()}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="product-price">
                    <span className="price">{indianCurrency(product?.Item_Rate)}</span>
                    <span className="units"> / {product?.Units}</span>
                </div>
            </div>
        </div>
    );
};

const ProductsMaster = ({ loadingOn, loadingOff }) => {
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [filterInput, setFilterInput] = useState('');
    const [productInputValue, setProductInputValue] = useState(initialInputValue)
    const [dialog, setDialog] = useState({
        imageUpload: false,
        createAndUpdate: false
    });

    const [productDetails, setProductDetails] = useState([])
    const [shortname, setShortname] = useState([])
    const [posBrand, setPosBrand] = useState([])
    const [productGroup, setProductGroup] = useState([])
    const [brand, setBrand] = useState([])

    const [filters, setFilters] = useState({
        Product_Id: '',
        Products: 'ALL',
        ShortName_Id: '',
        ShortName: 'ALL',
        PosBrand_Id: '',
        PosBrand: 'ALL',
        ProductGroup_Id: '',
        ProductGroup: 'ALL',
        Brand_Id: '',
        Brand: 'ALL'
    });

    const [dialogFilter, setDialogFilter] = useState({
        filters: false,
        orderDetails: false,
    });

    useEffect(() => {
        fetchLink({
            address: `masters/products/allProducts`,
            loadingOn, loadingOff
        }).then(data => {
            if (data.success) {
                setProducts(data.data)
            }
        }).catch(e => console.error(e))
    }, [reload])

    useEffect(() => {
        const filteredResults = products.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(filterInput.toLowerCase())
            );
        });

        setFilteredData(filteredResults);
    }, [products, filterInput])

    const updateProductImage = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Product_Image', productInputValue.Product_Image);
        formData.append('Product_Id', productInputValue?.Product_Id);
        if (productInputValue?.Product_Image && productInputValue?.Product_Id) {

            fetch(`${api}masters/products/productImage`, {
                method: 'PUT',
                body: formData
            }).then(res => res.json())
                .then(data => {
                    if (data.success) {
                        toast.success(data.message);
                        imageUploadDialogClose()
                        setReload(!reload)
                    } else {
                        toast.error(data.message)
                    }
                }).catch(e => console.error(e))
        }
    }

    const imageUploadDialogClose = () => {
        setDialog({ imageUpload: false, createAndUpdate: false });
        setProductInputValue(initialInputValue);
    }

    const syncLOS = () => {
        if (loadingOn) loadingOn();
        fetchLink({
            address: `masters/products/losSync`,
            method: 'POST'
        }).then(data => {
            if (data.success) toast.success(data.message);
            else toast.error(data.message);
        }).catch(e => console.error(e)).finally(() => {
            if (loadingOff) loadingOff();
        })
    }

    useEffect(() => {
        fetchLink({
            address: `masters/posbranch/dropdown`
        }).then(data => {
            if (data.success) {
                setPosBrand(data.data);
            }
        }).catch(e => console.error(e))
    }, [])

    const closeDialog = () => {
        setDialogFilter({
            ...dialog,
            filters: false,
            orderDetails: false,
        });
    }
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <Layout>
            <Card component={Paper}>
                <div className="p-3 pb-1 d-flex align-items-center flex-wrap">
                    <h6 className="flex-grow-1 fa-18">Products</h6>
                    {/* <Tooltip title='Filters'>
                        <IconButton
                            size="small"
                            onClick={() => setDialogFilter({ ...dialogFilter, filters: true })}
                        >
                            <FilterAlt />
                        </IconButton>
                    </Tooltip> */}
                    <Tooltip title='Sync Tally LOS'><IconButton onClick={syncLOS}><Sync /></IconButton></Tooltip>

                    <ProductAddEditComp
                        reload={() => setReload(pre => !pre)}
                        loadingOn={loadingOn}
                        loadingOff={loadingOff}
                        onCloseFun={() => {
                            setProductInputValue(initialInputValue);
                            setDialog(pre => ({ ...pre, createAndUpdate: false }))
                        }}
                    >
                        <Button
                            variant='outlined'
                            startIcon={<Add />}
                        >
                            New
                        </Button>
                    </ProductAddEditComp>

                    <input
                        type="search"
                        value={filterInput}
                        className="cus-inpt w-auto p-1 ps-2 ms-2"
                        placeholder="Search"
                        onChange={e => setFilterInput(e.target.value)}
                    />

                </div>

                <CardContent sx={{ p: 0 }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}> {/* ✅ Fixed height with scroll */}
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={customTableStyles.headCells.style}>S.No</TableCell>
                                    <TableCell style={customTableStyles.headCells.style}>Name</TableCell>
                                    <TableCell style={customTableStyles.headCells.style}>HSN Code</TableCell>
                                    <TableCell style={customTableStyles.headCells.style}>Price/Kg</TableCell>
                                    <TableCell style={customTableStyles.headCells.style} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(filterInput === '' ? products : filteredData)
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow  key={row.Product_Id || index}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{row.Product_Name}</TableCell>
                                            <TableCell>{row.HSN_Code || '-'}</TableCell>
                                            <TableCell>{indianCurrency(row.Item_Rate)}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={() => {
                                                        setProductInputValue(pre => {
                                                            let inputVAL = { ...pre };
                                                            Object.entries(row).forEach(([key, value]) => {
                                                                inputVAL[key] = value ?? '';
                                                            });
                                                            return inputVAL;
                                                        });
                                                        setDialog(pre => ({ ...pre, createAndUpdate: true }));
                                                    }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={(filterInput === '' ? products : filteredData).length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </CardContent>
            </Card>

            <Dialog
                open={dialog.imageUpload}
                onClose={imageUploadDialogClose}
                fullWidth maxWidth='sm'
            >
                <DialogTitle>
                    Update Product Image
                    <span className="ps-1 text-primary">{productInputValue?.Product_Name}</span>
                </DialogTitle>
                <form onSubmit={updateProductImage}>
                    <DialogContent>
                        <label>Select Product Image</label>
                        <input
                            type='file'
                            className="cus-inpt" required
                            onChange={e => setProductInputValue({ ...productInputValue, Product_Image: e.target.files[0] })}
                            accept="image/*"
                        />
                        {productInputValue.Product_Image && (
                            <img
                                src={URL.createObjectURL(productInputValue.Product_Image)}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: 200, marginTop: 10 }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button type="button" onClick={imageUploadDialogClose}>cancel</Button>
                        <Button type="submit">update</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {dialog.createAndUpdate && (
                <ProductAddEditComp
                    reload={() => setReload(pre => !pre)}
                    loadingOn={loadingOn}
                    loadingOff={loadingOff}
                    row={productInputValue}
                    openAction={dialog.createAndUpdate}
                    onCloseFun={() => {
                        setProductInputValue(initialInputValue);
                        setDialog(pre => ({ ...pre, createAndUpdate: false }))
                    }}
                />
            )}

            <Dialog
                open={dialogFilter.filters}
                onClose={closeDialog}
                fullWidth maxWidth='sm'
            >
                <DialogTitle>Filters</DialogTitle>
                <DialogContent>
                    <div className="table-responsive pb-5">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td style={{ verticalAlign: 'middle' }}>productDetails</td>
                                    <td>
                                        <Select
                                            value={{ value: filters?.Product_Id, label: filters?.Products }}
                                            // value={filters?.Products}
                                            onChange={(e) => setFilters({ ...filters, Product_Id: e.value, Products: e.label })}
                                            options={[
                                                { value: '', label: 'ALL' },
                                                ...productDetails.map(obj => ({ value: obj?.Product_Id, label: obj?.Product_Name }))
                                            ]}

                                            placeholder={"Product Name"}
                                            styles={{
                                                ...customSelectStyles,
                                                menuPortal: base => ({ ...base, zIndex: 9999 })
                                            }}
                                            isSearchable={true}

                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            menuPlacement="auto"
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    <td style={{ verticalAlign: 'middle' }}>Short Name</td>
                                    <td>
                                        <Select
                                            value={{ value: filters?.ShortName_Id, label: filters?.ShortName }}
                                            onChange={(e) => setFilters({ ...filters, ShortName_Id: e.value, ShortName: e.label })}
                                            options={[
                                                { value: '', label: 'ALL' },
                                                ...shortname.map(obj => ({ value: obj?.Product_Id, label: obj?.Short_Name }))
                                            ]}

                                            placeholder={"Short Name"}
                                            styles={{
                                                ...customSelectStyles,
                                                menuPortal: base => ({ ...base, zIndex: 9999 })
                                            }}
                                            isSearchable={true}

                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            menuPlacement="auto"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ verticalAlign: 'middle' }}>Pos Brand</td>
                                    <td>
                                        <Select
                                            value={{ value: filters?.PosBrand_Id, label: filters?.PosBrand }}
                                            onChange={(e) => setFilters({ ...filters, PosBrand_Id: e.value, PosBrand: e.label })}
                                            options={[
                                                { value: '', label: 'ALL' },
                                                ...posBrand.map(obj => ({ value: obj?.value, label: obj?.label }))
                                            ]}

                                            placeholder={"Pos Brand"}
                                            styles={{
                                                ...customSelectStyles,
                                                menuPortal: base => ({ ...base, zIndex: 9999 })
                                            }}
                                            isSearchable={true}

                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            menuPlacement="auto"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ verticalAlign: 'middle' }}>Product Group</td>
                                    <td>
                                        <Select
                                            value={{ value: filters?.ProductGroup_Id, label: filters?.ProductGroup }}
                                            onChange={(e) => setFilters({ ...filters, ProductGroup_Id: e.value, ProductGroup: e.label })}
                                            options={[
                                                { value: '', label: 'ALL' },
                                                ...productGroup.map(obj => ({ value: obj?.Pro_Group_Id, label: obj?.Pro_Group }))
                                            ]}
                                            placeholder={"Product Group"}
                                            styles={{
                                                ...customSelectStyles,
                                                menuPortal: base => ({ ...base, zIndex: 9999 })
                                            }}
                                            isSearchable={true}

                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            menuPlacement="auto"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ verticalAlign: 'middle' }}>Brand</td>
                                    <td>
                                        <Select
                                            value={{ value: filters?.Brand_Id, label: filters?.Brand }}
                                            onChange={(e) => setFilters({ ...filters, Brand_Id: e.value, Brand: e.label })}
                                            options={[
                                                { value: '', label: 'ALL' },
                                                ...brand.map(obj => ({ value: obj?.Brand_Id, label: obj?.Brand_Name }))
                                            ]}
                                            placeholder={"Brand"}
                                            styles={{
                                                ...customSelectStyles,
                                                menuPortal: base => ({ ...base, zIndex: 9999 })
                                            }}
                                            isSearchable={true}

                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            menuPlacement="auto"
                                        />
                                    </td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>close</Button>
                    <Button
                        onClick={() => {
                            closeDialog();

                            // updateQueryString(updatedFilters);
                            setReload(pre => !pre);
                        }}
                        startIcon={<Search />}
                        variant="outlined"
                    >Search</Button>
                </DialogActions>
            </Dialog>

        </Layout>
    )
}


export default ProductsMaster;