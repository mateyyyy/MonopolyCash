import React, { useEffect, useState } from "react";
import { ApiUrl } from "../../utils/var";
import Card from "../../components/Card";
import { Box, Typography, Button } from "@mui/material";
import { darken } from "@mui/material/styles";
import TransferirModal from "../../components/TransferirModal";
import { Fab } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LeaveModal from "../../components/LeaveModal";
export default function Game() {
  const [config, setConfig] = useState({});
  const [etapa, setEtapa] = useState(1);
  const [player, setPlayer] = useState();
  const [players, setPlayers] = useState([]);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openLeave, setOpenLeave] = useState(false);

  const selectPlayer = (player) => {
    fetch(`${ApiUrl}/config/pick`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: player.name,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status == "success") {
          localStorage.setItem("player", JSON.stringify(player));
          setPlayer(player);

          const updatedPlayers = players.filter(
            (pl) => pl.name !== player.name
          );
          setPlayers(updatedPlayers);
          localStorage.setItem("players", JSON.stringify(updatedPlayers));

          setEtapa(2);
        }
      });
  };

  const getConfig = () => {
    fetch(`${ApiUrl}/config`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setConfig(data);
        localStorage.setItem("players", JSON.stringify(data.players));
        setPlayers(data.players);
      });
  };
  useEffect(() => {
    if (etapa == 1) {
      const tempData = localStorage.getItem("player");
      if (tempData !== null) {
        setEtapa(2);
        setPlayer(JSON.parse(tempData));
        setPlayers(JSON.parse(localStorage.getItem("players")));
        return;
      }
      const interval = setInterval(() => {
        getConfig();
      }, 300);

      return () => clearInterval(interval);
    }
  }, [etapa]);

  useEffect(() => {
    if (etapa === 2) {
      const interval = setInterval(() => {
        fetch(`${ApiUrl}/player/${player.name}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              setPlayer(data.player);
            }
            console.log(data);
          });
      }, 1000); // cada 2 segundos

      return () => clearInterval(interval);
    }
  }, [etapa]);

  useEffect(() => {
    console.log(config);
  }, [config]);
  return (
    <>
      {etapa == 1 ? (
        <>
          <Typography
            variant="h3"
            sx={{
              marginBottom: "3rem",
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Elegí tu jugador
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: ".5rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {config.players ? (
              config.players.map(
                (player) =>
                  player.picked == false && (
                    <Card
                      key={player.name}
                      player={player}
                      {...player}
                      selectPlayer={selectPlayer}
                    />
                  )
              )
            ) : (
              <Typography>Cargando...</Typography>
            )}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: 3,
            backgroundColor: "#1e1e1e",
            borderRadius: 4,
            boxShadow: 3,
            maxWidth: 300,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              backgroundColor: player.color,
              width: 150,
              height: 150,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              {player.name}
            </Typography>
          </Box>

          <Typography variant="body1">
            💰 Dinero disponible: <b>${player.money}</b>
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: player.color,
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: darken(player.color, 0.2),
              },
            }}
            onClick={() => setOpenTransfer(true)}
          >
            Transferir
          </Button>
          <Fab
            aria-label="leave"
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              backgroundColor: "#d32f2f", // rojo más estilizado de la paleta MUI
              color: "#fff",
              "&:hover": {
                backgroundColor: "#b71c1c", // rojo más oscuro al hacer hover
              },
            }}
            onClick={() => setOpenLeave(true)}
          >
            <LogoutIcon />
          </Fab>
        </Box>
      )}
      <TransferirModal
        open={openTransfer}
        onClose={() => setOpenTransfer(false)}
        players={players}
        player={player}
      ></TransferirModal>

      <LeaveModal open={openLeave} onClose={() => setOpenLeave(false)} />
    </>
  );
}
