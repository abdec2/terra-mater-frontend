import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from './../../../components/components/footer';
import * as selectors from '../../../store/selectors';
import { fetchCollections, fetchCollectionNfts, searchCollectionNFT } from "../../../store/actions/thunks";
import { useParams } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from 'react-bootstrap/Spinner';
import NftCard from '../../../components/components/NftCard';
import Form from 'react-bootstrap/Form';
import auth from './../../../core/auth'
import metrics from './../../../assets/metrics.png'


//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../../../components/Styles';
import { DiscordIcon, EtherscanIcon, TwitterIcon, UsdtIcon, WebsiteIcon } from "./../../components/Icons";
import TooltipIcon from "./../../components/TooltipIcon";
import { Button, Table } from "react-bootstrap";
import CheckboxFilter from "../../../components/components/CheckboxFilter";
import { clearFilter, clearCollectionNfts } from "../../../store/actions";
import Tabs from "../../components/Tabs";
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

const Profile = function () {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const store = useSelector(state => state)
  const userInfo = auth.getUserInfo()
  console.log(userInfo)

  return (
    <div className="greyscheme">
      <StyledHeader theme={theme} />
      <section id='profile_banner' className='jumbotron breadcumb ' style={{ background: 'url("./img/background/6.jpg")' }}>
        <div className='mainbreadcumb'>
          <h1 className="text-center">About</h1>
          <p className="text-center fs-3">The first NFT incubator and marketplace owned by people</p>
        </div>
      </section>

      <section className="container">
        <div class="row mb-4 px-2 px-md-5">
          <div class="col-12">
            <h2 className="fw-normal">Opensea vs Terra Mater</h2>
          </div>
        </div>

        <div className="row px-2 px-md-5">
          <div class="col-12 col-sm-6 mb-4">
            <div className="">
              <h4 className="">Opensea</h4>
              <ul className="list-style-none ps-0">
                <li>Owned by few</li>
                <li>Mostly unrelevant collections</li>
                <li>Lots of collection not audited without kyc</li>
                <li>No more benefits other than exchange service</li>
              </ul>
            </div>
          </div>
          <div class="col-12 col-sm-6 mb-4">
            <div className="">
              <h4 className="">Terra Mater</h4>
              <ul className="list-style-none ps-0">
                <li>Owned by Terra Mater NFT holders</li>
                <li>Collection based on real projects</li>
                <li>Extremely accurate selection of the collection</li>
                <li>Lots of benefits to NFT holders other than exchange service</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row px-2 px-md-5 mb-4">
          <div class="col-12 col-md-6 offset-md-3">
            <div className="w-100 mx-auto">
              <img className="w-100" src={metrics} alt="" />
            </div>
          </div>
        </div>

        <div className="row px-2 px-md-5">
          <div className="col-12">
            <p>TERRAMATER conceive NFTs in a much broader and more organic way than how NFTs are commonly used; this allows to provide NFTs with many use cases and to really make the most of them.</p>

            <p>TerraMater was born with the intention of listing NFTs collections related to serious, lasting, incisive projects in various contexts and useful for achieving the good for the people.
              NFTs collections can be created, incubated and launched thanks to TerraMater, capable of offering a fertile place for all those projects that want to exist and do good, and that require a team of technical developers, analysts and expert advisors of complex systems, as well as an audience of members ready to finance them.</p>

            <p>
              The TERRAMATER NTFs make the holders co-creators, co-participants, entitled to rewards, economic benefits from TERRAMATER platform, and guarantee exclusive access to many products and services.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
export default memo(Profile);