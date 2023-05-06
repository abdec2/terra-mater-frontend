import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Clock from "../components/Clock";
import Footer from '../components/footer';
//import { createGlobalStyle } from 'styled-components';
import * as selectors from '../../store/selectors';
import { fetchNftDetail, mintNFT, addTransaction } from "../../store/actions/thunks";
/*import Checkout from "../components/Checkout";*/
import api from "../../core/api";
import moment from "moment";
import usdtAbi from './../../config/usdtAbi.json'
import marketplaceAbi from './../../config/Marketplace.json'
import nftAbi from './../../config/NftAbi.json'
import { useNavigate } from 'react-router-dom';

import { useParams } from "react-router-dom";
import { reconnectWallet } from "../menu/connectWallet";

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
import { UsdtIcon } from "../../myFiles/components/Icons";
import { CONFIG } from "../../config/config";
import auth from "../../core/auth";
import axios from "axios";
import { useCallback } from "react";
import { useState } from "react";
import Accordian from "../../myFiles/components/Accordian";
import PriceHistory from "../../myFiles/components/PriceHistory";


//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const ItemDetailRedux = () => {
    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(link);
    }
    const userInfo = auth.getUserInfo()
    const jwtToken = auth.getToken()
    const [openMenu0, setOpenMenu0] = React.useState(true);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const [loading, setLoading] = React.useState(false)
    const [like, setLike] = useState(false)
    const [likeData, setLikeData] = useState(0)

    const web3Store = useSelector(state => state.web3)
    const web3 = web3Store.web3;
    console.log(web3Store)

    const { nftId } = useParams();

    const dispatch = useDispatch();
    const nftDetailState = useSelector(selectors.nftDetailState);
    const nft = nftDetailState.data ? nftDetailState.data : [];
    console.log(nft);
    
    const [openCheckout, setOpenCheckout] = React.useState(false);
    const [openCheckoutbid, setOpenCheckoutbid] = React.useState(false);

    const handleOpenCheckout = async () => {
        if (!web3Store.account) {
            await reconnectWallet(dispatch)
        }
        setOpenCheckout(true)
    }

    const approveNFTContractForUSDT = async () => {
        try {
            console.log('asdasd')
            const approveAmount = web3.utils.toWei(nft.price.toString(), 'mwei')
            const usdtContract = new web3.eth.Contract(usdtAbi, CONFIG.USDT_ADDRESS)
            const estimateGas = await usdtContract.methods.approve(nft.collection.contract_address, approveAmount.toString()).estimateGas({ from: web3Store.account })
            const approvetx = await usdtContract.methods.approve(nft.collection.contract_address, approveAmount.toString()).send({ from: web3Store.account, gasLimit: estimateGas.toString() })
            console.log(approvetx)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const approveMktPlaceForUSDT = async () => {
        try {
            const approveAmount = web3.utils.toWei(nft.price.toString(), 'mwei')
            const usdtContract = new web3.eth.Contract(usdtAbi, CONFIG.USDT_ADDRESS)
            const estimateGas = await usdtContract.methods.approve(CONFIG.MARKETPLACE_ADDRESS, approveAmount.toString()).estimateGas({ from: web3Store.account })
            const approvetx = await usdtContract.methods.approve(CONFIG.MARKETPLACE_ADDRESS, approveAmount.toString()).send({ from: web3Store.account, gasLimit: estimateGas.toString() })
            console.log(approvetx)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const handleApprove = async () => {
        try {
            if (!web3Store.account) {
                await reconnectWallet(dispatch)
            }
            setLoading(true)

            if (nft.nft_status.Status.toLowerCase() === "mint") {
                await approveNFTContractForUSDT()
            } else {
                await approveMktPlaceForUSDT()
            }

        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const handleMint = async () => {
        try {
            setLoading(true)
            const nftPrice = web3.utils.toWei(nft.price.toString(), 'mwei')
            const nftContract = new web3.eth.Contract(nftAbi, nft.collection.contract_address)
            console.log(nftPrice.toString())
            const estimateGas = await nftContract.methods.mint(nft.token_id, nftPrice.toString()).estimateGas({ from: web3Store.account })
            const mintTx = await nftContract.methods.mint(nft.token_id, nftPrice.toString()).send({ from: web3Store.account, gasLimit: estimateGas.toString() })
            console.log(mintTx)
            dispatch(addTransaction(nftId, web3Store.account, nft.price.toString(), 'Mint'))
            setLoading(false)
            setOpenCheckout(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }

    }

    const handleBuy = async () => {
        try {
            setLoading(true)
            const nftPrice = web3.utils.toWei(nft.price.toString(), 'mwei')
            const mpContract = new web3.eth.Contract(marketplaceAbi, CONFIG.MARKETPLACE_ADDRESS)
            const estimateGas = await mpContract.methods.createMarketSale(nft.collection.contract_address, nft.item_id, nftPrice.toString()).estimateGas({ from: web3Store.account })
            console.log(estimateGas.toString())
            const createSaleTx = await mpContract.methods.createMarketSale(nft.collection.contract_address, nft.item_id, nftPrice.toString()).send({ from: web3Store.account, gasLimit: estimateGas.toString() })
            console.log(createSaleTx)
            dispatch(addTransaction(nftId, web3Store.account, nft.price.toString(), 'Buy'))
            setLoading(false)
            setOpenCheckout(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const handleTransaction = async () => {
        try {
            if (!web3Store.account) {
                await reconnectWallet(dispatch)
            }
            if (nft.nft_status.Status.toLowerCase() === "mint") {
                handleMint()
            } else {
                handleBuy()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const makeTransaction = async () => {
        try {
            if (nft.owner && nft.owner !== '' && isOwner(nft.owner)) {
                return
            }
            await handleApprove()
            await handleTransaction()
        } catch (e) {
            console.log(e)
        }
    }

    const isOwner = (address) => {
        console.log('address', address)
        if(userInfo) {
            return userInfo.address.toLowerCase() === address?.toLowerCase()
        }
        return false
    }

    const formatOwner = (address) => {
        if (isOwner()) {
            return 'You'
        }

        return `${address.slice(0, 5)}...${address.slice(37, 42)}`;
    }

    const updateCallback = useCallback(() => {
        updateViewCount()
    }, [nft])

    const updateLikeCount = async () => {
        try {
            console.log(like)
            const likeValue = !like ? 1 : -1
            console.log(likeValue)
            console.log(nft.likes)
            const res = await axios.put(`${api.baseUrl+api["nft-v1s"]}/${nftId}`, {
                    data: {
                        "likes": parseInt(likeData) + likeValue
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            )
            setLikeData(res.data.data.attributes.likes)
            console.log(res.data)
            
        } catch (e) {
            console.log(e)
        }
    }

    const updateViewCount = async () => {
        try {
            console.log(nft.views)
            const res = await axios.put(`${api.baseUrl+api["nft-v1s"]}/${nftId}`, {
                    data: {
                        "views": parseInt(nft.views) + 1
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            )
        } catch (e) {
            console.log(e)
        }
    }

    const kFormatter = (num) =>  {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(2)) + 'k' : Math.sign(num)*Math.abs(num)
    }

    useEffect(() => {
        updateCallback()
        setLikeData(nft.likes)
    }, [nft])

    useEffect(() => {
        dispatch(fetchNftDetail(nftId));
        
    }, [dispatch, nftId]);

    return (
        <div className="greyscheme">
            <StyledHeader theme={theme} />
            <section className='container'>
                <div className='row mt-md-5 pt-md-4'>
                    <div className="col-md-6 text-center">
                        <img src={nft && nft.img_url} className="img-fluid img-rounded mb-sm-30" alt="" />
                    </div>
                    <div className="col-md-6">
                        <div className="item_info">
                            {nft.item_type === 'on_auction' &&
                                <>
                                    Auctions ends in
                                    <div className="de_countdown">
                                        <Clock deadline={nft.deadline} />
                                    </div>
                                </>
                            }
                            <h2>{nft.title}</h2>
                            <div className="item_info_counts">
                                <div className="item_info_type"><i className="fa fa-image"></i>{nft && nft.collection && nft.collection.category && nft.collection.category.category}</div>
                                <div className="item_info_views"><i className="fa fa-eye"></i>{kFormatter(nft.views)}</div>
                                <div className={`item_info_like`} style={{cursor: 'pointer'}} onClick={() => {
                                    setLike(!like)
                                    updateLikeCount()
                                }}><i className={`fa fa-heart ${like ? 'text-danger' : ''}`}></i>{kFormatter(likeData)}</div>
                            </div>
                            <h3 className="text-uppercase color mb-0">{nft.token_name}</h3>
                            <div className="mb-3">
                                <span>Owner:</span>
                                <span className="ms-3">{nft.chain_data?.length > 0 ? `${nft.chain_data[0].owner_of.slice(0, 5)}....${nft.chain_data[0].owner_of.slice(37, 42)}`: ''}</span>
                            </div>
                            <p>{nft.description}</p>

                            <div className="d-flex flex-row">
                                <div className="mr40">
                                    <h6>Collection</h6>
                                    <div className="item_author" onClick={() => navigateTo(`/colection/${nft.collection && nft.collection.id}`)}>
                                        <div className="author_list_pp">
                                            <span>
                                                <img className="lazy" src={(nft.collection && nft.collection.feature_img) ? nft.collection && nft.collection.feature_img.url : `https://via.placeholder.com/300?text=${nft.collection && nft.collection.name}`} alt="" />
                                                <i className="fa fa-check"></i>
                                            </span>
                                        </div>
                                        <div className="author_list_info" style={{ cursor: 'pointer' }}>
                                            <span>{nft.collection && nft.collection.name}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="spacer-40"></div>

                            <div className="d-block mb-3">
                                <div className="mb-3">
                                    <span>Current price</span>
                                    <h3 className="mb-1"> <UsdtIcon size={20} />&nbsp;&nbsp; {nft.price}</h3>
                                </div>
                                <div className="d-flex flex-row">
                                    {
                                        nft.nft_status && nft.nft_status.Status === 'Mint' && (
                                            <button className='btn-main lead  mr15' onClick={handleOpenCheckout}>Mint</button>
                                        )

                                    }
                                    {
                                        nft.chain_data && nft.chain_data.length > 0 && nft.chain_data[0].owner_of.toLowerCase() === CONFIG.MARKETPLACE_ADDRESS.toLowerCase() && (
                                            <button className='btn-main lead  mr15' onClick={handleOpenCheckout}>Buy Now</button>
                                        )
                                    }

                                </div>
                                
                                {/* <div className="row mt-5">
                                    {
                                        nft.props && nft.props.map((item, key) => (
                                            <div key={key} className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>{item.Property}</h5>
                                                    <h4>{item.value}</h4>
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div> */}

                            </div>

                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-sm-12 col-md-6">
                        <Accordian nft={nft} />
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <PriceHistory nft={nft} />
                    </div>
                </div>
               
            </section>
            <Footer />
            {openCheckout && (
                <>
                    {
                        !loading ? (
                            <div className='checkout'>
                                <div className='maincheckout'>
                                    <button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                                    <div className='heading'>
                                        <h3>Checkout</h3>
                                    </div>
                                    <p>You are about to purchase a <span className="bold">{nft.token_name}</span>
                                    </p>

                                    <div className='heading mt-3'>
                                        <p>Item price</p>
                                        <div className='subtotal'>
                                            <UsdtIcon size={20} /> {nft.price} USDT
                                        </div>
                                    </div>
                                    {
                                        nft.nft_status.Status.toLowerCase() === 'buy now' ? (
                                            <div className='heading '>
                                                <p>5% Sale fee is included in this price. </p>
                                            </div>
                                        ) : ''
                                    }
                                    <div className="d-flex flex-row">
                                        {/* <div className="w-100 px-2">
                                            <button className='btn-main lead mb-5' onClick={handleApprove}>Approve</button>
                                        </div> */}
                                        <div className="w-100 px-2">
                                            <button className='btn-main lead mb-5' onClick={makeTransaction}>{nft.nft_status.Status}</button>
                                        </div>
                                    </div>
                                    <div>
                                        <span>Note: Kindly approve before minting / buying.</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='checkout'>
                                <div className='maincheckout'>
                                    <button disabled className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                                    <div className='heading mt-5'>
                                        <p className="w-100 text-center">Waiting for Transaction...</p>
                                    </div>
                                </div>
                            </div>
                        )

                    }

                </>
            )
            }


        </div>
    );
}

export default memo(ItemDetailRedux);