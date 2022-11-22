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
            <span className="box-url" style={{minHeight: '160px'}}>
              <h4>1. Stake & Earn</h4>
              <p>Staking to obtain cryptos</p>
            </span>
          </div>
          <div className="col-lg-4 mb30">
            <span className="box-url" style={{minHeight: '160px'}}>
              <h4>2. Pass to PLETHORA</h4>
              <p>Pass to PLETHORA of exclusive services and events.</p>
            </span>
          </div>
          <div className="col-lg-4 mb30">
            <span className="box-url" style={{minHeight: '160px'}}>
              <h4>3. Fees Distribution</h4>
              <p>Exchange fees distribution to NFT holders through smart contract.</p>
            </span>
          </div>
          <div className="col-lg-4 mb30">
            <span className="box-url" style={{minHeight: '184px'}}>
              <h4>4. Governance</h4>
              <p>NFT holders governance through votes in blockchain</p>
            </span>
          </div>
          <div className="col-lg-4 mb30">
            <span className="box-url" style={{minHeight: '184px'}}>
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

        <div className="row px-2 px-md-5 mt-5">
          <div className="col-12">
            <h2 className="fw-bold text-uppercase">NFTs Adoption</h2>
            <h6 className="fw-normal fs-4">Each project will be tokenized thanks to NFTs and everyone can be a participant like never before.</h6>
            <p className="mt-4">
              A Non-Fungible Token (NFT) is a special type of cryptographic token that represents the deed of ownership and the certificate of authenticity registered on the blockchain of a unique asset of its kind, be it digital or physical; the non-fungible tokens are therefore not mutually interchangeable. On the contrary, cryptocurrencies such as Bitcoin and many other tokens, as well as FIAT coins (USD, EUR, GBP ...) which are fungible, can exist in multiple copies exactly identical and interchangeable, and of which it is therefore not possible to uniquely define the identity of the single token that differentiates it from all others of the same type.
            </p>

            <p className="mt-3 fw-bold">
              We conceive NFTs in a much broader and more organic way than how they are commonly used; this allows us to provide them with many use cases and to really make the most of them to achieve our Mission; in fact, each of our projects is represented by an NFT collection consisting of a finite number of NFTs with multiple and particular characteristics:
            </p>

            <ul>
              <li>A NEW KIND OF OWNERSHIP AND PARTECIPATION</li>
              <li>A NEW KIND OF SHARE</li>
              <li>A NEW KIND OF REWARDS</li>
              <li>A NEW KIND OF STAKING </li>
              <li>A NEW KIND OF MINING</li>
              <li>A NEW WAY OF VOTING</li>
              <li>A NEW KIND OF PASSPARTOUT</li>
              <li>A NEW KIND OF FRANCHISING</li>
            </ul>

            <p className="mt-3 fw-bold">
              The technological world offers unlimited possibilities of expression and with the right research and development and the new philosophies that we conceive over time, our NFTs continuously acquire new use cases. The limit tends to infinity.
            </p>

          </div>
        </div>

        <div className="row px-2 px-md-5">
          <div className="col-12">
            <p>TerraMater was born with the intention of listing NFTs collections related to serious, lasting, incisive projects in various contexts and useful for achieving the good for the people.
              NFTs collections can be created, incubated and launched thanks to TerraMater, capable of offering a fertile place for all those projects that want to exist and do good, and that require a team of technical developers, analysts and expert advisors of complex systems, as well as an audience of members ready to finance them.</p>
          </div>
        </div>

        <div className="row px-2 px-md-5 mt-5">
          <div className="col-12">
            <h2 className="fw-bold text-uppercase">TERRAMATER Platform</h2>
            <h6 className="fw-normal fs-4">Solution: NFT MARKETPLACE & INCUBATOR PLATFORM</h6>
            <p className="mt-4">
              TerraMater was born with the intention of listing collections related to serious, lasting, incisive projects in various contexts and useful for achieving the mission of the Harmonious Paradise community. These are obviously community projects, such as the AntiAgeingCenter collection and the collection of TerraMater itself which are the first two to be listed. All the other collections will follow in the future.
            </p>

            <p className="mt-3">
              There is also space for external collections, or those that the Governance will deem up to be listed, and that can be created, incubated and launched thanks to TerraMater, capable of offering a fertile place for all those projects that want to exist and make the difference, and because of this reason they require a team of technical developers, analysts and advisors who are experts in complex systems, as well as an audience of members ready to finance them with the due returns and benefits.
            </p>

            <p className="mt-3">
              The meticulous choice of projects makes it literally impossible that these are scams. By doing so, the platform also becomes a certifying entity in the world of blockchain, especially in the field of NFTs.
            </p>

            <p className="mt-3">
              The TERRAMATER NTFs make the holders co-creators, co-participants, entitled to rewards,
              economic benefits from TERRAMATER platform, and guarantee exclusive access to many
              products and services.
            </p>
          </div>
        </div>



      </section>

      <Footer />
    </div>
  );
}
export default memo(Profile);