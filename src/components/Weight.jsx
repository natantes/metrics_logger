import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../state/UserContext";
import { UnitContext } from "../state/UnitContext";
import { Navbar } from "./Navbar";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  CssBaseline,
} from "@mui/material";

import StyledWeightChart from "./Chart";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { convertKgToLbs, convertLbsToKg } from "../utilities/functions";
import { parseISO } from "date-fns";
import DataHeatmap from "./Heatmap"; // Import the generic heatmap component

function Weight() {
  const { user, setUser } = useContext(UserContext);
  const { unit, setUnit } = useContext(UnitContext);
  const [weight, setWeight] = useState("");
  // Helper function to format date to datetime-local format
  const toLocalISOString = (date) => {
    const off = date.getTimezoneOffset();
    const offsetDate = new Date(date.getTime() - off * 60 * 1000);
    return offsetDate.toISOString().slice(0, 16);
  };

  // Set initial dateTime state using the helper function
  const [dateTime, setDateTime] = useState(toLocalISOString(new Date()));
  const [weights, setWeights] = useState([]);
  const weightsRef = useRef();
  weightsRef.current = weights;
  const [selectedWeightId, setSelectedWeightId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      if (currentUser) {
        setUser(currentUser);
        // Call fetchWeights here when a user is signed in
        fetchWeights(currentUser.uid);
      } else {
        setUser(null);
        setWeights([]); // Clear the weights when there is no user signed in
      }
    });
    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(weights);
  }, [weights]);

  // This useEffect should now be responsible for real-time updates
  // to the weights when a user is logged in.
  useEffect(() => {
    // Clear the weights when there is no user or when the user changes
    setWeights([]);

    let unsubscribe = () => {};

    if (user) {
      const weightsRef = collection(db, "weights");
      const q = query(
        weightsRef,
        where("userId", "==", user.uid),
        orderBy("timestamp")
      );

      // Subscribe to onSnapshot and store the unsubscribe function
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const weightsData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            weight: doc.data().weight,
            timestamp: doc.data().timestamp.toDate(),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setWeights(weightsData);
      });
    }

    // Return the unsubscribe function to be called when the component unmounts
    // or when the user changes
    return unsubscribe;
  }, [user]);

  const fetchWeights = async (userId) => {
    try {
      if (!userId) {
        console.error("No user ID provided to fetch weights.");
        return;
      }

      // Reference to the weights subcollection of a specific user
      const weightsRef = collection(db, "users", userId, "weights");
      const q = query(weightsRef, orderBy("timestamp"));

      const querySnapshot = await getDocs(q);
      const weightsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp;
        const date = timestamp.toDate
          ? timestamp.toDate()
          : new Date(timestamp);
        return {
          id: doc.id,
          weight: data.weight,
          timestamp: date,
        };
      });

      setWeights(weightsData.sort((a, b) => a.timestamp - b.timestamp));
    } catch (error) {
      console.error("Error fetching weights: ", error);
    }
  };

  const logWeightEntry = async (date, weight) => {
    if (!user || !user.uid) {
      console.error("User object or User ID is undefined.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const weightsRef = collection(userRef, "weights");

    try {
      await addDoc(weightsRef, {
        timestamp: new Date(date),
        weight: weight,
      });
      console.log("Weight logged for date: ", date);
      setWeight(""); // Clear the input field for weight
      setDateTime(toLocalISOString(new Date())); // Reset the date-time input
    } catch (error) {
      console.error("Error logging weight: ", error);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const parsedWeight = parseFloat(weight);

    if (!isFinite(parsedWeight)) {
      console.log("Invalid weight");
      return;
    } else if (!user) {
      console.log("No user signed in to submit weight");
      return;
    }

    const enteredWeight =
      unit === "kg" ? parsedWeight : convertLbsToKg(parsedWeight);
    const timestamp = parseISO(dateTime);

    await logWeightEntry(timestamp, enteredWeight); // Use the refactored logging function

    setWeight(""); // Clear the weight input field
    setDateTime(toLocalISOString(new Date())); // Reset the date-time input
  };

  const handleEditEntry = (entryId) => {
    setSelectedWeightId(entryId);
    const selectedEntry = weights.find((w) => w.id === entryId);
    if (selectedEntry) {
      setWeight(selectedEntry.weight);
      setDateTime(selectedEntry.timestamp.toISOString().slice(0, 16));
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!user) {
      console.log("No user signed in to delete weight");
      return;
    }

    try {
      await deleteDoc(doc(db, "users", user.uid, "weights", entryId));
      setWeights(weights.filter((w) => w.id !== entryId));
    } catch (error) {
      console.error("Error deleting weight: ", error);
    }
  };

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedWeightId(selectedId);

    // Optionally, pre-fill the edit fields with the selected entry's data
    const selectedWeightEntry = weights.find((w) => w.id === selectedId);
    if (selectedWeightEntry) {
      setWeight(selectedWeightEntry.weight);
      setDateTime(selectedWeightEntry.timestamp.toISOString().slice(0, 16));
    }
  };

  return (
    <React.Fragment>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="flex-start" // Changed from center to flex-start
        sx={{ minHeight: "100vh", paddingTop: "5vh", marginBottom: "5vh" }} // Added paddingTop
      >
        <Box
          sx={{
            border: 2,
            borderColor: "accent.main",
            borderRadius: 1,
            padding: 3,
            width: "65%",
            height: "auto",
            margin: "auto", // Center the box
          }}
        >
          <DataHeatmap
            data={weights.map((weight) => ({
              date: weight.timestamp.toISOString().slice(0, 10),
              value: weight.weight,
            }))}
            valueLabel="weight (kg)"
          />
        </Box>

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
                  <InputAdornment position="start">{unit}</InputAdornment>
                ),
              }}
            />
            <TextField
              id="date-time"
              label="Select Date and Time"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}
            >
              <Button
                type="submit"
                variant="contained"
                onClick={handleSubmit}
                sx={{ margin: "0 8px", borderRadius: "4px" }}
              >
                Submit
              </Button>
              <Button
                onClick={() => setUnit(unit === "kg" ? "lbs" : "kg")}
                sx={{ margin: "0 8px", borderRadius: "4px" }}
              >
                Toggle Lb/Kg
              </Button>
            </Box>
          </Box>
        </Grid>

        <StyledWeightChart
          key={windowWidth}
          data={weightsRef.current}
          unit={unit}
        />

        <Box
          sx={{
            border: 2,
            borderColor: "accent.main",
            borderRadius: 4,
            padding: 3,
            width: "65%",
            height: "auto",
            margin: "auto", // Center the box
            marginTop: "30px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {" "}
          {weights
            .sort((a, b) => {
              return b.timestamp - a.timestamp;
            }) // Sort by timestamp descending
            .map((weightEntry, index, array) => (
              <Box
                key={weightEntry.id}
                className="entry"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: index !== 0 ? 0.5 : 0,
                  paddingBottom: index !== array.length - 1 ? 1.5 : 0,
                  borderBottom:
                    index !== array.length - 1 ? "1px solid #e0e0e0" : "none",
                  margin: 1,
                }}
              >
                <Typography variant="body1">
                  {unit === "kg"
                    ? Math.round(weightEntry.weight * 100) / 100
                    : convertKgToLbs(weightEntry.weight).toFixed(2)}{" "}
                  {unit}
                  {" - "}
                  {weightEntry.timestamp.toLocaleString()}
                </Typography>
                <Box>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleEditEntry(weightEntry.id)}
                    sx={{ marginLeft: 1, borderRadius: "4px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteEntry(weightEntry.id)}
                    sx={{ marginLeft: 1, borderRadius: "4px" }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>
      </Grid>
    </React.Fragment>
  );
}

export default Weight;
