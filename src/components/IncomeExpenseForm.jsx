import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/system";
import "dayjs/locale/ru";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.7)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
  "& input": {
    color: "white",
  },
  "& input::placeholder": {
    color: "rgba(255, 255, 255, 0.5)",
    opacity: 1,
  },
});

const StyledSelect = styled(Select)({
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
});

const StyledRadio = styled(Radio)({
  color: "rgba(255, 255, 255, 0.7)",
  "&.Mui-checked": {
    color: "white",
  },
});

const StyledButton = styled(Button)({
  background: "white",
  color: "#004d7a",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.8)",
  },
});

const StyledChip = styled(Chip)({
  background: "rgba(255, 255, 255, 0.1)",
  color: "white",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
  },
  "&:focus": {
    background: "rgba(255, 255, 255, 0.3)",
  },
});

const expenseCategories = [
  "Транспорт и Связь",
  "Онлайн покупки",
  "Красота и Здоровье",
  "Отдых и развлечение",
  "Прочее", // Добавлена новая категория
  "Кредиты",
  "Продукты",
  "ЖКХ и Квартира",
  "Рестораны",
  "Переводы онлайн",
];

const presetAmounts = [2000, 5000, 10000, 90000];

function IncomeExpenseForm({ onAddTransaction, handleClose }) {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(dayjs());
  const [recipient, setRecipient] = useState(""); // Добавлено

  useEffect(() => {
    if (type === "income") {
      setDescription("Зарплата");
    } else {
      setDescription("");
    }
  }, [type]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (type === "income" && parseFloat(value) < 0) {
      return; // Игнорируем отрицательные значения для доходов
    }
    setAmount(value);
  };

  const handlePresetAmountClick = (value) => {
    setAmount(value.toString());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      amount &&
      description &&
      (type === "income" || (type === "expense" && category))
    ) {
      onAddTransaction({
        type,
        amount: parseFloat(amount),
        description,
        category: type === "expense" ? category : "",
        date: date.toISOString(), // Используем текущую дату для обоих типов
        recipient: category === "Переводы онлайн" ? recipient : "", // Добавлено
      });
      setAmount("");
      setDescription(type === "income" ? "Зарплата" : "");
      setCategory("");
      setDate(dayjs());
      setRecipient(""); // Добавлено
      handleClose(); // Закрываем модальное окно после добавления операции
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RadioGroup
              row
              value={type}
              onChange={(e) => setType(e.target.value)}
              sx={{ justifyContent: "center", mb: 2 }}
            >
              <FormControlLabel
                value="income"
                control={<StyledRadio color="success" />}
                label={<Typography variant="subtitle1">Доход</Typography>}
              />
              <FormControlLabel
                value="expense"
                control={<StyledRadio color="error" />}
                label={<Typography variant="subtitle1">Расход</Typography>}
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Сумма"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Typography variant="subtitle1" sx={{ mr: 1 }}>
                    ₽
                  </Typography>
                ),
              }}
            />
            {type === "income" && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                {presetAmounts.map((value) => (
                  <StyledChip
                    key={value}
                    label={`${value} ₽`}
                    onClick={() => handlePresetAmountClick(value)}
                    clickable
                  />
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          {type === "expense" && (
            <Grid item xs={12}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel>Категория</InputLabel>
                <StyledSelect
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Категория"
                >
                  {expenseCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Grid>
          )}
          {category === "Переводы онлайн" && (
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Кому перевести"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                variant="outlined"
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <DatePicker
              label="Дата"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => (
                <StyledTextField {...params} fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ color: "white", borderColor: "white" }}
              >
                Отмена
              </Button>
              <StyledButton variant="contained" type="submit">
                <AddIcon />
              </StyledButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
}

export default IncomeExpenseForm;
