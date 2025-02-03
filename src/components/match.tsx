import { Box, TextField, Typography } from "@mui/material";

export const Match = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      width={"600px"}
    >
      <Typography variant="h2" color="#000000">
        Match
      </Typography>
      <Typography variant="body1" color="#000000">
        table goes down here...
      </Typography>
    </Box>
  );
};
