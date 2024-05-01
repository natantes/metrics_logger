import React, { useState } from "react";
import Modal from "react-modal";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { TextField, Button, IconButton } from "@mui/material";
import { SketchPicker } from "react-color";
import { Tooltip } from "@mui/material";

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
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
      >
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
            onClick={() => setShowColorPicker((prev) => !prev)}
          >
            <IconButton style={{ backgroundColor: color }} />
            Color
          </Button>
        </Tooltip>

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
        >
          Create
        </Button>
      </Modal>
      {showColorPicker && (
        <div style={{ position: "fixed", bottom: 40, right: 40, zIndex: 1500 }}>
          <SketchPicker
            color={color}
            onChangeComplete={handleColorChangeComplete}
          />
        </div>
      )}
    </>
  );
};

export default CreateHabitModal;
