import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Modal,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSwipeable } from "react-swipeable";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TransactionList from "./TransactionList";
import IncomeExpenseForm from "./IncomeExpenseForm";
import LeftSidebar from "./LeftSidebar";
import Summary from "./Summary";
import dayjs from "dayjs";
import BankCard from "./BankCard";
import ExpenseAnalysis from "./ExpenseAnalysis";
import CategoryLimits from "./CategoryLimits";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ColorLensIcon from "@mui/icons-material/ColorLens";

import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const StyledContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    maxWidth: "1400px !important",
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

export const paperStyle = {
  background: "rgb(255, 255, 255)",
  outline: "0px",
  boxShadow:
    "rgba(38, 38, 38, 0.04) 0px 1px 2px, rgba(38, 38, 38, 0.16) 0px 4px 8px",
  margin: "0px 0px 0px",
  padding: "20px",
  borderRadius: "8px",
};

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: "rgb(255, 255, 255) !important",
  outline: "0px !important",
  boxShadow:
    "rgba(38, 38, 38, 0.04) 0px 1px 2px, rgba(38, 38, 38, 0.16) 0px 4px 8px !important",
  padding: "20px !important",
  borderRadius: "8px !important",
}));

const StyledAccordinWithLinearBackground = styled(StyledAccordion)(
  ({ theme }) => ({
    background:
      "linear-gradient(135deg, #171717 0%, #2c323c 50%, #5858f5 100%) !important",
  })
);

