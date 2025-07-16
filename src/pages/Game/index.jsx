import React, { useEffect, useState } from "react";
import { ApiUrl } from "../../utils/var";
import Card from "../../components/Card";
import { Box, Typography, Button } from "@mui/material";
import { darken } from "@mui/material/styles";
import TransferirModal from "../../components/TransferirModal";
import CobrarModal from "../../components/CobrarModal";
import { Fab } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import TransferenciasHistorial from "../../components/TransferenciasHistorial";
import LeaveModal from "../../components/LeaveModal";
import { useRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ReqModal from "../../components/ReqModal";

export default function Game() {
  const [config, setConfig] = useState({});
  const [requests, setRequests] = useState([]);
  const [etapa, setEtapa] = useState(1);
  const [player, setPlayer] = useState();
  const moneyRef = useRef(null);
  const [players, setPlayers] = useState([]);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openCobrar, setOpenCobrar] = useState(false);
  const [openLeave, setOpenLeave] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openReqModal, setOpenReqModal] = useState(false);

  const handleCloseNotif = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNotif(false);
  };

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

  const getRequests = () => {
    fetch(`${ApiUrl}/requests/${player.name}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          console.log(data);
          // Suponiendo que data.requests contiene los cobros pendientes
          setRequests(data.requests); // Asegurate de tener un estado setRequests
          if (data.requests.length > 0) {
            setOpenReqModal(true);
          }
        }
      })
      .catch((err) => {
        console.error("Error al obtener solicitudes:", err);
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
        setConfig(data);
        localStorage.setItem("config", JSON.stringify(data));
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
        setConfig(JSON.parse(localStorage.getItem("config")));
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
        getRequests();
        fetch(`${ApiUrl}/player/${player.name}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              const nuevoDinero = data.player.money;

              if (
                moneyRef.current !== null &&
                moneyRef.current !== nuevoDinero
              ) {
                setOpenNotif(true);
              }

              moneyRef.current = nuevoDinero;
              setPlayer(data.player);
            }
          });
      }, 1000); // cada 2 segundos

      return () => clearInterval(interval);
    }
  }, [etapa]);
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#038a0a",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: darken("#038a0a", 0.2),
              },
            }}
            onClick={() => setOpenCobrar(true)}
          >
            Cobrar
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

      {etapa == 2 ? (
        <>
          <TransferenciasHistorial></TransferenciasHistorial>
        </>
      ) : null}
      <TransferirModal
        open={openTransfer}
        onClose={() => setOpenTransfer(false)}
        players={players}
        player={player}
      ></TransferirModal>

      <CobrarModal
        config={config}
        open={openCobrar}
        player={player}
        onClose={() => {
          setOpenCobrar(false);
        }}
      ></CobrarModal>

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
          Ahora tienes ${moneyRef.current}
        </Alert>
      </Snackbar>

      <LeaveModal open={openLeave} onClose={() => setOpenLeave(false)} />
      <ReqModal
        open={openReqModal}
        onClose={() => setOpenReqModal(false)}
        requests={requests}
        player={player}
      ></ReqModal>
    </>
  );
}
