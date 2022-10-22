import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { 
  handleSelection,
  initEntityState,
  entityLoadingStarted,
  entityLoadingSucceeded,
  entityLoadingFailed,
  remapObject
} from '../utils';

export const defaultState = {
  selectedCategories: new Set(),
  selectedStatus: initEntityState(null),
  selectedItemsType: new Set(),
  selectedCollections: new Set(),
  filterNftTitle: ''
};

const states = (state = defaultState, action) => {
    const payload = action.payload;
  switch (action.type) {    
    case getType(actions.filterCategories):
        let selectedCategories = payload.value ? handleSelection(state.selectedCategories, payload.value, payload.singleSelect) : new Set();
      return { ...state, selectedCategories};


    case getType(actions.filterStatus.request):
      return { ...state, selectedStatus: entityLoadingStarted(state.selectedStatus, action.payload) };
    
    case getType(actions.filterStatus.success):
      let payload = state.selectedStatus.data ? {data: [...state.selectedStatus.data.data, ...remapObject(action.payload.data)], meta:action.payload.meta} : remapObject(action.payload);
      return { ...state, selectedStatus: entityLoadingSucceeded(state.selectedStatus, payload) };

    case getType(actions.filterStatus.failure):
      return { ...state, selectedStatus: entityLoadingFailed(state.selectedStatus) };
    
    
    case getType(actions.filterItemsType):
        let selectedItemsType = payload.value ? handleSelection(state.selectedItemsType, payload.value, payload.singleSelect) : new Set();
      return { ...state, selectedItemsType};

    case getType(actions.filterCollections):
        let selectedCollections = payload.value ? handleSelection(state.selectedCollections, payload.value, payload.singleSelect) : new Set();
      return { ...state, selectedCollections};
    
    case getType(actions.filterNftTitle):
      return { ...state, filterNftTitle: action.payload};

    case getType(actions.clearFilter):
      return { 
        selectedCategories: new Set(),
        selectedStatus: initEntityState(null),
        selectedItemsType: new Set(),
        selectedCollections: new Set(),
        filterNftTitle: ''
      };
    
    default:
      return state;
  }
};

export default states;
