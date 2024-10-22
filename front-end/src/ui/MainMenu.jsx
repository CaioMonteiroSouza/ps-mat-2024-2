import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom'
import AuthUserContext from '../contexts/AuthUserContext'

export default function MainMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { authUser } = React.useContext(AuthUserContext)

  const menuItems = [
    {
      children: 'Página inicial',
      to: '/',
      divider: true
    },
    {
      children: 'Listagem de veículos',
      to: '/cars',
      divider: false,
      requiresAuth: true
    },
    {
      children: 'Cadastro de veículos',
      to: '/cars/new',
      divider: true,
      requiresAuth: true
    },
    {
      children: 'Listagem de clientes',
      to: '/customers',
      divider: false,
      requiresAuth: true
    },
    {
      children: 'Cadastro de clientes',
      to: '/customers/new',
      divider: true,
      requiresAuth: true
    },
    {
      children: 'Cadastro de usuários',
      to: '/users',
      divider: true,
      requiresAuth: true
    },
    {
      children: 'Sobre o autor',
      to: '/about',
      divider: false
    },
  ]

  return (
    <div>
      <IconButton 
        edge="start" 
        color="inherit" 
        aria-label="menu" 
        sx={{ mr: 2 }}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {
          menuItems.map(item => {
            if(!(item?.requiresAuth) || (item?.requiresAuth && authUser)) {
              return <MenuItem 
                key={item.to} 
                onClick={handleClose} 
                component={Link}
                to={item.to}
                divider={item.divider}
              >
                {item.children}
              </MenuItem>
            }
            else return []
          })
        }
      </Menu>
    </div>
  );
}


