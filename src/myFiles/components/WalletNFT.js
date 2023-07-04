import React, { memo, useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { CONFIG } from './../../config/config'
import nftAbi from './../../config/NftAbi.json'
import marketplaceAbi from './../../config/Marketplace.json'
import auth from '../../core/auth';
import axios from 'axios';
import api from '../../core/api';
import { connectWallet, reconnectWallet } from '../../components/menu/connectWallet';
import { useWalletClient, useAccount } from 'wagmi'


const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 0px;
`;

//react functional component
const WalletNFT = ({ setFetchNfts, nft, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', height, onImgLoad }) => {
    const {address} = useAccount()
    const signer = useWalletClient()
    const [nftdata, setNftData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [openCheckout, setOpenCheckout] = useState(false);
    const dispatch = useDispatch()
    const web3Store = useSelector(state => state.web3)
    const web3 = web3Store.web3;
    const [nftPrice, setNftPrice] = useState('');
    const navigate = useNavigate();
    const jwtToken = auth.getToken()
    const userInfo = auth.getUserInfo()
    const navigateTo = (link) => {
        navigate(link);
    }


    const validateForm = () => {
        const input = nftPrice;
        let res = false
        if (input !== '') {
            res = true
        }

        return res
    }

    const handleApprove = async () => {
        if (!validateForm()) {
            return
        }
        if (!web3Store.account) {
            alert('connect wallet')
            return
        }
        try {
            setLoading(true)
            console.log(nft.token_address)
            const nftContract = new web3.eth.Contract(nftAbi, nft.token_address)
            const tokenId = nft.token_id;
            const estimateGas = await nftContract.methods.approve(CONFIG.MARKETPLACE_ADDRESS, tokenId).estimateGas({ from: web3Store.account })
            const approve = await nftContract.methods.approve(CONFIG.MARKETPLACE_ADDRESS, tokenId.toString()).send({ from: web3Store.account, gasLimit: estimateGas.toString() })
            console.log(approve)
            setLoading(false)
        } catch (e) {
            console.log(e);
            setLoading(false)
        }
    }

    const checkCollectionByContractAddress = async () => {
        const { data } = await axios.get(`${api.baseUrl + api.collection}?filters[contract_address]=${nft.token_address}`)
        return { exist: data.data.length > 0, collection: data.data[0] }
    }

    const createCollection = async () => {
        try {
            const {data} = await axios.post(`${api.baseUrl + api.collection}`, {
                data: {
                    name: nft.name,
                    contract_address: nft.token_address,
                    chain_id: CONFIG.CHAIN_ID,
                    chain_name: CONFIG.NETWORK,
                    status: 'Active',
                    desc: nft.normalized_metadata.description,
                    users_permissions_user: userInfo.id,
                    category: 1
                }
            }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
            return data.data
        } catch(e) {
            console.log(e)
        }
    }

    const checkNftExist = async (nftCollection) => {
        const tokenId = nft.token_id;
        const { data } = await axios.get(`${api.baseUrl}/api/nft?filters[$and][0][collection]=${nftCollection.id}&filters[$and][1][token_id]=${tokenId}`)
        return { exist: data.data.length > 0, _nft: data.data[0] }
    }

    const addNFTRecord = async (nftCollection, itemId) => {
        try {
            const tokenId = nft.token_id;
            const { data } = axios.post(`${api.baseUrl+api['nft-v1s']}`, {data:{
                token_name: nft.normalized_metadata.name, 
                owner: web3Store.account,
                views: 0,
                price: nftPrice, 
                likes: 0,
                description: nft.normalized_metadata.description, 
                token_id: tokenId, 
                token_standard: nft.contract_type, 
                img_url: transformImagePath(nft.normalized_metadata.image),
                item_id: itemId,
                collection: nftCollection.id,
                nft_status: 2, 

            }}, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
        } catch(e) {
            console.log(e)
        }
    }

    const updateNFTRecord = async (_nft, itemId) => {
        try {
            const {data} = axios.put(`${api.baseUrl+api['nft-v1s']}/${_nft.id}`, {
                data: {
                    owner: web3Store.account,
                    price: nftPrice,
                    item_id: itemId, 
                    nft_status: 2
                }
            })
        } catch(e) {
            console.log(e)
        }
    }

    const createNFT = async (nftCollection, itemId) => {
        try {
            const {exist, _nft} = await checkNftExist(nftCollection)
            console.log(exist)
            console.log(_nft)
            if(exist) {
                // update NFT status
                await updateNFTRecord(_nft, itemId)
            } else {
                // create nft record
                await addNFTRecord(nftCollection, itemId)
            }
        } catch(e) {
            console.log(e)
        }
    }

    const makeBackendEntries = async (itemId) => {
        try {
            const { exist, collection } = await checkCollectionByContractAddress()
            let nftCollection = collection
            console.log(exist)
            if (!exist) {
                nftCollection = await createCollection()
                console.log(nftCollection)
            }
            console.log(nftCollection)
            await createNFT(nftCollection, itemId)

        } catch(e) {
            console.log(e)
        }
    }

    const handleListItem = async () => {
        if (!validateForm()) {
            return
        }
        if (!web3Store.account) {
            alert('connect wallet')
            return
        }
        try {
            setLoading(true)
            console.log(nft.token_address)
            const price = web3.utils.toWei(nftPrice.toString(), 'mwei')
            const mpContract = new web3.eth.Contract(marketplaceAbi, CONFIG.MARKETPLACE_ADDRESS)
            const estimateGas = await mpContract.methods.createMarketItem(nft.token_address, nft.token_id, price).estimateGas({from: web3Store.account})
            console.log(estimateGas.toString())
            const ListTx = await mpContract.methods.createMarketItem(nft.token_address, nft.token_id, price).send({from: web3Store.account, gasLimit: estimateGas.toString()})
            console.log(ListTx)
            const itemId = ListTx.events.MarketItemCreated.returnValues.itemId
            await makeBackendEntries(itemId)
            setOpenCheckout(false)
            setLoading(false)
            setFetchNfts(true)
        } catch (e) {
            console.log(e);
            setLoading(false)
        }

    }

    const makeTransaction = async () => {
        if (!web3Store.account) {
            // await reconnectWallet(dispatch)
            await connectWallet(dispatch, address, signer, true)
        }
        await handleApprove()
        await handleListItem()
    }

    const transformImagePath = (imageUrl) => {
        let url = imageUrl
        const isIpfs = url.startsWith('ipfs://')
        if(isIpfs) {
            url = url.replace('ipfs://', 'https://ipfs.io/ipfs/')
        }
        return url
    }

    useEffect(() => {
        setNftData(nft)
    }, [])

    return (
        <>
            {
                nftdata && nftdata.token_address.toLowerCase() !== String("0x5d90317b33da4464de99a1757be47af40a1ff002").toLowerCase() && nftdata.normalized_metadata.image && (
                    <Card className='m-2' style={{ width: '18rem' }}>
                        <Card.Img variant="top" width={250} height={250} src={transformImagePath(nftdata.normalized_metadata.image)} />
                        <Card.Body>
                            <Card.Title>{nftdata.normalized_metadata.name}</Card.Title>
                            <p className="mb-3" style={{ fontSize: '14px' }}>{nftdata.name}</p>
                            <button className='btn-custom-card' onClick={async () => {
                                if(!web3Store.account) {
                                    // await reconnectWallet(dispatch)
                                    await connectWallet(dispatch, address, signer, true)
                                }
                                setOpenCheckout(true)
                            }}>List Now</button>
                        </Card.Body>
                    </Card>
                )
            }
            {openCheckout &&
                <>
                    {
                        !loading ? (
                            <div className='checkout'>
                                <div className='maincheckout'>
                                    <button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                                    <div className='heading'>
                                        <h3>Listing your NFT</h3>
                                    </div>
                                    <p>
                                        You are about to list your NFT on Terra Mater. You will make two transactions. first approve our smart contract to access your NFT then List
                                    </p>
                                    <Form.Control className='border border-secondary text-black-50' type='text' placeholder='Enter list price...' defaultValue={nftPrice} onChange={(e) => setNftPrice(e.target.value)} />
                                    <div className="d-flex flex-row">
                                        {/* <div className="w-100 px-2">
                                            <button className='btn-main lead mb-5' onClick={handleApprove}>Approve</button>
                                        </div> */}
                                        <div className="w-100 px-2">
                                            <button className='btn-main lead mb-5' onClick={makeTransaction}>List NFT</button>
                                        </div>
                                    </div>
                                    <div>
                                        <span>Note: Kindly approve before Listing NFT.</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='checkout'>
                                <div className='maincheckout'>
                                    <button disabled className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                                    <div className='heading mt-5'>
                                        <p className="w-100 text-center">Waiting for Transaction...</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </>
            }
        </>

    );
};

export default memo(WalletNFT);