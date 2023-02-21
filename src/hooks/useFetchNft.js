import axios from "axios";
import { useEffect, useState } from "react";
import { CONFIG } from "../config/config";

const useFetchNFT = (account, fetchNFTs, setFetchNFTs, page, setPage) => {
    const [nft, setNFT] = useState(null)
    const fetchWalletNFTs = async (account) => {
        try {
            console.log(page)
            if(account) {
                const options = {
                    method: 'GET',
                    url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                    params: {chain: CONFIG.CHAIN_FOR_MORALIS, format: 'decimal', limit: '100', disable_total: false, cursor: page, normalizeMetadata: 'true'},
                    headers: {accept: 'application/json', 'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY}
                  };
                
                axios
                .request(options)
                .then(function (response) {
                    console.log(response);
                    setPage(response.data.cursor)
                    if(nft) {
                        setNFT({...response.data, result: [...nft.result, ...response.data.result]})
                    } else {
                        setNFT(response.data)
                    }
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

    return nft

}

export default useFetchNFT