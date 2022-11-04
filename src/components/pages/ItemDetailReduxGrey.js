import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Clock from "../components/Clock";
import Footer from '../components/footer';
//import { createGlobalStyle } from 'styled-components';
import * as selectors from '../../store/selectors';
import { fetchNftDetail, mintNFT } from "../../store/actions/thunks";
/*import Checkout from "../components/Checkout";*/
import api from "../../core/api";
import moment from "moment";
import usdtAbi from './../../config/usdtAbi.json'
import marketplaceAbi from './../../config/Marketplace.json'
import nftAbi from './../../config/NftAbi.json' 

import { useParams } from "react-router-dom";

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
import { UsdtIcon } from "../../myFiles/components/Icons";
import { CONFIG } from "../../config/config";
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const ItemDetailRedux = () => {

    const [openMenu0, setOpenMenu0] = React.useState(true);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const [loading, setLoading] = React.useState(false)

    const web3Store = useSelector(state => state.web3)
    const web3 = web3Store.web3;
    console.log(web3Store)

    const { nftId } = useParams();

    const handleBtnClick0 = () => {
        setOpenMenu0(!openMenu0);
        setOpenMenu(false);
        setOpenMenu1(false);
        document.getElementById("Mainbtn0").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
        document.getElementById("Mainbtn1").classList.remove("active");
    };
    const handleBtnClick = () => {
        setOpenMenu(!openMenu);
        setOpenMenu1(false);
        setOpenMenu0(false);
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
        document.getElementById("Mainbtn0").classList.remove("active");
    };
    const handleBtnClick1 = () => {
        setOpenMenu1(!openMenu1);
        setOpenMenu(false);
        setOpenMenu0(false);
        document.getElementById("Mainbtn1").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
        document.getElementById("Mainbtn0").classList.remove("active");
    };

    const dispatch = useDispatch();
    const nftDetailState = useSelector(selectors.nftDetailState);
    const nft = nftDetailState.data ? nftDetailState.data : [];
    console.log(nft);

    const [openCheckout, setOpenCheckout] = React.useState(false);
    const [openCheckoutbid, setOpenCheckoutbid] = React.useState(false);

    const handleApprove = async () => {
        try {
            if (!web3Store.account) {
                alert('connect wallet')
                return
            }
            setLoading(true)
            const approveAmount = web3.utils.toWei(nft.price.toString(), 'mwei')
            const usdtContract = new web3.eth.Contract(usdtAbi, CONFIG.USDT_ADDRESS)
            const estimateGas = await usdtContract.methods.approve(CONFIG.MARKETPLACE_ADDRESS, approveAmount.toString()).estimateGas({ from: web3Store.account })
            const approvetx = await usdtContract.methods.approve(CONFIG.MARKETPLACE_ADDRESS, approveAmount.toString()).send({ from: web3Store.account, gasLimit: estimateGas.toString() })
            console.log(approvetx)
            setLoading(false)
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
            const estimateGas = await nftContract.methods.mint(nft.token_id, nftPrice.toString()).estimateGas({from: web3Store.account})
            const mintTx = await nftContract.methods.mint(nft.token_id, nftPrice.toString()).send({ from: web3Store.account, gasLimit: estimateGas.toString()})
            console.log(mintTx)
            dispatch(mintNFT(nftId, web3Store.account))
            setLoading(false)
            setOpenCheckout(false)
        } catch(e) {
            console.log(e)
            setLoading(false)
        }
            
    }

    const handleBuy = async () => {
        
    }

    const handleTransaction = async () => {
        try {
            if (!web3Store.account) {
                alert('connect wallet')
                return
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
                                <div className="item_info_views"><i className="fa fa-eye"></i>{nft.views}</div>
                                <div className="item_info_like"><i className="fa fa-heart"></i>{nft.likes}</div>
                            </div>
                            <h3 className="text-uppercase color mb-0">{nft.token_name}</h3>
                            <div className="mb-3">
                                <span>Owner:</span>
                                <span className="ms-3">{nft.owner && nft.owner !== '' ? `${nft.owner.slice(0, 5)}....${nft.owner.slice(37, 42)}` : nft.collection && `${nft.collection.contract_address.slice(0, 5)}....${nft.collection.contract_address.slice(37, 42)}`}</span>
                            </div>
                            <p>{nft.description}</p>

                            <div className="d-flex flex-row">
                                <div className="mr40">
                                    <h6>Collection</h6>
                                    <div className="item_author">
                                        <div className="author_list_pp">
                                            <span>
                                                <img className="lazy" src={nft.collection && nft.collection.feature_img.url} alt="" />
                                                <i className="fa fa-check"></i>
                                            </span>
                                        </div>
                                        <div className="author_list_info">
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
                                            <button className='btn-main lead  mr15' onClick={() => setOpenCheckout(true)}>Mint</button>
                                        )

                                    }
                                    {
                                        nft.nft_status && nft.nft_status.Status === 'Buy Now' && (
                                            <button className='btn-main lead  mr15' onClick={() => setOpenCheckout(true)}>Buy Now</button>
                                        )
                                    }

                                </div>

                                <div className="row mt-5">
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

                                </div>

                            </div>

                            <div className="de_tab">

                                {/* <ul className="de_nav">
                                    <li id='Mainbtn0' className="active"><span onClick={handleBtnClick0}>Details</span></li>
                                    <li id='Mainbtn' ><span onClick={handleBtnClick}>Bids</span></li>
                                    <li id='Mainbtn1' className=''><span onClick={handleBtnClick1}>History</span></li>
                                </ul> */}


                                <div className="de_tab_content">
                                    {/* button for checkout */}

                                </div>
                            </div>
                        </div>
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
                                   
                                    <div className="d-flex flex-row">
                                        <div className="w-100 px-2">
                                            <button className='btn-main lead mb-5' onClick={handleApprove}>Approve</button>
                                        </div>
                                        <div className="w-100 px-2">
                                            <button className='btn-main lead mb-5' onClick={handleTransaction}>{nft.nft_status.Status}</button>
                                        </div>
                                    </div>
                                    <div>
                                        <span>Note: Kindly approve before minting / buying.</span>
                                    </div>
                                </div>
                            </div>
                        ): (
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