import { Router } from 'express'
const router = Router()
import prisma from '../database/client.js'

/* GET home page. */
router.get('/', function (req, res) {
  res.send('Hello World!')
})

// Esta rota será chamada por um cronjob para fazer
//Uma requisição no banco de dados e tentar manter
// o projeto do Supabase ativo
router.get('/keep-alive', async function (req, res) {
  try {
    // Uma simples requisição ao DB, obtendo o número
    // De usuários cadastrados
    await prisma.user.count()

    // HTTP 204: No Content
    res.status(204).end()
  } catch(error){
    console.error(error)

    // Http 500: Internal server error
    res.status(500).end()
  }
})

export default router
