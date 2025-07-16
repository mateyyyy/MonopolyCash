import { Modal, Box, Typography, Button } from "@mui/material";
import React from "react";
import { ApiUrl } from "../../utils/var";

export default function ReqModal({ open, onClose, requests, player }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "80%", sm: "100%" },
    maxWidth: { xs: "none", sm: 400 },
    maxHeight: "400px",
    overflow: "auto",
    bgcolor: "#121212",
    borderRadius: "8px",
    boxShadow: 24,
    p: 1.5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "white",
  };

  const respondReq = (estado, requestId) => {
    fetch(`${ApiUrl}/requestsRespond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: requestId,
        playerName: player.name,
        accept: estado,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta enviada:", data);
      })
      .catch((err) => {
        console.error("Error al responder solicitud:", err);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" textAlign="center" color="white" mb={2}>
          Solicitudes de cobro pendientes
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            maxHeight: "300px",
          }}
        >
          {requests.length === 0
            ? onClose()
            : requests.map((req, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "#1f1f1f",
                    padding: 2,
                    borderRadius: "8px",
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <Typography>
                    <b>{req.to}</b> quiere cobrar ${req.amount} del banco
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexDirection: "row" }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => respondReq(true, req.id)}
                    >
                      Aceptar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => respondReq(false, req.id)}
                    >
                      Rechazar
                    </Button>
                  </Box>
                </Box>
              ))}
        </Box>
      </Box>
    </Modal>
  );
}
