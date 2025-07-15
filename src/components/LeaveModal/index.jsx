import { Modal, Button, Typography, Box, Stack } from "@mui/material";
import React from "react";
import { ApiUrl } from "../../utils/var";

export default function LeaveModal({ open, onClose }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
    bgcolor: "#121212",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    color: "white",
  };

  const onConfirm = () => {
    const player = JSON.parse(localStorage.getItem("player"));
    fetch(`${ApiUrl}/config/unpick`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          localStorage.removeItem("player");
          localStorage.removeItem("players");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error al deseleccionar jugador:", error);
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="leave-modal-title"
      aria-describedby="leave-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="leave-modal-title"
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          ¿Seguro que quieres salir?
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Confirmar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
