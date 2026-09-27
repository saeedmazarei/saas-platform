import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  message?: ReactNode;
  onRetry?: () => void;
  action?: ReactNode;
};

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <Paper role="alert" sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: onRetry || action ? 2 : 0 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Try again
        </Button>
      )}
      {action}
    </Paper>
  );
}
