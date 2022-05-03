import { useEffect, useState, useContext } from 'react'
import './style.css'
import UserContext from '../../contexts/UserContext'


function Resumo() {
    const { entrada, saida, resumir } = useContext(UserContext)

    useEffect(() => {
        resumir()
    }, [])
    return (
        <div className='container-resumo'>
            <h2 className='titulo-resumo'>Resumo</h2>
            <div className='entradas'>
                <span className='titulo-entrada'>Entradas</span>
                <span className='valor-entrada'>R$ {(entrada / 100).toFixed(2)}</span>
            </div>
            <div className='saidas'>
                <span className='titulo-saida'>Saídas</span>
                <span className='valor-saida'>R$ {(saida / 100).toFixed(2)}</span>
            </div>
            <div className='linha-resumo'>

            </div>
            <div className='saldo'>
                <span className='titulo-saldo'>Saldo</span>
                <span className='valor-saldo'>R$ {((entrada - saida) / 100).toFixed(2)}</span>
            </div>
        </div>
    )
}

export default Resumo