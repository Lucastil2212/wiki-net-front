import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";

export default function SignUp({ open, handleClose, setCurrentUser }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [passwordError, setPasswordError] = useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorText, setUsernameErrorText] = useState("");

  const handleUserNameChange = (e) => {
    setUsernameError(false);
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPasswordError(false);
    setPassword(e.target.value);
  };
  const submitSignUp = () => {
    if (password.length < 5) {
      setPasswordError(true);
      return;
    }

    if (username.length < 3) {
      setUsernameError(true);
      setUsernameErrorText("Username is too short!");
    }
    axios
      .post("http://184.72.207.15:3001/createUser", {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response);
        setCurrentUser(response.data.user.username);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        setUsernameError(true);
        setUsernameErrorText("Username already exists!");
      });
  };
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={{ ...style }}>
        <Typography id="modal-title" component="h2">
          Sign Up
        </Typography>
        <TextField
          id="username"
          label="Create Username"
          value={username}
          onChange={handleUserNameChange}
          error={usernameError}
          helperText={usernameError ? usernameErrorText : ""}
          sx={{ margin: "2% 1% 1%" }}
          required
        />
        <TextField
          id="password"
          label="Create Password"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
          helperText={passwordError ? "Password must be longer!" : ""}
          sx={{ margin: "2% 1% 1%" }}
          required
        />
        <Button id="login" variant="contained" onClick={submitSignUp}>
          Sign Up
        </Button>
      </Box>
    </Modal>
  );
}
