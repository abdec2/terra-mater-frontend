import React, { useState, useEffect } from "react";
import { StyledHeader } from "../../../components/Styles";
import {
  connectWallet,
  switchNetwork,
  reconnectWallet
} from "./../../../components/menu/connectWallet";
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import auth from "../../../core/auth";
import * as actions from "./../../../store/actions";
import Footer from "./../../../components/components/footer";
import { stakingData } from "./stakingData";
import { useFetchNFT } from './hooks/useFetchNfts';
import  useStakedNFT  from './hooks/useFetchStakedNft';
import "./staking.css";
import { useDispatch, useSelector } from "react-redux";
import { InputGroup } from "react-bootstrap";
import StakeTimerComponent from "./startDate";

// helpers
import { prepareNftPath } from './helpers/helpers'

const theme = "GREY"; //LIGHT, GREY, RETRO

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;
const inline = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
  .d-inline{
    display: inline-block;
   }
`;

const StakingNft = () => {
  const dispatch = useDispatch();
  const [islogin, setIsLogin] = useState(false);
  const [account, setAccount] = useState("");
  const [mCursor, setMcursor] = useState('');
  const web3Store = useSelector((state) => state.web3);
  const [fetchNFTs, setFetchNFTs] = useState(true);
  const {nft: myNfts, cursor} = useFetchNFT(web3Store.account, fetchNFTs, setFetchNFTs, mCursor );
  const stakedNFTs = [] //useStakedNFT(web3Store.account, fetchNFTs, setFetchNFTs)
  const userData = auth.getUserInfo();
  const [selectedNFT, setSelectedNFT] = useState([]);

  
  console.log(stakedNFTs)
  const handleLogout = () => {
    auth.clearAppStorage();
    dispatch(actions.delWeb3());
    setIsLogin(false);
  };
  const [stakedNft, setStakedNft] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userData && userData.address) {
      setIsLogin(true);
      //addLoginState(userData.address)
    } else {
      setIsLogin(false);
    }
    console.log(web3Store.account);
    if (typeof web3Store.account === "string") {
      setAccount(web3Store.account);
    }
  }, [web3Store.account, account]);

  useEffect(()=> {
    setMcursor(cursor)
  },[fetchNFTs])

  const handleNFT = (e,tokenId, pid) => {
    console.log(tokenId)
    console.log(e.target.checked)
    if(!e.target.checked) {
      const selnft = []
      selectedNFT.map(item => {
        if(!(parseInt(item.pid) === parseInt(pid) && parseInt(item.tokenId) === parseInt(tokenId))) {
          selnft.push(item)
        } 
      })
      setSelectedNFT([...selnft])
      
    } else {
      setSelectedNFT([...selectedNFT, {pid, tokenId}])
    }
    
  };

  const stakedNFT = () => {
    // setStakedNft([...stakedNft, selectedNFT]);
    // console.log(stakedNft);
    console.log(selectedNFT)
  };

  const handleNext = () => {
    document.querySelector('.containerStaked').scrollTo(0,0)
    setFetchNFTs(true)
  }

  const handleReset = () => {
    document.querySelector('.containerStaked').scrollTo(0,0)
    setMcursor('')
    setFetchNFTs(true)
  }
  return (
    <div
      className="greyscheme bg-dark"
      style={{ background: "black", width: "100%", minHeight: "100vh" }}
    >
      <StyledHeader theme={theme} />
      <div className="containerMain">
        <Reveal
          className="onStep marginTop10"
          keyframes={fadeInUp}
          delay={600}
          duration={900}
          triggerOnce
        >
          <div className="container_box p-2">
            <h1>Stake and Earn</h1>
            <p>Stake your NFTs and earn rewards.</p>
            <div className="container_box_btn">
              {!account ? (
                <>
                  <button
                    className="walletBtn"
                    onClick={() => reconnectWallet(dispatch)}
                  >
                    Connect Wallet
                  </button>
                </>
              ) : (
                <>
                  <div className="containerOptionsParent">
                    <div className="containerOptions">
                      <h1 onClick={() => setOpen(false)}>MY NFTS</h1>
                      <h1 onClick={() => setOpen(true)}>MY STAKED NFTS</h1>
                    </div>
                    {open ? (
                      <div className="ContainerStakedMain">
                        <div className="containerStaked">
                          {stakedNFTs.map((item, index) => {
                            return (
                              <div key={index} className="stakingCard">
                                <div className="InnerCard">
                                  <div className="stakingCardText">
                                    <input
                                      className="form-check-input checkBox"
                                      type="checkbox"
                                      value=""
                                      id="flexCheckDefault"
                                    />
                                    <div className="stakingCardImg">
                                      <img
                                        src={prepareNftPath(item?.normalized_metadata?.image)}
                                        alt="img"
                                        className=""
                                      />
                                    </div>
                                    <div className="txt">
                                      <h3>
                                        <span>{`${item.name}#${item.token_id}`}</span>
                                      </h3>
                                    </div>
                                  </div>
                                  {/* <div className="txt">
                                    <p>
                                      <StakeTimerComponent />
                                    </p>
                                  </div> */}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="cnfrmStake">
                          <hr />
                          <div>
                            <button onClick={() => {}}>Unstake</button>
                          </div>
                          <hr />
                        </div>
                      </div>
                    ) : (
                      <div className="ContainerStakedMain">
                        <div className="containerStaked">
                          {myNfts?.map((item, index) => {
                            return (
                              <div key={index} className="stakingCard">
                                <div className="InnerCard">
                                  <div className="stakingCardText">
                                    <input
                                      className="form-check-input checkBox"
                                      type="checkbox"
                                      onClick={(e) =>
                                        handleNFT(e, item.token_id, item.pid)
                                      }
                                    />
                                    <div className="stakingCardImg">
                                      <img
                                        src={prepareNftPath(item?.normalized_metadata?.image)}
                                        alt="img"
                                        className=""
                                      />
                                    </div>
                                    <div className="txt">
                                      <h3>
                                        <span>{`${item.name}#${item.token_id}`}</span>
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div className="d-flex align-items-center justify-content-center w-100">
                            <button disabled={myNfts?.length === 0} className="mt-5 me-3 py-2 px-5 rounded border " onClick={handleNext}>Next</button>
                            {/* <div className="mt-5 me-3 py-2 px-5 rounded border " style={{cursor: 'pointer'}} onClick={handleNext}>
                              <span>{ myNfts?.length > 0 ? 'Next' : 'Reset' }</span>
                            </div> */}
                            <button className="mt-5 me-3 py-2 px-5 rounded border text-white" style={{background: 'transparent'}} onClick={handleReset}>Reset</button>
                            {/* <div className="mt-5 py-2 ms-3 px-5 rounded border " style={{cursor: 'pointer'}} onClick={handleNext}>
                              <span>{ myNfts?.length > 0 ? 'Next' : 'Reset' }</span>
                            </div> */}
                          </div>
                        </div>
                        <div className="cnfrmStake">
                          <hr />
                          <div>
                            <button onClick={stakedNFT}>Confirm Stake</button>
                          </div>
                          <hr />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default StakingNft;
