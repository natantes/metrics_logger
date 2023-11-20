import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { UserContext } from "./state/UserContext";
import { Navbar } from "./components/Navbar";
import { CssBaseline } from "@mui/material";
import { SignIn } from "./components/SignIn";
import PrivateRoute from "./auth/PrivateRoute";
import Weight from "./components/Weight";

function App() {
  const { user } = useContext(UserContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
      <CssBaseline />
      <Navbar />
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
        <Route path="/" element={<div>Home Page</div>} />
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
    </BrowserRouter>
  );
}

export default App;

// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "./state/UserContext";
// import { UnitContext } from "./state/UnitContext";
// import { Navbar } from "./components/Navbar";
// import InputAdornment from "@mui/material/InputAdornment";
// import {
//   Typography,
//   Box,
//   TextField,
//   Button,
//   Grid,
//   CssBaseline,
// } from "@mui/material";

// import StyledWeightChart from "./components/Chart";
// import { db, auth } from "./firebase";
// import {
//   addDoc,
//   collection,
//   getDocs,
//   doc,
//   deleteDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   where,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { convertKgToLbs, convertLbsToKg } from "./utilities/functions";
// import { parseISO } from "date-fns";

// function App() {
//   const { unit, setUnit } = useContext(UnitContext);
//   const [weight, setWeight] = useState("");
//   // Helper function to format date to datetime-local format
//   const toLocalISOString = (date) => {
//     const off = date.getTimezoneOffset();
//     const offsetDate = new Date(date.getTime() - off * 60 * 1000);
//     return offsetDate.toISOString().slice(0, 16);
//   };

//   // Set initial dateTime state using the helper function
//   const [dateTime, setDateTime] = useState(toLocalISOString(new Date()));
//   const [weights, setWeights] = useState([]);
//   const [selectedWeightId, setSelectedWeightId] = useState(null);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const { user, setUser } = useContext(UserContext);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         // Call fetchWeights here when a user is signed in
//         fetchWeights(currentUser.uid);
//       } else {
//         setUser(null);
//         setWeights([]); // Clear the weights when there is no user signed in
//       }
//     });
//     // Cleanup function to unsubscribe when the component unmounts
//     return () => unsubscribe();
//   }, []);

//   // This useEffect should now be responsible for real-time updates
//   // to the weights when a user is logged in.
//   useEffect(() => {
//     let unsubscribe = () => {};

//     if (user) {
//       const weightsRef = collection(db, "weights");
//       // Make sure to query only the weights for the logged-in user
//       const q = query(
//         weightsRef,
//         where("userId", "==", user.uid),
//         orderBy("timestamp")
//       );

//       unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const weightsData = querySnapshot.docs
//           .map((doc) => ({
//             id: doc.id,
//             weight: doc.data().weight,
//             timestamp: doc.data().timestamp.toDate(),
//           }))
//           .sort((a, b) => a.timestamp - b.timestamp);

//         setWeights(weightsData);
//       });
//     } else {
//       setWeights([]); // Clear the weights when there is no user signed in
//     }

//     // Cleanup function to unsubscribe when the user logs out or when the component unmounts
//     return () => unsubscribe();
//   }, [user]);

//   const fetchWeights = async (userId) => {
//     try {
//       if (!userId) {
//         console.error("No user ID provided to fetch weights.");
//         return;
//       }

//       const weightsRef = collection(db, "weights");
//       const q = query(
//         weightsRef,
//         where("userId", "==", userId),
//         orderBy("timestamp")
//       );

//       const querySnapshot = await getDocs(q);
//       const weightsData = querySnapshot.docs
//         .map((doc) => {
//           const data = doc.data();
//           const timestamp = data.timestamp;
//           const date = timestamp.toDate
//             ? timestamp.toDate()
//             : new Date(timestamp);
//           return {
//             id: doc.id,
//             weight: data.weight,
//             timestamp: date,
//           };
//         })
//         .sort((a, b) => a.timestamp - b.timestamp);
//       setWeights(weightsData);
//     } catch (error) {
//       console.error("Failed to fetch weights:", error);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
//     return () => {
//       window.removeEventListener("resize", () =>
//         setWindowWidth(window.innerWidth)
//       );
//     };
//   }, []);

//   useEffect(() => {
//     const weightsRef = collection(db, "weights");
//     const q = query(weightsRef, orderBy("timestamp"));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const weightsData = querySnapshot.docs
//         .map((doc) => ({
//           id: doc.id,
//           weight: doc.data().weight,
//           timestamp: doc.data().timestamp.toDate(),
//         }))
//         .sort((a, b) => a.timestamp - b.timestamp);

//       setWeights(weightsData);
//     });

//     return () => unsubscribe(); // Clean up the listener
//   }, []);

//   const handleSubmit = async (e) => {
//     const parsedWeight = parseFloat(weight);

//     // error handling
//     if (!isFinite(parsedWeight)) {
//       console.log("Invalid weight");
//       return;
//     } else if (!user) {
//       console.log("No user signed in to submit weight");
//       return;
//     }

