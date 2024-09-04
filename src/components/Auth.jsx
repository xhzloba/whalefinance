import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Container,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Auth = ({ onAuthStateChange }) => {
  const [email, setEmail] = useState("zlobajs@yandex.ru");
  const [password, setPassword] = useState("9269239");
  const [error, setError] = useState(null);
  const auth = getAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in:", userCredential.user.uid);
      onAuthStateChange(true);
    } catch (error) {
      console.error("Error signing in:", error);
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onAuthStateChange(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(to right bottom, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Вход в систему
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignIn}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email адрес"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Войти
            </Button>
            <Button
              onClick={handleSignOut}
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Выйти
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;
