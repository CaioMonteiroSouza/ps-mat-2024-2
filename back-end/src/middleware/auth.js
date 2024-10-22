/*
  Este middleware intercepta todas as rotas e verifica
  se um token de autenticação foi enviado junto com a 
  request
*/
import jwt from 'jsonwebtoken'

/*
  Algumas rotas, como /user/login, poderão ser acessadas
  sem a necessidade de apresentação do token
*/
const bypassRoutes = [
  { url: '/users/login', method: 'POST' },
  { url: '/keep-alive', method: 'GET' }
]

export default function(req, res, next) {

  /*
    Verificamos se a rota interceptada corresponde a alguma das
    exceções cadastradas acima. Sendo o caso, permite continuar
    sem verificar a autorização
  */
  for(let route of bypassRoutes) {
    if(route.url === req.url && route.method === req.method) {
      next()
      return
    }
  }

  /* PROCESSO DE VERIFICAÇÃO DO TOKEN DE AUTORIZAÇÃO */
  let token = null

  // 1. PROCURA O TOKEN EM UM COOKIE
  token = req.cookies[process.env.AUTH_COOKIE_NAME]

  // 2. SE O TOKEN NÃO FOR ENCONTRADO EM UM COOKIE, ENTÃO
  //    PROCURA NO HEADER DE AUTENTICAÇÃO
  if(! token) {
    // O token é enviado por meio do cabeçalho 'authorization'
    // da request
    const authHeader = req.headers['authorization']

    console.log({ HEADERS: req.headers })

    // O cabeçalho 'authorization' não existe, retorna
    // HTTP 403: Forbidden
    if(! authHeader) {
      console.error('*** ERRO: acesso negado por falta de cabeçalho de autorização ***')
      return res.status(403).end()
    }

    // O cabeçalho de autorização tem o formato "Bearer XXXXXXX",
    // onde XXXXXXX é o token. Portanto, precisamos dividir esse
    // cabeçalho em duas partes, cortando-o onde está o caracter de
    // espaço, e aproveitar apenas a segunda parte
    token = authHeader.split(' ')[1]
  }

  // Validação do token
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {

    // Token inválido ou expirdo, retorna
    // HTTP 403: Forbidden
    if(error) {
      console.error('*** ERRO: acesso negado; token inválido ou expirado ***')
      return res.status(403).end()
    }

    // Se chegamos até aqui, o token está OK e temos as informações
    // do usuário logado no parâmetro 'user'. Vamos guardar isso
    // dentro do 'req' para usar depois
    req.authUser = user

    // Continua para a rota normal
    next()

  })

}

