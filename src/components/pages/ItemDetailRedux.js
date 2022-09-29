import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Clock from "../components/Clock";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import * as selectors from '../../store/selectors';
import { fetchNftDetail } from "../../store/actions/thunks";
/*import Checkout from "../components/Checkout";
import Checkoutbid from "../components/Checkoutbid";*/
import api from "../../core/api";
import moment from "moment";
import { useParams } from "react-router-dom";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
  }
  .mr40{
    margin-right: 40px;
  }
  .mr15{
    margin-right: 15px;
  }
  .btn2{
    background: #f6f6f6;
    color: #8364E2 !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const ItemDetailRedux = () => {

    const [openMenu0, setOpenMenu0] = React.useState(true);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const { nftId } = useParams();
    console.log(nftId)

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

    useEffect(() => {
        dispatch(fetchNftDetail(nftId));
    }, [dispatch, nftId]);

    return (
        <div>
            <GlobalStyles />
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
                            <p>{nft.description}</p>

                            <div className="d-flex flex-row">
                                {/* <div className="mr40">
                                    <h6>Creator</h6>
                                    <div className="item_author">                                    
                                        <div className="author_list_pp">
                                            <span>
                                                <img className="lazy" src={nft.author && api.baseUrl + nft.author.avatar.url} alt=""/>
                                                <i className="fa fa-check"></i>
                                            </span>
                                        </div>                                    
                                        <div className="author_list_info">
                                            <span>{nft.author && nft.author.username}</span>
                                        </div>
                                    </div>
                                </div> */}
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
                                <div className="mr40">
                                    <h6>Owner</h6>
                                    <span>{nft.owner !== '' ? nft.owner : nft.collection && `${nft.collection.contract_address.slice(0, 5)}....${nft.collection.contract_address.slice(37, 42)}`}</span>

                                </div>

                                <div className="row mt-3">
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
                                    <div className="d-flex flex-row mt-5">
                                        {
                                            nft.nft_status && nft.nft_status.Status === 'Mint' && (
                                                <button className='btn-main lead mb-5 mr15' onClick={() => setOpenCheckout(true)}>Mint</button>
                                            )
                                            
                                        }
                                        {
                                            nft.nft_status && nft.nft_status.Status === 'Buy Now' && (
                                                <button className='btn-main lead mb-5 mr15' onClick={() => setOpenCheckout(true)}>Buy Now</button>
                                            )
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            {openCheckout &&
                <div className='checkout'>
                    <div className='maincheckout'>
                        <button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                        <div className='heading'>
                            <h3>Checkout</h3>
                        </div>
                        <p>You are about to purchase a <span className="bold">AnimeSailorClub #304</span>
                            <span className="bold">from Monica Lucas</span></p>
                        <div className='detailcheckout mt-4'>
                            <div className='listcheckout'>
                                <h6>
                                    Enter quantity.
                                    <span className="color">10 available</span>
                                </h6>
                                <input type="text" name="buy_now_qty" id="buy_now_qty" className="form-control" />
                            </div>

                        </div>
                        <div className='heading mt-3'>
                            <p>Your balance</p>
                            <div className='subtotal'>
                                10.67856 ETH
                            </div>
                        </div>
                        <div className='heading'>
                            <p>Service fee 2.5%</p>
                            <div className='subtotal'>
                                0.00325 ETH
                            </div>
                        </div>
                        <div className='heading'>
                            <p>You will pay</p>
                            <div className='subtotal'>
                                0.013325 ETH
                            </div>
                        </div>
                        <button className='btn-main lead mb-5'>Checkout</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default memo(ItemDetailRedux);