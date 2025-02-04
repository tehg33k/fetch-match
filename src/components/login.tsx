import {
  Card,
  CardContent,
  Box,
  TextField,
  Grid2 as Grid,
  Button,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import { FC, useContext, useState } from "react";
import { logIn } from "../fetch/auth";
import { checkForEnterKey } from "../helpers";
import { UserContext } from "../context/user";

export const Login = () => {
  const { setUser, setIsLoggedIn } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoggingIn(true);
      await logIn(name, email);
      setUser({ name, email });
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };
  return (
    <>
      <Grid p={2}>
        <Typography
          variant="h1"
          mb={1}
          sx={{
            textShadow: "0 0 20px #00000059",
          }}
        >
          fetchMatch
        </Typography>
        <Card>
          <CardHeader
            title="Login"
            subheader="Enter your name and email to get started."
          />
          <CardContent>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    disabled={isLoggingIn}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    disabled={isLoggingIn}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    onKeyDown={(e) => {
                      checkForEnterKey(e, () => {
                        handleSubmit();
                      });
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isLoggingIn}
                    onClick={handleSubmit}
                  >
                    Submit {isLoggingIn && <CircularProgress size={24} />}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};
