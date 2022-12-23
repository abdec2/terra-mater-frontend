import axios from "axios";
import { useEffect, useState } from "react";
import { CONFIG } from "../config/config";

const useFetchNFT = (account, fetchNFTs, setFetchNFTs) => {
    const [nft, setNFT] = useState(null)
    const fetchWalletNFTs = async (account) => {
        try {
            if(account) {
                const options = {
                    method: 'GET',
                    url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                    params: {chain: CONFIG.CHAIN_FOR_MORALIS, format: 'decimal', normalizeMetadata: 'true'},
                    headers: {accept: 'application/json', 'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY}
                  };
                
                axios
                .request(options)
                .then(function (response) {
                    console.log(response.data.result);
                    setNFT(response.data.result)
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