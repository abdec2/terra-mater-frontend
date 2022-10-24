import { useEffect, useState } from "react";

const useNFTMetadata = (contractAddress, tokenId, fetchNFTs, setFetchNFTs) => {
    const [nft, setNFT] = useState(null)
    const fetchWalletNFTs = async (contractAddress, tokenId) => {
        try {
            if(contractAddress && tokenId) {
                const endpoint = process.env.REACT_APP_ALCHEMY_KEY
                const nfts = await fetch(`${endpoint}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}` ,{
                    method: 'GET', 
                    redirect: 'follow'
                })
                const response = await nfts.json();
                setNFT(response)
                setFetchNFTs(false)
            }
          
        } catch(e) {
            console.log(e)
            setFetchNFTs(false)
        }
    }

    useEffect(()=>{
        if (fetchNFTs) {
            fetchWalletNFTs(contractAddress, tokenId)
        }
    }, [contractAddress, tokenId, fetchNFTs])

    return nft

}

export default useNFTMetadata