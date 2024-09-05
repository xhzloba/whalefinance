import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Modal,
  Slide,
  IconButton,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { styled } from "@mui/system";
import { NumericFormat } from "react-number-format";
import IncomeExpenseForm from "./IncomeExpenseForm";
import dayjs from "dayjs";
import logoImage from "../assets/whale-logo.png";

const SafeAreaContainer = styled(Box)({
  paddingTop: "env(safe-area-inset-top)",
  backgroundColor: "transparent",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
});

const CardContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  aspectRatio: "1.586 / 1",
  perspective: "1000px",
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    marginTop: "calc(-1 * env(safe-area-inset-top))",
    paddingTop: "calc(env(safe-area-inset-top))",
  },
  position: "relative",
  zIndex: 1,
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
});

const Logo = styled("img")({
  width: "30px",
  height: "30px",
  marginRight: "10px",
});

const CardInner = styled(Box)(({ flipped }) => ({
  width: "100%",
  height: "100%",
  transition: "transform 0.6s",
  transformStyle: "preserve-3d",
  transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
}));

const CardSide = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    height: "400px",
  },
  position: "absolute",
  backfaceVisibility: "hidden",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
  display: "flex",
  flexDirection: "column",
  color: "white",
  fontFamily: "'Roboto', sans-serif",
  overflow: "hidden",
}));

const CardFront = styled(CardSide)(({ theme }) => ({
  background: "linear-gradient(45deg, #051937 0%, #004d7a 50%, #008793 100%)",
  zIndex: 2,
  borderRadius: 0, // Убираем скругление углов
  paddingTop: "calc(env(safe-area-inset-top) + 25px)",
}));

const CardBack = styled(CardSide)(({ theme }) => ({
  background: "linear-gradient(45deg, #008793 0%, #004d7a 50%, #051937 100%)",
  transform: "rotateY(180deg)",
}));

// Функция для изменения яркости цвета
function adjustColor(color, amount) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

const CardBalance = styled(Typography)(({ theme }) => ({
  filter: "drop-shadow(0px 10px 15px black)",
  fontWeight: "bold",
  fontSize: "1.5rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "3rem",
  },
  [`@media (max-width:391px)`]: {
    fontSize: "1.3rem",
  },
  position: "relative",
  zIndex: 3,
}));

const MagneticStrip = styled(Box)({
  width: "100%",
  height: "40px",
  background: "#000",
  marginBottom: "20px",
});

const AnimatedBalance = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const animationDuration = 1000; // 1 секунда
    const steps = 60;
    const increment = (value - displayValue) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        setDisplayValue((prevValue) => prevValue + increment);
        currentStep++;
      } else {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, animationDuration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <NumericFormat
      value={displayValue}
      displayType={"text"}
      thousandSeparator={" "}
      decimalSeparator={","}
      decimalScale={2}
      fixedDecimalScale={true}
      suffix={" ₽"}
      renderText={(formattedValue) => (
        <CardBalance>{formattedValue}</CardBalance>
      )}
    />
  );
};

const BankCard = ({
  balance,
  progressValue,
  currentMonthExpenses,
  lastIncomeDate,
  lastIncomeAmount,
  addTransaction,
  handleMonthChange,
  resetProgress,
}) => {
  console.log("BankCard рендеринг:", {
    balance,
    progressValue,
    currentMonthExpenses,
    lastIncomeDate: lastIncomeDate
      ? dayjs(lastIncomeDate).format("DD.MM.YYYY")
      : "Нет",
    lastIncomeAmount,
  });

  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getProgressColor = (value) => {
    if (value < 50) return "#4caf50";
    if (value < 75) return "#ff9800";
    return "#f44336";
  };

  const handleClick = () => {
    setFlipped(!flipped);
  };

  const displayBalance = balance >= 0 ? balance : 0;

  return (
    <>
      <SafeAreaContainer />
      <CardContainer onClick={handleClick}>
        <CardInner flipped={flipped}>
          <CardFront>
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  resetProgress(balance);
                }}
                sx={{
                  top: "calc(env(safe-area-inset-top) + 12px)",
                  right: "50px",
                  background: "transparent",
                  color: "white",
                }}
              >
                <RestartAltIcon />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                sx={{
                  top: "calc(env(safe-area-inset-top) + 12px)",
                  right: "10px",
                  background: "transparent",
                  fontSize: "30px",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  lineHeight: "1",
                  padding: "0",
                  minWidth: "unset",
                  minHeight: "unset",
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                +
              </Button>
            </Box>
            <Box>
              <LogoContainer>
                <Logo src={logoImage} alt="Whale Finance Logo" />
                <Typography variant="h6">Whale Finance</Typography>
              </LogoContainer>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    backgroundColor: getProgressColor(progressValue),
                  },
                }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {balance > 0 && lastIncomeDate
                  ? `Расходы с ${dayjs(lastIncomeDate).format(
                      "DD.MM.YYYY"
                    )}: ${currentMonthExpenses.toFixed(2)} ₽`
                  : "Нет доходов в текущем периоде"}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {balance > 0 && lastIncomeDate && lastIncomeAmount > 0
                  ? `${progressValue.toFixed(
                      1
                    )}% от дохода ${lastIncomeAmount.toFixed(2)} ₽`
                  : ""}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">Баланс</Typography>
              <AnimatedBalance value={displayBalance} />
            </Box>
          </CardFront>
          <CardBack>
            <MagneticStrip />
            <Box>
              <Typography variant="body2" gutterBottom>
                CVC
              </Typography>
              <Typography variant="h6">***</Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                Это обратная сторона вашей каты Сбербанка. Здесь находится
                магнитная полоса и код безопасности CVC.
              </Typography>
            </Box>
          </CardBack>
        </CardInner>
      </CardContainer>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Box
            sx={{
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              width: "100%",
              maxWidth: 600,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Добавить операцию
            </Typography>
            <IncomeExpenseForm
              onAddTransaction={addTransaction}
              onMonthChange={handleMonthChange}
              handleClose={handleClose}
            />
          </Box>
        </Slide>
      </Modal>
    </>
  );
};

export default BankCard;
