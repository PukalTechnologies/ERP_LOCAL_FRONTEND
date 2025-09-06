import React from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* ✅ Navbar at top */}
      <Navbar />

      {/* ✅ Main Content below Navbar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f5f5f5",
          overflowY: "auto", // scrolls only the content area
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
