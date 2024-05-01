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
import { SketchPicker } from "react-color";
import { db } from "../../firebase";
import DataHeatmap from "../DataVis/Heatmap";
import React, { useState, useRef, useEffect } from "react";
import { Menu, MenuItem } from "@mui/material";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const HeatmapColorPicker = ({ user, habit, color, setColor }) => {
  const [showPicker, setShowPicker] = useState(false);
  const timeoutRef = useRef(null);

  const closePicker = () => {
    clearTimeout(timeoutRef.current);
    updateDatabase(color);
    setShowPicker(false);
  };

  const togglePicker = () => {
    if (showPicker) {
      closePicker(); // Handle closing the picker and updating the database
    } else {
      setShowPicker(true);
      timeoutRef.current = setTimeout(() => {
        closePicker();
      }, 4000);
    }
  };

  useEffect(() => {
    // Cleanup the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

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

  const handleColorChange = (color) => {
    setColor(color.hex);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateDatabase(color.hex);
      setShowPicker(false);
    }, 4000); // Set the timeout for 10 seconds
  };

  return (
    <>
      <Tooltip title="Change Color">
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
      </Tooltip>
      {showPicker && (
        <div style={{ position: "fixed", bottom: 40, right: 40, zIndex: 1500 }}>
          <SketchPicker color={color} onChangeComplete={handleColorChange} />
        </div>
      )}
    </>
  );
};

export default HeatmapColorPicker;
