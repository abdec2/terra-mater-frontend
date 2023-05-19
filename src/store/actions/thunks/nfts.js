import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';
import auth from '../../../core/auth';
import Moralis from 'moralis'
import { CONFIG } from '../../../config/config';



export const fetchNftsBreakdown = (page = 1, collectionId, isMusic = false) => async (dispatch) => {

  dispatch(actions.getNftBreakdown.request(Canceler.cancel));

  try {
    const filters = collectionId ? `${'collectionId=' + collectionId}` : ''
    const { data, meta } = await Axios.get(`${api.baseUrl}${api['nft-v1s']}?page=${page}&${filters}`, {
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

export const addTransaction = (nftId, newOwner, price, desc) => async (dispatch) => {
  try {
    const token = auth.getToken()
    const { data } = await Axios.get(`${api.baseUrl}${api['nft-v1s']}/${nftId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    )
    const res = await Axios.post(`${api.baseUrl+api.transaction}`, {
      data: {
        collection: data.collection.id,
        nft_v_1: data.id, 
        from_address: data.owner !== null && data.owner !== '' && data.owner !== undefined ? data.owner : '0x0000000000000000000000000000000000000000',
        to_address: newOwner,
        price: price,
        desc: desc
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    dispatch(mintNFT(nftId, newOwner))

  } catch (err) {
    console.log(err)
  }
}

export const mintNFT = (nftId, ownerAddress) => async (dispatch) => {
  console.log(nftId)
  try {
    const token = auth.getToken()
    const { data } = await Axios.put(`${api.baseUrl}${api['nft-v1s']}/${nftId}`,
      {
        data: {
          owner: ownerAddress,
          nft_status: 3
        }
      }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    )

    dispatch(fetchNftDetail(nftId))

  } catch (err) {
    console.log(err)
  }

}

export const fetchNftDetail = (nftId) => async (dispatch) => {
  console.log(nftId)
  dispatch(actions.getNftDetail.request(Canceler.cancel));

  try {
    const relations = [
      'collection',
      'nft_status',
      'collection.feature_img',
      'transaction'
    ];
    let populate = `populate=${relations}`;
    const { data } = await Axios.get(`${api.baseUrl}${api['nft-v1s']}/${nftId}?${populate}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    console.log("data", data)
    const chaindata = await getNFTChainData(data.token_id, data.collection.contract_address)
    data["chain_data"] = chaindata 
    dispatch(actions.getNftDetail.success(data));
  } catch (err) {
    dispatch(actions.getNftDetail.failure(err));
  }
};

export const getNFTChainData = async (token_id, contractAddress) => {
  try {
    console.log(token_id, contractAddress)
    const response = await Moralis.EvmApi.nft.getNFTTokenIdOwners({
      "chain": CONFIG.CHAIN_ID_HEX,
      "format": "decimal",
      "normalizeMetadata": true,
      "disableTotal": true,
      "mediaItems": true,
      "address": contractAddress,
      "tokenId": token_id
    });

    return response.raw.result
  
  } catch(e) {
    console.log(e)
  }
}
