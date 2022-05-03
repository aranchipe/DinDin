import './style.css'
import api from '../../services/api'
import logo from '../../assets/logo.svg'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getItem, setItem, removeItem } from '../../utils/storage'



function SignIn() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', senha: '' })
    const [formIncompleto, setFormIncompleto] = useState(false)
    const [erro, setErro] = useState(false)

    useEffect(() => {
        const token = getItem('token')
        if (token) {
            navigate('/main')
        }
        removeItem('transacao_id')
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        if (!form.email || !form.senha) {
            setFormIncompleto(true)
            setErro(false)
            return
        }

        try {
            const response = await api.post('/login', {
                ...form
            })

            const { token, usuario } = response.data
            setItem('token', token)
            setItem('usuario', usuario.nome)

            navigate('/main')

        } catch (error) {
            setFormIncompleto(false)
            setErro(true)
        }
    }

    function handleChangForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    return (
        <div className='container'>
            <img className='logo-login' src={logo} alt='logo' />
            <div className='main-login'>
                <div className='left'>
                    <div className='titulo-login'>
                        <h1>Controle suas <span>finanças</span>, sem planilha chata.</h1>
                    </div>
                    <div className='texto-login'>
                        <p>Organizar as suas finanças nunca foi tão fácil,
                            com o DINDIN, você tem tudo num único lugar
                            e em um clique de distância.</p>
                    </div>
                    <button className='cadastre-se' onClick={() => navigate('/sign-up')}>Cadastre-se</button>
                </div>
                <form className='form-login' onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div className='input'>
                        <label>E-mail</label>
                        <input
                            name='email'
                            type='text'
                            value={form.email}
                            onChange={handleChangForm}
                        />
                    </div>
                    <div className='input'>
                        <label>Password</label>
                        <input
                            name='senha'
                            type='password'
                            value={form.senha}
                            onChange={handleChangForm}
                        />
                    </div>
                    {formIncompleto && <span className='erro'>Preencha todos os campos</span>}
                    {erro && <span className='erro'>Email ou senha incorretos</span>}
                    <button>Entrar</button>
                </form>
            </div>
        </div>
    )
}

export default SignIn