import { useEffect, useState, useContext } from 'react'
import api from '../../services/api'
import { getItem } from '../../utils/storage'
import './style.css'
import Navbar from '../../components/Navbar'
import Transacao from '../../components/Transacao'
import Resumo from '../../components/Resumo'
import Adicionar from '../../components/Adicionar'
import Editar from '../../components/Editar'
import Perfil from '../../components/Perfil'
import crescente from '../../assets/crescente.svg'
import UserContext from '../../contexts/UserContext'


function Main() {

    const [showAddRegistro, setShowAddRegistro] = useState(false)
    const [showEditarRegistro, setShowEditarRegistro] = useState(false)
    const [showEditarPerfil, setShowEditarPerfil] = useState(false)
    const [ordem, setOrdem] = useState('')
    const [categorias, setCategorias] = useState()
    const [transacoesState, setTransacoesState] = useState([])
    const [entrada, setEntrada] = useState(0)
    const [saida, setSaida] = useState(0)
    const token = getItem('token')
    const usuario = getItem('usuario')

    async function listarTransacoes() {
        try {
            const response = await api.get('/transacao', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setTransacoesState(response.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        listarTransacoes()
        resumir()
        listarCategorias()
    }, [])


    async function deletarTransacao(id) {
        try {
            await api.delete(`/transacao/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            listarTransacoes()
            resumir()
            listarCategorias()
        } catch (error) {

        }
    }

    async function resumir() {
        try {
            const response = await api.get('/transacao/extrato', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setEntrada(response.data.entrada)
            setSaida(response.data.saida)

        } catch (error) {

        }
    }

    async function listarCategorias() {
        try {
            const response = await api.get('/categoria', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategorias(response.data)
        } catch (error) {

        }
    }

    function ordenar() {
        if (ordem === '' || ordem === 'decrescente') {
            const transacoesCrescente = [...transacoesState]
            transacoesCrescente.sort((a, b) => {
                return new Date(a.data).getTime() - new Date(b.data).getTime()
            })
            setOrdem('crescente')
            setTransacoesState(transacoesCrescente)
        } else {
            const transacoesDecrescente = [...transacoesState]
            transacoesDecrescente.sort((a, b) => {
                return new Date(b.data).getTime() - new Date(a.data).getTime()
            })
            setOrdem('decrescente')
            setTransacoesState(transacoesDecrescente)
        }
    }

    return (
        <UserContext.Provider value={{
            setShowEditarPerfil,
            deletarTransacao,
            listarTransacoes,
            token,
            setShowEditarRegistro,
            entrada,
            saida,
            resumir,
            showAddRegistro,
            setShowAddRegistro,
            categorias
        }}>
            <div className='main'>
                <Navbar
                    usuario={usuario.split(' ')[0]}
                />
                <div className='container-main'>
                    <div className='colunas'>
                        <span className='data-span' onClick={ordenar}>Data </span>
                        <img className='crescente' src={crescente} />
                        <span>Dia da semana</span>
                        <span>Descrição</span>
                        <span>Categoria</span>
                        <span>Valor</span>
                    </div>
                    <div className='transacoes'>
                        {transacoesState.map((item) => (
                            <Transacao
                                key={item.id}
                                transacao={item}
                                transacao_id={item.id}
                            />
                        ))}

                    </div>

                    <Resumo />
                    <button onClick={() => setShowAddRegistro(true)} className='add-registro'>Adicionar Registro</button>
                </div>

                {showAddRegistro &&
                    <Adicionar />}

                {showEditarRegistro &&
                    <Editar />}

                {showEditarPerfil &&
                    <Perfil />
                }
            </div>
        </UserContext.Provider>
    )
}

export default Main