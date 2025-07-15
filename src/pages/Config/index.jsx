import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Divider,
  Modal,
  IconButton,
} from "@mui/material";
import { ApiUrl } from "../../utils/var";
import { SketchPicker } from "react-color";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
export default function Config() {
  const [startMoney, setStartMoney] = useState(1500);
  const [passGoBonus, setPassGoBonus] = useState(200);
  const [showPalette, setShowPalette] = useState(false);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ff8826");
  const navigate = useNavigate();
  const handleSubmit = () => {
    fetch(`${ApiUrl}/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        passGoBonus,
        startMoney,
        players,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status == "success") {
          console.log("entra aca");
          navigate("/game");
        }
      })
      .catch((error) => {
        console.error("Error de red o inesperado:", error);
      });
  };

  const styleInput = {
    input: { color: "#d6d6d6" },
    label: { color: "#d6d6d6" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#d6d6d6",
      },
      "&:hover fieldset": {
        borderColor: "#e0e0e0",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fafafa",
      },
    },
  };
  const addPlayer = (e) => {
    e.preventDefault();
    if (name.trim() !== "") {
      setPlayers((prev) => [...prev, { name, color }]);
      setName("");
    }
    setColor(randomHexColor());
  };
  const deletePlayer = (name) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.name !== name)
    );
  };

  const randomHexColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")
    );
  };
  return (
    <Box
      sx={{
        gap: "2rem",
        backgroundColor: "#121212",
        borderRadius: "1rem",
        padding: "2rem",
      }}
    >
      {" "}
      {/* ojo: gap en Box funciona solo si es contenedor flex/grid */}
      <Typography
        variant="h3"
        sx={{
          marginBottom: "3rem",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Monopoly Cash
      </Typography>
      <Typography
        variant="h4"
        sx={{
          marginBottom: "3rem",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Configuracion
      </Typography>
      <Grid
        container
        spacing={2}
        gap={"1rem"}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid size={12} sx={{ color: "white" }}>
          <Box sx={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <TextField
              label="Dinero inicial"
              required
              variant="outlined"
              color="white"
              name="startMoney"
              sx={styleInput}
              value={startMoney}
              onChange={(e) => setStartMoney(e.target.value)}
            />
            <TextField
              label="Dinero por vuelta"
              required
              variant="outlined"
              color="white"
              name="startMoney"
              sx={styleInput}
              value={passGoBonus}
              onChange={(e) => setPassGoBonus(e.target.value)}
            />
          </Box>
        </Grid>
        <Grid
          component={"form"}
          size={12}
          sx={{
            color: "white",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
          onSubmit={(e) => addPlayer(e)}
        >
          <Box
            component={"button"}
            type="button"
            sx={{
              backgroundColor: color,
              cursor: "pointer",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
            onClick={() => setShowPalette(!showPalette)}
          />
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <Box sx={{ position: "absolute" }}>
              <Modal
                open={showPalette}
                onClose={() => setShowPalette(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    borderRadius: "8px",
                    boxShadow: 24,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <SketchPicker
                    color={color}
                    onChange={(c) => setColor(c.hex)}
                  />
                </Box>
              </Modal>
            </Box>
            <TextField
              label="Nombre del jugador"
              variant="outlined"
              color="white"
              name="startMoney"
              sx={styleInput}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Box
              component={"button"}
              label="Agregar jugador"
              type="submit"
              sx={{ backgroundColor: "#1A1A1A" }}
            >
              Agregar jugador
            </Box>
          </Box>
        </Grid>
        <Grid size xs={12} sm={6} sx={{ maxHeight: "200px", overflow: "auto" }}>
          {players.map((player) => {
            return (
              <>
                <Box
                  key={player.name}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component={"div"}
                    sx={{
                      backgroundColor: player.color,
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                  />

                  <Typography variant="h6">{player.name}</Typography>
                  <IconButton
                    sx={{
                      color: "white",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                    onClick={() => {
                      deletePlayer(player.name);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: "white" }}></Divider>
              </>
            );
          })}
        </Grid>
      </Grid>
      <Grid size={6} sx={{}}>
        <Box component={"button"} label="Empezar" onClick={handleSubmit}>
          Empezar
        </Box>
      </Grid>
    </Box>
  );
}
