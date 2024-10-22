import { Router } from 'express'
import prisma from '../database/client.js'
const router = Router()

/* GET home page. */
router.get('/', function (req, res) {
  res.send('Hello World!')
})

// Esta rota será chamada por um cronjob para fazer
// uma requisição ao banco de dados e tentar manter
// o projeto do Supabase ativo
router.get('/keep-alive', async function(req, res) {
  try {
    // Uma simples requisição ao BD, obtendo o número
    // de usuários cadastrados
    await prisma.user.count()

    // HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    console.error(error)

    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
})

export default router
