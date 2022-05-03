const express = require('express');
const { listarCategorias } = require('./controladores/categorias');
const { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao, extrato } = require('./controladores/transacoes');
const { cadastrarUsuario, login, dadosPerfilUsuario, atualizarDadosPerfil } = require('./controladores/usuarios');
const { verificarLogin } = require('./intermediarios/verificarLogin');
const rotas = express()

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', login)

rotas.use(verificarLogin)

rotas.get('/usuario', dadosPerfilUsuario)
rotas.put('/usuario', atualizarDadosPerfil)

rotas.get('/categoria', listarCategorias)

rotas.get('/transacao', listarTransacoes)
rotas.get('/transacao/extrato', extrato)
rotas.get('/transacao/:id', detalharTransacao)
rotas.post('/transacao', cadastrarTransacao)
rotas.put('/transacao/:id', atualizarTransacao)
rotas.delete('/transacao/:id', excluirTransacao)







module.exports = rotas
