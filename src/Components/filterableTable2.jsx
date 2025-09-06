import React, { Fragment, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  TableCell,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Card,
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem as MuiMenuItem,
  TextField,
  Button,
} from "@mui/material";
import {
  Download,
  MoreVert,
  ToggleOff,
  ToggleOn,
  Search,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";

// Helper functions
const isEqualNumber = (value, compareTo) => {
  return Number(value) === Number(compareTo);
};

const NumberFormat = (val) => {
  return new Intl.NumberFormat().format(val);
};

const LocalDate = (val) => {
  return new Date(val).toLocaleDateString();
};

const LocalTime = (val) => {
  return new Date(val).toLocaleTimeString();
};

/**
 * @typedef {Object} Column
 * @property {string} [Field_Name]
 * @property {'string'|'number'|'date'|'time'} [Fied_Data]
 * @property {'top'|'middle'|'bottom'} [verticalAlign]
 * @property {string} [ColumnHeader]
 * @property {string} [tdClass]
 * @property {0|1} [isVisible]
 * @property {'left'|'right'|'center'} [align]
 * @property {boolean} [isCustomCell]
 * @property {(row: object) => JSX.Element} [Cell]
 */

/**
 * @typedef {Object} Menu
 * @property {string} [name]
 * @property {JSX.Element} [icon]
 * @property {() => void} [onclick]
 * @property {boolean} [disabled]
 */

/**
 * @typedef {Object} FilterableTableProps
 * @property {Array<Object>} [dataArray]
 * @property {Array<Column>} [columns]
 * @property {Function} [onClickFun]
 * @property {boolean} [isExpendable]
 * @property {JSX.Element} [expandableComp]
 * @property {number} [tableMaxHeight]
 * @property {number} [initialPageCount]
 * @property {boolean} [EnableSerialNumber]
 * @property {'small'|'medium'|'large'} [CellSize]
 * @property {boolean} [disablePagination]
 * @property {string} [title]
 * @property {boolean} [PDFPrintOption]
 * @property {boolean} [ExcelPrintOption]
 * @property {boolean} [maxHeightOption]
 * @property {JSX.Element} [ButtonArea]
 * @property {Array<Menu>} [MenuButtons]
 * @property {number} [bodyFontSizePx]
 * @property {number} [headerFontSizePx]
 * @property {Function} [onCreateClick]
 * @property {Function} [onSearchChange]
 */

const preprocessDataForExport = (data, columns) => {
  return data.map((row) => {
    const flattenedRow = {};

    columns.forEach((column, index) => {
      if (column.isVisible || column.Defult_Display) {
        if (column.isCustomCell && column.Cell) {
          const cellContent = column.Cell({ row });

          const safeColumnHeader = column.ColumnHeader
            ? String(column.ColumnHeader).replace(/\s+/g, "_").toLowerCase()
            : `field_${index + 1}`;

          if (
            typeof cellContent === "string" ||
            typeof cellContent === "number" ||
            typeof cellContent === "bigint"
          ) {
            flattenedRow[safeColumnHeader] = cellContent;
          }
        } else {
          let key = column.Field_Name;
          flattenedRow[key] = row[key] || "";
        }
      }
    });

    return flattenedRow;
  });
};

const generatePDF = (dataArray, columns) => {
  try {
    const doc = new jsPDF();
    const processedData = preprocessDataForExport(dataArray, columns);

    const headers = columns
      .filter((column) => column.isVisible || column.Defult_Display)
      .map(
        (column) =>
          column.Field_Name ||
          String(column.ColumnHeader).replace(/\s+/g, "_").toLowerCase()
      );

    const rows = processedData
      .map((row) => headers.map((header) => row[header]))
      .map((o, i) => ({ ...o, Sno: i + 1 }));

    doc.autoTable({
      head: [headers],
      body: rows,
    });

    doc.save("table.pdf");
  } catch (e) {
    console.error(e);
  }
};

const exportToExcel = (dataArray, columns) => {
  try {
    const processedData = preprocessDataForExport(dataArray, columns);

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "table.xlsx");
  } catch (e) {
    console.error(e);
  }
};

