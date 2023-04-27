import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Projects({
  open,
  handleClose,
  currentUser,
  networks,
  changeNetwork,
  deleteNetwork,
}) {
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

  const handleClick = (networkName) => {
    changeNetwork(networkName);
  };

  const handleDelete = (networkName) => {
    deleteNetwork(networkName);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={{ ...style }}>
        <Typography id="modal-title" component="h2" sx={{ marginBottom: "1%" }}>
          {`Projects for ${currentUser}`}
        </Typography>
        {networks.length === 0
          ? "No Saved Projects"
          : networks.map((network) => {
              return (
                <div>
                  <Button
                    id={network}
                    onClick={() => handleClick({ network })}
                    sx={{ width: "90%" }}
                  >
                    {network}
                  </Button>
                  <IconButton
                    id={`delete-${network}`}
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete({ network })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              );
            })}
      </Box>
    </Modal>
  );
}
