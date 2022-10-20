import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import {
  initEntityState,
  entityLoadingStarted,
  entityLoadingSucceeded,
  entityLoadingFailed
} from '../utils';

export const defaultState = {
  hotCollections: initEntityState(null),
  ComingSoonCollection: initEntityState(null)
};

const states = (state = defaultState, action) => {
  switch (action.type) {

    case getType(actions.getHotCollections.request):
      return { ...state, hotCollections: entityLoadingStarted(state.hotCollections, action.payload) };
    case getType(actions.getHotCollections.success):
      return { ...state, hotCollections: entityLoadingSucceeded(state.hotCollections, action.payload) };
    case getType(actions.getHotCollections.failure):
      return { ...state, hotCollections: entityLoadingFailed(state.hotCollections) };

    case getType(actions.getComingCollections.request):
      return { ...state, ComingSoonCollection: entityLoadingStarted(state.ComingSoonCollection, action.payload) };
    case getType(actions.getComingCollections.success):
      return { ...state, ComingSoonCollection: entityLoadingSucceeded(state.ComingSoonCollection, action.payload) };
    case getType(actions.getComingCollections.failure):
      return { ...state, ComingSoonCollection: entityLoadingFailed(state.ComingSoonCollection) };
    default:
      return state;
  }
};

export default states;
