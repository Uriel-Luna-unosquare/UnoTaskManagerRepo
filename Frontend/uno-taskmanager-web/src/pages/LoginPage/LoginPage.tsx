import { Button, TextField, Box, Typography, Card, Container } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  loginContainerStyles,
  loginCardStyles,
  loginTitleStyles,
  loginSubtitleStyles,
  textFieldStyles,
  loginButtonStyles,
} from "./LoginPage.styles";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
    await loginUser(username, password);
    navigate("/");
  }

  return (
    <Box sx={loginContainerStyles}>
      <Container maxWidth={false} sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Card sx={{ ...loginCardStyles, maxWidth: "400px", width: "100%" }}>
          <Typography variant="h4" sx={loginTitleStyles}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={loginSubtitleStyles}>
            Sign in to your account to continue
          </Typography>

          <TextField
            fullWidth
            label="Username"
            type="text"
            margin="normal"
            variant="outlined"
            onChange={e => setUsername(e.target.value)}
            sx={textFieldStyles}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            onChange={e => setPassword(e.target.value)}
            sx={textFieldStyles}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={loginButtonStyles}
          >
            Sign In
          </Button>
        </Card>
      </Container>
    </Box>
  );
}