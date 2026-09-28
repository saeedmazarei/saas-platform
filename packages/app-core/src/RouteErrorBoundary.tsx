import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ErrorState } from '@saas/ui';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  console.error(error);

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', mt: 8 }}>
      <ErrorState
        message="An unexpected error occurred. Reloading the page usually fixes it."
        action={
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        }
      />
    </Box>
  );
}

export function NotFoundPage() {
  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', mt: 8 }}>
      <ErrorState
        title="Page not found"
        message="The page you are looking for does not exist."
        action={
          <Button component={Link} to="/" variant="contained">
            Go home
          </Button>
        }
      />
    </Box>
  );
}