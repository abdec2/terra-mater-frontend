import axios from "axios";
import { useEffect, useState } from "react";
import { STAKE_NFT_CONTRACTS } from './../../../../config/config';

export const useFetchNFT = (account, fetchNFTs, setFetchNFTs, cursors = null) => {
    const [nft, setNFT] = useState(null)
    const [cursor, setCursor] = useState('')
    const fetchWalletNFTs = async (account) => {
        try {
            console.log('useFetchNFT', account)
            if(account) {
                let tokenAddress = STAKE_NFT_CONTRACTS[0].tokenAddress
                STAKE_NFT_CONTRACTS.map((item, i) => {
                    if(i > 0) {
                        tokenAddress += '&';
                        tokenAddress += `token_addresses=${item.tokenAddress}`
                    }
                })

                const options = {
                    method: 'GET',
                    url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                    params: {
                        cursor: cursors ? cursors : '',
                        chain: 'mumbai', 
                        format: 'decimal', 
                        limit: 10,
                        token_addresses: tokenAddress,
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