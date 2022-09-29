import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchHotCollections = (collectionId) => async (dispatch) => {
  dispatch(actions.getHotCollections.request(Canceler.cancel));

  try {
    const filter = collectionId ? `id=${collectionId}` : ''
    let populate = `populate=*`;
    const { data } = await Axios.get(`${api.baseUrl + api.collections}/get_collection?${populate}&${filter}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    console.log(data)
    dispatch(actions.getHotCollections.success(data));
  } catch (err) {
    dispatch(actions.getHotCollections.failure(err));
  }
};
