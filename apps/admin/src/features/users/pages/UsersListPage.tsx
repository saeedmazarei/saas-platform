import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ErrorState, PageHeader, PageLoader } from '@saas/ui';
import { UsersTable } from '../components/UsersTable';
import { UsersToolbar } from '../components/UsersToolbar';
import { useUsersList } from '../hooks/api/useUsersList';
import { useUsersListParams } from '../hooks/useUsersListParams';

export function UsersListPage() {
  const [params, updateParams] = useUsersListParams();
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useUsersList(params);

  return (
    <>
      <PageHeader title="Users" subtitle="All user accounts on the platform." />
      <Paper sx={{ overflow: 'hidden' }}>
        <UsersToolbar
          search={params.search ?? ''}
          role={params.role}
          onSearchChange={(search) => updateParams({ search })}
          onRoleChange={(role) => updateParams({ role })}
        />
        <LinearProgress sx={{ visibility: isPlaceholderData ? 'visible' : 'hidden' }} />
        {isPending ? (
          <PageLoader />
        ) : isError ? (
          <ErrorState message={error.message} onRetry={() => void refetch()} />
        ) : data.items.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
            No users match your filters.
          </Typography>
        ) : (
          <UsersTable
            users={data.items}
            total={data.total}
            page={data.page}
            pageSize={data.pageSize}
            onPageChange={(page) => updateParams({ page })}
            onPageSizeChange={(pageSize) => updateParams({ pageSize })}
          />
        )}
      </Paper>
    </>
  );
}
