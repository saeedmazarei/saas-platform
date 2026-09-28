import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@saas/i18n";
import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  message?: ReactNode;
  onRetry?: () => void;
  action?: ReactNode;
};

export function ErrorState({ title, message, onRetry, action }: ErrorStateProps) {
  const { t } = useTranslation("ui");

  return (
    <Paper role="alert" sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        {title ?? t("errorTitle")}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: onRetry || action ? 2 : 0 }}>
        {message ?? t("errorMessage")}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          {t("tryAgain")}
        </Button>
      )}
      {action}
    </Paper>
  );
}
