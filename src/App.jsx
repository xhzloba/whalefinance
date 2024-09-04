import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FinanceTracker from "./components/FinanceTracker";
import Auth from "./components/Auth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [themeColor, setThemeColor] = useState("#1976d2");
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const theme = createTheme({
    palette: {
      primary: {
        main: themeColor,
      },
      secondary: {
        main: "#F86A01",
      },
    },
    typography: {
      fontFamily: '"SB Sans Display", "SB Sans Text", sans-serif',
      fontWeightMedium: 500,
      fontWeightSemibold: 600,
    },
  });

  const handleColorChange = () => {
    const colors = ["#21A038", "#1976d2"];
    const currentIndex = colors.indexOf(themeColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setThemeColor(colors[nextIndex]);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAuthenticated ? (
        <Auth onAuthStateChange={setIsAuthenticated} />
      ) : (
        <FinanceTracker
          themeColor={themeColor}
          onColorChange={handleColorChange}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
