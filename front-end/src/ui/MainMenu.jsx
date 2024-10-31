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

  /*
    authLevel para o menu principal:
    * Nível 0: o menu é sempre exibido, independentemente de haver
               usuário autenticado
    * Nível 1: o menu será exibido apenas se houver usuário autenticado
    * Nível 2: o menu será exibido apenas se o usuário autenticado for
    *          administrador       
  */

  const menuItems = [
    {
      children: 'Página inicial',
      to: '/',
      divider: true,
      authLevel: 0
    },
    {
      children: 'Listagem de veículos',
      to: '/cars',
      divider: false,
      authLevel: 1
    },
    {
      children: 'Cadastro de veículos',
      to: '/cars/new',
      divider: true,
      authLevel: 1
    },
    {
      children: 'Listagem de clientes',
      to: '/customers',
      divider: false,
      authLevel: 1
    },
    {
      children: 'Cadastro de clientes',
      to: '/customers/new',
      divider: true,
      authLevel: 1
    },
    {
      children: 'Cadastro de usuários',
      to: '/users',
      divider: true,
      // Item do menu só aparece se o usuário logado for administrador
      authLevel: 2
    },
    {
      children: 'Sobre o autor',
      to: '/about',
      divider: false,
      authLevel: 0
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
            if(
              (item.authLevel === 0) ||
              (item.authLevel === 1 && authUser) ||
              (item.authLevel === 2 && authUser?.is_admin)
            ) {
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