const FinanceTracker = ({ themeColor, onColorChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [transactions, setTransactions] = useState([]);
  const [savingsBalance, setSavingsBalance] = useState(133000);
  const [expanded, setExpanded] = useState({
    panel1: true,
    panel2: true,
    panel3: true,
  });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();
  const [progressValue, setProgressValue] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [lastIncomeDate, setLastIncomeDate] = useState(null);
  const [lastIncomeAmount, setLastIncomeAmount] = useState(0);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [isPulsing, setIsPulsing] = useState(false);

  const triggerPulse = useCallback(() => {
    setIsPulsing(true);
    // Увеличим время анимации до 2 секунд
    setTimeout(() => setIsPulsing(false), 2000);
  }, []);

  const calculateProgressValue = useCallback((transactions) => {
    console.log("Все транзакции:", transactions);

    if (!transactions || transactions.length === 0) {
      setProgressValue(0);
      setCurrentMonthExpenses(0);
      setLastIncomeDate(null);
      setLastIncomeAmount(0);
      return;
    }

    const sortedTransactions = [...transactions].sort((a, b) =>
      dayjs(a.date.toDate()).diff(dayjs(b.date.toDate()))
    );

    let lastIncome = null;
    let totalExpenses = 0;
    let foundLastIncome = false;

    for (const transaction of sortedTransactions) {
      if (!transaction.date) continue;

      const transactionDate = dayjs(transaction.date.toDate());
      console.log("Обработка тразакции:", {
        date: transactionDate.format("DD.MM.YYYY"),
        type: transaction.type,
        amount: transaction.amount,
      });

      if (transaction.type === "income") {
        lastIncome = transaction;
        foundLastIncome = true;
        totalExpenses = 0;
        console.log("Найден доход:", {
          date: transactionDate.format("DD.MM.YYYY"),
          amount: transaction.amount,
        });
      } else if (transaction.type === "expense") {
        if (foundLastIncome) {
          totalExpenses += parseFloat(transaction.amount);
          console.log("Добавлен расход:", {
            date: transactionDate.format("DD.MM.YYYY"),
            amount: transaction.amount,
          });
        }
      }
    }

    if (lastIncome) {
      const lastIncomeAmount = parseFloat(lastIncome.amount);
      const expensePercentage = (totalExpenses / lastIncomeAmount) * 100;

      setProgressValue(Math.min(expensePercentage, 100));
      setCurrentMonthExpenses(totalExpenses);
      setLastIncomeDate(lastIncome.date.toDate());
      setLastIncomeAmount(lastIncomeAmount);

      console.log(
        "Последний доход:",
        dayjs(lastIncome.date.toDate()).format("DD.MM.YYYY")
      );
      console.log("Сумма последнего дохода:", lastIncomeAmount);
      console.log("Расходы с последнего дохода:", totalExpenses);
      console.log("Процент расходов:", expensePercentage);
      console.log("Значение прогресс-бара:", Math.min(expensePercentage, 100));
    } else {
      setProgressValue(0);
      setCurrentMonthExpenses(0);
      setLastIncomeDate(null);
      setLastIncomeAmount(0);
    }
  }, []);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      calculateProgressValue(transactions);
    }
  }, [transactions, calculateProgressValue]);

  const fetchTransactions = useCallback(async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetchedTransactions);
      console.log("Загруженные транзакции:", fetchedTransactions);

      const newBalance = fetchedTransactions.reduce((sum, t) => {
        return t.type === "income"
          ? sum + parseFloat(t.amount)
          : sum - parseFloat(t.amount);
      }, 0);
      setBalance(newBalance);

      calculateProgressValue(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [auth, calculateProgressValue]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        console.log("User authenticated:", user.uid);
        fetchTransactions();
      } else {
        console.log("User not authenticated");
        setTransactions([]);
        setSavingsBalance(0);
      }
    });

    return () => unsubscribe();
  }, [auth, fetchTransactions]);

  const addTransaction = useCallback(
    (transaction) => {
      if (auth.currentUser) {
        try {
          const transactionDate = dayjs(transaction.date).isValid()
            ? Timestamp.fromDate(new Date(transaction.date))
            : Timestamp.now();

          addDoc(collection(db, "transactions"), {
            ...transaction,
            userId: auth.currentUser.uid,
            date: transactionDate,
            amount: parseFloat(transaction.amount),
          });

          fetchTransactions();
          setLastTransaction(Date.now());
          triggerPulse();
          console.log("New transaction added, lastTransaction:", Date.now());
        } catch (error) {
          console.error("Error adding transaction: ", error);
        }
      } else {
        console.error("User not authenticated");
      }
    },
    [auth, fetchTransactions, triggerPulse]
  );

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      setTransactions(updatedTransactions);

      const newBalance = updatedTransactions.reduce((sum, t) => {
        return t.type === "income"
          ? sum + parseFloat(t.amount)
          : sum - parseFloat(t.amount);
      }, 0);
      setBalance(newBalance);

      calculateProgressValue(updatedTransactions);
      console.log("Транзакция удалена, баланс обновлен:", newBalance);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [panel]: isExpanded,
    }));
  };

  const handleDeleteSwitch = (event) => {
    setIsDeleteEnabled(event.target.checked);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleDeleteAllTransactions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setTransactions([]);
      setBalance(0);
      setCurrentMonthExpenses(0);
      setProgressValue(0);
      console.log("Все транзакции удалены, баланс обнулен");
    } catch (error) {
      console.error("Error deleting all transactions:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isMobile && (
        <AppBar position="static" sx={{ bgcolor: themeColor }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Whale Finance
            </Typography>
            <IconButton color="inherit" onClick={onColorChange}>
              <ColorLensIcon />
            </IconButton>
            <FormControlLabel
              control={
                <Switch
                  checked={isDeleteEnabled}
                  onChange={handleDeleteSwitch}
                  color="secondary"
                />
              }
            />
            {isDeleteEnabled && (
              <Button color="inherit" onClick={handleDeleteAllTransactions}>
                Удалить все
              </Button>
            )}
          </Toolbar>
        </AppBar>
      )}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Введите пароль</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Для удаления все транзакций ведите пароль.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Пароль"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDeleteAllTransactions} color="primary">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        <StyledContainer maxWidth="lg" sx={{ mt: 3, mb: 2 }}>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={4}
              lg={3}
              sx={{
                minWidth: { md: 320 },
                paddingTop: { xs: "0px !important", sm: "24px !important" },
              }}
            >
              <BankCard
                balance={balance}
                progressValue={progressValue}
                currentMonthExpenses={currentMonthExpenses}
                lastIncomeDate={lastIncomeDate}
                lastIncomeAmount={lastIncomeAmount}
                addTransaction={addTransaction}
                handleMonthChange={handleMonthChange}
                themeColor={themeColor}
              />
              <Box
                sx={{
                  mt: { xs: 0, sm: 3 },
                  position: { xs: "relative", sm: "static" },
                  top: { sm: 0, xs: "-24px" },
                }}
              >
                <LeftSidebar
                  balance={balance}
                  savingsBalance={savingsBalance}
                  themeColor={themeColor}
                  lastTransaction={lastTransaction}
                  isPulsing={isPulsing}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              lg={6}
              sx={{
                "@media (max-width:600px)": {
                  "& .MuiGrid-item": {
                    paddingTop: "0px !important",
                  },
                },
              }}
            >
              <Grid container spacing={{ xs: 6, sm: 3 }}>
                <Grid item xs={12}>
                  <Summary
                    balance={balance}
                    lastIncomeDate={lastIncomeDate}
                    lastIncomeAmount={lastIncomeAmount}
                    currentMonthExpenses={currentMonthExpenses}
                    progressValue={progressValue}
                    transactions={transactions}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledAccordion
                    expanded={expanded.panel1}
                    onChange={handleChange("panel1")}
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography variant="h6">Добавить операцию</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <IncomeExpenseForm
                        onAddTransaction={addTransaction}
                        onMonthChange={handleMonthChange}
                      />
                    </AccordionDetails>
                  </StyledAccordion>
                </Grid>
                <Grid item xs={12}>
                  <StyledAccordion
                    expanded={expanded.panel2}
                    onChange={handleChange("panel2")}
                    sx={{
                      borderRadius: {
                        xs: "0px !important",
                        sm: "8px !important",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2bh-content"
                      id="panel2bh-header"
                    >
                      <Typography variant="h6">История операций</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TransactionList
                        transactions={transactions}
                        onDeleteTransaction={deleteTransaction}
                        selectedMonth={selectedMonth}
                        onMonthChange={handleMonthChange}
                      />
                    </AccordionDetails>
                  </StyledAccordion>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              lg={3}
              sx={{
                paddingTop: { xs: "0 !important", sm: "24px !important" },
              }}
            >
              <ExpenseAnalysis transactions={transactions} />
              <StyledAccordinWithLinearBackground
                expanded={expanded.panel3}
                onChange={handleChange("panel3")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Typography sx={{ color: "white" }} variant="h6">
                    Лимиты расходов
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <CategoryLimits transactions={transactions} />
                </AccordionDetails>
              </StyledAccordinWithLinearBackground>
            </Grid>
          </Grid>
        </StyledContainer>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 400, sm: 300 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Добавить операцию
          </Typography>
          <IncomeExpenseForm
            onAddTransaction={addTransaction}
            onMonthChange={handleMonthChange}
            handleClose={handleClose}
          />
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default FinanceTracker;
