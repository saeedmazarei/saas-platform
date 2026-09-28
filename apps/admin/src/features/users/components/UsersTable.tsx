import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import type { User } from '@saas/domain';
import { NameAvatar } from '@saas/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Link as RouterLink, useNavigate } from 'react-router';
import { usersQueries } from '../api/queries';
import { PAGE_SIZE_OPTIONS } from '../hooks/useUsersListParams';
import { RoleChip, StatusChip } from './UserChips';

type UsersTableProps = {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

export function UsersTable({ users, total, page, pageSize, onPageChange, onPageSizeChange }: UsersTableProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const prefetch = (id: string) => void queryClient.prefetchQuery(usersQueries.detail(id));

  return (
    <>
      <TableContainer>
        <Table aria-label="Users">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(user.id)}
                onMouseEnter={() => prefetch(user.id)}
              >
                <TableCell>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <NameAvatar name={user.name} size={32} />
                    <Link
                      component={RouterLink}
                      to={user.id}
                      underline="hover"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {user.name}
                    </Link>
                  </Stack>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.email}</TableCell>
                <TableCell>
                  <RoleChip role={user.role} />
                </TableCell>
                <TableCell>
                  <StatusChip status={user.status} />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                  {dateFormat.format(new Date(user.createdAt))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={pageSize}
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        onPageChange={(_, zeroBasedPage) => onPageChange(zeroBasedPage + 1)}
        onRowsPerPageChange={(event) => onPageSizeChange(Number(event.target.value))}
      />
    </>
  );
}
