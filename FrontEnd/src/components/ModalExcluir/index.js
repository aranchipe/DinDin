import './style.css'
import seta from '../../assets/seta.svg'


function ModalExcluir({ deletarTransacao, transacao_id, setShowModalExcluir }) {
    return (
        <div className='modal-excluir'>
            <span>Apagar item?</span>
            <div className='btn-modal-excluir'>
                <button onClick={() => deletarTransacao(transacao_id)} className='sim'>Sim</button>
                <button onClick={() => setShowModalExcluir(false)} className='nao'>Não</button>
            </div>
            <img className='seta' src={seta} />
        </div>
    )
}

export default ModalExcluir