import { Box, Typography, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ApiUrl } from "../../utils/var";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRef } from "react";

export default function TransferenciasHistorial() {
  const [transfers, setTransfers] = useState([]);
  const [openNotif, setOpenNotif] = useState(false);
  const transfersRef = useRef([]);

  const handleCloseNotif = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNotif(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${ApiUrl}/transfers`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            // Compara con la referencia persistente
            if (data.transfers.length > transfersRef.current.length) {
              setOpenNotif(true);
            }
            // Actualiza referencia y estado
            transfersRef.current = data.transfers;
            setTransfers(data.transfers);
          }
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#1E1E1E",
        borderRadius: "12px",
        marginTop: "1rem",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          marginBottom: "3rem",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Transferencias
      </Typography>
      <Box
        sx={{
          gap: "1rem",
          padding: "1rem",
          maxHeight: "200px",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {[...transfers].reverse().map((transfer, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              marginBottom: "3rem",
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {`${transfer.from} → ${transfer.to}: $${
              transfer.amount
            } (${new Date(transfer.timestamp).toLocaleString()})`}
          </Typography>
        ))}
      </Box>
      <Snackbar
        open={openNotif}
        autoHideDuration={2000}
        onClose={handleCloseNotif}
      >
        <Alert
          onClose={handleCloseNotif}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          ¡Nueva transferencia!
        </Alert>
      </Snackbar>
    </Box>
  );
}
