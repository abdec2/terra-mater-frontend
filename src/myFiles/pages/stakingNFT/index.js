import React, { useState, useEffect } from "react";
import { StyledHeader } from "../../../components/Styles";
import {
  connectWallet,
  reconnectWallet
} from "./../../../components/menu/connectWallet";
import { useWalletClient, useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/react'

import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import Footer from "./../../../components/components/footer";
import { useFetchNFT } from './hooks/useFetchNfts';
import useStakedNFT from './hooks/useFetchStakedNft';
import "./staking.css";
import { useDispatch, useSelector } from "react-redux";
import DropDownComponent from "./dropdown";
// helpers
import { prepareNftPath } from './helpers/helpers'
import LoadingScreen from "./loadingScreen";
import { CONFIG, STAKE_NFT_CONTRACTS } from "../../../config/config";
import NFTABI from '../../../config/NftAbi.json'
import StakingAbi from '../../../config/staking.json'
import StakeTimerComponent from './startDate'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


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
  const { address } = useAccount()
  const {open:openModal, close} = useWeb3Modal()
  const signer = useWalletClient()
  const [account, setAccount] = useState("");
  const [mCursor, setMcursor] = useState('');
  const web3Store = useSelector((state) => state.web3);
  const web3 = web3Store.web3
  const [fetchNFTs, setFetchNFTs] = useState(true);
  const { nft: myNfts, cursor } = useFetchNFT(web3Store.account, fetchNFTs, setFetchNFTs, mCursor);
  const stakedNFTs = useStakedNFT(web3Store.account, fetchNFTs, setFetchNFTs)
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  console.log(stakedNFTs)

  useEffect(() => {
    if (typeof web3Store.account === "string") {
      setAccount(web3Store.account);
    }
  }, [web3Store.account, account]);

  useEffect(() => {
    setMcursor(cursor)
  }, [fetchNFTs])

  const handleApprove = async (pid, tokenId) => {
    const tokenAddress = STAKE_NFT_CONTRACTS.filter(item => item.pid === pid)
    const nftContract = new web3.eth.Contract(NFTABI, tokenAddress[0].tokenAddress)
    const estimateGas = await nftContract.methods.approve(CONFIG.STAKING_ADDRESS, tokenId.toString()).estimateGas({ from: web3Store.account })
    const approve = await nftContract.methods.approve(CONFIG.STAKING_ADDRESS, tokenId.toString()).send({ from: web3Store.account, gasLimit: estimateGas.toString() })
    console.log(approve)
  }
  const handleStakeTransaction = async (pid, tokenId) => {
    const stakingContract = new web3.eth.Contract(StakingAbi, CONFIG.STAKING_ADDRESS)
    const estimateGas = await stakingContract.methods.stake([pid], [tokenId]).estimateGas({ from: web3Store.account })
    const staketx = await stakingContract.methods.stake([pid], [tokenId]).send({ from: web3Store.account, gasLimit: estimateGas.toString() }) 
    console.log(staketx)
  }

  const handleStake = async (pid, tokenId) => {
    try {
      setIsLoading(true)
      await handleApprove(pid, tokenId)
      await handleStakeTransaction(pid, tokenId)
      setIsLoading(false)
      setFetchNFTs(true)
      MySwal.fire({
        title: 'Success!',
        text: 'Your nft has been staked successfuly',
        icon: 'success'
        
      })
      
      
    } catch (e) {
      setIsLoading(false)
      MySwal.fire({
        title: 'Oops!',
        text: 'Something went wrong..',
        icon: 'error'
        
      })
      console.log(e)
    }
  }

  const handleClaimRewards = async (pid, tokenId) => {
    try {
      setIsLoading(true)
      const stakingContract = new web3.eth.Contract(StakingAbi, CONFIG.STAKING_ADDRESS)
      const estimateGas = await stakingContract.methods.claimRewards([pid], [tokenId]).estimateGas({ from: web3Store.account })
      const unstaketx = await stakingContract.methods.claimRewards([pid], [tokenId]).send({ from: web3Store.account, gasLimit: estimateGas.toString() }) 
      console.log(unstaketx)
      setIsLoading(false)
      setFetchNFTs(true)
      MySwal.fire({
        title: 'Success!',
        text: 'Your have claimed your rewards successfuly',
        icon: 'success'
        
      })
    } catch(e) {
      setIsLoading(false)
      MySwal.fire({
        title: 'Oops!',
        text: 'Something went wrong..',
        icon: 'error'
        
      })
      console.log(e)
    }
  }

  const handleUnstake = async (pid, tokenId) => {
    try {
      setIsLoading(true)
      const stakingContract = new web3.eth.Contract(StakingAbi, CONFIG.STAKING_ADDRESS)
      const estimateGas = await stakingContract.methods._unstakeMany([pid], [tokenId]).estimateGas({ from: web3Store.account })
      const unstaketx = await stakingContract.methods._unstakeMany([pid], [tokenId]).send({ from: web3Store.account, gasLimit: estimateGas.toString() }) 
      console.log(unstaketx)
      setIsLoading(false)
      setFetchNFTs(true)
      MySwal.fire({
        title: 'Success!',
        text: 'Your nft has been unstaked successfuly',
        icon: 'success'
        
      })
      
    } catch(e) {
      setIsLoading(false)
      MySwal.fire({
        title: 'Oops!',
        text: 'Something went wrong..',
        icon: 'error'
        
      })
      console.log(e)
    }
  }

  const handleNext = () => {
    // document.querySelector('.containerStaked').scrollTo(0, 0)
    window.scrollTo(0, 0)
    setFetchNFTs(true)
  }

  const handleReset = () => {
    // document.querySelector('.containerStaked').scrollTo(0, 0)
    window.scrollTo(0, 0)
    setMcursor('')
    setFetchNFTs(true)
  }
  return (
    <div
      className="greyscheme bg-dark"
      style={{ background: "black", width: "100%", minHeight: "100vh" }}
    >
      <StyledHeader theme={theme} />
      <div className="container">
        <div className="" style={{ paddingTop: '100px' }}>
          <Reveal
            className=""
            keyframes={fadeInUp}
            delay={600}
            duration={900}
            triggerOnce
          >
            <div className="container_box p-2">
              <h1 className="text-center">Stake and Earn</h1>
              <p className="text-center">Stake your NFTs and earn rewards.</p>
            </div>
          </Reveal>
        </div>

        <div className="container_box_btn">
          {!account ? (
            <>
              <button
                className="walletBtn"
                onClick={() => {
                  if(signer.data === undefined) {
                    openModal()
                  } else {
                    connectWallet(dispatch, address, signer, true)
                  }
                }}
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
                  <div className="w-100" style={{ maxWidth: '500px' }}>
                    <div className="">
                      {stakedNFTs?.map((item, index) => {
                        return (
                          <div key={index} className="">
                            <div className="">
                              <div className="d-flex align-items-center justify-content-between py-3 border-bottom border-danger">
                                <div className="">
                                  <img width={90} height={90}
                                    src={item?.normalized_metadata?.image ? prepareNftPath(item?.normalized_metadata?.image) : 'https://via.placeholder.com/90x90?text=NFT'}
                                    alt="img"
                                    className="rounded"
                                  />
                                </div>

                                <div className="ms-2">
                                  <h3 className="text-truncate" style={{ marginBottom: 0, textAlign: 'left', fontSize: '14px' }}>
                                    <span>{`${item.name}#${item.token_id}`}</span>
                                    <StakeTimerComponent startDate={item.stakeInfo.timestamp} />
                                    <span style={{fontWeight: 'normal', color: '#555', fontSize: '12px'}}>Reward per day: {(item.stakeInfo.rewardPerDay / Math.pow(10,18)).toFixed(2)} Natura</span>
                                    <div style={{fontWeight: 'normal', color: '#555', fontSize: '12px'}}>Total Rewards: {(item.stakeInfo.totalRewards / Math.pow(10,18)).toFixed(2)} Natura</div>
                                  </h3>
                                </div>

                                <div className=""> 
                                  <DropDownComponent options={[
                                    {
                                      handler: handleUnstake, label: 'Unstake', pid: item.pid, tokenId: item.token_id
                                    },
                                    {
                                      handler: handleClaimRewards, label: 'Claim Rewards', pid: item.pid, tokenId: item.token_id
                                    } 
                                  ]} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* <div className="d-flex align-items-center justify-content-center w-100">
                      <button disabled={myNfts?.length === 0} className="mt-5 me-3 py-2 px-5 rounded border " onClick={handleNext}>Next</button>
                     
                      <button className="mt-5 me-3 py-2 px-5 rounded border text-white" style={{ background: 'transparent' }} onClick={handleReset}>Reset</button>
                  
                    </div> */}
                    </div>

                  </div>
                ) : (
                  <div className="w-100" style={{ maxWidth: '500px' }}>
                    <div className="">
                      {myNfts?.map((item, index) => {
                        return (
                          <div key={index} className="">
                            <div className="">
                              <div className="d-flex align-items-center justify-content-between py-3 border-bottom border-danger">
                                <div className=" ">
                                  <img width={90} height={90}
                                    src={item?.normalized_metadata?.image ? prepareNftPath(item?.normalized_metadata?.image) : 'https://via.placeholder.com/90x90?text=NFT'}
                                    alt="img"
                                    className="rounded"
                                  />
                                </div>

                                <div className="w-50 ms-2">
                                  <h3 className="text-truncate" style={{ marginBottom: 0, textAlign: 'left', fontSize: '14px' }}>
                                    <span className="">{`${item.name}#${item.token_id}`}</span>
                                  </h3>
                                </div>

                                <div>
                                  <DropDownComponent options={[{handler: handleStake, label: 'Stake', pid: item.pid, tokenId: item.token_id}]} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="d-flex align-items-center justify-content-center w-100">
                        <button disabled={myNfts?.length === 0} className="mt-5 me-3 py-2 px-5 rounded border " onClick={handleNext}>Next</button>

                        <button className="mt-5 me-3 py-2 px-5 rounded border text-white" style={{ background: 'transparent' }} onClick={handleReset}>Reset</button>

                      </div>
                    </div>

                  </div>
                )}
              </div>
              {
                isLoading && (
                  <LoadingScreen setIsLoading={setIsLoading} />
                )
              }
            </>
          )}
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default StakingNft;
