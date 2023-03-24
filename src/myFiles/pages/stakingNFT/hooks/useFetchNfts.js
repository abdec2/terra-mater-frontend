import axios from "axios";
import { useEffect, useState } from "react";
import { CONFIG, STAKE_NFT_CONTRACTS } from './../../../../config/config';

export const useFetchNFT = (account, fetchNFTs, setFetchNFTs, cursors = null) => {
    const [nft, setNFT] = useState(null)
    const [cursor, setCursor] = useState('')
    const fetchWalletNFTs = async (account) => {
        try {
            console.log('useFetchNFT', account)
            if(account) {
                const tokenAddress = [];
                STAKE_NFT_CONTRACTS.map((item, i) => {
                    tokenAddress.push(item.tokenAddress)
                })
                console.log(tokenAddress)
                const options = {
                    method: 'GET',
                    url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                    params: {
                        cursor: cursors ? cursors : '',
                        chain: CONFIG.CHAIN_FOR_MORALIS, 
                        format: 'decimal', 
                        token_addresses: tokenAddress,
                        limit: 20,
                        normalizeMetadata: 'true'
                    },
                    headers: {accept: 'application/json', 'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY}
                };
                
                axios
                .request(options)
                .then(function (response) {
                    console.log(response.data)
                    const resData = response.data.result
                    const resDataWithPID = resData.map(item => {
                        const pdata = STAKE_NFT_CONTRACTS.filter(pitem => pitem.tokenAddress.toLowerCase() === item.token_address.toLowerCase() )
                        item.pid = pdata[0].pid
                        return item 
                    })
                    setCursor(response.data.cursor)
                    setNFT(resDataWithPID)
                    setFetchNFTs(false)
                })
                .catch(function (error) {
                    console.error(error);
                });

            }
          
        } catch(e) {
            console.log(e)
            setFetchNFTs(false)
        }
    }

    useEffect(()=>{
        if (fetchNFTs) {
            fetchWalletNFTs(account)
        }
    }, [account, fetchNFTs])

    return {nft, cursor}

}

export default useFetchNFT