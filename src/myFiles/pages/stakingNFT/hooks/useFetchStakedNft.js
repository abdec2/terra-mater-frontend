import { useEffect } from "react"
import { CONFIG, STAKE_NFT_CONTRACTS } from './../../../../config/config'
import { useState } from "react"
import ABI from './../../../../config/staking.json'
import { useSelector } from "react-redux"
import axios from "axios";


const useStakedNFT = (account, fetchNFTs, setFetchNfts) => {
    const [stakedTokens, setStakedTokens] = useState([])
    const web3Store = useSelector(state => state.web3)
    const web3 = web3Store.web3;
    const loadStakedNFT = async () => {
        if (account) {
            const contract = new web3.eth.Contract(ABI, CONFIG.STAKING_ADDRESS);
            const tokenArray = await Promise.all(STAKE_NFT_CONTRACTS.map(async item => {
                const staked_tokens = await contract.methods.getUserStakedTokens(item.pid, account).call()
                const result = staked_tokens.map(token => ({token_address: item.tokenAddress, token_id: token }))
                return result
            }))

            const options = {
                method: 'POST',
                url: 'https://deep-index.moralis.io/api/v2/nft/getMultipleNFTs',
                params: {chain: CONFIG.CHAIN_FOR_MORALIS},
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
                    setStakedTokens(response.data)
                    setFetchNfts(false)
                })
                .catch(function (error) {
                  console.error(error);
                });
                
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