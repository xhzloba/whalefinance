import React, { useState, useMemo } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  TextField,
  Box,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FaceIcon from "@mui/icons-material/Face";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ru";
import dayjs from "dayjs";
import ExportToExcelButton from "./ExportToExcelButton";
import { Timestamp } from "firebase/firestore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const categoryColors = {
  "Транспорт и Связь": { background: "#1a4cff34", iconColor: "#d35400" },
  "Онлайн покупки": { background: "#f951ff19", iconColor: "#d42ec6" },
  "Красота и Здоровье": { background: "#7aff7c61", iconColor: "#3caa28de" },
  "Отдых и развлечение": { background: "#ffa50061", iconColor: "#ff8c00" },
  Прочее: { background: "#d2d7d361", iconColor: "#7f8c8d" },
  Кредиты: { background: "#f1c40f61", iconColor: "#f39c12" },
  Продукты: { background: "#e74c3c61", iconColor: "#c0392b" },
  "ЖКХ и Квартира": { background: "#9b59b661", iconColor: "#8e44ad" },
  income: { background: "#2ecc7161", iconColor: "#27ae60" },
  Рестораны: { background: "#e67e2261", iconColor: "#d35400" },
  "Переводы онлайн": { background: "#3498db61", iconColor: "#2980b9" },
};

const categoryIcons = {
  "Транспорт и Связь": DirectionsBusIcon,
  "Онлайн покупки": ShoppingCartIcon,
  "Красота и Здоровье": FaceIcon,
  "Отдых и развлечение": LocalActivityIcon,
  Прочее: HelpOutlineIcon,
  Кредиты: AccountBalanceIcon,
  Продукты: ShoppingBasketIcon,
  "ЖКХ и Квартира": HomeIcon,
  income: AttachMoneyIcon,
  Рестораны: LocalDiningIcon,
  "Переводы онлайн": AttachMoneyIcon,
};

const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedAmount = formatter.format(amount);

  // Если сумма целая, убираем десятичную часть
  return formattedAmount.endsWith(",00")
    ? formattedAmount.slice(0, -3)
    : formattedAmount;
};

