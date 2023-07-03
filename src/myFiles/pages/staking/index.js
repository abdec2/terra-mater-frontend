import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { StyledHeader } from "../../../components/Styles";
import Footer from "../../../components/components/footer";
import { Button } from "bootstrap";
import Swal from "sweetalert2";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";
import Stake from "./StakeAndRewards/Stake";
import Rewards from "./StakeAndRewards/Rewards";

const Container_header = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;
const OptionsDiv = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
`;
const Options = styled.div`
  padding: 10px;
  border-radius: 5px;
  :hover {
    background: #ff343f;
    color: #fff;
  }
  :hover {
    background: #ff343f;
    color: #fff;
  }
  ${({ selected }) => selected && "background-color: #ff343f; color: #fff;"}
`;
const BUTTON = styled.div`
  padding: 10px;
  border-radius: 5px;
  font-size: 15px;
  background: #ff343f;
  color: #fff;
  cursor: pointer;
`;
const ListingBtn = styled.div`
  cursor: pointer;
`;
const HighlightedHeading = styled.div`
  cursor: pointer;
  :hover {
    color: #ff343f;
  }
`;
const Contained = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.5px solid #1a1b1e;
  height: 70px;
  flex-wrap: nowrap;
  @media (max-width: 670px) {
    flex-wrap: wrap;
    justify-content: start;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 20px;
    padding-right: 20px;
    gap: 20px;
    height: 130px;
  }
`;
const providerOptions = {
  /* See Provider Options Section */
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        80001: process.env.REACT_APP_ALCHEMY_TEST_KEY,
      },
    },
  },
};
const theme = "GREY"; //LIGHT, GREY, RETRO
const Staking = () => {
  const [option, setOption] = useState("Stake");
  const [provider, setProvider] = useState(null);
  const [currentAcc, setCurrentAcc] = useState(null);
  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      providerOptions, // required
    });
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const currentAcc = accounts[0];
    setCurrentAcc(currentAcc);
    setProvider(web3);
    console.log(web3);
    console.log(currentAcc);
    let chainId = await web3.eth.getChainId();
    console.log(chainId);
    if (chainId != 80001) {
      Swal.fire({
        title: "Please switch to Mumbai Network",
        icon: "warning",
        background: "white",
      });
    }
  };

  const selectOption = (props) => {
    setOption(props);
  };
  return (
    <>
      <div className="greyscheme">
        <StyledHeader theme={theme} />
        <section
          id="profile_banner"
          className="jumbotron breadcumb "
          style={{ background: 'url("./img/background/6.jpg")' }}
        >
          <div className="mainbreadcumb">
            <h1 className="text-center">Stake your tokens</h1>
          </div>
        </section>
        <section className="container-fluid d_coll no-top no-bottom pb-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <Contained className="mx-2 mx-md-5">
                <Container_header>
                  <OptionsDiv>
                    <Options
                      selected={option === "Stake"}
                      onClick={() => selectOption("Stake")}
                    >
                      Stake
                    </Options>
                    <Options
                      selected={option === "Rewards"}
                      onClick={() => selectOption("Rewards")}
                    >
                      Rewards
                    </Options>
                  </OptionsDiv>
                </Container_header>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!currentAcc ? (
                    <BUTTON
                      className="text-center"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => connectWallet()}
                    >
                      Connect Wallet
                    </BUTTON>
                  ) : (
                    <BUTTON>
                      {currentAcc.slice(0, 6) +
                        "..." +
                        currentAcc.slice(36, 42)}
                    </BUTTON>
                  )}
                </div>
              </Contained>
              <div className="mx-2 mx-md-5 mt-4">
                {option === "Stake" ? (
                  <Stake provider={provider} currentAcc={currentAcc} />
                ) : (
                  <Rewards provider={provider} currentAcc={currentAcc} />
                )}
              </div>
            </div>
          </div>
        </section>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Staking;
