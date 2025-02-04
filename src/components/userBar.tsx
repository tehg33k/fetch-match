import { useContext } from "react";
import { UserContext } from "../context/user";
import { Box, Grid2 as Grid, Link, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { logOut } from "../fetch/auth";

export const UserBar = () => {
  const { user, setIsLoggedIn } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const res = await logOut();
      setIsLoggedIn(false);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        paddingInline={2}
        paddingBlock={1}
        className="user-bar"
      >
        <Typography color="ffffff" fontWeight={"bold"}>
          Hello, {user?.name}
        </Typography>
        <Link
          color="white"
          underline="none"
          onClick={() => handleLogout()}
          sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }}
        >
          Logout <Logout sx={{ fontSize: "16px", marginBottom: "-3px" }} />
        </Link>
      </Grid>
    </Box>
  );
};
