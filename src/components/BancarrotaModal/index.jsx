import React from "react";
import { Modal, Box, Button, Typography, Stack } from "@mui/material";
import { ApiUrl } from "../../utils/var";

export default function BancarrotaModal({ open, onClose, player }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "80%", sm: "100%" },
    maxWidth: 400,
    bgcolor: "#1e1e1e",
    borderRadius: "12px",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    color: "#fff",
  };

  const bancarrota = () => {
    fetch(`${ApiUrl}/bancarrota/${player.name}`, {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al declarar bancarrota");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Bancarrota confirmada:", data);
        localStorage.removeItem("player");
        localStorage.removeItem("players");
        localStorage.removeItem("config");
        // Lógica adicional, como cerrar el modal o actualizar el estado
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          ¿Estás seguro que querés declarar bancarrota?
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Esta acción es irreversible y te eliminará del juego.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="error"
            onClick={() => bancarrota()}
          >
            Confirmar
          </Button>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancelar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
