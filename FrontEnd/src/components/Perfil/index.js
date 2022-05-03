import './style.css'
import close from '../../assets/close.svg'
import { useState, useEffect, useContext } from 'react'
import api from '../../services/api'
import { setItem } from '../../utils/storage'
import UserContext from '../../contexts/UserContext'

function Perfil() {

    const { setShowEditarPerfil, token } = useContext(UserContext)

    const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmacao: '' })
    const [formIncompleto, setFormIncompleto] = useState(false)
    const [senhaIncorreta, setSenhaIncorreta] = useState(false)

    useEffect(() => {
        detalharPerfil()
    }, [])

    async function detalharPerfil() {
        try {
            const response = await api.get(`/usuario`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setForm({
                nome: response.data.nome,
                email: response.data.email,
                senha: '',
                confirmacao: ''
            })
        } catch (error) {
        }
    }

    function handleChangeInput(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function editarPerfil() {

        if (!form.nome || !form.email || !form.senha || !form.confirmacao) {
            setFormIncompleto(true)
            return
        }
        setFormIncompleto(false)


        if (form.senha !== form.confirmacao) {
            setSenhaIncorreta(true)
            return
        }
        try {
            await api.put('/usuario',
                {
                    nome: form.nome,
                    email: form.email,
                    senha: form.senha
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setItem('usuario', form.nome)
            setShowEditarPerfil(false)
        } catch (error) {

        }
    }

    function submit(e) {
        e.preventDefault()
        editarPerfil()
    }

    return (
        <div className='container-perfil'>
            <form onSubmit={submit} className='form-editar-perfil'>
                <div className='titulo'>
                    <h2 className='titulo-perfil'>Editar Perfil</h2>
                </div>

                <img onClick={() => setShowEditarPerfil(false)} className='close' src={close} />
                <div className='input'>
                    <label>Nome</label>
                    <input
                        name='nome'
                        type='text'
                        value={form.nome}
                        onChange={handleChangeInput}
                    />
                    <label>E-mail</label>
                    <input
                        name='email'
                        type='text'
                        value={form.email}
                        onChange={handleChangeInput}
                    />
                    <label>Senha</label>
                    <input
                        name='senha'
                        type='password'
                        value={form.senha}
                        onChange={handleChangeInput}
                    />
                    <label>Confirmação de senha</label>
                    <input
                        name='confirmacao'
                        type='password'
                        value={form.confirmacao}
                        onChange={handleChangeInput}
                    />

                </div>
                {senhaIncorreta && <span className='erro'>Senha e confirmação de senha não conferem</span>}
                {formIncompleto && <span className='erro'>Preencha todos os campos</span>}
                <button className='confirmar-editar'>Confirmar</button>
            </form>
        </div>
    )
}

export default Perfil