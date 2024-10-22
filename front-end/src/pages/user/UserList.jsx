import AddBoxIcon from '@mui/icons-material/AddBox'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { Link } from 'react-router-dom'
import myfetch from '../../lib/myfetch'
import useConfirmDialog from '../../ui/useConfirmDialog'
import useNotification from '../../ui/useNotification'
import useWaiting from '../../ui/useWaiting'

export default function UserList() {
  
  const columns = [
    {
      field: 'id',
      headerName: 'Cód.',
      type: 'number',
      width: 80,
    },
    {
      field: 'fullname',
      headerName: 'Nome completo',
      width: 200,
    },
    {
      field: 'username',
      headerName: 'Nome de usuário',
      width: 150,
    },

    {
      field: 'email',
      headerName: 'E-mail',
      width: 200,
    },
    {
      field: 'is_admin',
      headerName: 'É admin?',
      width: 100,
      renderCell: (value) => (value.row.is_admin ? 'SIM' : '')
    },
    {
      field: '_edit',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      sortable: 'false',
      width: 90,
      renderCell: (params) => (
        <Link to={`./${params.id}`}>
          <IconButton aria-label='Editar'>
            <EditIcon />
          </IconButton>
        </Link>
      ),
    },
    {
      field: '_delete',
      headerName: 'Excluir',
      headerAlign: 'center',
      align: 'center',
      sortable: 'false',
      width: 90,
      renderCell: (params) => (
        <IconButton
          aria-label='Excluir'
          onClick={() => handleDeleteButtonClick(params.id)}
        >
          <DeleteForeverIcon color='error' />
        </IconButton>
      ),
    },
  ]

  const [state, setState] = React.useState({
    users: [],
  })
  const { users } = state

  const { askForConfirmation, ConfirmDialog } = useConfirmDialog()
  const { notify, Notification } = useNotification()
  const { showWaiting, Waiting } = useWaiting()

  /*
    useEffect() com vetor de dependências vazio irá ser executado
    apenas uma vez, durante o carregamento inicial do componente
  */
  React.useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    showWaiting(true)
    try {
      const result = await myfetch.get('/users')
      setState({
        ...state,
        users: result,
      })
    } catch (error) {
      console.error(error)
      notify(error.message, 'error')
    } finally {
      showWaiting(false)
    }
  }

  async function handleDeleteButtonClick(deleteId) {
    if (await askForConfirmation('Deseja realmente excluir este item?')) {
      // Exibe a tela de espera
      showWaiting(true)
      try {
        await myfetch.delete(`/users/${deleteId}`)

        // Recarrega os dados da grid
        fetchData()

        notify('Item excluído com sucesso.')
      } catch (error) {
        console.log(error)
        notify(error.message, 'error')
      } finally {
        showWaiting(false)
      }
    }
  }

  return (
    <>
      <Waiting />
      <Notification />
      <ConfirmDialog />

      <Typography variant='h1' gutterBottom>
        Listagem de usuários
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          mb: 2, // marginBottom
        }}
      >
        <Link to='./new'>
          <Button
            variant='contained'
            size='large'
            color='secondary'
            startIcon={<AddBoxIcon />}
          >
            Novo Usuário
          </Button>
        </Link>
      </Box>

      <Paper elevation={10}>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
          />
        </Box>
      </Paper>
    </>
  )
}