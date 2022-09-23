import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { 
  initEntityState, 
} from '../utils';

export const defaultState = {
  account: initEntityState(null)
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    
    case getType(actions.addWeb3):
      return { ...state, account: action.payload.account };

    case getType(actions.delWeb3):
      return { ...state, account: initEntityState(null) };
    

    default:
      return state;
  }
};

export default states;
