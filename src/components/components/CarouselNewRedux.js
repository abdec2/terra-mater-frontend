import React, { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import styled from "styled-components";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Clock from "./Clock";
import { carouselNew } from './constants';
import * as selectors from '../../store/selectors';
import { fetchNftsBreakdown } from "../../store/actions/thunks";
import api from "../../core/api";
import { useNavigate } from "react-router-dom";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const CarouselNewRedux = () => {

    const dispatch = useDispatch();
    const nftsState = useSelector(selectors.nftBreakdownState);
    const nfts = nftsState.data ? nftsState.data : [];
    const navigate = useNavigate()
    const navigateTo = (link) => {
        navigate(link)
    }

    const [height, setHeight] = useState(0);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }
    console.log(nfts)
    useEffect(() => {
        dispatch(fetchNftsBreakdown());
    }, [dispatch]);

    return (
        <div className='nft'>
          <Slider {...carouselNew}>
          {nfts && nfts.length && nfts.map( (nft, index) => (
            <div className='itm' index={index + 1} key={index}>
              <div className="d-item">
                <div className="nft__item p-0">
                    { nft.deadline &&
                        <div className="de_countdown">
                            <Clock deadline={nft.deadline} />
                        </div>
                    }
                    {/* <div className="author_list_pp">
                        <span onClick={()=> navigateTo(`/colection/${nft.collection.id}`)}>
                            { nft.collection.feature_img.data !== null && 
                                <img className="lazy" src={nft.collection.feature_img.url} alt=""/>
                            }                                    
                            <i className="fa fa-check"></i>
                        </span>
                    </div> */}
                    <div className="nft__item_wrap mt-0" style={{height: `${height}px`}}>
                      <Outer>
                        <span>
                            <img src={nft.img_url} style={{borderRadius: '0'}} className="lazy nft__item_preview" onLoad={onImgLoad} alt=""/>
                        </span>
                      </Outer>
                    </div>
                    <div className="nft__item_info p-3 pt-0 pb-1 ">
                        <span onClick={()=> navigateTo(`/ItemDetail/${nft.id}`)}>
                            <h4>{nft.token_name}</h4>
                        </span>
                        <div className="nft__item_price">
                            {nft.price} USDT
                        </div>
                        <div className="nft__item_action">
                            <span onClick={()=> navigateTo(`/ItemDetail/${nft.id}`)}>{nft.nft_status.Status === "Mint" ? "Mint" : nft.nft_status.Status === "Buy Now" ? "Buy Now" : "Not for sale" }</span>
                        </div>
                        <div className="nft__item_like">
                            <i className="fa fa-heart"></i><span>{nft.likes}</span>
                        </div>                                                        
                    </div> 
                </div>
              </div>
            </div>
          ))}
          </Slider>
        </div>
    );
}

export default memo(CarouselNewRedux);
