import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import {
  initEntityState,
  entityLoadingStarted,
  entityLoadingSucceeded,
  entityLoadingFailed,
  remapObject
} from '../utils';

export const defaultState = {
  selectedCollection: initEntityState(null),
  selectedNfts: initEntityState(null),
  newCollection: initEntityState(null),
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
      return { ...state, selectedNfts: entityLoadingStarted(state.selectedNfts, action.payload) };
    case getType(actions.getCollectionNfts.success):
      //append existing data with new data
      let payload = state.selectedNfts.data ? {data: [...state.selectedNfts.data.data, ...remapObject(action.payload.data)], meta:action.payload.meta} : remapObject(action.payload);
      return { ...state, selectedNfts: entityLoadingSucceeded(state.selectedNfts, payload) };
    case getType(actions.getCollectionNfts.failure):
      return { ...state, selectedNfts: entityLoadingFailed(state.selectedNfts) };

    // case getType(actions.getCollectionNfts.request):
    //   return { ...state, selectedNfts: entityLoadingStarted(state.selectedNfts, action.payload) };
    // case getType(actions.getCollectionNfts.success):
    //   return { ...state, selectedNfts: entityLoadingSucceeded(state.selectedNfts, action.payload) };
    // case getType(actions.getCollectionNfts.failure):
    //   return { ...state, selectedNfts: entityLoadingFailed(state.selectedNfts) };

    case getType(actions.getNewCollection.request):
      return { ...state, newCollection: entityLoadingStarted(state.newCollection, action.payload) };
    case getType(actions.getNewCollection.success):
      return { ...state, newCollection: entityLoadingSucceeded(state.newCollection, action.payload) };
    case getType(actions.getNewCollection.failure):
      return { ...state, newCollection: entityLoadingFailed(state.newCollection) };
    default:
      return state;
  }
};

export default states;
