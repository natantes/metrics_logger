import React, { useContext, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { signInWithGoogle } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../state/UserContext";

export const SignIn = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Handle sign-in
  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigate("/weight");
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  // Use useEffect to navigate after user state changes
  useEffect(() => {
    if (user) {
      navigate("/weight");
    }
  }, [user, navigate]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Button
        type="button"
        variant="contained"
        onClick={handleSignIn}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        Sign In with Google
      </Button>
    </Grid>
  );
};
