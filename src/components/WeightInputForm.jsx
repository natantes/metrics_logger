import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { Box, Button, Grid } from "@mui/material";

export const WeightInputForm = ({ handleSubmit }) => {
  return (
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
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            sx={{ margin: "0 8px" }}
          >
            Submit
          </Button>
          <Button onClick={() => setUnit(unit === "kg" ? "lbs" : "kg")}>
            Toggle Lb/Kg
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};
