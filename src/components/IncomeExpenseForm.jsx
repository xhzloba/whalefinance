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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ru";
import dayjs from "dayjs";

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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RadioGroup
              row
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <FormControlLabel
                value="income"
                control={<Radio />}
                label="Доход"
              />
              <FormControlLabel
                value="expense"
                control={<Radio />}
                label="Расход"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Сумма"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              required
              variant="outlined"
            />
            {type === "income" && (
              <Box sx={{ mt: 1, display: { xs: "none", sm: "flex" }, gap: 1 }}>
                {presetAmounts.map((value) => (
                  <Button
                    key={value}
                    variant="outlined"
                    size="small"
                    onClick={() => handlePresetAmountClick(value)}
                  >
                    {value}
                  </Button>
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              variant="outlined"
            />
          </Grid>
          {type === "expense" && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel>Категория</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Категория"
                >
                  {expenseCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {category === "Переводы онлайн" && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Кому перевести"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                variant="outlined"
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Дата"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Button variant="contained" color="primary" type="submit">
                Добавить
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
}

export default IncomeExpenseForm;
