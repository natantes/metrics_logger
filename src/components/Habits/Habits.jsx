import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/material";
import { db } from "../../firebase";
import DataHeatmap from "../DataVis/Heatmap";
import React, { useState, useRef, useEffect } from "react";
import { Menu, MenuItem } from "@mui/material";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HeatmapColorPicker from "../CommonComponents/ColorPicker";

function Habit({ habit, user }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [value, setValue] = useState("");
  const [color, setColor] = useState(habit.heatmap_color);
  // const [showPicker, setShowPicker] = useState(false);
  const timeoutRef = useRef(null);

  const openMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const updateDatabase = async (newColor) => {
    if (!user || !user.uid || !habit.id) {
      console.error("User object or Habit ID is undefined.");
      return;
    }

    const habitRef = doc(db, "users", user.uid, "habitsList", habit.id);
    try {
      await updateDoc(habitRef, {
        heatmap_color: newColor,
      });
    } catch (error) {
      console.error("Error updating color: ", error);
    }
  };

  const deleteHabit = async () => {
    if (!user || !habit.id) {
      console.error("User object or Habit ID is undefined.");
      return;
    }

    try {
      const habitRef = doc(db, "users", user.uid, "habitsList", habit.id);
      await deleteDoc(habitRef);
      console.log("Habit deleted.");
      closeMenu(); // Close menu after deletion
    } catch (error) {
      console.error("Error deleting habit: ", error);
    }
  };

  // const handleColorChange = (color) => {
  //   setColor(color.hex);
  //   clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(() => {
  //     updateDatabase(color.hex);
  //     setShowPicker(false);
  //   }, 4000); // Set the timeout for 10 seconds
  // };

  // const closePicker = () => {
  //   clearTimeout(timeoutRef.current);
  //   updateDatabase(color);
  //   setShowPicker(false);
  // };

  // const togglePicker = () => {
  //   if (showPicker) {
  //     closePicker(); // Handle closing the picker and updating the database
  //   } else {
  //     setShowPicker(true);
  //     timeoutRef.current = setTimeout(() => {
  //       closePicker();
  //     }, 4000);
  //   }
  // };

  useEffect(() => {
    // Cleanup the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const logHabitEntry = async () => {
    if (!user || !user.uid || !habit.id) {
      console.error("User object or Habit ID is undefined.");
      return;
    }

    const habitRef = doc(db, "users", user.uid, "habitsList", habit.id);
    const entryKey = `entries.${date}`;

    try {
      await updateDoc(habitRef, {
        [entryKey]: value,
      });
      console.log("Habit logged for date: ", date);
      setOpenDialog(false);
      setValue("");
    } catch (error) {
      console.error("Error logging habit: ", error);
    }
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "accent.main",
        borderRadius: 1,
        paddingRight: 4,
        marginTop: 4,
      }}
    >
      <Grid container sx={{ margin: "auto" }} spacing={2}>
        <Grid item xs={12}>
          <DataHeatmap
            data={habit.entries}
            name={habit.name}
            units={habit.units}
            heatmap_color={color}
          />
        </Grid>
        <Grid
          item
          xs={12}
          container
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Log today
          </Button>

          <HeatmapColorPicker
            user={user}
            habit={habit}
            color={color}
            setColor={setColor}
          />

          {/* <Tooltip title="Change Color">
            <Button
              variant="contained"
              sx={{
                marginLeft: 1,
                color: "black", // Text color
                borderColor: "black", // Border color
                backgroundColor: "white", // Background color
                ":hover": {
                  backgroundColor: "#f5f5f5", // Lighter grey on hover
                  borderColor: "black", // Maintain border color on hover
                },
                gap: 1,
              }}
              onClick={togglePicker}
            >
              <IconButton style={{ backgroundColor: color }} />
              Color
            </Button>
          </Tooltip> */}

          <IconButton onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
          >
            <MenuItem onClick={deleteHabit}>Delete</MenuItem>
          </Menu>

          {/* {showPicker && (
            <div
              style={{ position: "fixed", bottom: 40, right: 40, zIndex: 1500 }}
            >
              <SketchPicker
                color={color}
                onChangeComplete={handleColorChange}
              />
            </div>
          )} */}
        </Grid>
        <Grid item xs={12}>
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Log Habit Entry</DialogTitle>
            <DialogContent>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  logHabitEntry();
                }}
              >
                <TextField
                  autoFocus
                  margin="dense"
                  id="date"
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <TextField
                  margin="dense"
                  id="value"
                  label={`Value (${habit.units})`}
                  type="number"
                  fullWidth
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button type="submit" color="primary" variant="contained">
                  Log Entry
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Habit;
