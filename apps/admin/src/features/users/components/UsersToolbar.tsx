import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { userRoleSchema, type UserRole } from '@saas/domain';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

type UsersToolbarProps = {
  search: string;
  role: UserRole | undefined;
  onSearchChange: (search: string) => void;
  onRoleChange: (role: UserRole | undefined) => void;
};

export function UsersToolbar({ search, role, onSearchChange, onRoleChange }: UsersToolbarProps) {
  const [term, setTerm] = useState(search);
  const debouncedTerm = useDebouncedValue(term);

  useEffect(() => {
    if (debouncedTerm !== search) onSearchChange(debouncedTerm);
  }, [debouncedTerm, search, onSearchChange]);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ p: 2 }}>
      <TextField
        size="small"
        placeholder="Search by name or email"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
          htmlInput: { 'aria-label': 'Search users' },
        }}
      />
      <TextField
        select
        size="small"
        label="Role"
        value={role ?? ''}
        onChange={(event) => onRoleChange(userRoleSchema.safeParse(event.target.value).data)}
        sx={{ minWidth: { sm: 160 } }}
        fullWidth={false}
      >
        <MenuItem value="">All roles</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="user">User</MenuItem>
      </TextField>
    </Stack>
  );
}
