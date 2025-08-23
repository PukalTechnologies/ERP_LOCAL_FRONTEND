import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://192.168.3.113:5000/api/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
   <Box
  sx={{
    backgroundImage: "url('/images/glass-building.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 2,
  }}
>
     <Paper
  elevation={8}
  sx={{
    p: 4,
    width: "400px",
    textAlign: "center",
    background: "rgba(0, 0, 0, 0.6)", 
    backdropFilter: "blur(10px)",     
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
    color: "white",
  }}
>

        {/* Logo & Title */}
        <Box mb={2}>
          <img
            src="/images/ERP3.png"
            alt="ERP Logo"
            style={{ width: "150px" }}
          />
        </Box>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            margin="normal"
            InputProps={{
              sx: {
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.4)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
              },
            }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.8)" },
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            InputProps={{
              sx: {
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.4)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
              },
            }}
            InputLabelProps={{
              sx: { color: "rgba(255,255,255,0.8)" },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "8px",
              backgroundColor: "#0051ff",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
