import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@saas/i18n";

export function PageLoader({ fullScreen = false }: { fullScreen?: boolean }) {
  const { t } = useTranslation("ui");

  return (
    <Box
      role="status"
      aria-label={t("loading")}
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
