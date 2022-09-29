import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { 
  initEntityState, 
  entityLoadingStarted, 
  entityLoadingSucceeded, 
  entityLoadingFailed
} from '../utils';

export const defaultState = {
  selectedCollection: initEntityState(null),
  selectedNfts: initEntityState(null)
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    
    case getType(actions.getCollections.request):
      return { ...state, selectedCollection: entityLoadingStarted(state.selectedCollection, action.payload) };
    case getType(actions.getCollections.success):
      return { ...state, selectedCollection: entityLoadingSucceeded(state.selectedCollection, action.payload) };
    case getType(actions.getCollections.failure):
      return { ...state, selectedCollection: entityLoadingFailed(state.selectedCollection) };   
    case getType(actions.getCollectionNfts.request):
      return { ...state, selectedNfts: entityLoadingStarted(state.selectedCollection, action.payload) };
    case getType(actions.getCollectionNfts.success):
      return { ...state, selectedNfts: entityLoadingSucceeded(state.selectedCollection, action.payload) };
    case getType(actions.getCollectionNfts.failure):
      return { ...state, selectedNfts: entityLoadingFailed(state.selectedCollection) };  
    default:
      return state;
  }
};

export default states;
