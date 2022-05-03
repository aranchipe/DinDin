import './style.css'
import close from '../../assets/close.svg'
import { useState, useContext } from 'react'
import api from '../../services/api'
import UserContext from '../../contexts/UserContext'

function Adicionar() {

    const { setShowAddRegistro, categorias, token, listarTransacoes, resumir } = useContext(UserContext)

    const [tipo, setTipo] = useState('saida')
    const [form, setForm] = useState({ valor: '', categoria_id: '', data: '', descricao: '' })
    const [categoriaId, setCategoriaId] = useState(0)

    async function adicionarTransacao() {
        try {

            await api.post('/transacao', {

                tipo,
                descricao: form.descricao,
                data: form.data,
                valor: form.valor * 100,
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
            setShowAddRegistro(false)
        } catch (error) {
            console.log(error.message)
        }
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
        adicionarTransacao()
    }

    return (
        <div className='container-adicionar'>
            <form onSubmit={submit} className='form-add-registro'>
                <h2 className='titulo-adicionar'>Adicionar Registro</h2>
                <img onClick={() => setShowAddRegistro(false)} className='close' src={close} />
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
                <button className='confirmar-add'>Confirmar</button>
            </form>

        </div>
    )
}

export default Adicionar