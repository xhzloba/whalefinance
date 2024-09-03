import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Button, TextField, Box, Typography } from "@mui/material";

const Auth = ({ onAuthStateChange }) => {
  const [email, setEmail] = useState("zlobajs@yandex.ru");
  const [password, setPassword] = useState("3409269239");
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
    <Box sx={{ maxWidth: 300, margin: "auto", mt: 2 }}>
      <form onSubmit={handleSignIn}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Sign In
        </Button>
      </form>
      <Button onClick={handleSignOut} variant="outlined" sx={{ mt: 2 }}>
        Sign Out
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Auth;
