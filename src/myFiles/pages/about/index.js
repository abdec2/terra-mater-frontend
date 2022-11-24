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
        <div className="row mb-4 px-2 px-md-5">
          <div className="col-12">
            <h2 className="fw-normal">Opensea vs Terra Mater</h2>
          </div>
        </div>

        <div className="row px-2 px-md-5">
          <div className="col-12 col-sm-6 mb-4">
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
          <div className="col-12 col-sm-6 mb-4">
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

        <div className="row px-2 px-md-5 mt-5">
          <div className="col-12 ">
            <h2 className="text-center text-uppercase">NFT Terra Mater Benefits</h2>
          </div>
        </div>

        <div className="row px-2 px-md-5 mt-5 align-item-center justify-content-center">
          <div className="col-lg-4 mb30">
            <span className="box-url" style={{ minHeight: '160px' }}>
              <h4>1. Stake & Earn</h4>
              <p>Staking to obtain cryptos</p>
            </span>
          </div>
          <div className="col-lg-4 mb30">
            <span className="box-url" style={{ minHeight: '160px' }}>
              <h4>2. Pass to PLETHORA</h4>
              <p>Pass to PLETHORA of exclusive services and events.</p>
            </span>
          </div>
          <div className="col-lg-4 mb30">
            <span className="box-url" style={{ minHeight: '160px' }}>
              <h4>3. Fees Distribution</h4>
              <p>Exchange fees distribution to NFT holders through smart contract.</p>
            </span>
          </div>
          <div className="col-lg-4 mb30">
            <span className="box-url" style={{ minHeight: '184px' }}>
              <h4>4. Governance</h4>
              <p>NFT holders governance through votes in blockchain</p>
            </span>
          </div>
          <div className="col-lg-4 mb30">
            <span className="box-url" style={{ minHeight: '184px' }}>
              <h4>5. Treasury Bonus</h4>
              <p>Treasury bonus distributed to NFT holders through smart contract</p>
            </span>
          </div>
        </div>

        {/* <div className="row px-2 px-md-5 mb-4">
          <div className="col-12 col-md-6 offset-md-3">
            <div className="w-100 mx-auto">
              <img className="w-100" src={metrics} alt="" />
            </div>
          </div>
        </div> */}

        <div className="row px-2 px-md-5 mt-5">
          <div className="col-12">
            <h2 className="fw-bold text-uppercase">NFTs collection TERRAMATER</h2>
            <div className="mt-5">
              <h4>Opensea</h4>
              <p>The largest platform operating in the NFT market is definitely OpenSea. Founded in 2017 with just $ 2.3 million, following a heightened interest in non-fungible tokens, its revenue went from $ 95 million in February 2021 to $ 2.75 billion in September of the same year. As of January 2022, the company was valued at $ 13.3 billion.</p>
            </div>

            <div className="mt-5">
              <h4>Problem</h4>
              <p>In March 2021, OpenSea announced that, from that point on, the NFTs collections would no longer need prior approval to be listed. This decision was later heavily criticized for allowing any scammer to publish copied and non-original NFTs collections in order to commit scams against customers. This situation still generates a rampant plagiarism of the NFTs collections on the platform. Furthermore, and more importantly, on OpenSea there are very few NFTs collections that are really useful. In fact 99% of these are works of art and images that do not "impact" positively in any sense, and most of the time they are even used for money laundering.</p>
            </div>

            <div className="mt-5">
              <h4>Reasonable question</h4>
              <p>Why do we have to continue to use third party services without benefits and with innumerable risks between plagiarism and scams, when instead we can start using a platform in which there are projects of absolute value and which is created in partnership with all the owners of the NFTs of the specification collection sharing the profits and the benefits?</p>
            </div>
          </div>
        </div>

        <div className="row px-2 px-md-5 mt-2">
          <div className="col-12">
            <p className="mt-3">
              TERRAMATER conceive NFTs in a much broader and more organic way than how NFTs are commonly used; this allows to provide NFTs with many use cases and to really make the most of them.
              <a href="https://harmonious-paradise.gitbook.io/harmonious-paradise-project/nfts-projects/nfts-adoption" className="ms-2 text-primary" target="_blank">find out more</a>
            </p>
          </div>
        </div>

        <div className="row px-2 px-md-5 mt-2">
          <div className="col-12">
            <p className="mt-3">
              TerraMater was born with the intention of listing NFTs collections related to serious, lasting,
              incisive projects in various contexts and useful for achieving the good for the people.NFTs collections can be created, incubated and launched thanks to TerraMater, capable of
              offering a fertile place for all those projects that want to exist and do good, and that require a team of technical developers, analysts and expert advisors of complex systems, as well as an audience of members ready to finance them.
              <a href="https://harmonious-paradise.gitbook.io/harmonious-paradise-project/nfts-projects/nfts-collection-terramater/terramater-platform" className="ms-2 text-primary" target="_blank">find out more</a>
            </p>
          </div>
        </div>

        <div className="row px-2 px-md-5 mt-2">
          <div className="col-12">
            <p className="mt-3">
              The TERRAMATER NTFs make the holders co-creators, co-participants, entitled to rewards, economic benefits from TERRAMATER platform, and guarantee exclusive access to many products and services.
              <a href="https://harmonious-paradise.gitbook.io/harmonious-paradise-project/nfts-projects/nfts-collection-terramater/characteristics-and-functionality" className="ms-2 text-primary" target="_blank">find out more</a>
            </p>
          </div>
        </div>



      </section>

      <Footer />
    </div>
  );
}
export default memo(Profile);