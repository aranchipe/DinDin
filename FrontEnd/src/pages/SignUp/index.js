import './style.css';
import logo from '../../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../../services/api';


function SignUp() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmacao: '' });
  const [senhaIncorreta, setSenhaIncorreta] = useState(false)
  const [formIncompleto, setFormIncompleto] = useState(false)
  const [emailErro, setEmailErro] = useState(false)
  const navigate = useNavigate()


  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.email || !form.nome || !form.senha || !form.confirmacao) {
      setFormIncompleto(true)
      setSenhaIncorreta(false)
      setEmailErro(false)
      return;
    }


    if (form.senha !== form.confirmacao) {
      setSenhaIncorreta(true)
      setFormIncompleto(false)
      setEmailErro(false)
      return
    }
    setFormIncompleto(false)
    setEmailErro(false)
    await handleCadastrarUsuario()

  }

  async function handleCadastrarUsuario() {
    try {
      const response = await api.post('/usuario', {
        nome: form.nome,
        email: form.email,
        senha: form.senha
      })
      navigate('/login')
    } catch (error) {
      setEmailErro(true)
      setSenhaIncorreta(false)
    }
  }

  function handleChangeInputValue(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="container">
      <img src={logo} className='logo-sign-up' alt='logo'></img>
      <div className='main-sign-up'>
        <form className='form' onSubmit={handleSubmit}>
          <div className='input'>
            <div className='titulo'>
              <h2>Cadastre-se</h2>
            </div>
            <label>Nome</label>
            <input
              name='nome'
              type='text'
              value={form.nome}
              onChange={handleChangeInputValue}
            />
          </div>
          <div className='input'>
            <label>E-mail</label>
            <input
              name='email'
              type='text'
              value={form.email}
              onChange={handleChangeInputValue}
            />
          </div>
          <div className='input'>
            <label>Senha</label>
            <input
              name='senha'
              type='password'
              value={form.senha}
              onChange={handleChangeInputValue}
            />
          </div>
          <div className='input'>
            <label>Confirmação de senha</label>
            <input
              name='confirmacao'
              type='password'
              value={form.confirmacao}
              onChange={handleChangeInputValue}
            />
          </div>
          {senhaIncorreta && <span className='erro'>Senha e confirmação de senha não conferem</span>}
          {formIncompleto && <span className='erro'>Preencha todos os campos</span>}
          {emailErro && <span className='erro'>Esse email já existe</span>}
          <button>Cadastrar</button>
          <div className='link'>
            <span>Já tem cadastro?</span>
            <Link className='link' to='/login'>Clique Aqui!</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
