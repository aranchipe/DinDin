import './style.css'
import close from '../../assets/close.svg'
import { useEffect, useState, useContext } from 'react'
import api from '../../services/api'
import { getItem, removeItem } from '../../utils/storage'
import UserContext from '../../contexts/UserContext'

function Editar() {

    const { setShowEditarRegistro, categorias, token, listarTransacoes, resumir } = useContext(UserContext)

    const [tipo, setTipo] = useState('saida')
    const [form, setForm] = useState({ valor: '', categoria_id: '', data: '', descricao: '' })
    const [categoriaId, setCategoriaId] = useState(0)

    useEffect(() => {
        detalharTransacao()
    }, [])

    const id = getItem('transacao_id')

    async function detalharTransacao() {
        try {
            const response = await api.get(`/transacao/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setForm({
                valor: response.data.valor,
                categoria_id: response.data.categoria_nome,
                data: response.data.data,
                descricao: response.data.descricao,
            })
            setCategoriaId(response.data.categoria_id)
        } catch (error) {
        }
    }

    function fecharModal() {
        setShowEditarRegistro(false)
        removeItem('transacao_id')
    }

    async function editarTransacao() {
        try {
            await api.put(`/transacao/${id}`, {
                tipo,
                descricao: form.descricao,
                valor: form.valor,
                data: form.data,
                categoria_id: categoriaId
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            listarTransacoes()
            resumir()
            setShowEditarRegistro(false)
        } catch (error) {
        }
        listarTransacoes()
        resumir()
    }

    function handleChangeInput(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleChangeSelect(e) {
        setForm({ ...form, [e.target.name]: e.target.value })

        const response = await api.get('/categoria', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const categorias = response.data
        categorias.map((item) => {
            if (item.descricao === e.target.value) {
                setCategoriaId(item.id)
            }
        })
    }

    function submit(e) {
        e.preventDefault()
        editarTransacao()
    }

    return (
        <div className='container-editar'>
            <form onSubmit={submit} className='form-editar-registro'>
                <h2 className='titulo-editar'>Editar Registro</h2>
                <img onClick={() => fecharModal()} className='close' src={close} />
                <div className='botoes'>
                    <button
                        onClick={() => setTipo('entrada')}
                        type='button'
                        className={tipo === 'entrada' ? 'btn-entrada-blue' : 'btn-entrada-gray'}
                    >
                        Entrada
                    </button>
                    <button
                        onClick={() => setTipo('saida')}
                        type='button'
                        className={tipo === 'saida' ? 'btn-saida-red' : 'btn-saida-gray'}
                    >
                        Saída
                    </button>
                </div>
                <label>Valor</label>
                <input
                    name='valor'
                    type='number'
                    value={form.valor}
                    onChange={handleChangeInput}
                />
                <label>Categoria</label>
                <select
                    name='categoria_id'
                    value={form.categoria_id}
                    onChange={handleChangeSelect}
                >
                    <option></option>
                    {categorias.map((item) => (
                        <option
                            key={item.id}
                        >{item.descricao}</option>
                    ))}

                </select>
                <label>Data</label>
                <input
                    name='data'
                    type='date'
                    value={form.data}
                    onChange={handleChangeInput}
                />
                <label>Descricao</label>
                <input
                    name='descricao'
                    type='text'
                    value={form.descricao}
                    onChange={handleChangeInput}
                />
                <button className='confirmar-editar'>Confirmar</button>
            </form>

        </div>
    )
}

export default Editar