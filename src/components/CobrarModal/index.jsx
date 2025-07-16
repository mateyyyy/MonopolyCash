import { Modal, Box, Button, TextField, Grid } from "@mui/material";
import React, { useState } from "react";
import { ApiUrl } from "../../utils/var";

export default function CobrarModal({ open, onClose, config, player }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "80%", sm: "100%" },
    maxWidth: { xs: "none", sm: 400 },
    bgcolor: "#121212",
    borderRadius: "8px",
    boxShadow: 24,
    p: 1.5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "white",
  };

  const receive = () => {
    fetch(`${ApiUrl}/receive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Banco",
        to: player.name,
        amount: Number(amount),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status == "success") {
          onClose();

          setAmount();
        }
        if (data.status == "error") {
          alert(data.message);
        }
      });
  };

  const receiveBonus = () => {
    fetch(`${ApiUrl}/receive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Banco",
        to: player.name,
        amount: Number(config.passGoBonus),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status == "success") {
          onClose();
          setAmount();
        }
        if (data.status == "error") {
          alert(data.message);
        }
      });
  };

  const [amount, setAmount] = useState();

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            paddingY: 1.5,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
            "&:hover": {
              backgroundColor: "#388e3c",
              boxShadow: "0 5px 10px rgba(0,0,0,0.4)",
            },
          }}
          onClick={() => {
            receiveBonus();
          }}
        >
          Cobrar paso por salida + ${config.passGoBonus}
        </Button>

        <TextField
          type="number"
          variant="outlined"
          placeholder="Ingrese monto personalizado"
          sx={{ mb: 2, marginTop: "1rem" }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            sx: {
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
            },
          }}
        />

        <Grid container spacing={1} justifyContent="center" sx={{ mb: 3 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "borrar", 0, "←"].map((key, index) => (
            <Grid size={4} key={index}>
              {key === "borrar" ? (
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: "white",
                    borderColor: "#666",
                    minHeight: "56px",
                  }}
                  onClick={() => setAmount("")}
                >
                  Borrar
                </Button>
              ) : key === "←" ? (
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: "white",
                    borderColor: "#666",
                    minHeight: "56px",
                  }}
                  onClick={() =>
                    setAmount((prev) => (prev ? prev.slice(0, -1) : ""))
                  }
                >
                  ←
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: "#333",
                    color: "white",
                    fontSize: "1.2rem",
                    minHeight: "56px",
                  }}
                  onClick={() =>
                    setAmount((prev) => (prev ? prev + key : String(key)))
                  }
                >
                  {key}
                </Button>
              )}
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            paddingY: 1.5,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
            "&:hover": {
              backgroundColor: "#388e3c",
              boxShadow: "0 5px 10px rgba(0,0,0,0.4)",
            },
          }}
          onClick={() => {
            receive();
          }}
        >
          Cobrar
        </Button>
      </Box>
    </Modal>
  );
}
