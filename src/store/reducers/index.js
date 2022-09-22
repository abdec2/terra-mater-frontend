import { combineReducers } from 'redux';
import nftReducer from './nfts';
import hotCollectionsReducer from './hotCollections';
import authorListReducer from './authorList';
import filterReducer from './filters';
import blogPostsReducer from './blogs';
import web3Reducer from './web3';

export const rootReducer = combineReducers({
  NFT: nftReducer,
  hotCollection: hotCollectionsReducer,
  authors: authorListReducer,
  filters: filterReducer,
  blogs: blogPostsReducer,
  web3: web3Reducer
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;