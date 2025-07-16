// components/Card.jsx
import { Box, Typography } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

export default function Card({ player, selectPlayer }) {
  return (
    <Box
      component="button"
      sx={{
        width: "150px",
        height: "150px",
        backgroundColor: player.color,
        border: "none",
        borderRadius: "12px",
        color: "white",
        fontWeight: "bold",
        fontSize: "1.2rem",
        cursor: "pointer",
        boxShadow: 3,
        "&:hover": {
          boxShadow: 6,
          transform: "scale(1.05)",
        },
        transition: "all 0.2s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
      }}
      onClick={selectPlayer ? () => selectPlayer(player) : undefined}
    >
      {player.name == "Banco" ? (
        <AccountBalanceIcon sx={{ fontSize: 60 }} />
      ) : (
        player.name
      )}
    </Box>
  );
}
