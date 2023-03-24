import { useEffect } from "react"
import { CONFIG, STAKE_NFT_CONTRACTS } from './../../../../config/config'
import { useState } from "react"
import ABI from './../../../../config/staking.json'
import { useSelector } from "react-redux"
import axios from "axios";
import Web3 from "web3"


const useStakedNFT = (account, fetchNFTs, setFetchNfts) => {
  const [stakedTokens, setStakedTokens] = useState([])
  const web3Store = useSelector(state => state.web3)
  const web3 = new Web3(process.env.REACT_APP_ALCHEMY_KEY);
  const loadStakedNFT = async () => {
    if (account) {
      const contract = new web3.eth.Contract(ABI, CONFIG.STAKING_ADDRESS);
      const tokenArray = await Promise.all(STAKE_NFT_CONTRACTS.map(async item => {
        const staked_tokens = await contract.methods.getUserStakedTokens(item.pid, account).call()
        const result = await Promise.all(
          staked_tokens.map(async (token) => {
            const stakeDetails = await contract.methods.vault(item.pid, token).call()
            const rewardsPerDay = await contract.methods.getRewardsPerDay(item.pid).call()
            stakeDetails.rewardPerDay = parseInt(rewardsPerDay)
            const currentTimeStamp = new Date().getTime()
            const stakeTimeStamp = parseInt(stakeDetails.timestamp)
            const diff = (currentTimeStamp / 1000) - stakeTimeStamp
            const days = Math.floor(diff / (60 * 60 * 24))
            const totalRewards = days * rewardsPerDay
            stakeDetails.totalRewards = totalRewards
            return { token_address: item.tokenAddress, token_id: token, stakeDetails: stakeDetails }
          })
        )
        return result
      }))
      let tokens = []
      tokenArray.map(item => tokens = [...tokens, ...item])
      const dataArray = []
      if (tokens.length > 25) {
        while (tokens.length) {
          dataArray.push(tokens.splice(0, 25))
        }
      } else {
        dataArray.push(tokens)
      }
      let data = []
      await Promise.all(dataArray.map(async (itemsArray) => {
        if (itemsArray.length > 0) {
          const options = {
            method: 'POST',
            url: 'https://deep-index.moralis.io/api/v2/nft/getMultipleNFTs',
            params: { chain: CONFIG.CHAIN_FOR_MORALIS },
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY
            },
            data: {
              tokens: itemsArray,
              normalizeMetadata: true
            }
          };

          const response = await axios.request(options)
          const res = response.data
          const result = res.map(item => {
            const pidObj = STAKE_NFT_CONTRACTS.filter(contract => contract.tokenAddress.toLowerCase() === item.token_address.toLowerCase())
            
            item.pid = pidObj[0].pid
            return item
          })

          const resultWithST = result.map(res => {
            const filteredTokenArray = itemsArray.filter(item => (item.token_address.toLowerCase() === res.token_address.toLowerCase() && parseInt(item.token_id) === parseInt(res.token_id)))
            res.stakeInfo = filteredTokenArray[0].stakeDetails
            return res
          })

          console.log(resultWithST)
          if (resultWithST.length > 0) {
            data = [...data, ...resultWithST]
          }
          
        }
      }))
      setStakedTokens([...data])
      setFetchNfts(false)
    }

  }

  useEffect(() => {
    if (fetchNFTs) {
      loadStakedNFT()
    }

  }, [account, fetchNFTs])

  return stakedTokens

}

export default useStakedNFT