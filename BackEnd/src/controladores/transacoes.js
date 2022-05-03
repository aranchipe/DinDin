const conexao = require('../conexao')

const listarTransacoes = async (req, res) => {
    const { usuario } = req
    const { filtro } = req.query

    try {
        if (filtro) {
            let resposta = []
            for (let item of filtro) {
                const transacoes = await conexao.query(
                    ` 
                    select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
                    from transacoes t 
                    left join categorias c on c.id = t.categoria_id
                    where t.usuario_id = $1 and c.descricao = $2
                    `, [usuario.id, item]
                )
                resposta = [...resposta, ...transacoes.rows]
            }

            return res.json(resposta)
        }

        const transacoes = await conexao.query(
            ` 
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
            from transacoes t 
            left join categorias c on c.id = t.categoria_id
            where t.usuario_id = $1
            `, [usuario.id]
        )
        return res.json(transacoes.rows)

    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })
    }
}

const detalharTransacao = async (req, res) => {
    const { id } = req.params
    const { usuario } = req

    try {
        const transacao = await conexao.query(
            `
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t. categoria_id, c.descricao as categoria_nome
            from transacoes t
            left join categorias c on c.id = t.categoria_id
            where t.usuario_id = $1 and t.id = $2
            `, [usuario.id, id]
        )

        if (transacao.rowCount === 0) {
            return res.status(404).json({ "mensagem": "transação não encontrada" })
        }

        return res.status(200).json(transacao.rows[0])
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })
    }
}

const cadastrarTransacao = async (req, res) => {
    const { usuario } = req
    const { tipo, descricao, valor, data, categoria_id } = req.body

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ "mensagem": "todos os campos são obrigatórios" })
    }

    try {
        const categoriaEncontrada = await conexao.query('select * from categorias where id = $1', [categoria_id])

        if (categoriaEncontrada.rowCount === 0) {
            return res.status(404).json({ "mensagem": "A categoria não existe" })
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ "mensagem": "por favor informe se o tipo é de 'entrada' ou 'saida'" })
        }

        const novaTransacao = await conexao.query(`insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id) 
        values ($1, $2, $3, $4, $5, $6)`, [tipo, descricao, valor, data, categoria_id, usuario.id])

        if (novaTransacao.rowCount === 0) {
            return res.status(500).json({ "mensagem": "não foi possível cadastrar a transação" })
        }

        const transacoes = await conexao.query(
            `
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
            from transacoes t 
            left join categorias c on c.id = t.categoria_id
            where t.usuario_id = $1
            `, [usuario.id]
        )

        return res.status(200).json(transacoes.rows[transacoes.rows.length - 1])
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })
    }


}

const atualizarTransacao = async (req, res) => {
    const { usuario } = req
    const { id } = req.params
    const { tipo, descricao, valor, data, categoria_id } = req.body

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ "mensagem": "todos os campos são obrigatórios" })
    }

    try {

        const transacaoEncontrada = await conexao.query(
            `
            select * from transacoes where id = $1 and usuario_id = $2
            `, [id, usuario.id])

        if (transacaoEncontrada.rowCount === 0) {
            return res.status(404).json({ "mensagem": "Transação não existe ou pertence a outro usuário" })
        }

        const categoriaEncontrada = await conexao.query('select * from categorias where id = $1', [categoria_id])

        if (categoriaEncontrada.rowCount === 0) {
            return res.status(404).json({ "mensagem": "A categoria não existe" })
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ "mensagem": "por favor informe se o tipo é de 'entrada' ou 'saida'" })
        }

        const transacaoAtualizada = await conexao.query(
            `
            update transacoes set tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5 where id = $6
            `, [tipo, descricao, valor, data, categoria_id, id]
        )

        if (transacaoAtualizada.rowCount === 0) {
            return res.status(500).json({ "mensagem": "Não foi possível atualizar a transação" })
        }

        return res.status(200).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })
    }


}

const excluirTransacao = async (req, res) => {
    const { usuario } = req
    const { id } = req.params
    try {
        const transacaoEncontrada = await conexao.query(
            `
            select * from transacoes where id = $1 and usuario_id = $2
            `, [id, usuario.id])

        if (transacaoEncontrada.rowCount === 0) {
            return res.status(404).json({ "mensagem": "Transação não existe ou pertence a outro usuário" })
        }

        const transacaoExcluida = await conexao.query('delete from transacoes where id = $1 and usuario_id = $2', [id, usuario.id])

        return res.status(200).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })
    }
}

const extrato = async (req, res) => {
    const { usuario } = req

    try {
        const saida = await conexao.query("select sum(valor) from transacoes where usuario_id = $1 and tipo = 'saida'", [usuario.id])
        const entrada = await conexao.query("select sum(valor) from transacoes where usuario_id = $1 and tipo = 'entrada'", [usuario.id])
        return res.status(200).json({
            saida: saida.rows[0].sum,
            entrada: entrada.rows[0].sum
        })


    } catch (error) {
        return res.status(500).json({ "mensagem": "erro desconhecido" + error.message })
    }
}
module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    extrato
}
