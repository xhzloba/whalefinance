import React from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";

const ExportToExcelButton = ({ transactions, selectedMonth }) => {
  const handleExportToExcel = () => {
    console.log("Export button clicked"); // Добавлено для отладки

    if (!selectedMonth) {
      console.error("Selected month is not defined");
      return;
    }

    const monthDate = new Date(selectedMonth);
    if (isNaN(monthDate.getTime())) {
      console.error("Selected month is not a valid date");
      return;
    }

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === monthDate.getMonth() &&
        transactionDate.getFullYear() === monthDate.getFullYear()
      );
    });

    if (filteredTransactions.length === 0) {
      console.warn("No transactions found for the selected month");
      return;
    }

    console.log("Filtered Transactions:", filteredTransactions);

    // Calculate total expenses and expenses by category
    const totalExpenses = filteredTransactions.reduce((sum, transaction) => {
      return transaction.type === "expense" ? sum + transaction.amount : sum;
    }, 0);

    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      if (transaction.type === "expense") {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {});

    // Create data for the summary sheet
    const summaryData = [
      ["Общий расход", totalExpenses],
      ...Object.entries(categoryTotals).map(([category, total]) => [
        category,
        total,
      ]),
    ];

    // Create worksheet for transactions
    const transactionsWorksheet =
      XLSX.utils.json_to_sheet(filteredTransactions);

    // Create worksheet for summary
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Create workbook and append sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      transactionsWorksheet,
      "Transactions"
    );
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

    // Write workbook to file
    XLSX.writeFile(
      workbook,
      `Transactions_${monthDate.getFullYear()}_${monthDate.getMonth() + 1}.xlsx`
    );
  };

  return (
    <Button variant="outlined" size="small" onClick={handleExportToExcel}>
      Импорт в Excel
    </Button>
  );
};

export default ExportToExcelButton;
