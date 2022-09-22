import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { 
  initEntityState, 
} from '../utils';

export const defaultState = {
  web3: initEntityState(null),
  account: initEntityState(null)
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    
    case getType(actions.addWeb3):
        console.log(action)
      return { ...state, web3: action.payload.web3, account: action.payload.account };

    case getType(actions.delWeb3):
      return { ...state, web3: initEntityState(null), account: initEntityState(null) };
    

    default:
      return state;
  }
};

export default states;