//     e.preventDefault();
//     const enteredWeight =
//       unit === "kg" ? parsedWeight : convertLbsToKg(parsedWeight);
//     const timestamp = parseISO(dateTime);

//     await addDoc(collection(db, "weights"), {
//       weight: enteredWeight,
//       timestamp: timestamp,
//       userId: user.uid, // Associate the weight entry with the user ID
//     });

//     setWeight("");
//   };

//   const handleEditEntry = (entryId) => {
//     setSelectedWeightId(entryId);
//     const selectedEntry = weights.find((w) => w.id === entryId);
//     if (selectedEntry) {
//       setWeight(selectedEntry.weight);
//       setDateTime(selectedEntry.timestamp.toISOString().slice(0, 16));
//     }
//   };

//   const handleDeleteEntry = async (entryId) => {
//     if (user) {
//       // Check if there is a user signed in
//       await deleteDoc(doc(db, "weights", entryId));
//       setWeights(weights.filter((w) => w.id !== entryId));
//     } else {
//       // Handle the case where there is no user signed in
//       console.log("No user signed in to delete weight");
//     }
//   };

//   const handleSelectChange = (event) => {
//     const selectedId = event.target.value;
//     setSelectedWeightId(selectedId);

//     // Optionally, pre-fill the edit fields with the selected entry's data
//     const selectedWeightEntry = weights.find((w) => w.id === selectedId);
//     if (selectedWeightEntry) {
//       setWeight(selectedWeightEntry.weight);
//       setDateTime(selectedWeightEntry.timestamp.toISOString().slice(0, 16));
//     }
//   };

//   return (
//     <React.Fragment>
//       <CssBaseline />
//       <Navbar />

//       <Grid
//         container
//         spacing={0}
//         direction="column"
//         alignItems="center"
//         justifyContent="flex-start" // Changed from center to flex-start
//         sx={{ minHeight: "100vh", paddingTop: "5vh" }} // Added paddingTop
//       >
//         <Grid>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               flexWrap: "wrap",
//               margin: "8px",
//             }}
//           >
//             <TextField
//               id="weight"
//               label="Enter weight"
//               type="number"
//               value={weight}
//               onChange={(e) => setWeight(e.target.value)}
//               placeholder="Enter weight"
//               margin="normal"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">{unit}</InputAdornment>
//                 ),
//               }}
//             />
//             <TextField
//               id="date-time"
//               label="Select Date and Time"
//               type="datetime-local"
//               value={dateTime}
//               onChange={(e) => setDateTime(e.target.value)}
//               margin="normal"
//               InputLabelProps={{ shrink: true }}
//             />
//             <Box
//               sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}
//             >
//               <Button
//                 type="submit"
//                 variant="contained"
//                 onClick={handleSubmit}
//                 sx={{ margin: "0 8px" }}
//               >
//                 Submit
//               </Button>
//               <Button onClick={() => setUnit(unit === "kg" ? "lbs" : "kg")}>
//                 Toggle Lb/Kg
//               </Button>
//             </Box>
//           </Box>
//         </Grid>

//         <StyledWeightChart key={windowWidth} data={weights} unit={unit} />

//         <Box
//           sx={{
//             border: 2,
//             borderColor: "black", // gray color
//             borderRadius: 2,
//             padding: 3,
//             width: "65%", // Adjust this as needed
//             height: "auto",
//             margin: "auto", // Center the box
//             marginTop: "30px",
//             maxHeight: "300px", // Adjust as needed
//             overflowY: "auto",
//           }}
//         >
//           {" "}
//           {weights
//             .sort((a, b) => {
//               return b.timestamp - a.timestamp;
//             }) // Sort by timestamp descending
//             .map((weightEntry, index, array) => (
//               <Box
//                 key={weightEntry.id}
//                 className="entry"
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   paddingTop: index !== 0 ? 0.5 : 0,
//                   paddingBottom: index !== array.length - 1 ? 1.5 : 0,
//                   borderBottom:
//                     index !== array.length - 1 ? "1px solid #e0e0e0" : "none",
//                   margin: 1,
//                 }}
//               >
//                 {console.log(weightEntry.timestamp.seconds)}
//                 <Typography variant="body1">
//                   {unit === "kg"
//                     ? Math.round(weightEntry.weight * 100) / 100
//                     : convertKgToLbs(weightEntry.weight).toFixed(2)}{" "}
//                   {unit}
//                   {" - "}
//                   {weightEntry.timestamp.toLocaleString()}
//                 </Typography>
//                 <Box>
//                   <Button
//                     size="small"
//                     variant="contained"
//                     onClick={() => handleEditEntry(weightEntry.id)}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     size="small"
//                     variant="contained"
//                     color="error"
//                     onClick={() => handleDeleteEntry(weightEntry.id)}
//                     sx={{ marginLeft: 1 }}
//                   >
//                     Delete
//                   </Button>
//                 </Box>
//               </Box>
//             ))}
//         </Box>
//       </Grid>

//     </React.Fragment>
//   );
// }

// export default App;
