import React, { useState, useEffect } from "react";
import { StyledHeader } from "../../../components/Styles";
import {
  connectWallet,
  switchNetwork,
} from "./../../../components/menu/connectWallet";
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import auth from "../../../core/auth";
import * as actions from "./../../../store/actions";
import Footer from "./../../../components/components/footer";
import { stakingData } from "./stakingData";
import "./staking.css";
import { useDispatch, useSelector } from "react-redux";
import { InputGroup } from "react-bootstrap";
import StakeTimerComponent from "./startDate";
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
  const web3Store = useSelector((state) => state.web3);
  const userData = auth.getUserInfo();
  const [selectedNFT, setSelectedNFT] = useState([]);
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

  const handleNFT = (id, image) => {
    if (selectedNFT.map((item) => item.id).includes(id)) {
      setSelectedNFT(selectedNFT.filter((item) => item.id !== id));
      console.log(selectedNFT);
      return;
    } else {
      setSelectedNFT([...selectedNFT, { id: id, image: image }]);
      console.log(selectedNFT);
    }
    console.log(selectedNFT);
  };

  const stakedNFT = () => {
    setStakedNft([...stakedNft, selectedNFT]);
    console.log(stakedNft);
  };
  return (
    <div
      className="greyscheme bg-dark"
      style={{ background: "black", width: "100%", height: "100%" }}
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
          <div className="container_box">
            <h1>Stake and Earn</h1>
            <p>Stake your NFTs and earn rewards.</p>
            <div className="container_box_btn">
              {!islogin ? (
                <>
                  <button
                    className="walletBtn"
                    onClick={() => connectWallet(dispatch)}
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
                          {stakingData.map((item, index) => {
                            return (
                              <div className="stakingCard">
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
                                        src={item.image}
                                        alt="img"
                                        className=""
                                        onClick={() =>
                                          handleNFT(item.id, item.image)
                                        }
                                      />
                                    </div>
                                    <div className="txt">
                                      <h3>
                                        <span>{item.name}</span>
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="txt">
                                    <p>
                                      <StakeTimerComponent />
                                    </p>
                                  </div>
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
                          {stakingData.map((item, index) => {
                            return (
                              <div className="stakingCard">
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
                                        src={item.image}
                                        alt="img"
                                        className=""
                                        onClick={() =>
                                          handleNFT(item.id, item.image)
                                        }
                                      />
                                    </div>
                                    <div className="txt">
                                      <h3>
                                        <span>{item.name}</span>
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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
