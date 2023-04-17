import { useContext } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CyclesContext } from '../../contexts/CyclesContext'
import { HistoryContainer, HistoryList, Status } from './styles'

export function History() {
  const { cicles } = useContext(CyclesContext)
  return (
    <HistoryContainer>
      <h1>Meu Historico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {cicles.map((cicle) => {
              return (
                <tr key={cicle.id}>
                  <td>{cicle.task}</td>
                  <td>{cicle.minutsAmount} minutos</td>
                  <td>
                    {formatDistanceToNow(new Date(cicle.startDate), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </td>
                  <td>
                    {cicle.finishedDate && (
                      <Status statusColor="green">Concluido</Status>
                    )}

                    {cicle.interruptedDate && (
                      <Status statusColor="red">Interrompido</Status>
                    )}

                    {!cicle.interruptedDate && !cicle.finishedDate && (
                      <Status statusColor="yellow">Em andamento</Status>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
