import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Habit from "./Habits";
import CreateHabitModal from "./CreateHabitModal";
import { Box, TextField, Button, Grid } from "@mui/material";

const HabitsList = ({ user }) => {
  const [habits, setHabits] = useState([]);
  const [createHabitIsOpen, setCreateHabitIsOpen] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      // Reference to the user's habitsList subcollection
      const habitsListRef = collection(db, "users", user.uid, "habitsList");

      // Set up the real-time subscription to the habitsList
      const q = query(habitsListRef, orderBy("name"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const habitsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHabits(habitsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  console.log(habits);

  if (!user) {
    // If the user object is not yet available, you can return null, a loading indicator, or some other placeholder content
    return <div>Loading...</div>;
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="flex-start" // Changed from center to flex-start
      sx={{ minHeight: "50vh", paddingTop: "5vh", marginBottom: "5vh" }} // Added paddingTop
    >
      <Box
        sx={{
          borderColor: "accent.main",
          padding: 3,
          width: "75%",
          height: "auto",
          margin: "auto", // Center the box
          maxWidth: 1000,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            type="search"
            placeholder="Search habits"
            variant="outlined"
            style={{ flex: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateHabitIsOpen(true)}
          >
            Create Habit
          </Button>
        </Box>

        {habits.length > 0 ? (
          habits.map((habit) => (
            <Habit key={habit.id} habit={habit} user={user} />
          ))
        ) : (
          <p>No habits found. Start by creating a new habit.</p>
        )}
        <CreateHabitModal
          isOpen={createHabitIsOpen}
          onRequestClose={() => setCreateHabitIsOpen(false)}
          userId={user.uid}
        />
      </Box>
    </Grid>
  );
};

export default HabitsList;
