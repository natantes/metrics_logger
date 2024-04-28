import React, { useState } from "react";
import Modal from "react-modal";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { TextField, Button, IconButton } from "@mui/material";
import { SketchPicker } from "react-color";
import { FaEyeDropper } from "react-icons/fa";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 999,
  },
};

const CreateHabitModal = ({ isOpen, onRequestClose, userId }) => {
  const [name, setName] = useState("");
  const [units, setUnits] = useState("");
  const [color, setColor] = useState("#ff4500"); // Default color for the heatmap
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChangeComplete = (color) => {
    setColor(color.hex);
  };

  const handleSubmit = async () => {
    // Additional validation could be performed here
    if (name && units) {
      const userHabitsListRef = collection(db, "users", userId, "habitsList");
      await addDoc(userHabitsListRef, {
        name,
        units,
        entries: {}, // Use an empty object for entries
        heatmap_color: color, // Save the selected color
      });
      onRequestClose(); // Close the modal after submitting
      // Reset the form state if necessary
      setName("");
      setUnits("");
      setColor("#ff4500");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <h2>Create New Habit</h2>
      <TextField
        label="Habit Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Units"
        value={units}
        onChange={(e) => setUnits(e.target.value)}
        fullWidth
        margin="normal"
      />
      <IconButton
        color="primary"
        onClick={() => setShowColorPicker(!showColorPicker)}
        style={{ marginTop: 20 }}
      >
        <FaEyeDropper />
      </IconButton>
      {showColorPicker && (
        <SketchPicker
          color={color}
          onChangeComplete={handleColorChangeComplete}
        />
      )}
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        style={{ marginTop: 20 }}
      >
        Create
      </Button>
    </Modal>
  );
};

export default CreateHabitModal;
