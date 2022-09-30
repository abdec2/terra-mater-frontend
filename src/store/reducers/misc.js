import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { 
  initEntityState, 
  entityLoadingStarted, 
  entityLoadingSucceeded, 
  entityLoadingFailed
} from '../utils';

export const defaultState = {
  categories: initEntityState(null),
  nftStatus: initEntityState(null)
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    
    case getType(actions.fetchCategories.request):
      return { ...state, categories: entityLoadingStarted(state.categories, action.payload) };
    case getType(actions.fetchCategories.success):
      return { ...state, categories: entityLoadingSucceeded(state.categories, action.payload) };
    case getType(actions.fetchCategories.failure):
      return { ...state, categories: entityLoadingFailed(state.categories) };   
    case getType(actions.fetchStatus.request):
      return { ...state, nftStatus: entityLoadingStarted(state.nftStatus, action.payload) };
    case getType(actions.fetchStatus.success):
      return { ...state, nftStatus: entityLoadingSucceeded(state.nftStatus, action.payload) };
    case getType(actions.fetchStatus.failure):
      return { ...state, nftStatus: entityLoadingFailed(state.nftStatus) };  
    default:
      return state;
  }
};

export default states;
