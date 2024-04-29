import { UserContext } from "../state/UserContext";
import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import { signInWithGoogle, signOutUser } from "../auth/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    signOutUser();
    setUser(null);
  };

  // Define a common style for the links
  const linkStyle = {
    color: "rgb(248, 249, 250)",
    "&:hover": {
      fontfamily: "Montserrat",
      cursor: "pointer",
      color: "rgb(233, 236, 239)",
      transform: "scale(1.05)",
      transition: "transform 1s",
    },
    marginX: 2, // Horizontal margin for each link
  };

  return (
    <AppBar
      position="fixed"
      style={{
        background: "rgba(124, 124, 124, 0.7)",
        boxShadow: "none",
        borderBottom: "1px solid #eeeeee",
        zIndex: 1100,
      }}
    >
      <Container>
        <Toolbar disableGutters>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography variant="h6" noWrap sx={linkStyle}>
              Discipline&trade;
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Link to="/habits" style={{ textDecoration: "none" }}>
            <Typography sx={linkStyle}>Habits</Typography>
          </Link>
          <Link to="/weight" style={{ textDecoration: "none" }}>
            <Typography sx={linkStyle}>Weight</Typography>
          </Link>
          <Link to="/nutrients" style={{ textDecoration: "none" }}>
            <Typography sx={linkStyle}>Nutrients</Typography>
          </Link>
          <Link to="/about" style={{ textDecoration: "none" }}>
            <Typography sx={linkStyle}>About</Typography>
          </Link>
          {user ? (
            <Button
              type="submit"
              variant="contained"
              onClick={handleSignOut}
              sx={{ margin: "0 8px", borderRadius: "4px" }}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              onClick={signInWithGoogle}
              sx={{ margin: "0 8px", borderRadius: "4px" }}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
