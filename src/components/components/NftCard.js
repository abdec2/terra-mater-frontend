import React, { memo } from 'react';
import styled from "styled-components";
import Clock from "./Clock";
import { useNavigate } from 'react-router-dom';
import api from '../../core/api';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 0px;
`;

//react functional component
const NftCard = ({ nft, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', clockTop = true, height, onImgLoad }) => {
    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(link);
    }

    return (
        <div className={className}>
            <div className="nft__item m-0 p-0">
                {/* { nft.item_type === 'single_items' ? (
             <div className='icontype'><i className="fa fa-bookmark"></i></div>   
             ) : (  
             <div className='icontype'><i className="fa fa-shopping-basket"></i></div>
                )
            } */}
                {/* {nft.deadline && clockTop &&
                    <div className="de_countdown">
                        <Clock deadline={nft.deadline} />
                    </div>
                }
                {nft.collection && nft.collection.feature_img && nft.collection.feature_img.url &&
                    <div className="author_list_pp">
                        <span onClick={() => navigateTo(`/colection/${nft.collection.id}`)}>
                            <img className="lazy" src={nft.collection.feature_img.url} alt="" />
                            <i className="fa fa-check"></i>
                        </span>
                    </div>
                } */}
                <div className="nft__item_wrap mt-0" style={{ height: `${height}px` }}>
                    <Outer>
                        <span>
                            <img style={{borderRadius: '0'}} onLoad={onImgLoad}  src={nft.img_url} className="lazy nft__item_preview" alt="" />
                        </span>
                    </Outer>
                </div>
                {nft.deadline && !clockTop &&
                    <div className="de_countdown">
                        <Clock deadline={nft.deadline} />
                    </div>
                }
                <div className="nft__item_info p-3 pt-0 pb-1">
                    <span onClick={() => navigateTo(`/ItemDetail/${nft.id}`)}>
                        <h4>{nft.token_name}</h4>
                    </span>
                    <div className="nft__item_price">
                        {nft.price} USDT
                        {/* {nft.status === 'on_auction' &&
                            <span>{nft.bid}/{nft.max_bid}</span>
                        } */}
                    </div>
                    <div className="nft__item_action">
                        <span onClick={() => navigateTo(`/ItemDetail/${nft.id}`)}>{nft.nft_status.Status === 'Mint' ? 'Mint Now' : nft.nft_status.Status === 'Buy Now' ? 'Buy Now' : 'View'}</span>
                    </div>
                    <div className="nft__item_like">
                        <i className="fa fa-heart"></i><span>{nft.likes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(NftCard);