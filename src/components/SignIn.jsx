import React, { useContext, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { signInWithGoogle } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../state/UserContext";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const SignIn = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // User is signed in.
        setUser(authUser);
        // Check if the user exists in the database
        const userRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(userRef);

        // If the user does not exist, create a new document
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            uid: authUser.uid,
            email: authUser.email,
            // any other user info you want to store
          });
        }
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    return unsubscribe; // Make sure we unbind the observer when the component unmounts
  }, [setUser]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle(); // signInWithGoogle should only initiate the sign-in process
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  // Navigate when the user state changes
  useEffect(() => {
    if (user) {
      navigate("/habits");
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
