import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; 
import AssignmentIcon from "@mui/icons-material/Assignment"; 
import Layout from "../Components/Layout";

export default function Dashboard() {
  const cardData = [
    {
      title: "SALE ORDER",
      erp: "0 / 0",
      tally: "0 / 0",
      color: "#FFC107", // yellow
      icon: <AssignmentIcon sx={{ fontSize: 50, color: "white" }} />,
    },
    {
      title: "SALES INVOICE",
      erp: "17,553 / 3",
      tally: "17,553 / 3",
      color: "#26A69A", // teal
      icon: <ReceiptLongIcon sx={{ fontSize: 50, color: "white" }} />,
    },
  ];

  return (
    <Layout>
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card
              sx={{
                background: card.color,
                color: "white",
                borderRadius: "16px",
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {card.title}
                    </Typography>
                    <Typography variant="body2">ERP: {card.erp}</Typography>
                    <Typography variant="body2">TALLY: {card.tally}</Typography>
                  </Box>
                  <Box>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </Layout>
  );
}
