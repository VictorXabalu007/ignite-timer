import { createContext, ReactNode, useState } from 'react'

interface ICicle {
  id: string
  task: string
  minutsAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface ICreateNewCycle {
  task: string
  minutsAmount: number
}

interface CyclesContextType {
  cicles: ICicle[]
  activeCycle: ICicle | undefined
  activeCicleId: string
  amountSecondPassed: number
  markCurrentCycleAsFinished: () => void
  setInitialActiveCicleId: () => void
  setSecondPassed: (secons: number) => void
  setSecondsDiference: (secons: number) => void
  createNewCicle: (data: ICreateNewCycle) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cicles, setCicles] = useState<ICicle[]>([])
  const [activeCicleId, setActiveCicleId] = useState<string>('')
  const [amountSecondPassed, setAmountSecondPassed] = useState(0)

  const activeCycle = cicles.find((cicle) => cicle.id === activeCicleId)

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

  function setSecondPassed(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function setSecondsDiference(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function createNewCicle(data: ICreateNewCycle) {
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
  }

  function interruptCurrentCycle() {
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

  return (
    <CyclesContext.Provider
      value={{
        cicles,
        activeCycle,
        activeCicleId,
        amountSecondPassed,
        markCurrentCycleAsFinished,
        setInitialActiveCicleId,
        setSecondPassed,
        setSecondsDiference,
        createNewCicle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
