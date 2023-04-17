import { ActionTypes } from './actions'

export interface ICicle {
  id: string
  task: string
  minutsAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}
interface IStateReducer {
  cicles: ICicle[]
  activeCicleId: string
}

export function cyclesReducer(state: IStateReducer, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CICLE:
      return {
        ...state,
        cicles: [...state.cicles, action.payload.newCicle],
        activeCicleId: action.payload.newCicle.id,
      }
    case ActionTypes.INTERRUPT_CURRENT_CICLE:
      return {
        ...state,
        cicles: state.cicles.map((cicle) => {
          if (cicle.id === state.activeCicleId) {
            return {
              ...cicle,
              interruptedDate: new Date(),
            }
          } else {
            return cicle
          }
        }),
        activeCicleId: '',
      }
    case ActionTypes.MARK_CURRENT_CICLE_AS_FINISHED:
      return {
        ...state,
        cicles: state.cicles.map((cicle) => {
          if (cicle.id === state.activeCicleId) {
            return {
              ...cicle,
              finishedDate: new Date(),
            }
          } else {
            return cicle
          }
        }),
        activeCicleId: '',
      }

    default:
      return state
  }
}
