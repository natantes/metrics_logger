import React, { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Container,
  CssBaseline,
} from "@mui/material";

import WeightChart from "./chart";
import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore"; // Import push and ref

function App() {
  const [weight, setWeight] = useState("");
  const [selectedWeightId, setSelectedWeightId] = useState(null); // For tracking selected weight
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State to track window width

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "weights"), {
      weight: weight,
      timestamp: new Date(),
    });
    setWeight("");
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth); // Update the width on resize
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize); // Add resize event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the listener
    };
  }, []);

  const handleDelete = async () => {
    // Delete functionality goes here
    // This function will need to delete the selected weight from Firestore
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="static"
        style={{
          background: "#536b78",
          boxShadow: "none",
          borderBottom: "1px solid #eeeeee",
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
          <Button color="inherit" style={{ color: "white" }}>
            Body Comp.
          </Button>
          <Button color="inherit" style={{ color: "white" }}>
            Nutrients
          </Button>
          <Button color="inherit" style={{ color: "white" }}>
            About
          </Button>
        </Toolbar>
      </AppBar>

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="flex-start" // Changed from center to flex-start
        sx={{ minHeight: "100vh", paddingTop: "5vh" }} // Added paddingTop
      >
        <Grid>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "8px",
            }}
          >
            <TextField
              id="weight"
              label="Enter weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">kg</InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 1,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#bde0fe", // Pastel Blue
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#a2c4fd", // Darker shade for hover
                  },
                  margin: "0 8px",
                }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
                sx={{ margin: "0 8px" }}
                disabled={!selectedWeightId} // Disable if no weight is selected
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Grid>
        <Box
          sx={{
            border: 1,
            borderColor: "primary.main",
            borderRadius: 2,
            padding: 3,
            width: "65%", // Adjust this as needed
            height: "auto",
            margin: "auto", // Center the box
            marginTop: "30px",
          }}
        >
          <WeightChart key={windowWidth} />
        </Box>
      </Grid>
    </React.Fragment>
  );
}

export default App;
