import { Checkbox, FormControlLabel } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import myfetch from '../../lib/myfetch'
import useConfirmDialog from '../../ui/useConfirmDialog'
import useNotification from '../../ui/useNotification'
import useWaiting from '../../ui/useWaiting'

export default function UserForm() {
  /*
    Por padrão, todos os campos do nosso formulário terão como
    valor inicial uma string vazia. A exceção é o campo birth_date
    que, devido ao funcionamento do componente DatePicker, deve
    iniciar valendo null.
  */
  const formDefaults = {
    fullname: '',
    username: '',
    email: '',
    confirm_email: '',
    password: '',
    confirm_password: '',
    is_admin: false
  }

  const [state, setState] = React.useState({
    user: { ...formDefaults },
    showPasswordFields: false,
    formModified: false,
    inputErrors: {},
  })
  const { user, showPasswordFields, formModified, inputErrors } = state

  const params = useParams()
  const navigate = useNavigate()

  const { askForConfirmation, ConfirmDialog } = useConfirmDialog()
  const { notify, Notification } = useNotification()
  const { showWaiting, Waiting } = useWaiting()
  
  function handleFieldChange(event) {
    const userCopy = { ...user }

    if(event.target.name === 'is_admin') {
      userCopy[event.target.name] = event.target.checked
    }
    else {
      userCopy[event.target.name] = event.target.value
    }
    
    setState({ ...state, user: userCopy, formModified: true })
  }

  async function handleFormSubmit(event) {
    event.preventDefault(); // Evita que a página seja recarregada
    showWaiting(true); // Exibe a tela de espera

    try {

      // Limpa as mensagens de erro
      setState({ ...state, inputErrors: {} })

      // Validação dos campos de senha e e-mail
      if(user.email !== user.confirm_email) {
        const msg = 'A confirmação do e-mail não coincide com o e-mail.'
        const inputErrorsCopy = { ...inputErrors, confirm_email: msg }
        setState({ ...state, inputErrors: inputErrorsCopy })
        throw new Error(msg)
      }

      // A validação da senha e da validação da senha somente será
      // processada se os respectivos campos estiverem visíveis
      if(showPasswordFields && user.password !== user.confirm_password) {
        const msg = 'A confirmação da senha não coincide com a senha.'
        const inputErrorsCopy = { ...inputErrors, confirm_password: msg }
        setState({ ...state, inputErrors: inputErrorsCopy })
        throw new Error(msg)
      }

      // Apaga os campos de confirmação do objeto que será enviado
      // ao back-end
      delete user.confirm_email
      delete user.confirm_password

      // Se os campos de senha não estiverem visíveis, apaga também
      // o campo password do objeto que será enviado ao back-end
      if(! showPasswordFields) delete user.password

      // Se houver parâmetro na rota, significa que estamos modificando
      // um usuário já existente. A requisição será enviada ao back-end
      // usando o método PUT
      if (params.id) await myfetch.put(`/users/${params.id}`, user)
      // Caso contrário, estamos criando um novo usuário, e enviaremos
      // a requisição com o método POST
      else await myfetch.post('/users', user)

      // Deu certo, vamos exbir a mensagem de feedback que, quando for
      // fechada, vai nos mandar de volta para a listagem de usuários
      notify('Item salvo com sucesso.', 'success', 4000, () => {
        navigate('..', { relative: 'path', replace: true })
      })
    } catch (error) {
      console.error(error)
      notify(error.message, 'error')
    } finally {
      // Desliga a tela de espera, seja em caso de sucesso, seja em caso de erro
      showWaiting(false)
    }
  }

  /*
    useEffect() que é executado apenas uma vez, no carregamento do componente.
    Verifica se a rota tem parâmetro. Caso tenha, significa que estamos vindo
    do componente de listagem por meio do botão de editar, e precisamos chamar
    a função loadData() para buscar no back-end os dados do usuário a ser editado
  */
  React.useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    showWaiting(true)
    try {

      let user = { ...formDefaults }

      // Se houver parâmetro na rota, precisamos buscar o usuário para
      // ser editado
      if(params.id) {
        user = await myfetch.get(`/users/${params.id}`)
        // Iniciamos o campo confirm_email com o mesmo valor de email
        user.confirm_email = user.email
      }

      /* Se não houver parâmetro na rota, significa que estamos
         cadastrando um novo usuário e, portanto, os campos de
         senha serão exibidos. Se houver parâmetro, estaremos
         editando um usuário e os campos de senha não serão
         exibidos por padrão */
      setState({ ...state, user, showPasswordFields: !(params.id) })

    } catch (error) {
      console.error(error)
      notify(error.message, 'error')
    } finally {
      showWaiting(false)
    }
  }

  async function handleBackButtonClick() {
    if (
      formModified &&
      !(await askForConfirmation(
        'Há informações não salvas. Deseja realmente sair?'
      ))
    )
      return; // Sai da função sem fazer nada

    // Navega de volta para a página de listagem
    navigate('..', { relative: 'path', replace: true })
  }

  return (
    <>
      <ConfirmDialog />
      <Notification />
      <Waiting />

      <Typography variant='h1' gutterBottom>
        {params.id ? `Editar usuáro #${params.id}` : 'Cadastrar novo usuário'}
      </Typography>

      <Box className='form-fields'>
        <form onSubmit={handleFormSubmit}>
          
          <TextField
            name="fullname"
            label="Nome completo"
            variant="filled"
            required
            fullWidth
            value={user.fullname}
            onChange={handleFieldChange}
            helperText={inputErrors?.fullname}
            error={inputErrors?.fullname}
          />

          <TextField
            name="username"
            label="Nome de usuário"
            variant="filled"
            required
            fullWidth
            value={user.username}
            onChange={handleFieldChange}
            helperText={inputErrors?.username}
            error={inputErrors?.username}
          />

          <TextField
            name="email"
            label="E-mail"
            variant="filled"
            required
            fullWidth
            value={user.email}
            onChange={handleFieldChange}
            helperText={inputErrors?.email}
            error={inputErrors?.email}
          />

          <TextField
            name="confirm_email"
            label="Conforme o e-mail"
            variant="filled"
            required
            fullWidth
            value={user.confirm_email}
            onChange={handleFieldChange}
            helperText={inputErrors?.confirm_email}
            error={inputErrors?.confirm_email}
          />

          <div class="MuiFormControl-root">
            <FormControlLabel
              control={
                <Checkbox
                  name="is_admin"
                  variant="filled"
                  value={user.is_admin}
                  checked={user.is_admin}
                  onChange={handleFieldChange}
                  color="primary"
                />
              }
              label="É admin?"
            />
          </div>

          { params.id && 
            <div class="MuiFormControl-root">
              <FormControlLabel
                control={
                  <Checkbox
                    name="change_password"
                    variant="filled"
                    value={showPasswordFields}
                    checked={showPasswordFields}
                    onChange={() => setState({ 
                      ...state, showPasswordFields: !showPasswordFields 
                    })}
                    color="primary"
                  />
                }
                label="Alterar senha"
              />
            </div>
          }

          { showPasswordFields && 
            <TextField
              name="password"
              label="Senha"
              variant="filled"
              required={showPasswordFields}
              fullWidth
              type="password"
              value={user.password}
              onChange={handleFieldChange}
              helperText={inputErrors?.password}
              error={inputErrors?.password}
            />
          }

          { showPasswordFields && 
            <TextField
              name="confirm_password"
              label="Confirme a senha"
              variant="filled"
              required={showPasswordFields}
              fullWidth
              type="password"
              value={user.confirm_password}
              onChange={handleFieldChange}
              helperText={inputErrors?.confirm_password}
              error={inputErrors?.confirm_password}
            />
          }

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <Button variant='contained' color='secondary' type='submit'>
              Salvar
            </Button>
            <Button variant='outlined' onClick={handleBackButtonClick}>
              Voltar
            </Button>
          </Box>

          {/*<Box sx={{ fontFamily: 'monospace', display: 'flex', width: '100%' }}>
            {JSON.stringify(user)}
          </Box>*/}
        </form>
      </Box>
    </>
  )
}