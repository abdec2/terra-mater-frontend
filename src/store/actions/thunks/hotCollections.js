import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchHotCollections = (collectionId) => async (dispatch) => {
  dispatch(actions.getHotCollections.request(Canceler.cancel));
  console.log('bahr')
  try {
    const filter = collectionId ? `id=${collectionId}` : ''
    let populate = `populate=*&filters[status]=active`;
    const { data } = await Axios.get(`${api.baseUrl + api.collection}?${populate}&${filter}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    console.log('andar')
    console.log(data)
    dispatch(actions.getHotCollections.success(data.data));
  } catch (err) {
    dispatch(actions.getHotCollections.failure(err));
    console.log('catch')
  }
};


export const fetchComingSoonCollections = () => async (dispatch) => {
  dispatch(actions.getComingCollections.request(Canceler.cancel));
  console.log('bahr')
  try {
    let populate = `populate=*&filters[status]=inactive`;
    const { data } = await Axios.get(`${api.baseUrl + api.collection}?${populate}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    console.log('andar')
    console.log(data)
    dispatch(actions.getComingCollections.success(data.data));
  } catch (err) {
    dispatch(actions.getComingCollections.failure(err));
    console.log('catch')
  }
};
