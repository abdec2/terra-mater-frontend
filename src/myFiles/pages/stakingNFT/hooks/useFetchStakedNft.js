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
        const result =await Promise.all(
          staked_tokens.map(async (token) => {
            const stakeDetails = await contract.methods.vault(item.pid, token).call()
            const rewardsPerDay = await contract.methods.getRewardsPerDay(item.pid).call()
            stakeDetails.rewardPerDay = parseInt(rewardsPerDay)
            return { token_address: item.tokenAddress, token_id: token, stakeDetails: stakeDetails }
          })
        )
        return result
      }))
      console.log(tokenArray)
      if (tokenArray[0].length > 0) {
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
            tokens: tokenArray[0],
            normalizeMetadata: true
          }
        };

        axios
          .request(options)
          .then(function (response) {
            const res = response.data
            const result = res.map(item => {
              const pidObj = STAKE_NFT_CONTRACTS.filter(contract => contract.tokenAddress.toLowerCase() === item.token_address.toLowerCase())
              item.pid = pidObj[0].pid
              return item
            })
            console.log(result)

            const resultWithST = result.map(res => {
              const filteredTokenArray = tokenArray[0].filter(item => (item.token_address.toLowerCase() === res.token_address.toLowerCase() && parseInt(item.token_id) === parseInt(res.token_id)) )
              res.stakeInfo = filteredTokenArray[0].stakeDetails
              return res
            })

            console.log(resultWithST)

            setStakedTokens(resultWithST)
            setFetchNfts(false)
          })
          .catch(function (error) {
            console.error(error);
          });
      } else {
        setStakedTokens(tokenArray[0])
        setFetchNfts(false)
      }

      // setStakedTokens(tokenArray)
      // setFetchNfts(false)
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