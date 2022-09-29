import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import ColumnNewRedux from "../components/ColumnNewRedux";
import * as selectors from '../../store/selectors';
import { fetchCollections } from "../../store/actions/thunks";
import api from "../../core/api";
import { useParams } from "react-router-dom";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
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

const Colection = function() {
const [openMenu, setOpenMenu] = React.useState(true);
const [openMenu1, setOpenMenu1] = React.useState(false);
const {collectionId} = useParams();
console.log(collectionId)
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
  <div>
  <GlobalStyles/>
    { hotCollections.banner &&
      <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${hotCollections.banner.url})`}}>
        <div className='mainbreadcumb'>
        </div>
      </section>
    }

    <section className='container d_coll no-top no-bottom'>
      <div className='row'>
        <div className="col-md-12">
          <div className="d_profile">
            <div className="profile_avatar">
                { hotCollections.feature_img &&
                  <div className="d_profile_img">
                    <img src={hotCollections.feature_img.url} alt=""/>
                    <i className="fa fa-check"></i>
                  </div>
                }
                <div className="profile_name">
                  <h2 className="text-uppercase color fw-bold">
                      { hotCollections.name }                                                
                      <div className="clearfix"></div>
                  </h2>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>

    <section className='container no-top'>
          
          <div id='zero1' className='onStep fadeIn'>
            <ColumnNewRedux showLoadMore={true} authorId={ hotCollections.id } />
          </div>
        
        </section>
    <Footer />
  </div>
);
}
export default memo(Colection);