import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { StyledHeader } from "../../../components/Styles";
import Footer from "../../../components/components/footer";
import Switch from "./switch";
import ListingModal from "./ListingModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import BuyTable from "./listingTables/BuyTable";
import Dropdown from "react-bootstrap/Dropdown";
import RecordTable from "./listingTables/RecordTable";
import UserTable from "./userListings";
import useFetchUserData from "./hooks/useFetchUserData";
import useFetchListings from "./hooks/useFetchAllListings";
import { reconnectWallet } from "../../../components/menu/connectWallet";
import TradeTable from "./listingTables/BuyTable";
import LoadingScreen from "../stakingNFT/loadingScreen";
// import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
// import Web3Modal from "web3modal";
import { CiFilter } from "react-icons/ci";
import { Button } from "bootstrap";
import { CONFIG } from "./abi/Config";
const Container_header = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;
const CurrencyOptions = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
  margin-left: 20px;
`;
const CurrencyOption = styled.div`
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

// const providerOptions = {
//   /* See Provider Options Section */
//   walletconnect: {
//     package: WalletConnectProvider, // required
//     options: {
//       rpc: {
//         137: process.env.REACT_APP_ALCHEMY_KEY,
//       },
//     },
//   },
// };
const theme = "GREY"; //LIGHT, GREY, RETRO
const Swapping = () => {
  const dispatch = useDispatch();
  const [account, setAccount] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("buy");
  const [modal, setModal] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [condition, setCondition] = useState("buy");
  const web3Store = useSelector((state) => state.web3);
  const web3 = web3Store.web3;
  const selectCurrency = (props) => {
    setCurrency(props);
  };
  const [currentAcc, setCurrentAcc] = useState(null);
  const [provider, setProvider] = useState(null);

  const { userListings } = useFetchUserData(currentAcc, refetch, setRefetch);
  const { Listings } = useFetchListings(refetch, setRefetch);
  const [filterType, setFilterType] = useState("all");
  // const connectWallet = async () => {
  //   const web3Modal = new Web3Modal({
  //     providerOptions, // required
  //   });
  //   const provider = await web3Modal.connect();
  //   const web3 = new Web3(provider);
  //   const accounts = await web3.eth.getAccounts();
  //   console.log(accounts);
  //   const currentAcc = accounts[0];
  //   setCurrentAcc(currentAcc);
  //   setProvider(web3);
  //   setCondition("userListings");
  //   setRefetch(true);
  //   console.log(web3);
  //   console.log(currentAcc);
  //   let chainId = await web3.eth.getChainId();
  //   console.log(chainId);
  //   if (chainId != 137) {
  //     Swal.fire({
  //       title: "Please switch to Polygon Network",
  //       icon: "warning",
  //       background: "white",
  //     });
  //   }
  // };
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="dropdown-toggle"
    >
      {children}
      &#x25bc;
    </a>
  ));

  const TOGGLE = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="dropdown-toggle"
    >
      {children}
    </a>
  ));

  useFetchUserData(account);
  const OpenModal = () => {
    if (!currentAcc) {
      Swal.fire({
        title: "Please login to create listing",
        icon: "warning",
        background: "#000",
      });
    } else {
      setModal(true);
    }
  };

  return (
    <>
      <div className="greyscheme">
        <StyledHeader theme={theme} />
        {isLoading && <LoadingScreen setIsLoading={setIsLoading} />}
        {modal ? (
          <ListingModal
            setModal={setModal}
            account={account}
            setRefetch={setRefetch}
            setIsLoading={setIsLoading}
            web3={provider}
            currentAcc={currentAcc}
          />
        ) : null}
        <section
          id="profile_banner"
          className="jumbotron breadcumb "
          style={{ background: 'url("./img/background/6.jpg")' }}
        >
          <div className="mainbreadcumb">
            <h1 className="text-center">Swap your tokens</h1>
          </div>
        </section>
        <section className="container-fluid d_coll no-top no-bottom pb-5 mb-5">
          <div className="row">
            <div className="col-md-12">
              <Contained className="mx-2 mx-md-5">
                <Container_header>
                  <Switch value={value} setValue={setValue} />
                  <CurrencyOptions>
                    <CurrencyOption
                      selected={currency === "USDT"}
                      onClick={() => selectCurrency("USDT")}
                    >
                      USDT
                    </CurrencyOption>
                    <CurrencyOption
                      selected={currency === "Natura"}
                      onClick={() => selectCurrency("Natura")}
                    >
                      Natura
                    </CurrencyOption>
                  </CurrencyOptions>
                </Container_header>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HighlightedHeading
                    onClick={() => {
                      setCondition("record");
                      setFilterType("all");
                    }}
                  >
                    Record
                  </HighlightedHeading>{" "}
                  {condition === "record" ? (
                    <span
                      style={{
                        color: "#ff343f",
                      }}
                    >
                      <Dropdown
                        style={{
                          width: "100%",
                        }}
                      >
                        <Dropdown.Toggle
                          as={TOGGLE}
                          variant="success"
                          id="dropdown-basic"
                        >
                          <CiFilter
                            style={{
                              color: "#ff343f",
                              height: "20px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => setFilterType("cancelled")}
                          >
                            Cancelled Listings
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setFilterType("successful")}
                          >
                            Successful Listings
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </span>
                  ) : null}
                  <span
                    style={{
                      color: "#ff343f",
                    }}
                  >
                    &#124;
                  </span>
                  <div>
                    {!currentAcc ? (
                      <HighlightedHeading
                        className="text-center"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          // connectWallet()
                        }}
                      >
                        Connect your wallet to create listings
                      </HighlightedHeading>
                    ) : (
                      <>
                        <Dropdown
                          style={{
                            width: "100%",
                          }}
                        >
                          <Dropdown.Toggle
                            as={CustomToggle}
                            variant="success"
                            id="dropdown-basic"
                          >
                            Manage your listings
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <ListingBtn onClick={OpenModal}>
                                Create new listing
                              </ListingBtn>
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => setCondition("userListings")}
                            >
                              Your Listings
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    )}
                  </div>
                  {condition === "userListings" ||
                  (condition === "record" && condition !== "buy") ? (
                    <BUTTON onClick={() => setCondition("buy")}>Back</BUTTON>
                  ) : null}
                </div>
              </Contained>
              {condition === "buy" ? (
                <div className="mx-2 mx-md-5 mt-4">
                  <TradeTable
                    currency={currency}
                    Listings={Listings}
                    value={value}
                    setRefetch={setRefetch}
                    setIsLoading={setIsLoading}
                  />
                </div>
              ) : condition === "userListings" ? (
                <>
                  <div className="mx-2 mx-md-5 mt-4">
                    <UserTable
                      currency={currency}
                      currentAcc={currentAcc}
                      Listings={Listings}
                      setRefetch={setRefetch}
                      setIsLoading={setIsLoading}
                      provider={provider}
                    />
                  </div>
                </>
              ) : condition === "record" ? (
                <>
                  <div className="mx-2 mx-md-5 mt-4">
                    <RecordTable
                      currency={currency}
                      Listings={Listings}
                      value={value}
                      setRefetch={setRefetch}
                      setIsLoading={setIsLoading}
                      filterType={filterType}
                    />
                  </div>
                </>
              ) : null}
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

export default Swapping;
