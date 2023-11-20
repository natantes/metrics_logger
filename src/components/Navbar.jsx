import { UserContext } from "../state/UserContext";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { signInWithGoogle, signOutUser } from "../auth/auth";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    signOutUser();
    setUser(null);
  };

  return (
    <AppBar
      position="static"
      style={{
        background: "#536b78",
        boxShadow: "none",
        borderBottom: "1px solid #eeeeee",
        paddingTop: "15px",
        paddingBottom: "15px",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          style={{ color: "white", fontWeight: "bold" }}
        >
          Metrics Logger
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {user ? (
          <div>
            <span>Welcome, {user.displayName}</span>
            <Button
              type="submit"
              variant="contained"
              sx={{ margin: "8px" }}
              style={{ color: "white" }}
              onClick={signOutUser}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            variant="contained"
            sx={{ margin: "8px" }}
            style={{ color: "white" }}
            onClick={signInWithGoogle}
          >
            Sign In with Google
          </Button>
        )}
        <Link to="/weight" style={{ textDecoration: "none", color: "white" }}>
          <Button color="inherit">Body Comp.</Button>
        </Link>
        <Link
          to="/nutrients"
          style={{ textDecoration: "none", color: "white" }}
        >
          <Button color="inherit">Nutrients</Button>
        </Link>
        <Link to="/about" style={{ textDecoration: "none", color: "white" }}>
          <Button color="inherit">About</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
