import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export function PageLoader({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <Box
      role="status"
      aria-label="Loading"
      sx={{
        display: "grid",
        placeItems: "center",
        minHeight: fullScreen ? "100vh" : 240,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