const createCol = (
  field = "",
  type = "string",
  ColumnHeader = "",
  align = "left",
  verticalAlign = "center",
  isVisible = 1
) => {
  return {
    isVisible: isVisible,
    Field_Name: field,
    Fied_Data: type,
    align,
    verticalAlign,
    ...(ColumnHeader && { ColumnHeader }),
  };
};

const ButtonActions = ({ buttonsData = [], ToolTipText = "Options" }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const popOverOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={ToolTipText}>
        <IconButton
          aria-describedby={popOverOpen}
          onClick={handleClick}
          className="ms-2"
          size="small"
          sx={{
            backgroundColor: "#f0f0f0",
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          <MoreVert />
        </IconButton>
      </Tooltip>

      <Popover
        open={popOverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuList>
          {buttonsData.map((btn, btnKey) => (
            <MenuItem
              key={btnKey}
              onClick={() => btn?.onclick && btn?.onclick()}
              disabled={btn?.disabled}
            >
              <ListItemIcon>{btn?.icon}</ListItemIcon>
              <ListItemText>{btn?.name}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
};

const formatString = (val, dataType) => {
  switch (dataType) {
    case "number":
      return val ? NumberFormat(val) : val;
    case "date":
      return val ? LocalDate(val) : val;
    case "time":
      return val ? LocalTime(val) : val;
    case "string":
      return val;
    default:
      return "";
  }
};

const FilterableTable = ({
  dataArray = [],
  columns = [],
  onClickFun = null,
  isExpendable = false,
  expandableComp = null,
  tableMaxHeight = 500,
  initialPageCount = 10,
  EnableSerialNumber = true,
  CellSize = "medium",
  disablePagination = false,
  title = "User Control / User Type",
  PDFPrintOption = false,
  ExcelPrintOption = false,
  maxHeightOption = false,
  ButtonArea = null,
  MenuButtons = [],
  bodyFontSizePx = 13,
  headerFontSizePx = 13,
  onCreateClick = null,
  onSearchChange = null,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialPageCount);
  const [showFullHeight, setShowFullHeight] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const tableHeight =
    showFullHeight && maxHeightOption ? "max-content" : tableMaxHeight;

  const columnAlign = [
    {
      type: "left",
      class: "text-start",
    },
    {
      type: "right",
      class: "text-end",
    },
    {
      type: "center",
      class: "text-center",
    },
  ];

  const columnVerticalAlign = [
    {
      type: "top",
      class: "vtop",
    },
    {
      type: "bottom",
      class: "vbottom",
    },
    {
      type: "center",
      class: "vctr",
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = dataArray.slice(startIndex, endIndex);

  const RowComp = ({ row, index }) => {
    const [open, setOpen] = useState(false);

    return (
      <Fragment>
        <TableRow
          sx={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E0E0E0",
            "&:hover": {
              backgroundColor: onClickFun ? "#F5F7FF" : "inherit",
              cursor: onClickFun ? "pointer" : "default",
            },
          }}
        >
          {isExpendable === true && expandableComp && (
            <TableCell
              className="text-center vtop"
              sx={{
                fontSize: `${bodyFontSizePx}px`,
                padding: "12px 16px",
                border: "none",
              }}
            >
              <IconButton size="small" onClick={() => setOpen((pre) => !pre)}>
                {open ? (
                  <KeyboardArrowUp sx={{ fontSize: "20px" }} />
                ) : (
                  <KeyboardArrowDown sx={{ fontSize: "20px" }} />
                )}
              </IconButton>
            </TableCell>
          )}

          {EnableSerialNumber === true && (
            <TableCell
              className="text-center vtop"
              sx={{
                fontSize: `${bodyFontSizePx}px`,
                padding: "12px 16px",
                border: "none",
                color: "#666666",
                fontWeight: "500",
              }}
            >
              {rowsPerPage * page + index + 1}
            </TableCell>
          )}

          {columns?.map((column, columnInd) => {
            const isColumnVisible =
              isEqualNumber(column?.Defult_Display, 1) ||
              isEqualNumber(column?.isVisible, 1);
            const isCustomCell = Boolean(column?.isCustomCell) && column.Cell;
            const isCommonValue = !isCustomCell;

            const tdClass = (row, Field_Name, tdIndex) =>
              column?.tdClass
                ? ` ${column?.tdClass({ row, Field_Name, index: tdIndex })} `
                : "";

            const horizondalalignClass = column.align
              ? columnAlign.find(
                  (align) => align.type === String(column.align).toLowerCase()
                )?.class
              : "";

            const verticalAlignClass = column.verticalAlign
              ? columnVerticalAlign.find(
                  (align) =>
                    align.type === String(column.verticalAlign).toLowerCase()
                )?.class
              : "vctr";

            if (isColumnVisible && isCommonValue) {
              const foundEntry = Object.entries(row).find(
                ([key]) => key === column.Field_Name
              );

              return (
                <TableCell
                  key={columnInd}
                  className={`${horizondalalignClass} ${verticalAlignClass} ${tdClass(
                    row,
                    column.Field_Name,
                    index
                  )}`}
                  sx={{
                    fontSize: `${bodyFontSizePx}px`,
                    padding: "12px 16px",
                    border: "none",
                    color: "#333333",
                    fontWeight: "400",
                  }}
                  onClick={() =>
                    onClickFun
                      ? onClickFun(row)
                      : console.log("Function not supplied")
                  }
                >
                  {foundEntry
                    ? formatString(foundEntry[1], column?.Fied_Data)
                    : "-"}
                </TableCell>
              );
            }

            if (isColumnVisible && isCustomCell) {
              return (
                <TableCell
                  key={columnInd}
                  className={`${horizondalalignClass} ${verticalAlignClass} ${tdClass(
                    row,
                    column.Field_Name,
                    index
                  )}`}
                  sx={{
                    fontSize: `${bodyFontSizePx}px`,
                    padding: "12px 16px",
                    border: "none",
                    color: "#333333",
                    fontWeight: "400",
                  }}
                >
                  {column.Cell({ row, Field_Name: column.Field_Name, index })}
                </TableCell>
              );
            }

            return (
              <TableCell
                key={columnInd}
                sx={{
                  fontSize: `${bodyFontSizePx}px`,
                  padding: "12px 16px",
                  border: "none",
                  color: "#333333",
                  fontWeight: "400",
                }}
                className={`${horizondalalignClass} ${verticalAlignClass}`}
              >
                -
              </TableCell>
            );
          })}
        </TableRow>

        {isExpendable === true && expandableComp && open && (
          <TableRow>
            <TableCell
              colSpan={
                Number(columns?.length) + (EnableSerialNumber === true ? 2 : 1)
              }
              sx={{ border: "none", padding: 0 }}
            >
              {expandableComp({ row, index })}
            </TableCell>
          </TableRow>
        )}
      </Fragment>
    );
  };

  return (
    <Card
      className="bg-white overflow-hidden"
      component={Paper}
      sx={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #E0E0E0",
        borderRadius: "8px",
      }}
    >
      {/* Top Section with Title, Search and Create Button */}
      <Box
        sx={{
          backgroundColor: "#F8F9FA",
          borderBottom: "1px solid #E0E0E0",
          padding: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        {title && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              color: "#2D3748",
              m: 0,
              fontSize: "18px",
            }}
          >
            {title}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Search Box
          <TextField
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
            size="small"
            sx={{
              width: "220px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4299E1",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4299E1",
                  borderWidth: "1px",
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#E2E8F0",
              },
            }}
            InputProps={{
              startAdornment: (
                <Search
                  sx={{
                    color: "#718096",
                    marginRight: "8px",
                    fontSize: "20px",
                  }}
                />
              ),
            }}
          /> */}

       {/* CREATE USER TYPE Button - Matching Screenshot */}
{onCreateClick && (
  <Button
    variant="contained"
    onClick={onCreateClick}
    endIcon={<AddIcon />} // <-- Plus icon at the end
    sx={{
      backgroundColor: "#6B46C1",
      color: "#FFFFFF",
      borderRadius: "8px",        // smoother corners like in image
      textTransform: "uppercase", // matches screenshot
      fontWeight: "600",
      padding: "8px 20px",        // more horizontal padding
      fontSize: "14px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      "&:hover": {
        backgroundColor: "#553C9A",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      },
    }}
  >
    CREATE USER TYPE
  </Button>
)}

          {ButtonArea && ButtonArea}

          {(PDFPrintOption ||
            ExcelPrintOption ||
            MenuButtons.length > 0 ||
            maxHeightOption) && (
            <ButtonActions
              ToolTipText="Table Options"
              buttonsData={[
                ...(maxHeightOption
                  ? [
                      {
                        name: "Max Height",
                        icon: showFullHeight ? (
                          <ToggleOn fontSize="small" color="primary" />
                        ) : (
                          <ToggleOff fontSize="small" />
                        ),
                        onclick: () => setShowFullHeight((pre) => !pre),
                        disabled: isEqualNumber(dataArray?.length, 0),
                      },
                    ]
                  : []),
                ...(PDFPrintOption
                  ? [
                      {
                        name: "PDF Print",
                        icon: <Download fontSize="small" color="primary" />,
                        onclick: () => generatePDF(dataArray, columns),
                        disabled: isEqualNumber(dataArray?.length, 0),
                      },
                    ]
                  : []),
                ...(ExcelPrintOption
                  ? [
                      {
                        name: "Excel Print",
                        icon: <Download fontSize="small" color="primary" />,
                        onclick: () => exportToExcel(dataArray, columns),
                        disabled: isEqualNumber(dataArray?.length, 0),
                      },
                    ]
                  : []),
                ...MenuButtons,
              ]}
            />
          )}
        </Box>
      </Box>

      <TableContainer
        sx={{
          maxHeight: tableHeight,
          borderRadius: "0 0 8px 8px",
          borderBottomLeftRadius: "6px",
          borderBottomRightRadius: "6px",
          overflow: "auto",
          "& .MuiTable-root": {
            borderCollapse: "separate",
            borderSpacing: 0,
          },
        }}
      >
        <Table
          stickyHeader
          size={CellSize}
          sx={{
            minWidth: 650,
            "& .MuiTableCell-head": {
              backgroundColor: "#F5F5F5",
              borderBottom: "2px solid #E0E0E0",
              borderTop: "none",
              "&:first-of-type": {
                borderTopLeftRadius: "8px",
              },
              "&:last-of-type": {
                borderTopRightRadius: "8px",
              },
            },
            "& .MuiTableRow-root:last-child .MuiTableCell-body": {
              "&:first-of-type": {
                borderBottomLeftRadius: "8px",
              },
              "&:last-of-type": {
                borderBottomRightRadius: "8px",
              },
            },
          }}
        >
          <TableHead>
            <TableRow>
              {/* Expendable column */}
              {isExpendable && expandableComp && (
                <TableCell
                  className="fw-bold text-center"
                  sx={{
                    fontSize: `${headerFontSizePx}px`,
                    backgroundColor: "#F5F5F5",
                    padding: "10px",
                    fontWeight: "600",
                    color: "#333333",
                    borderBottom: "2px solid #E0E0E0",
                  }}
                >
                  #
                </TableCell>
              )}

              {/* Serial number column */}
              {EnableSerialNumber && (
                <TableCell
                  className="fw-bold text-center"
                  sx={{
                    fontSize: `${headerFontSizePx}px`,
                    backgroundColor: "#F5F5F5",
                    padding: "10px",
                    fontWeight: "600",
                    color: "#333333",
                    borderBottom: "2px solid #E0E0E0",
                  }}
                >
                  S No
                </TableCell>
              )}

              {/* Columns */}
              {columns.map((column, ke) => {
                const isColumnVisible =
                  isEqualNumber(column?.Defult_Display, 1) ||
                  isEqualNumber(column?.isVisible, 1);

                if (isColumnVisible) {
                  return (
                    <TableCell
                      key={ke}
                      className={
                        `${
                          column.ColumnHeader || column?.Field_Name
                            ? "fw-bold appFont"
                            : ""
                        }` +
                        (column.align
                          ? " " +
                            columnAlign.find(
                              (align) =>
                                align.type ===
                                String(column.align).toLowerCase()
                            )?.class
                          : "")
                      }
                      sx={{
                        fontSize: `${headerFontSizePx}px`,
                        backgroundColor: "#F5F5F5",
                        padding: "16px",
                        fontWeight: "600",
                        color: "#333333",
                        borderBottom: "2px solid #E0E0E0",
                      }}
                    >
                      {column.ColumnHeader ||
                        column?.Field_Name?.replace(/_/g, " ")}
                    </TableCell>
                  );
                }
                return null;
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {(disablePagination ? dataArray : paginatedData).map(
              (row, index) => (
                <RowComp key={index} row={row} index={index} />
              )
            )}
            {dataArray.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (isExpendable === true && expandableComp ? 1 : 0) +
                    (EnableSerialNumber === true ? 1 : 0)
                  }
                  sx={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#718096",
                    fontSize: "14px",
                    border: "none",
                  }}
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!disablePagination && dataArray.length > 0 && (
        <Box
          sx={{
            backgroundColor: "#F8F9FA",
            borderTop: "1px solid #E2E8F0",
            padding: "5px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#718096", marginRight: 1, fontSize: "14px" }}
            >
              Show per Page
            </Typography>
            <FormControl size="small" sx={{ minWidth: 70 }}>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{
                  height: "32px",
                  backgroundColor: "#FFFFFF",
                  fontSize: "14px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E2E8F0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4299E1",
                  },
                }}
              >
                {[3, 5, 10, 20, 50].map((option) => (
                  <MuiMenuItem
                    key={option}
                    value={option}
                    sx={{ fontSize: "14px" }}
                  >
                    {option}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Typography
              variant="body2"
              sx={{ color: "#718096", fontSize: "14px" }}
            >
              Page {page + 1} of {Math.ceil(dataArray.length / rowsPerPage)}
            </Typography>
            <IconButton
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              sx={{
                padding: "6px",
                borderRadius: "4px",
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#EDF2F7",
                  borderColor: "#4299E1",
                },
                "&.Mui-disabled": {
                  borderColor: "#EDF2F7",
                  backgroundColor: "#F7FAFC",
                },
              }}
            >
              {"<"}
            </IconButton>
            <IconButton
              onClick={() =>
                setPage((p) =>
                  Math.min(Math.ceil(dataArray.length / rowsPerPage) - 1, p + 1)
                )
              }
              disabled={page >= Math.ceil(dataArray.length / rowsPerPage) - 1}
              sx={{
                padding: "6px",
                borderRadius: "4px",
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#EDF2F7",
                  borderColor: "#4299E1",
                },
                "&.Mui-disabled": {
                  borderColor: "#EDF2F7",
                  backgroundColor: "#F7FAFC",
                },
              }}
            >
              {">"}
            </IconButton>
          </Box>
        </Box>
      )}
    </Card>
  );
};

FilterableTable.propTypes = {
  dataArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Field_Name: PropTypes.string,
      Fied_Data: PropTypes.oneOf(["string", "number", "date", "time"]),
      ColumnHeader: PropTypes.string,
      isVisible: PropTypes.oneOf([0, 1]),
      align: PropTypes.oneOf(["left", "right", "center"]),
      verticalAlign: PropTypes.oneOf(["top", "center", "bottom"]),
      isCustomCell: PropTypes.bool,
      Cell: PropTypes.func,
      tdClass: PropTypes.func,
    })
  ).isRequired,
  onClickFun: PropTypes.func,
  isExpendable: PropTypes.bool,
  expandableComp: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  tableMaxHeight: PropTypes.number,
  initialPageCount: PropTypes.number,
  EnableSerialNumber: PropTypes.bool,
  CellSize: PropTypes.string,
  disablePagination: PropTypes.bool,
  title: PropTypes.string,
  PDFPrintOption: PropTypes.bool,
  ExcelPrintOption: PropTypes.bool,
  maxHeightOption: PropTypes.bool,
  ButtonArea: PropTypes.element,
  MenuButtons: PropTypes.arrayOf(PropTypes.object),
  onCreateClick: PropTypes.func,
  onSearchChange: PropTypes.func,
};

FilterableTable.defaultProps = {
  dataArray: [],
  columns: [],
  onClickFun: null,
  isExpendable: false,
  expandableComp: null,
  tableMaxHeight: 550,
  initialPageCount: 10,
  EnableSerialNumber: true,
  CellSize: "medium",
  disablePagination: false,
  title: "User Control / User Type",
  PDFPrintOption: false,
  ExcelPrintOption: false,
  maxHeightOption: false,
  ButtonArea: null,
  MenuButtons: [],
  headerFontSizePx: 14,
  bodyFontSizePx: 14,
  onCreateClick: null,
  onSearchChange: null,
};

export default FilterableTable;
export { createCol, ButtonActions, formatString, isEqualNumber };