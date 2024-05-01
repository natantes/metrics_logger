import React, { useContext, useEffect, useRef } from "react";
import { Button, Grid } from "@mui/material";
import { signInWithGoogle } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../state/UserContext";
import { gsap } from "gsap";
import "tailwindcss/tailwind.css";

export const SignIn = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const headlineRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle sign-in
  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigate("/habits");
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  // Navigate after user state changes
  useEffect(() => {
    if (user) {
      navigate("/habits");
    }
  }, [user, navigate]);

  // GSAP animations
  useEffect(() => {
    gsap.fromTo(
      headlineRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-600 text-white p-8">
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        className="min-h-screen"
        sx={{ paddingTop: 30 }}
      >
        <h1
          ref={headlineRef}
          className="text-4xl font-bold mb-6"
          style={{ fontSize: "100px" }}
        >
          Discipline&trade;
        </h1>

        <h1 ref={headlineRef} className="text-2xl font-bold mb-6">
          Please sign in to continue
        </h1>

        <Button
          ref={buttonRef}
          type="button"
          variant="contained"
          onClick={handleSignIn}
          className="bg-primary-main text-white hover:bg-primary-dark"
        >
          Sign In with Google
        </Button>
      </Grid>
    </div>
  );
};
