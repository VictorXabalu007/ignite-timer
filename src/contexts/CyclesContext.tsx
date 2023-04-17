import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { cyclesReducer, ICicle } from '../reducers/cycles/reducer'
import {
  ActionTypes,
  addNewCicleAction,
  interruptCurrentCycleAction,
  markCurrentCicleAsFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

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
  const [ciclesState, dispath] = useReducer(
    cyclesReducer,
    {
      cicles: [],
      activeCicleId: '',
    },
    (initialState) => {
      const storedStateAsJson = localStorage.getItem(
        '@ignite-timer:cicles-state-1.0.0',
      )

      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson)
      }

      return initialState
    },
  )

  useEffect(() => {
    const stateJSON = JSON.stringify(ciclesState)

    localStorage.setItem('@ignite-timer:cicles-state-1.0.0', stateJSON)
  }, [ciclesState])

  const { cicles, activeCicleId } = ciclesState
  const activeCycle = cicles.find((cicle) => cicle.id === activeCicleId)

  const [amountSecondPassed, setAmountSecondPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  function markCurrentCycleAsFinished() {
    dispath(markCurrentCicleAsFinishedAction())
  }

  function createNewCicle(data: ICreateNewCycle) {
    const newCicle: ICicle = {
      id: crypto.randomUUID(),
      task: data.task,
      minutsAmount: data.minutsAmount,
      startDate: new Date(),
    }
    dispath(addNewCicleAction(newCicle))
    setAmountSecondPassed(0)
  }

  function interruptCurrentCycle() {
    dispath(interruptCurrentCycleAction())
  }

  function setSecondPassed(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function setSecondsDiference(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  return (
    <CyclesContext.Provider
      value={{
        cicles,
        activeCycle,
        activeCicleId,
        amountSecondPassed,
        markCurrentCycleAsFinished,
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
