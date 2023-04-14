import { HandPalm, Play } from 'phosphor-react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountDownButton,
} from './styles'

import { createContext, useState } from 'react'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

interface ICicle {
  id: string
  task: string
  minutsAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutsAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser no máximo 60min')
    .max(60, 'O ciclo precisa ser no máximo 60min'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface CyclesContextType {
  activeCycle: ICicle | undefined
  activeCicleId: string
  amountSecondPassed: number
  markCurrentCycleAsFinished: () => void
  setInitialActiveCicleId: () => void
  setSecondPassed: (secons: number) => void
  setSecondsDiference: (secons: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  const [cicles, setCicles] = useState<ICicle[]>([])
  const [activeCicleId, setActiveCicleId] = useState<string>('')
  const [amountSecondPassed, setAmountSecondPassed] = useState(0)

  const newCycleFormHook = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutsAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleFormHook

  function markCurrentCycleAsFinished() {
    setCicles((prevState) =>
      prevState.map((cicle) => {
        if (cicle.id === activeCicleId) {
          return {
            ...cicle,
            finishedDate: new Date(),
          }
        } else {
          return cicle
        }
      }),
    )
  }

  function setInitialActiveCicleId() {
    setActiveCicleId('')
  }

  function handleCreateNewCicle(data: NewCycleFormData) {
    const newCicle: ICicle = {
      id: crypto.randomUUID(),
      task: data.task,
      minutsAmount: data.minutsAmount,
      startDate: new Date(),
    }

    setCicles((prevState) => {
      return [...prevState, newCicle]
    })
    setActiveCicleId(newCicle.id)
    setAmountSecondPassed(0)

    reset()
  }

  function handleInterruptCycle() {
    setCicles((prevState) =>
      prevState.map((cicle) => {
        if (cicle.id === activeCicleId) {
          return {
            ...cicle,
            interruptedDate: new Date(),
          }
        } else {
          return cicle
        }
      }),
    )

    setActiveCicleId('')
  }

  const activeCycle = cicles.find((cicle) => cicle.id === activeCicleId)

  function setSecondPassed(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function setSecondsDiference(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  console.log(cicles)

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCicle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCicleId,
            amountSecondPassed,
            markCurrentCycleAsFinished,
            setInitialActiveCicleId,
            setSecondPassed,
            setSecondsDiference,
          }}
        >
          <FormProvider {...newCycleFormHook}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
