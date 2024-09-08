import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RubleIcon from "./icons/RubleIcon";
import CardIcon from "./icons/CardIcon";
import SafeIcon from "./icons/SafeIcon";

const paperStyle = {
  background: "rgb(255, 255, 255)",
  outline: "0px",
  boxShadow:
    "rgba(38, 38, 38, 0.04) 0px 1px 2px, rgba(38, 38, 38, 0.16) 0px 4px 8px",
  borderRadius: "8px",
};

function LeftSidebar({ balance, savingsBalance, themeColor, isPulsing }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const AccountSection = ({
    title,
    balance,
    accountNumber,
    LeftIcon,
    RightContent,
  }) => {
    const [expanded, setExpanded] = useState(true);

    const handleExpand = (event) => {
      event.stopPropagation();
      setExpanded(!expanded);
    };

    const handleAddClick = (event) => {
      event.stopPropagation();
      // Здесь можно добавить логику для кнопки "+"
    };

    return (
      <Accordion
        expanded={expanded}
        onChange={() => {}}
        sx={{
          boxShadow: "none",
          "&:before": { display: "none" },
          backgroundColor: "transparent",
          transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        }}
      >
        <AccordionSummary
          sx={{
            padding: 0,
            "& .MuiAccordionSummary-content": {
              margin: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            },
          }}
        >
          <Box
            onClick={handleExpand}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mr: 1,
                color: "rgb(38, 38, 38)",
                fontFamily: '"SB Sans Display Semibold", sans-serif',
              }}
            >
              {title}
            </Typography>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Box>
          <IconButton
            size="small"
            sx={{ color: "success.main" }}
            onClick={handleAddClick}
          >
            <AddIcon sx={{ color: themeColor }} />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails
          sx={{ padding: 0, paddingTop: 1, overflow: "hidden" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              opacity: expanded ? 1 : 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LeftIcon width={36} height={36} color={themeColor} />
              <Box sx={{ ml: 1 }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "19px",
                    color: "rgb(38, 38, 38)",
                    fontFamily: '"SB Sans Text", sans-serif',
                  }}
                >
                  {formatCurrency(balance)}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(38, 38, 38, 0.7)",
                    fontSize: "13px",
                    fontFamily: '"SB Sans Text", sans-serif',
                  }}
                >
                  {accountNumber}
                </Typography>
              </Box>
            </Box>
            <Box>{RightContent}</Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Paper
      sx={{
        ...paperStyle,
        pl: { xs: 4, sm: 2 },
        pr: { xs: 4, sm: 2 },
        pb: {
          sm: 2,
          xs: 4,
        },
        pt: {
          xs: 4,
          sm: 2,
        },
        bgcolor: "white.100",
        borderRadius: {
          xs: 0, // 0px на экранах размером с телефон и меньше
          sm: 3, // стандартный borderRadius на экранах больше телефона
        },
        borderTopRightRadius: {
          xs: 42,
        },
        borderTopLeftRadius: {
          xs: 42,
        },
        boxShadow: {
          xs: isPulsing ? "none" : "0px -11px 30px #00dfff",
          sm: "rgba(38, 38, 38, 0.04) 0px 1px 2px, rgba(38, 38, 38, 0.16) 0px 4px 8px",
        },
        position: "relative",
        overflow: "hidden",
        zIndex: 2,
        marginTop: "calc(env(safe-area-inset-top) + 12px)",
        "&::before": isPulsing
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "200%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(0, 180, 180, 0.3), rgba(3, 217, 220, 0.597), rgba(0, 180, 180, 0.3), transparent)",
              animation: "wave 2s linear infinite",
            }
          : {},
        "@keyframes wave": {
          "0%": {
            left: "-100%",
          },
          "100%": {
            left: "100%",
          },
        },
      }}
    >
      <AccountSection
        title="Кошелёк"
        balance={balance}
        accountNumber="Платёжный счёт •• 4247"
        LeftIcon={(props) => <RubleIcon {...props} color={themeColor} />}
        RightContent={<CardIcon width={36} height={36} />}
      />
      <AccountSection
        title="Накопительный счёт"
        balance={savingsBalance}
        accountNumber="Накопительный счёт •• 0500"
        LeftIcon={SafeIcon}
        RightContent={
          <Typography
            variant="body2"
            sx={{ color: "success.main", fontWeight: "bold" }}
          >
            16,00 %
          </Typography>
        }
      />
    </Paper>
  );
}

export default React.memo(LeftSidebar);
