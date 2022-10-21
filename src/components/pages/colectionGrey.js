import React, { forwardRef, memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ColumnNewRedux from '../components/ColumnNewRedux';
import Footer from '../components/footer';
import * as selectors from '../../store/selectors';
import { fetchCollections } from "../../store/actions/thunks";
import api from "../../core/api";
import { useParams } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';


//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
import { DiscordIcon, EtherscanIcon, TwitterIcon, UsdtIcon, WebsiteIcon } from "../../myFiles/components/Icons";
import TooltipIcon from "../../myFiles/components/TooltipIcon";
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
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const { collectionId } = useParams();
  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
    setOpenMenu1(false);
    document.getElementById("Mainbtn").classList.add("active");
    document.getElementById("Mainbtn1").classList.remove("active");
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
    setOpenMenu(false);
    document.getElementById("Mainbtn1").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
  };

  const dispatch = useDispatch();
  const collectionState = useSelector(selectors.collectionState);
  const hotCollections = collectionState.data ? collectionState.data[0] : {};
  console.log(hotCollections)

  useEffect(() => {
    dispatch(fetchCollections(collectionId));
  }, [dispatch, collectionId]);

  return (
    <div className="greyscheme">
      <StyledHeader theme={theme} />
      <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${hotCollections.banner ? hotCollections.banner.url : 'https://via.placeholder.com/1920x380.png?text=Collection+Banner'})` }}>
        <div className='mainbreadcumb'>
        </div>
      </section>

      <section className='container-fluid d_coll no-top no-bottom'>
        <div className='row'>
          <div className="col-md-12">
            <div className="px-5" >
              <div className="bg-white rounded-4 p-1" style={{ width: '150px', marginTop: '-120px' }}>
                <img className="rounded-4 w-100" src={hotCollections.feature_img ? hotCollections.feature_img.url : 'https://via.placeholder.com/150x150.png?text=Logo'} alt="" />
              </div>
            </div>
            <div className="px-5 d-flex  align-items-start align-items-sm-center justify-content-between flex-column flex-md-row flex-md-row-reverse">
              <div className="d-flex align-items-center justify-content-center collection-social-icon-parent ms-auto">
                <div className="d-none d-md-flex social align-items-center justify-content-center mt-4">
                  <TooltipIcon id='website' tooltipTxt='Website' placement='top' >
                    <a className="website"> 
                      <WebsiteIcon size={20} />
                    </a>
                  </TooltipIcon>
                  <TooltipIcon id='etherscan' tooltipTxt='View on etherscan' placement='top' >
                    <a className="etherscan">
                      <EtherscanIcon size={20} />
                    </a>
                  </TooltipIcon>
                  <TooltipIcon id='Discord' tooltipTxt='Discord' placement='top' >
                    <a className="discord">
                      <DiscordIcon size={20} />
                    </a>
                  </TooltipIcon>
                  <TooltipIcon id='Twitter' tooltipTxt='Twitter' placement='top' >
                    <a className="twitter">
                      <TwitterIcon size={20} />
                    </a>
                  </TooltipIcon>

                  <div style={{ height: '15px', width: '1px', background: '#ccc' }} className="mx-2"></div>
                </div>

                <div className="share mt-4">
                  <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} id="share-dd">
                      <i className="fa fa-fw text-white" aria-hidden="true"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark" className="bg-dark p-2" style={{ border: '1px solid #333' }}>
                      <Dropdown.Item className="p-2 fw-normal text-white share-dd-item">
                        <i className="fa fa-fw" aria-hidden="true"></i> Share on facebook
                      </Dropdown.Item>
                      <Dropdown.Item className="p-2 fw-normal text-white share-dd-item">
                        <i className="fa fa-fw" aria-hidden="true" ></i> Share on Twitter
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
                      <Dropdown.Item className="p-2 fw-normal text-white share-dd-item">
                        <TooltipIcon id='website' tooltipTxt='Website' placement='top' >
                          <a className="website">
                            <WebsiteIcon size={20} />
                            <span className="ms-2">Website</span>
                          </a>
                        </TooltipIcon>
                      </Dropdown.Item>
                      <Dropdown.Item className="p-2 fw-normal text-white share-dd-item">
                        <TooltipIcon id='etherscan' tooltipTxt='View on etherscan' placement='top' >
                          <a className="etherscan">
                            <EtherscanIcon size={20} />
                            <span className="ms-2">View on Etherscan</span>
                          </a>
                        </TooltipIcon>
                      </Dropdown.Item>
                      <Dropdown.Item className="p-2 fw-normal text-white share-dd-item">
                        <TooltipIcon id='Discord' tooltipTxt='Discord' placement='top' >
                          <a className="discord">
                            <DiscordIcon size={20} />
                            <span className="ms-2">Discord</span>
                          </a>
                        </TooltipIcon>
                      </Dropdown.Item>
                      <Dropdown.Item className="p-2 fw-normal text-white share-dd-item">
                        <TooltipIcon id='Twitter' tooltipTxt='Twitter' placement='top' >
                          <a className="twitter">
                            <TwitterIcon size={20} />
                            <span className="ms-2">Twitter</span>
                          </a>
                        </TooltipIcon>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

              </div>
              <div className="d-flex align-items-center mt-4">
                <h2 className="fw-normal m-0">
                  {hotCollections && hotCollections.name}
                </h2>
                <div className="ms-2 bg-primary px-1 rounded-5" style={{ marginTop: '-20px' }}><i className="fa fa-check text-white d-none d-md-inline-block"></i></div>
              </div>

            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12 col-md-6">
            <div className="px-5">
              <p className="">{hotCollections.desc}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="px-5 d-flex flex-wrap align-items-start align-items-sm-center collection-page-stats justify-content-center justify-content-md-start">
              <div>
                <h3>10K</h3>
                <p>items</p>
              </div>
              <div>
                <h3><UsdtIcon size={20} /> 10.000</h3>
                <p>floor price</p>
              </div>
              <div>
                <h3>382</h3>
                <p>owners</p>
              </div>
              <div>
                <h3> <UsdtIcon size={20} /> 10000</h3>
                <p>total volume</p>
              </div>
            </div>
          </div>
        </div>
      </section>




      <Footer />
    </div>
  );
}
export default memo(Colection);