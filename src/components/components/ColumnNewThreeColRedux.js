import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions/thunks';
import NftCard from './NftCard';
import { clearNfts, clearFilter } from '../../store/actions';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from 'react-bootstrap/Spinner';


const ColumnNewThreeColRedux = () => {

    const dispatch = useDispatch();

    const { data, meta } = useSelector(selectors.nftItems);
    console.log(data)
    const [height, setHeight] = useState(0);
    const [page, setPage] = useState(1);

    const onImgLoad = ({ target: img }) => {
        let currentHeight = height;
        if (currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    useEffect(() => {
        if (!data || data.length === 0) {
            dispatch(actions.fetchNftsBreakdown());
        }
    }, [dispatch]);

    //will run when component unmounted
    useEffect(() => {
        return () => {
            dispatch(clearFilter());
            dispatch(clearNfts());
        }
    }, [dispatch]);

    const loadMore = () => {
        dispatch(actions.fetchNftsBreakdown(page + 1));
        setPage(page + 1)
    }

    return (
        <>
            {data && (
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMore}
                    hasMore={data.length !== meta.total}
                    loader={<Spinner animation="border" />}
                    style={{overflow: 'hidden'}}
                >
                    <div className='row'>
                        {data && data.map((nft, index) => (
                            <NftCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} className="d-item col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4" />
                        ))}
                        <div className='col-lg-12'>
                            <div className="spacer-single"></div>
                        </div>

                    </div>
                </InfiniteScroll>
            )}
        </>
    );
}

export default memo(ColumnNewThreeColRedux);