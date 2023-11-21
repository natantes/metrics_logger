import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Snackbar, Box } from "@mui/material";
import { UserContext } from "./state/UserContext";
import { Navbar } from "./components/Navbar";
import { CssBaseline } from "@mui/material";
import { SignIn } from "./components/SignIn";
import PrivateRoute from "./auth/PrivateRoute";
import Weight from "./components/Weight";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ComingSoon } from "./components/ComingSoon";
import { LandingPage } from "./components/LandingPage";

function App() {
  const { user } = useContext(UserContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgba(173, 216, 230, 1)", // Pastel Blue
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
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20, // Increased border-radius
            // Gradient background
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
            path="/nutrients"
            element={
              <PrivateRoute>
                <ComingSoon />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <ComingSoon />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<LandingPage />} />
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
