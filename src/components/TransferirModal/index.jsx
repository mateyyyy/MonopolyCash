import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Card from "../Card";
import { ApiUrl } from "../../utils/var";

export default function TransferirModal({ open, onClose, players, player }) {
  const [playerTransfer, setPlayerTransfer] = useState("");
  const [amount, setAmount] = useState();
  const [etapa, setEtapa] = useState(1);

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
  const transfer = () => {
    fetch(`${ApiUrl}/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: player.name,
        to: playerTransfer,
        amount: Number(amount),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status == "success") {
          onClose();
          setEtapa(1);
          setAmount();
        }
        if (data.status == "error") {
          alert(data.message);
        }
      });
  };

  const selectPlayer = (player) => {
    setEtapa(2);
    setPlayerTransfer(player.name);
  };
  useState();
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setEtapa(1);
        setPlayerTransfer("");
      }}
    >
      <Box sx={style}>
        {etapa == 1 ? (
          <>
            <Typography
              variant="h6"
              sx={{
                marginBottom: "3rem",
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              ¿A quien desea transferir?
            </Typography>
            <Box
              sx={{
                gap: "1rem",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {players.map((player) => (
                <Card
                  player={player}
                  key={player.name}
                  selectPlayer={selectPlayer}
                ></Card>
              ))}
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "center",
              }}
            >
              <IconButton
                onClick={() => setEtapa(1)}
                sx={{
                  color: "white",
                  mr: 1,
                  width: "10px",
                  height: "10px",
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                ¿Cuánto desea transferir?
              </Typography>
            </Box>
            <TextField
              type="number"
              variant="outlined"
              placeholder="Ingrese el monto"
              sx={{ mb: 2 }}
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "borrar", 0, "←"].map(
                (key, index) => (
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
                )
              )}
            </Grid>
            <Button
              onClick={transfer}
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1rem",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#43a047",
                },
              }}
            >
              Enviar
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}
