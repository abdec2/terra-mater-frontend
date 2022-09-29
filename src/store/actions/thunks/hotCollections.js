import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchHotCollections = (collectionId) => async (dispatch) => {
  dispatch(actions.getHotCollections.request(Canceler.cancel));

  try {
    // let filter = collectionId ? 'filters[id][$eq]='+collectionId : '';
    // const relations = [
    //   'author',
    //   'author.avatar',
    //   'author.banner',
    //   'banner',
    // ];
    // let populate = `populate=${relations}&`; ${filter}
    let populate = `populate=*`;
    const { data } = await Axios.get(`${api.baseUrl + api.collections}/get_collection?${populate}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    console.log(data)
    dispatch(actions.getHotCollections.success(data));
  } catch (err) {
    dispatch(actions.getHotCollections.failure(err));
  }
};
