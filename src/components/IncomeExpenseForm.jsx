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

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(0, 137, 147, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0, 137, 147, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#008793",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#008793",
  },
});

const StyledSelect = styled(Select)({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(0, 137, 147, 0.3)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(0, 137, 147, 0.5)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#008793",
  },
});

const StyledRadio = styled(Radio)({
  "&.Mui-checked": {
    color: "#008793",
  },
});

const StyledButton = styled(Button)({
  background: "linear-gradient(45deg, #051937 30%, #004d7a 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(0, 137, 147, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
  "&:hover": {
    background: "linear-gradient(45deg, #004d7a 30%, #008793 90%)",
  },
});

const StyledChip = styled(Chip)({
  background: "rgba(0, 137, 147, 0.1)",
  border: "1px solid rgba(0, 137, 147, 0.3)",
  "&:hover": {
    background: "rgba(0, 137, 147, 0.2)",
  },
  "&:focus": {
    background: "rgba(0, 137, 147, 0.3)",
  },
});

const expenseCategories = [
  "Транспорт и Связь",
  "Онлайн покупки",
  "Красота и Здоровье",
  "Прочее",
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
                sx={{ color: "#008793", borderColor: "#008793" }}
              >
                Отмена
              </Button>
              <StyledButton variant="contained" type="submit">
                Добавить
              </StyledButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
}

export default IncomeExpenseForm;
