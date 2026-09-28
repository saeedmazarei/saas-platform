import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import { Link } from 'react-router';

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Button component={Link} to={to} size="small" startIcon={<ArrowBackIcon />} sx={{ mb: 1, ml: -1 }}>
      {label}
    </Button>
  );
}
