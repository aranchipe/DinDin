import './style.css'
import editar from '../../assets/editar.svg'
import excluir from '../../assets/excluir.svg'
import { useState, useContext } from 'react'
import ModalExcluir from '../ModalExcluir'
import { setItem } from '../../utils/storage'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';
import UserContext from '../../contexts/UserContext'


function Transacao({ transacao, transacao_id }) {

    const { deletarTransacao, setShowEditarRegistro } = useContext(UserContext)

    const [showModalExcluir, setShowModalExcluir] = useState(false)

    function editarTransacao(transacao_id) {
        setShowEditarRegistro(true)
        setItem('transacao_id', transacao_id)
    }

    return (
        <div className='container-transacao'>
            <div className='transacao'>
                <div className='data'>
                    <span>{format(new Date(transacao.data), "dd/MM/yyy")}</span>
                </div>
                <div className='dia'>
                    <span>{format(new Date(transacao.data), "eeee", { locale: ptBR }).toUpperCase().split('-')[0]}</span>
                </div>
                <div className='descricao'>
                    <span>{transacao.descricao}</span>
                </div>
                <div className='categoria'>
                    <span>{transacao.categoria_nome}</span>
                </div>
                <div className={transacao.tipo === 'saida' ? 'valor-saida' : 'valor-entrada'}>
                    <span>R$ {(transacao.valor / 100).toFixed(2)}</span>
                </div>

                <img onClick={() => editarTransacao(transacao_id)} className='editar' src={editar} alt='editar' />
                <img onClick={() => setShowModalExcluir(true)} className='excluir' src={excluir} alt='excluir' />

                {showModalExcluir &&
                    <ModalExcluir
                        deletarTransacao={deletarTransacao}
                        transacao_id={transacao_id}
                        setShowModalExcluir={setShowModalExcluir}
                    />}

            </div>
            <div className='linha'>

            </div>
        </div>
    )
}

export default Transacao