import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Snackbar, Box } from "@mui/material";
import { UserContext } from "./state/UserContext";
import { Navbar } from "./components/Navbar";
import { CssBaseline } from "@mui/material";
import { SignIn } from "./components/SignIn";
import PrivateRoute from "./auth/PrivateRoute";
import Weight from "./components/Tracking/Tracking";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import About from "./components/About";
import HabitsList from "./components/Habits/HabitsList";

function App() {
  const { user } = useContext(UserContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const theme = createTheme({
    typography: {
      fontFamily: "Inter, Arial, sans-serif",
    },
    palette: {
      primary: {
        main: "rgba(50, 50, 50)", // Pastel Blue
        contrastText: "#fff",
      },
      secondary: {
        main: "rgba(255, 165, 0, 1)", // Pastel Orange
        contrastText: "#fff",
      },
      error: {
        main: "rgba(255, 105, 101, 0.9)", // Pastel Red
        contrastText: "#fff",
      },
      accent: {
        main: "rgba(235, 236, 240, 1)",
        contrastText: "#fff",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 2, // Increased border-radius
          },
        },
      },
    },
  });

  useEffect(() => {
    if (!user) {
      setOpenSnackbar(true);
    }
  }, [user]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            marginBottom: "60px",
          }}
        >
          <Navbar />
        </Box>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/weight"
            element={
              <PrivateRoute>
                <Weight />
              </PrivateRoute>
            }
          />
          <Route
            path="/habits"
            element={
              <PrivateRoute>
                <HabitsList user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<SignIn />} />
          {!user && (
            <Route path="*" element={<Navigate replace to="/signin" />} />
          )}
        </Routes>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          message="Please sign in to continue."
        />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
