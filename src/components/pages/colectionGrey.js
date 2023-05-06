import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ColumnNewRedux from '../components/ColumnNewRedux';
import Footer from '../components/footer';
import * as selectors from '../../store/selectors';
import { fetchCollections, fetchCollectionNfts, searchCollectionNFT, fetchMarketItems } from "../../store/actions/thunks";
import api from "../../core/api";
import { useParams } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from 'react-bootstrap/Spinner';
import NftCard from '../components/NftCard';
import Form from 'react-bootstrap/Form';
import StickyBox from "react-sticky-box";
import { FacebookShareButton, TwitterShareButton } from "react-share";


//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
import { DiscordIcon, EtherscanIcon, FacebookIcon, TelegramIcon, TwitterIcon, UsdtIcon, WebsiteIcon } from "../../myFiles/components/Icons";
import TooltipIcon from "../../myFiles/components/TooltipIcon";
import { Button } from "react-bootstrap";
import CheckboxFilter from "../components/CheckboxFilter";
import { clearFilter, clearCollectionNfts } from "../../store/actions";
import axios from "axios";
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    className="px-2"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}

  </a>
));

const Colection = function () {
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0)
  const [height, setHeight] = useState(0);
  const [selStatus, setSelStatus] = useState([])
  const searchTxt = useRef(null)
  const { collectionId } = useParams();
  const dispatch = useDispatch();
  const store = useSelector(state => state)
  const collectionState = useSelector(selectors.collectionState);
  const collectionNft = useSelector(selectors.collectionNft);
  const filteredNft = useSelector(state => state.filters.selectedStatus);
  const hotCollections = collectionState.data ? collectionState.data[0] : {};
  const nftItems = (filteredNft.data) ? filteredNft.data : collectionNft;
  const [marketItems, setMarketItems] = useState([])
  console.log(filteredNft)
  console.log(nftItems)
  console.log('hotCollections', hotCollections)


  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      setHeight(img.offsetHeight);
    }
  }

  const kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(2)) + 'k' : Math.sign(num) * Math.abs(num)
  }

  const loadMore = useCallback(() => {
    console.log(page)
    dispatch(fetchCollectionNfts(page, collectionId, selStatus));
  }, [page])

  const UpdateFilters = useCallback(() => {
    dispatch(fetchCollectionNfts(page, collectionId, selStatus, true));
  }, [selStatus.length])

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      dispatch(searchCollectionNFT(collectionId, searchTxt.current.value))
    }
  }

  const dateFormator = (date) => {
    const pDate = new Date(date)
    let month = pDate.toDateString()
    month = month.split(" ")
    return month[1] + " " + month[3]
  }

  const getNFTCount = async () => {
    const res = await axios.get(`${api.baseUrl}/api/nft?filters[collection]=${collectionId}`)
    console.log(res.data)
    const items = await fetchMarketItems()
    setMarketItems(items)
    setTotalItems(res.data.meta.pagination.total)
  }

  useEffect(() => {
    dispatch(fetchCollections(collectionId));
    if (filteredNft.data && collectionNft.data) {
      loadMore()
    }
  }, [dispatch, collectionId]);

  useEffect(() => {
    dispatch(clearCollectionNfts())
    dispatch(clearFilter())
    getNFTCount()
  }, [])

  useEffect(() => {
    if (selStatus.length === 0) {
      dispatch(clearFilter())
      if (!filteredNft.data) {
        loadMore()
      }
    } else {
      loadMore()
    }
  }, [page])

  useEffect(() => {
    if (selStatus.length === 0) {
      dispatch(clearFilter())
    } else {
      UpdateFilters()
    }
  }, [selStatus.length])

  return (
    <div className="greyscheme">
      <StyledHeader theme={theme} />
      <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${hotCollections.banner ? hotCollections.banner.url : 'https://via.placeholder.com/1920x380.png?text=Collection+Banner'})` }}>
        <div className='mainbreadcumb'>
        </div>
      </section>
      <section className='container-fluid d_coll no-top no-bottom pb-5 mb-5'>
        <div className='row'>
          <div className="col-md-12">
            <div className="px-2 px-md-5" >
              <div className="bg-white rounded-4 p-1" style={{ width: '150px', marginTop: '-120px' }}>
                <img className="rounded-4 w-100" src={hotCollections.feature_img ? hotCollections.feature_img.url : 'https://via.placeholder.com/150x150.png?text=Logo'} alt="" />
              </div>
            </div>
            <div className="px-2 px-md-5 d-flex  align-items-start justify-content-between flex-column flex-md-row flex-md-row-reverse">
              <div className="d-flex align-items-center justify-content-center collection-social-icon-parent ms-auto">
                <div className="d-none d-md-flex social align-items-center justify-content-center mt-4">
                  {
                    hotCollections && hotCollections.website && (
                      <TooltipIcon id='website' tooltipTxt='Website' placement='top' >
                        <a className="website" href={hotCollections.website} target="_blank">
                          <WebsiteIcon size={20} />
                        </a>
                      </TooltipIcon>
                    )
                  }
                  {
                    hotCollections && hotCollections.etherscan && (
                      <TooltipIcon id='etherscan' tooltipTxt='View on etherscan' placement='top' >
                        <a className="etherscan" href={hotCollections.etherscan} target="_blank">
                          <EtherscanIcon size={20} />
                        </a>
                      </TooltipIcon>
                    )
                  }
                  {
                    hotCollections && hotCollections.discord && (
                      <TooltipIcon id='Discord' tooltipTxt='Discord' placement='top' >
                        <a className="discord" href={hotCollections.discord} target="_blank">
                          <DiscordIcon size={20} />
                        </a>
                      </TooltipIcon>
                    )
                  }
                  {
                    hotCollections && hotCollections.twitter && (
                      <TooltipIcon id='Twitter' tooltipTxt='Twitter' placement='top' >
                        <a className="twitter" href={hotCollections.twitter} target="_blank">
                          <TwitterIcon size={20} />
                        </a>
                      </TooltipIcon>
                    )
                  }
                  {
                    hotCollections && hotCollections.facebook && (
                      <TooltipIcon id='Facebook' tooltipTxt='Facebook' placement='top' >
                        <a className="facebook" href={hotCollections.facebook} target="_blank">
                          <FacebookIcon size={20} />
                        </a>
                      </TooltipIcon>
                    )
                  }
                  {
                    hotCollections && hotCollections.telegram && (
                      <TooltipIcon id='Telegram' tooltipTxt='Telegram' placement='top' >
                        <a className="telegram" href={hotCollections.telegram} target="_blank">
                          <TelegramIcon size={20} />
                        </a>
                      </TooltipIcon>
                    )
                  }

                  <div style={{ height: '15px', width: '1px', background: '#ccc' }} className="mx-2"></div>
                </div>

                <div className="share mt-4">
                  <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} id="share-dd">
                      <i className="fa fa-fw text-white" aria-hidden="true"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark" className="bg-dark p-2" style={{ border: '1px solid #333' }}>
                      <Dropdown.Item className="p-2 fw-normal text-white share-dd-item">
                        <FacebookShareButton url={document.location.href} >
                          <i className="fa fa-fw" aria-hidden="true"></i> Share on facebook
                        </FacebookShareButton>
                      </Dropdown.Item>
                      <Dropdown.Item className="p-2 fw-normal text-white share-dd-item">
                        <TwitterShareButton url={document.location.href}>
                          <i className="fa fa-fw" aria-hidden="true" ></i> Share on Twitter
                        </TwitterShareButton>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="d-md-none mobile-social mt-4">
                  <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} id="share-dd">
                      <i className="fa fa-fw text-white" aria-hidden="true"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark" className="bg-dark p-2" style={{ border: '1px solid #333' }}>
                      {
                        hotCollections && hotCollections.website && (
                          <Dropdown.Item className="p-2 fw-normal text-white share-dd-item" href={hotCollections.website} target="_blank">
                            <TooltipIcon id='website' tooltipTxt='Website' placement='top' >
                              <>
                                <WebsiteIcon size={20} />
                                <span className="ms-2">Website</span>
                              </>
                            </TooltipIcon>
                          </Dropdown.Item>
                        )
                      }
                      {
                        hotCollections && hotCollections.etherscan && (
                          <Dropdown.Item className="p-2 fw-normal text-white share-dd-item" href={hotCollections.etherscan} target="_blank">
                            <TooltipIcon id='etherscan' tooltipTxt='View on etherscan' placement='top' >
                              <>
                                <EtherscanIcon size={20} />
                                <span className="ms-2">View on Etherscan</span>
                              </>
                            </TooltipIcon>
                          </Dropdown.Item>
                        )
                      }
                      {
                        hotCollections && hotCollections.discord && (
                          <Dropdown.Item className="p-2 fw-normal text-white share-dd-item" href={hotCollections.discord} target="_blank">
                            <TooltipIcon id='Discord' tooltipTxt='Discord' placement='top' >
                              <>
                                <DiscordIcon size={20} />
                                <span className="ms-2">Discord</span>
                              </>
                            </TooltipIcon>
                          </Dropdown.Item>
                        )
                      }
                      {
                        hotCollections && hotCollections.twitter && (
                          <Dropdown.Item className="p-2 fw-normal text-white share-dd-item" href={hotCollections.twitter} target="_blank">
                            <TooltipIcon id='Twitter' tooltipTxt='Twitter' placement='top' >
                              <>
                                <TwitterIcon size={20} />
                                <span className="ms-2">Twitter</span>
                              </>
                            </TooltipIcon>
                          </Dropdown.Item>
                        )
                      }
                      {
                        hotCollections && hotCollections.facebook && (
                          <Dropdown.Item className="p-2 fw-normal text-white share-dd-item" href={hotCollections.facebook} target="_blank">
                            <TooltipIcon id='facebook' tooltipTxt='facebook' placement='top' >
                              <>
                                <FacebookIcon size={20} />
                                <span className="ms-2">Twitter</span>
                              </>
                            </TooltipIcon>
                          </Dropdown.Item>
                        )
                      }
                      {
                        hotCollections && hotCollections.telegram && (
                          <Dropdown.Item className="p-2 fw-normal text-white share-dd-item" href={hotCollections.telegram} target="_blank">
                            <TooltipIcon id='telegram' tooltipTxt='telegram' placement='top' >
                              <>
                                <TelegramIcon size={20} />
                                <span className="ms-2">Twitter</span>
                              </>
                            </TooltipIcon>
                          </Dropdown.Item>
                        )
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

              </div>
              <div className="mt-4 d-flex align-items-center">
                <h2 className="fw-normal m-0 me-2 fs-2">
                  {hotCollections && hotCollections.name}
                </h2>
                <i className="fa fa-check text-white bg-primary p-1 rounded-5 " style={{ marginTop: '-15px' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex mb-3 px-2 px-md-5 gap-4">
          <div>Items <span className="fw-bold">{kFormatter(totalItems)}</span></div>
          <div>Created <span className="fw-bold">{dateFormator(hotCollections.publishedAt)}</span></div>
          <div>Creator Fee <span className="fw-bold">7%</span></div>
          <div>Chain <span className="fw-bold">{hotCollections.chain_name}</span></div>
        </div>
        <div className="row mb-4">
          <div className="col-12 col-sm-8 col-md-6">
            <div className="px-2 px-md-5">
              <p className="">
                {hotCollections.desc}
                {hotCollections.detail_link && (
                  <a className="ms-2 text-primary" href={hotCollections.detail_link} target="_blank">Find out more</a>
                )}
              </p>
            </div>
          </div>
        </div>
        {/* <div className="row">
          <div className="col-12">
            <div className="d-none px-2 px-md-5 w-100 d-md-inline-flex flex-wrap collection-page-stats gap-5">
              <div>
                <h4>10K</h4>
                <p>items</p>
              </div>
              <div>
                <h4>382</h4>
                <p>owners</p>
              </div>
            </div>
            <div className="px-2 px-md-5 w-100 d-inline-flex d-md-none flex-wrap collection-page-stats gap-4">
              <div>
                <h4>10K</h4>
                <p>items</p>
              </div>
              <div>
                <h4>382</h4>
                <p>owners</p>
              </div>
            </div>
          </div>
        </div> */}
      </section>

      <section className="container-fluid px-2 px-md-5 no-top">
        <div className="row">
          <div className="w-100 border-bottom mb-3 borderColor"></div>
          <div className="col-12">
            <Form.Control ref={searchTxt} type="text" placeholder="Search" className="m-0" onKeyDown={handleSearch} />
          </div>
          <div className="w-100 border-top mt-3 borderColor"></div>
        </div>
        <div className="row mb-3 mt-4">
          <div className="col-12 col-md-3">
            <div className="">
              <div className="heading"><h3>Filters</h3></div>
              <CheckboxFilter collectionId={collectionId} setPage={setPage} selStatus={selStatus} setSelStatus={setSelStatus} />
            </div>
          </div>
          <div className="col-12 col-md-9">
            {
              (nftItems && nftItems.data && nftItems.data.length > 0) ? (
                <InfiniteScroll
                  dataLength={nftItems.data.length}
                  next={() => setPage(page + 1)}
                  hasMore={nftItems.data.length < nftItems.meta.total}
                  loader={<Spinner animation="border" />}
                  style={{ overflow: 'hidden' }}
                >
                  <div className='row'>
                    {nftItems.data && nftItems.data.map((nft, index) => (
                      <NftCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} className="d-item col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4" marketItems={marketItems} />
                    ))}
                    <div className='col-lg-12'>
                      <div className="spacer-single"></div>
                    </div>

                  </div>
                </InfiniteScroll>
              ) : (
                <h3 className="text-center fw-normal">No item to display</h3>
              )
            }
          </div>

        </div>

      </section>

      <Footer />
    </div>
  );
}
export default memo(Colection);