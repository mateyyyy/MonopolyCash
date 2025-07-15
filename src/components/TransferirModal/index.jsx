import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
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
    width: "100%",
    maxWidth: 400,
    mx: 2,
    bgcolor: "#121212",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
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
        console.log(data);
        if (data.status == "success") {
          console.log("Transferencia hecha");
          onClose();
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
              sx={{ mb: 3 }}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              InputProps={{
                sx: {
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                },
              }}
            />
            <Button onClick={transfer}>Enviar</Button>
          </>
        )}
      </Box>
    </Modal>
  );
}
