const conexao = require('../conexao')
const securePassword = require('secure-password')
const pwd = securePassword()
const jwt = require('jsonwebtoken')
const jwtSecret = require('../jwt_secret.js')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ "mensagem": "os campos são obrigatórios" })
    }

    try {
        const usuarioEncontrado = await conexao.query('select * from usuarios where email = $1', [email])

        if (usuarioEncontrado.rowCount > 0) {
            return res.status(400).json({ "mensagem": "email já cadastrado" })
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex')
        const usuarioCadastrado = await conexao.query('insert into usuarios (nome, email, senha) values ($1, $2, $3)', [nome, email, hash])

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(500).json('Não foi possível cadastrar o usuario')
        }

        const usuario = await conexao.query('select id, nome, email from usuarios where email = $1', [email])

        return res.status(200).json(usuario.rows[0])
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ "mensagem": "os campos são obrigatórios" })
    }

    try {
        const usuarioEncontrado = await conexao.query('select * from usuarios where email = $1', [email])

        if (usuarioEncontrado.rowCount === 0) {
            return res.status(400).json({ "mensagem": "Email ou senha incorretos" })
        }

        const usuario = usuarioEncontrado.rows[0]
        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, 'hex'))

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json('Email ou senha incorretos')
            case securePassword.VALID:
                break
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex')
                    await conexao.query('update usuarios set senha = $1 where email = $2', [hash, email])
                } catch {
                }
                break
        }

        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, jwtSecret)


        return res.status(200).json({
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email
            },
            "token": token
        })


    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })

    }
}

const dadosPerfilUsuario = async (req, res) => {
    const { usuario } = req

    try {
        return res.status(200).json(usuario)
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })
    }
}

const atualizarDadosPerfil = async (req, res) => {
    const { nome, email, senha } = req.body
    const { usuario } = req

    if (!nome || !email || !senha) {
        return res.status(400).json({ "mensagem": "Os campos são obrigatórios" })
    }

    try {
        const usuarioEncontrado = await conexao.query('select * from usuarios where email = $1 and id != $2', [email, usuario.id])

        if (usuarioEncontrado.rowCount > 0) {
            return res.status(400).json({ "mansagem": "email já cadastrado" })
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex')
        const usuarioCadastrado = await conexao.query('update usuarios set nome = $1, email = $2, senha = $3 where id = $4', [nome, email, hash, usuario.id])

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(500).json('Não foi possível atualizar o usuario')
        }

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })
    }


}

module.exports = {
    cadastrarUsuario,
    login,
    dadosPerfilUsuario,
    atualizarDadosPerfil
}