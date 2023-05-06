import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';
import axios from 'axios';
import ABI from './../../../config/Marketplace.json'
import Web3 from "web3"
import { CONFIG } from '../../../config/config';

export const fetchCollections = (collectionId) => async (dispatch) => {
  dispatch(actions.getCollections.request(Canceler.cancel));
  try {
    const filter = collectionId ? `id=${collectionId}` : ''
    let populate = `populate=*`;
    const { data } = await Axios.get(`${api.baseUrl + api.collection}/get_collection?${filter}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    console.log(data)
    dispatch(actions.getCollections.success(data));
  } catch (err) {
    dispatch(actions.getCollections.failure(err));
  }
};

export const fetchCollectionNfts = (page=1, collectionId, statuses, replaceFilteredData = false) => async (dispatch) => {
    if(replaceFilteredData && statuses && statuses.length > 0) {
      dispatch(actions.filterStatusUpdate.request(Canceler.cancel));
    } else if (!replaceFilteredData && statuses && statuses.length > 0) {
      dispatch(actions.filterStatus.request(Canceler.cancel));
    } else {
      dispatch(actions.getCollectionNfts.request(Canceler.cancel));
    }
    try {
      const filters = collectionId ? `${'collectionId='+collectionId}` : ''
      const status = (statuses && statuses.length > 0) ? `${'statuses='+JSON.stringify(statuses)}` : ''
      const { data } = await Axios.get(`${api.baseUrl}${api['nft-v1s']}?page=${page}&${filters}&${status}`, {
        cancelToken: Canceler.token,
        params: {}
      });
      console.log('aaaa')
      if(replaceFilteredData && statuses && statuses.length > 0) {
        dispatch(actions.filterStatusUpdate.success(data));
      } else if (!replaceFilteredData && statuses && statuses.length > 0) {
        dispatch(actions.filterStatus.success(data));
      } else {
        dispatch(actions.getCollectionNfts.success(data));
      }

    } catch (err) {
      console.log('bbbb')
      if(replaceFilteredData && statuses && statuses.length > 0) {
        dispatch(actions.filterStatusUpdate.failure(err));
      } else if (!replaceFilteredData && statuses && statuses.length > 0) {
        dispatch(actions.filterStatus.failure(err));
      } else {
        dispatch(actions.getCollectionNfts.failure(err));
      }
      
    }
  };

export const fetchNewCollection = () => async (dispatch) => {
  dispatch(actions.getNewCollection.request(Canceler.cancel));

  try {
    // http://localhost:5000/api/collections?populate=*&sort[1]=createdAt:desc&pagination[limit]=1
    const { data } = await axios.get(`${api.baseUrl}/api/collections?populate=*&filters[status]=active&sort[1]=createdAt:desc&pagination[limit]=1`, {
      cancelToken: Canceler.token,
      params: {}
    })

    console.log(data.data)
    if(data.data.length > 0) {
      dispatch(actions.getNewCollection.success(data));
    }
  } catch (e) {
    actions.getNewCollection.failure(e)
  }
}

export const searchCollectionNFT = (collectionId, searchtxt) => async (dispatch) => {

  dispatch(actions.filterStatusUpdate.request(Canceler.cancel));
  try {
    const filters = collectionId ? `${'collectionId='+collectionId}` : ''
    const { data } = await Axios.get(`${api.baseUrl}${api['nft-v1s']}/fwfilters?${filters}&searchtxt=${searchtxt}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    
    if (data.data.length > 0) {
      dispatch(actions.filterStatusUpdate.success(data));
    }
  } catch (err) {
      dispatch(actions.filterStatusUpdate.failure(err));
  }
};

export const fetchMarketItems = async () => {
  const web3 = new Web3(process.env.REACT_APP_ALCHEMY_KEY);
  const contract = new web3.eth.Contract(ABI, CONFIG.MARKETPLACE_ADDRESS);
  const marketItems = await contract.methods.fetchMarketItems().call()
  return marketItems
}