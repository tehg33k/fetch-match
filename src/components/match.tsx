import { Box, Button, TextField, Typography } from "@mui/material";
import { getDogs } from "../fetch/dogs";

export const Match = () => {
  const fetchDogs = async () => {
    try {
      const res = await getDogs();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
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
      <Button onClick={fetchDogs}>Fetch Dogs</Button>
    </Box>
  );
};
