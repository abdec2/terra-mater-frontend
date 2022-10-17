import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';
import axios from 'axios';

export const fetchCollections = (collectionId) => async (dispatch) => {
  dispatch(actions.getCollections.request(Canceler.cancel));

  try {
    const filter = collectionId ? `id=${collectionId}` : ''
    let populate = `populate=*`;
    const { data } = await Axios.get(`${api.baseUrl + api.collections}/get_collection?${populate}&${filter}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    console.log(data)
    dispatch(actions.getCollections.success(data));
  } catch (err) {
    dispatch(actions.getCollections.failure(err));
  }
};

export const fetchCollectionNfts = (page=1, collectionId, isMusic = false) => async (dispatch) => {

    dispatch(actions.getCollectionNfts.request(Canceler.cancel));
  
    try {
      const filters = collectionId ? `${'collectionId='+collectionId}` : ''
      const { data } = await Axios.get(`${api.baseUrl}${api['nft-v1s']}?page=${page}&${filters}`, {
        cancelToken: Canceler.token,
        params: {}
      });
      if(data.length > 0) {
        dispatch(actions.getCollectionNfts.success(data));
      }
    } catch (err) {
      dispatch(actions.getCollectionNfts.failure(err));
    }
  };

export const fetchNewCollection = () => async (dispatch) => {
  dispatch(actions.getNewCollection.request(Canceler.cancel));

  try {
    // http://localhost:5000/api/collections?populate=*&sort[1]=createdAt:desc&pagination[limit]=1
    const { data } = await axios.get(`${api.baseUrl}/api/collections?populate=*&sort[1]=createdAt:desc&pagination[limit]=1`, {
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