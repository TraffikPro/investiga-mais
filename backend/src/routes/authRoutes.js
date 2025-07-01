const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const authController = require('../controllers/authController')
const recuperacaoController = require('../controllers/recuperacaoController')
const { sendSuccess } = require('../utils/sendResponse')

// ✅ Verificação de autenticação (usada no hook useAuth)
router.get('/verify', verifyToken, (req, res) => {
  return sendSuccess(res, {
    usuario: req.user
  }, 'Usuário autenticado')
})

// 🔐 Login
router.post('/login', authController.login)

// 🔓 Logout
router.get('/logout', authController.logout)

// 🔁 Recuperação de senha
router.post('/recuperar', recuperacaoController.recuperarSenha)
router.post('/resetar-senha', recuperacaoController.resetarSenha)

module.exports = router
