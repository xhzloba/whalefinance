import React, { useMemo, useState, useEffect } from "react";
import {
  Typography,
  Box,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function ExpenseAnalysis({ transactions }) {
  const [expanded, setExpanded] = useState(true);
  const [categoryLimits, setCategoryLimits] = useState({});

  useEffect(() => {
    const savedLimits = localStorage.getItem("categoryLimits");
    if (savedLimits) {
      setCategoryLimits(JSON.parse(savedLimits));
    }
  }, []);

  const expenseAnalysis = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const incomes = transactions.filter((t) => t.type === "income");
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = totalIncome - totalExpense;

    const categorySums = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const sortedCategories = Object.entries(categorySums)
      .sort(([, a], [, b]) => b - a)
      .map(([category, sum]) => ({
        category,
        sum,
        percentage: totalExpense > 0 ? (sum / totalExpense) * 100 : 0,
      }));

    return { totalExpense, sortedCategories, currentBalance };
  }, [transactions]);

  const getProgressColor = (percentage) => {
    if (percentage <= 33) return "success.main";
    if (percentage <= 66) return "warning.main";
    return "error.main";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRecommendation = (topCategories, balance) => {
    let recommendation = "";
    const daysInMonth = 30;
    const today = new Date().getDate();
    const remainingDays = daysInMonth - today + 1;

    if (topCategories.length > 0) {
      const topCategory = topCategories[0];
      const categoryLimit = categoryLimits[topCategory.category];

      if (categoryLimit) {
        const spent = topCategory.sum;
        const remainingBudget = categoryLimit - spent;
        const progress = (spent / categoryLimit) * 100;
        const dailyBudget = remainingBudget / remainingDays;

        if (progress >= 100) {
          recommendation += `Вы превысили лимит в категории "${
            topCategory.category
          }" на ${formatCurrency(Math.abs(remainingBudget))}. `;
          if (balance > 0) {
            recommendation += `Ваш общий баланс позволяет покрыть перерасход, но рекомендуется пересмотреть расходы в этой категории. `;
          } else {
            recommendation += `Рекомендуется срочно пересмотреть расходы в этой категории. `;
          }
        } else if (progress > 90) {
          recommendation += `Вы почти исчерпали лимит в категории "${
            topCategory.category
          }". Осталось ${formatCurrency(remainingBudget)}. `;
          recommendation += `Рекомендуется ограничить расходы до ${formatCurrency(
            dailyBudget
          )} в день до конца месяца. `;
        } else if (progress > 75) {
          recommendation += `Вы приближаетесь к лимиту в категории "${
            topCategory.category
          }". Осталось ${formatCurrency(remainingBudget)}. `;
          recommendation += `Рекомендуется тратить не более ${formatCurrency(
            dailyBudget
          )} в день до конца месяца. `;
        } else {
          recommendation += `В категории "${
            topCategory.category
          }" у вас еще есть ${formatCurrency(
            remainingBudget
          )} до достижения лимита. `;
          recommendation += `Вы можете тратить до ${formatCurrency(
            dailyBudget
          )} в день до конца месяца. `;
        }

        if (balance < remainingBudget) {
          recommendation += `Обратите внимание, что ваш текущий баланс (${formatCurrency(
            balance
          )}) меньше оставшегося лимита в этой категории. `;
        }
      } else {
        // Существующая логика для категорий без лимита
      }
    }

    if (balance > 0) {
      const dailyBudget = balance / daysInMonth;
      recommendation += `Исходя из вашего текущего баланса (${formatCurrency(
        balance
      )}), рекомендуем тратить не более ${formatCurrency(
        dailyBudget
      )} в день в течение следующего месяца, чтобы сохранить финансовую стабильность.`;
    } else if (balance < 0) {
      const dailyDeficit = Math.abs(balance) / daysInMonth;
      recommendation += `Ваш текущий баланс отрицательный (${formatCurrency(
        balance
      )}). Рекомендуем сократить расходы минимум на ${formatCurrency(
        dailyDeficit
      )} в день в течение следующего месяца, чтобы улучшить финансовое положение.`;
    } else {
      recommendation += `Ваш текущий баланс равен нулю. Постарайтесь увеличить доходы или сократить расходы, чтобы улучшить финансовое положение.`;
    }

    return recommendation;
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        background: "transparent",
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Анализ расходов</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 2, paddingTop: 1 }}>
        <Box>
          {expenseAnalysis.sortedCategories.length > 0 ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Топ категорий расходов:
              </Typography>
              {expenseAnalysis.sortedCategories.slice(0, 3).map((category) => (
                <Box key={category.category} sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    {category.category}: {category.percentage.toFixed(1)}% (
                    {formatCurrency(category.sum)})
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={category.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getProgressColor(category.percentage),
                      },
                    }}
                  />
                </Box>
              ))}
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Рекомендация:
              </Typography>
              <Typography variant="body2">
                {getRecommendation(
                  expenseAnalysis.sortedCategories,
                  expenseAnalysis.currentBalance
                )}
              </Typography>
            </>
          ) : (
            <Typography variant="body2">
              Недостаточно данных для анализа расходов.
            </Typography>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default ExpenseAnalysis;
