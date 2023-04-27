import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";

export default function Login({ open, handleClose, setCurrentUser }) {
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

  const [loginError, setLoginError] = useState(false);

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const submitLogin = () => {
    axios
      .post("http://localhost:3001/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response);
        setCurrentUser(response.data.user.username);
        handleClose();
      })
      .catch((err) => {
        setLoginError(true);
        console.log(err);
      });
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={{ ...style }}>
        <Typography id="modal-title" component="h2">
          Login
        </Typography>
        <TextField
          id="username"
          label="Enter Username"
          value={username}
          onChange={handleUserNameChange}
          sx={{ margin: "2% 1% 1%" }}
          required
        />
        <TextField
          id="password"
          label="Enters Password"
          value={password}
          onChange={handlePasswordChange}
          sx={{ margin: "2% 1% 1%" }}
          required
        />
        <Button id="login" variant="contained" onClick={submitLogin}>
          Login
        </Button>
        {loginError && (
          <h3 style={{ color: "red" }}>Wrong username and/or password!</h3>
        )}
      </Box>
    </Modal>
  );
}
