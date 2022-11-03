import { getType } from 'typesafe-actions';
import * as actions from '../actions';
// import { 
//   initEntityState, 
// } from '../utils';

export const defaultState = {
  account: null, 
  provider: null, 
  web3: null
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    
    case getType(actions.addWeb3):
      return { ...state, account: action.payload.account, provider: action.payload.provider, web3: action.payload.web3 };

    case getType(actions.delWeb3):
      return { ...state, account: null, provider: null, web3: null };
    

    default:
      return state;
  }
};

export default states;
