import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

function CategoryLimits({ transactions }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [categoryLimits, setCategoryLimits] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const savedLimits = localStorage.getItem("categoryLimits");
    if (savedLimits) {
      setCategoryLimits(JSON.parse(savedLimits));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(categoryLimits).length > 0) {
      localStorage.setItem("categoryLimits", JSON.stringify(categoryLimits));
    }
  }, [categoryLimits]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleSave = () => {
    if (selectedCategory && limit) {
      setCategoryLimits((prev) => {
        const newLimits = {
          ...prev,
          [selectedCategory]: Number(limit),
        };
        localStorage.setItem("categoryLimits", JSON.stringify(newLimits));
        return newLimits;
      });
      setSelectedCategory("");
      setLimit("");
      setEditingCategory(null);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setSelectedCategory(category);
    setLimit(categoryLimits[category].toString());
  };

  const handleDelete = (category) => {
    setCategoryLimits((prev) => {
      const newLimits = { ...prev };
      delete newLimits[category];
      localStorage.setItem("categoryLimits", JSON.stringify(newLimits));
      return newLimits;
    });
  };

  const getProgressColor = (progress) => {
    if (progress <= 50) return "success.main";
    if (progress <= 80) return "warning.main";
    return "error.main";
  };

  const calculateSpent = (category) => {
    return transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ fontSize: "0.9rem" }}>
      <Box sx={{ mb: 2 }}>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          fullWidth
          size="small"
          displayEmpty
          sx={{
            mb: 1,
            color: "white",
            "& .MuiSelect-select": { color: "white" },
            "& .MuiSelect-icon": { color: "white" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(63, 172, 255, 0.975)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            "& .MuiMenuItem-root": { color: "black" }, // Цвет текста в выпадающем меню
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "white",
                "& .MuiMenuItem-root": {
                  color: "black",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                  "&.Mui-selected": {
                    bgcolor: "rgba(0, 0, 0, 0.08)",
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            Выберите категорию
          </MenuItem>
          {expenseCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        <TextField
          type="number"
          placeholder="Лимит"
          value={limit}
          onChange={handleLimitChange}
          fullWidth
          size="small"
          sx={{
            mb: 1,
            color: "white",
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
          }}
        />
        <Button
          sx={{ color: "white" }}
          variant="contained"
          onClick={handleSave}
          fullWidth
          size="small"
        >
          {editingCategory ? "Обновить" : "Добавить"}
        </Button>
      </Box>
      <Box>
        {Object.entries(categoryLimits).map(([category, limit]) => {
          const spent = calculateSpent(category);
          const progress = (spent / limit) * 100;
          const progressColor = getProgressColor(progress);

          return (
            <Paper
              key={category}
              elevation={2}
              sx={{ p: 1, mb: 1, backgroundColor: "rgba(0, 0, 0, 0.1)" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  color: "white",
                }}
              >
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ flexGrow: 1, color: "white" }}
                >
                  {category}
                </Typography>
                <Tooltip title="Редактировать">
                  <IconButton
                    sx={{ color: "white" }}
                    size="small"
                    onClick={() => handleEdit(category)}
                  >
                    <EditIcon sx={{ color: "white" }} fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Удалить">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(category)}
                  >
                    <DeleteIcon sx={{ color: "white" }} fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography
                sx={{ color: "white" }}
                variant="caption"
                display="block"
              >
                {formatCurrency(spent)} / {formatCurrency(limit)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mt: 1,
                  bgcolor: "rgba(0, 0, 0, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: progressColor,
                  },
                }}
              />
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}

export default CategoryLimits;
