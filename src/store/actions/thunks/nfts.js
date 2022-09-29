import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchNftsBreakdown = (page=1, collectionId, isMusic = false) => async (dispatch) => {

  dispatch(actions.getNftBreakdown.request(Canceler.cancel));

  try {
    
    const { data } = await Axios.get(`${api.baseUrl}${api['nft-v1s']}?page=${page}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    dispatch(actions.getNftBreakdown.success(data));
  } catch (err) {
    dispatch(actions.getNftBreakdown.failure(err));
  }
};

export const fetchNftShowcase = () => async (dispatch) => {

  dispatch(actions.getNftShowcase.request(Canceler.cancel));

  try {
    const { data } = await Axios.get(`${api.baseUrl}${api.nftShowcases}`, {
      cancelToken: Canceler.token,
      params: {}
    });

    dispatch(actions.getNftShowcase.success(data.data.attributes));
  } catch (err) {
    dispatch(actions.getNftShowcase.failure(err));
  }
};

export const fetchNftDetail = (nftId) => async (dispatch) => {
  console.log(nftId)
  dispatch(actions.getNftDetail.request(Canceler.cancel));

  try {
    const relations = [
      'collection',
      'nft_status',
      'collection.feature_img'
    ];
    let populate = `populate=${relations}`;
    const { data } = await Axios.get(`${api.baseUrl}${api['nft-v1s']}/${nftId}?${populate}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    dispatch(actions.getNftDetail.success(data));
  } catch (err) {
    dispatch(actions.getNftDetail.failure(err));
  }
};
