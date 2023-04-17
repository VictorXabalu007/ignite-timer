import { ICicle } from './reducer'

export enum ActionTypes {
  ADD_NEW_CICLE = 'ADD_NEW_CICLE',
  INTERRUPT_CURRENT_CICLE = 'INTERRUPT_CURRENT_CICLE',
  MARK_CURRENT_CICLE_AS_FINISHED = 'MARK_CURRENT_CICLE_AS_FINISHED',
}

export function addNewCicleAction(newCicle: ICicle) {
  return {
    type: ActionTypes.ADD_NEW_CICLE,
    payload: {
      newCicle,
    },
  }
}

export function markCurrentCicleAsFinishedAction() {
  return {
    type: ActionTypes.MARK_CURRENT_CICLE_AS_FINISHED,
  }
}

export function interruptCurrentCycleAction() {
  return {
    type: ActionTypes.INTERRUPT_CURRENT_CICLE,
  }
}
