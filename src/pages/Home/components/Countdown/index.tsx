import { useContext, useEffect } from 'react'
import { CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../../../../contexts/CyclesContext'

export function Countdown() {
  const {
    activeCycle,
    activeCicleId,
    amountSecondPassed,
    markCurrentCycleAsFinished,
    setSecondPassed,
    setSecondsDiference,
  } = useContext(CyclesContext)

  const totalSecond = activeCycle ? activeCycle.minutsAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalSecond) {
          markCurrentCycleAsFinished()
          setSecondPassed(totalSecond)

          clearInterval(interval)
        } else {
          setSecondsDiference(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSecond,
    activeCicleId,
    markCurrentCycleAsFinished,
    setSecondPassed,
    setSecondsDiference,
  ])

  console.log(activeCycle)

  const currentSecond = activeCycle ? totalSecond - amountSecondPassed : 0

  const minutsAmount = Math.floor(currentSecond / 60)
  const secondsAmount = currentSecond % 60

  const minutes = String(minutsAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    } else if (seconds === '00') {
      document.title = `Ignite Timer`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
