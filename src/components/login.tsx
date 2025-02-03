import {
  Card,
  CardContent,
  Box,
  TextField,
  Grid2 as Grid,
  Button,
  CardHeader,
  CircularProgress,
} from "@mui/material";
import { FC, useState } from "react";
import { login } from "../fetch/auth";
import { checkForEnterKey } from "../helpers";

interface ILogin {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const Login: FC<ILogin> = ({ setIsLoggedIn }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoggingIn(true);
      await login(name, email);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };
  return (
    <>
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
    </>
  );
};
