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
import StyledBox from "../StyledComponents/StyledBox";

function Habit({ habit, user }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [value, setValue] = useState("");
  const [color, setColor] = useState(habit.heatmap_color);
  const timeoutRef = useRef(null);

  const openMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
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
    <StyledBox>
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
    </StyledBox>
  );
}

export default Habit;