function TransactionList({ transactions, onDeleteTransaction }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [visibleTransactions, setVisibleTransactions] = useState(2);

  const formatDate = (date) => {
    if (date instanceof Timestamp) {
      return dayjs(date.toDate()).locale("ru");
    } else if (date && typeof date === "object" && "seconds" in date) {
      return dayjs(new Date(date.seconds * 1000)).locale("ru");
    } else if (dayjs(date).isValid()) {
      return dayjs(date).locale("ru");
    }
    return dayjs().locale("ru");
  };

  const filteredTransactions = useMemo(() => {
    if (!selectedMonth) return transactions;
    return transactions.filter((transaction) => {
      const transactionDate = formatDate(transaction.date);
      return transactionDate.isSame(selectedMonth, "month");
    });
  }, [transactions, selectedMonth]);

  const sortAndGroupTransactions = (transactions) => {
    const sorted = [...transactions].sort((a, b) => {
      return formatDate(b.date).valueOf() - formatDate(a.date).valueOf();
    });

    const grouped = sorted.reduce((acc, transaction) => {
      const dateString = formatDate(transaction.date).format("YYYY-MM-DD");
      if (!acc[dateString]) {
        acc[dateString] = {
          date: formatDate(transaction.date),
          transactions: [],
          totalExpenses: 0,
        };
      }
      acc[dateString].transactions.push(transaction);
      if (transaction.type !== "income") {
        acc[dateString].totalExpenses += parseFloat(transaction.amount);
      }
      return acc;
    }, {});

    return Object.entries(grouped).sort(([dateA], [dateB]) =>
      dayjs(dateB).diff(dayjs(dateA))
    );
  };

  const sortedGroupedTransactions = useMemo(
    () => sortAndGroupTransactions(filteredTransactions),
    [filteredTransactions]
  );

  const getIcon = (transaction) => {
    const category =
      transaction.type === "income" ? "income" : transaction.category;
    const IconComponent =
      transaction.type === "income"
        ? categoryIcons["income"]
        : categoryIcons[category] || LocalActivityIcon;
    const { background, iconColor } =
      categoryColors[category] || categoryColors["Отдых и развлечение"];

    return (
      <Avatar
        sx={{
          bgcolor: background,
          boxShadow: "7px 0px 4px #b8b6b6", // Добавлена тень
        }}
      >
        <IconComponent sx={{ color: iconColor }} />
      </Avatar>
    );
  };

  const formatMonthYear = (date) => {
    return dayjs(date).format("MMMM YYYY");
  };

  const calculateMonthlyTotal = (transactions) => {
    return transactions.reduce((total, transaction) => {
      if (transaction.type !== "income") {
        return total + parseFloat(transaction.amount);
      }
      return total;
    }, 0);
  };

  const calculateCategoryTotals = (transactions) => {
    const categoryTotals = {};
    transactions.forEach((transaction) => {
      if (transaction.type !== "income") {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += parseFloat(transaction.amount);
      }
    });
    return categoryTotals;
  };

  const monthlyTotal = useMemo(
    () => calculateMonthlyTotal(filteredTransactions),
    [filteredTransactions]
  );
  const categoryTotals = useMemo(
    () => calculateCategoryTotals(filteredTransactions),
    [filteredTransactions]
  );

  const calculateMonthlyTotals = useMemo(() => {
    const monthlyTotals = {};
    transactions.forEach((transaction) => {
      const month = formatDate(transaction.date).format("YYYY-MM");
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      if (transaction.type !== "income") {
        monthlyTotals[month] += parseFloat(transaction.amount);
      }
    });
    return monthlyTotals;
  }, [transactions]);

  const minDate = useMemo(() => {
    return transactions.length > 0
      ? dayjs(Math.min(...transactions.map((t) => formatDate(t.date))))
      : dayjs().subtract(1, "year");
  }, [transactions]);

  const maxDate = useMemo(() => {
    return transactions.length > 0
      ? dayjs(Math.max(...transactions.map((t) => formatDate(t.date))))
      : dayjs();
  }, [transactions]);

  const getTransactionAmountStyle = (type) => {
    return {
      color: type === "income" ? "green" : "#000000",
      fontWeight: "bold",
      fontFamily: '"SB Sans Display Semibold", sans-serif',
      fontSize: "15px",
    };
  };

  const getMonthYearStyle = () => {
    return {
      fontFamily: '"SB Sans Display Semibold", sans-serif !important',
      fontSize: "15px",
      color: "rgb(38, 38, 38)",
    };
  };

  const getDateStyle = () => {
    return {
      fontFamily: '"SB Sans Display Semibold", sans-serif',
      fontSize: "15px",
      color: "rgb(38, 38, 38)",
      padding: "16px 16px 8px 16px",
    };
  };

  const getTransactionDescriptionStyle = () => {
    return {
      fontFamily: '"SB Sans Text"',
      fontSize: "15px",
    };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <div>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {/* <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              ...getMonthYearStyle(),
            }}
          >
            История операций
          </Typography> */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<CalendarTodayIcon />}
            onClick={() => setShowDatePicker(!showDatePicker)}
            sx={{ mr: 1 }}
          >
            Выбрать месяц
          </Button>
          {selectedMonth && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSelectedMonth(null)}
            >
              Сбросить
            </Button>
          )}
        </Box>
        {showDatePicker && (
          <Box sx={{ mb: 2 }}>
            <DatePicker
              views={["year", "month"]}
              label="Выберите месяц"
              minDate={minDate}
              maxDate={maxDate}
              value={selectedMonth}
              onChange={(newMonth) => {
                setSelectedMonth(newMonth);
                setShowDatePicker(false);
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" fullWidth />
              )}
              renderDay={(day, _value, DayComponentProps) => {
                const monthKey = day.format("YYYY-MM");
                const total = calculateMonthlyTotals[monthKey];
                return (
                  <Box
                    sx={{
                      position: "relative",
                      "&::after": total
                        ? {
                            content: `'${formatCurrency(total)} р'`,
                            position: "absolute",
                            bottom: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "0.7rem",
                            whiteSpace: "nowrap",
                          }
                        : {},
                    }}
                  >
                    <DayComponentProps.Day {...DayComponentProps} />
                  </Box>
                );
              }}
            />
          </Box>
        )}
        <List>
          {sortedGroupedTransactions.map(
            ([dateString, { date, transactions, totalExpenses }]) => (
              <React.Fragment key={dateString}>
                <ListItem
                  sx={{
                    paddingLeft: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      ...getDateStyle(),
                      padding: 0,
                      paddingTop: "16px",
                    }}
                  >
                    {date.format("D MMMM YYYY")}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      ...getDateStyle(),
                      padding: 0,
                      paddingTop: "16px",
                      color: "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    {formatCurrency(totalExpenses)} ₽
                  </Typography>
                </ListItem>
                {transactions.map((transaction) => (
                  <ListItem
                    key={transaction.id}
                    sx={{
                      paddingLeft: 0,
                      "& .MuiListItem-root": {
                        paddingLeft: 0,
                      },
                    }}
                  >
                    <ListItemAvatar>{getIcon(transaction)}</ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={getTransactionDescriptionStyle()}>
                          {transaction.description}
                        </Typography>
                      }
                      secondary={
                        <>
                          {formatDate(transaction.date).format("HH:mm")}
                          <br />
                          {transaction.category}
                        </>
                      }
                    />
                    <Typography
                      component="span"
                      sx={getTransactionAmountStyle(transaction.type)}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </ListItem>
                ))}
                <Divider />
              </React.Fragment>
            )
          )}
        </List>
        {visibleTransactions < sortedGroupedTransactions.length && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setVisibleTransactions((prev) => prev + 2)}
            >
              Покзать еще
            </Button>
          </Box>
        )}
        {selectedMonth && (
          <>
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                mt: 2,
                p: 2,
                borderRadius: "8px",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Итог за {formatMonthYear(selectedMonth)}:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {formatCurrency(monthlyTotal)} р
              </Typography>
              <ExportToExcelButton
                transactions={filteredTransactions}
                selectedMonth={selectedMonth}
              />
            </ListItem>
            <ListItem
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                backgroundColor: "#f0f0f0",
                mt: 2,
                p: 2,
                borderRadius: "8px",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Расходы по категориям:
              </Typography>
              {Object.entries(categoryTotals).map(([category, total]) => (
                <Typography key={category} variant="body2">
                  {category}: {formatCurrency(total)} р
                </Typography>
              ))}
            </ListItem>
          </>
        )}
      </div>
    </LocalizationProvider>
  );
}

export default TransactionList;
