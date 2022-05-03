import './style.css'
import logo from '../../assets/logo.svg'
import perfil from '../../assets/perfil.svg'
import sair from '../../assets/sair.svg'
import { removeItem } from '../../utils/storage'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import UserContext from '../../contexts/UserContext'

function Navbar({ usuario }) {

    const { setShowEditarPerfil } = useContext(UserContext)
    const navigate = useNavigate()

    function deslogar() {
        removeItem('token')
        removeItem('usuario')
        navigate('/login')
    }
    return (
        <nav>
            <div className='logo-navbar'>
                <img src={logo} alt='logo' />
            </div>
            <div className='right'>
                <img onClick={() => setShowEditarPerfil(true)} className='perfil' src={perfil} alt='perfil' />
                <span>{usuario}</span>
                <img
                    className='sair'
                    src={sair}
                    alt='sair'
                    onClick={deslogar}
                />
            </div>
        </nav>
    )
}

export default Navbar