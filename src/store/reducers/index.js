import { combineReducers } from 'redux';
import nftReducer from './nfts';
import hotCollectionsReducer from './hotCollections';
import collectionReducer from './collections';
import authorListReducer from './authorList';
import filterReducer from './filters';
import blogPostsReducer from './blogs';
import web3Reducer from './web3';
import misc from './misc';

export const rootReducer = combineReducers({
  NFT: nftReducer,
  hotCollection: hotCollectionsReducer,
  collectionReducer,
  authors: authorListReducer,
  filters: filterReducer,
  blogs: blogPostsReducer,
  web3: web3Reducer,
  misc
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;