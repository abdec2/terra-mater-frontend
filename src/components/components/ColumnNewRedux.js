import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions/thunks';
import { clearNfts, clearFilter } from '../../store/actions';
import NftCard from './NftCard';
import NftMusicCard from './NftMusicCard';
import { shuffleArray } from '../../store/utils';
import { fetchCollectionNfts } from './../../store/actions/thunks'

//react functional component
const ColumnNewRedux = ({ showLoadMore = true, shuffle = false, authorId = null }) => {

    const dispatch = useDispatch();
    const store = useSelector(state => state);
    const nftItems = useSelector(selectors.collectionNft);
    const nfts = nftItems ? shuffle ? shuffleArray(nftItems) : nftItems : [];
    const [height, setHeight] = useState(0);
    const [page, setPage] = useState(1);
    console.log(nfts)
    console.log(store)
    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }
    
    useEffect(() => {
        if(authorId) {
            dispatch(actions.fetchCollectionNfts(page, authorId));
        }
    }, [dispatch, authorId]);

    //will run when component unmounted
    useEffect(() => {
        return () => {
            dispatch(clearFilter());
            dispatch(clearNfts());
        }
    },[dispatch]);

    const loadMore = () => {
        dispatch(actions.fetchCollectionNfts(page + 1, authorId));
        setPage(page + 1);
    }

    return (
        <div className='row'>
            {nfts && nfts.map( (nft, index) => (
                nft.category === 'music' ?
                <NftMusicCard nft={nft} audioUrl={nft.audio_url} key={index} onImgLoad={onImgLoad} height={height} />
                :
                <NftCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
            ))}
            { showLoadMore  &&
                <div className='col-lg-12'>
                    <div className="spacer-single"></div>
                    <span onClick={loadMore} className="btn-main lead m-auto">Load More</span>
                </div>
            }
        </div>              
    );
};

export default memo(ColumnNewRedux);