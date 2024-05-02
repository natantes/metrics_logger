import { Box } from "@mui/material";
import React from "react";

function StyledBox({ children, extraStyles = {} }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "accent.main",
        borderRadius: 1,
        paddingRight: 4,
        marginTop: 4,
        ...extraStyles,
      }}
    >
      {children}
    </Box>
  );
}

export default StyledBox;
