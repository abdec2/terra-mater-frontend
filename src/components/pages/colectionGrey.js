import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ColumnNewRedux from '../components/ColumnNewRedux';
import Footer from '../components/footer';
import * as selectors from '../../store/selectors';
import { fetchCollections } from "../../store/actions/thunks";
import api from "../../core/api";
import { useParams } from "react-router-dom";

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
import { DiscordIcon, EtherscanIcon, TwitterIcon, WebsiteIcon } from "../../myFiles/components/Icons";
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

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
        <div className='row mb-5'>
          <div className="col-md-12">
            <div className="px-5" >
              <div className="bg-white rounded-4 p-1" style={{ width: '150px', marginTop: '-120px' }}>
                <img className="rounded-4 w-100" src={hotCollections.feature_img ? hotCollections.feature_img.url : 'https://via.placeholder.com/150x150.png?text=Logo'} alt="" />
              </div>
            </div>
            <div className="px-5 d-flex  align-items-center justify-content-between flex-column flex-md-row flex-md-row-reverse">
              <div className="d-flex align-items-center justify-content-center collection-social-icon-parent">
                <a className="website">
                  <WebsiteIcon size={20} />
                </a>
                <a className="etherscan">
                  <EtherscanIcon size={20} />
                </a>
                <a className="discord">
                  <DiscordIcon size={20} />
                </a>
                <a className="twitter">
                  <TwitterIcon size={20} />
                </a>
                <div style={{height: '15px', width: '1px', background: '#ccc'}} className="mx-2"></div>
              </div>
              <div className="d-flex align-items-center mt-3">
                <h2 className="fw-normal m-0">
                  {hotCollections && hotCollections.name}
                </h2>
                <div className="ms-2 bg-primary px-1 rounded-5" style={{ marginTop: '-20px' }}><i className="fa fa-check text-white"></i></div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <section className='container no-top'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className="items_filter">
              <ul className="de_nav">
                <li id='Mainbtn' className="active"><span onClick={handleBtnClick}>On Sale</span></li>
                <li id='Mainbtn1' className=""><span onClick={handleBtnClick1}>Owned</span></li>
              </ul>
            </div>
          </div>
        </div>
        {openMenu && (
          <div id='zero1' className='onStep fadeIn'>
            <ColumnNewRedux shuffle showLoadMore={false} authorId={hotCollections.author ? hotCollections.author.id : 1} />
          </div>
        )}
        {openMenu1 && (
          <div id='zero2' className='onStep fadeIn'>
            <ColumnNewRedux shuffle showLoadMore={false} />
          </div>
        )}
      </section>


      <Footer />
    </div>
  );
}
export default memo(Colection);