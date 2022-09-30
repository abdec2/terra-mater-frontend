import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchCategories = () => async (dispatch) => {
    dispatch(actions.fetchCategories.request(Canceler.cancel));
  
    try {
      const { data } = await Axios.get(`${api.baseUrl + api.categories}`, {
        cancelToken: Canceler.token,
        params: {}
      });
      dispatch(actions.fetchCategories.success(data.data));
    } catch (err) {
      dispatch(actions.fetchCategories.failure(err));
    }
  };

  export const fetchStatus = () => async (dispatch) => {
    dispatch(actions.fetchStatus.request(Canceler.cancel));
  
    try {
      const { data } = await Axios.get(`${api.baseUrl + api.status}`, {
        cancelToken: Canceler.token,
        params: {}
      });
      dispatch(actions.fetchStatus.success(data.data));
    } catch (err) {
      dispatch(actions.fetchStatus.failure(err));
    }
  };