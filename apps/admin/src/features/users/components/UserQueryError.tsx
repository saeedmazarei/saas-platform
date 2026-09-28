import Button from '@mui/material/Button';
import { isApiError } from '@saas/api-client';
import { ErrorState } from '@saas/ui';
import { Link } from 'react-router';

export function UserQueryError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  if (isApiError(error) && error.status === 404) {
    return (
      <ErrorState
        title="User not found"
        message="This user does not exist or was removed."
        action={
          <Button component={Link} to="/users" variant="contained">
            Back to users
          </Button>
        }
      />
    );
  }
  return <ErrorState message={error.message} onRetry={onRetry} />;
}
