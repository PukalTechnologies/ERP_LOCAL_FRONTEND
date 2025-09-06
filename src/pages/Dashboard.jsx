import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; 
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Layout from "../Components/Layout";

export default function Dashboard() {
  const cardData = [
    {
      title: "SALES INVOICE",
      count: "120",
      color: "#26A69A", 
      icon: <ReceiptLongIcon sx={{ fontSize: 50, color: "white" }} />,
    },
    {
      title: "PURCHASE INVOICE",
      count: "100",
      color: "#1c8554ff", 
      icon: <AttachMoneyIcon sx={{ fontSize: 50, color: "white" }} />,
    },
    {
      title: "JOURNAL",
      count: "140",
      color: "#1c2785cc", 
      icon: <MenuBookIcon sx={{ fontSize: 50, color: "white" }} />,
    }
  ];

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: 24 
          }}
        >
          {cardData.map((card, index) => (
            <Card
              key={index}
              sx={{
                background: card.color,
                color: "white",
                borderRadius: "16px",
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
                height: 150,                 
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <CardContent sx={{  display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2">ERP: {card.count}</Typography>
                </Box>
                <Box>{card.icon}</Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}
