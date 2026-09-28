import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTranslation } from '@saas/i18n';
import { useState } from 'react';
import { NameAvatar } from './NameAvatar';

export type UserMenuLink = { label: string; href: string };

type UserMenuProps = {
  name: string;
  email: string;
  links?: UserMenuLink[];
  onLogout: () => void;
};

export function UserMenu({ name, email, links = [], onLogout }: UserMenuProps) {
  const { t } = useTranslation('ui');
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);

  return (
    <>
      <Button
        color="inherit"
        onClick={(event) => setAnchor(event.currentTarget)}
        startIcon={<NameAvatar name={name} size={28} />}
        aria-haspopup="menu"
        aria-label={t('accountMenu')}
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          {name}
        </Box>
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2">{name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
        </Box>
        <Divider />
        {links.map((link) => (
          <MenuItem key={link.href} component="a" href={link.href} onClick={close}>
            {link.label}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            close();
            onLogout();
          }}
        >
          {t('signOut')}
        </MenuItem>
      </Menu>
    </>
  );
}