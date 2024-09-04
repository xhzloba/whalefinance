import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Tabs,
  Tab,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BarChartIcon from "@mui/icons-material/BarChart";
import dayjs from "dayjs";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Summary({
  balance,
  lastIncomeDate,
  lastIncomeAmount,
  currentMonthExpenses,
  progressValue,
  transactions,
}) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getProgressColor = (value) => {
    if (value < 50) return "#4caf50";
    if (value < 75) return "#ff9800";
    return "#f44336";
  };

  const totalIncome = transactions
    ? transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    : 0;

  const totalExpenses = transactions
    ? transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    : 0;

  const doughnutChartData = {
    labels: ["Доходы", "Расходы"],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Paper
      elevation={3}
      sx={{
        background:
          "linear-gradient(135deg, #002f4e 0%, #004d7a 50%, #008793 100%)",
        borderRadius: "12px",
        color: "white",
        overflow: "hidden",
      }}
    >
      <Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            "& .MuiTab-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .Mui-selected": { color: "white" },
            "& .MuiTabs-indicator": { backgroundColor: "white" },
            background: "#004973",
            boxShadow: `
    3px 1px 3px #007e8f,
    inset 2px 5px 23px black
  `,
          }}
        >
          <Tab icon={<TrendingUpIcon />} label="Доходы" />
          <Tab icon={<TrendingDownIcon />} label="Расходы" />
          <Tab icon={<BarChartIcon />} label="Графики" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Общий доход: {formatCurrency(totalIncome)}
          </Typography>
          <Typography variant="body2">
            Последний доход: {formatCurrency(lastIncomeAmount)} (
            {lastIncomeDate
              ? dayjs(lastIncomeDate).format("DD.MM.YYYY")
              : "Н/Д"}
            )
          </Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Общие расходы: {formatCurrency(totalExpenses)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Расходы с{" "}
            {lastIncomeDate
              ? dayjs(lastIncomeDate).format("DD.MM.YYYY")
              : "Н/Д"}
            :
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {formatCurrency(currentMonthExpenses)} ({progressValue.toFixed(1)}%
            от дохода {formatCurrency(lastIncomeAmount)})
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor: getProgressColor(progressValue),
              },
            }}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ height: 300 }}>
            <Doughnut
              data={doughnutChartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "white",
                    },
                  },
                },
              }}
            />
          </Box>
        </TabPanel>
      </Box>
    </Paper>
  );
}

export default Summary;
