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

    const reloadData = async () => {
        try {
            const endpoint = process.env.REACT_APP_ALCHEMY_KEY
            const nfts = await fetch(`${endpoint}/getNFTMetadata?contractAddress=${nftdata.contract.address}&tokenId=${nftdata.id.tokenId}`, {
                method: 'GET',
                redirect: 'follow'
            })
            const response = await nfts.json();
            console.log(response)
            setNftData(response)
        } catch (e) {
            console.log(e)
        }
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
            console.log(nft.contract.address)
            const nftContract = new web3.eth.Contract(nftAbi, nft.contract.address)
            const tokenId = parseInt(nft.id.tokenId, 16);
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
        const { data } = await axios.get(`${api.baseUrl + api.collection}?filters[contract_address]=${nft.contract.address}`)
        return { exist: data.data.length > 0, collection: data.data[0] }
    }

    const createCollection = async () => {
        try {
            const {data} = await axios.post(`${api.baseUrl + api.collection}`, {
                data: {
                    name: nft.contractMetadata.name,
                    contract_address: nft.contract.address,
                    chain_id: CONFIG.CHAIN_ID,
                    chain_name: CONFIG.NETWORK,
                    status: 'Active',
                    desc: nft.contractMetadata.name,
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
        const tokenId = parseInt(nft.id.tokenId, 16);
        const { data } = await axios.get(`${api.baseUrl}/api/nft?filters[$and][0][collection]=${nftCollection.id}&filters[$and][1][token_id]=${tokenId}`)
        return { exist: data.data.length > 0, _nft: data.data[0] }
    }

    const addNFTRecord = async (nftCollection, itemId) => {
        try {
            const tokenId = parseInt(nft.id.tokenId, 16);
            const { data } = axios.post(`${api.baseUrl+api['nft-v1s']}`, {data:{
                token_name: nft.metadata.name, 
                owner: web3Store.account,
                views: 0,
                price: nftPrice, 
                likes: 0,
                description: nft.description, 
                token_id: tokenId, 
                token_standard: nft.contractMetadata.tokenType, 
                img_url: nft.media[0].gateway,
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
            console.log(nft.contract.address)
            const price = web3.utils.toWei(nftPrice.toString(), 'mwei')
            const mpContract = new web3.eth.Contract(marketplaceAbi, CONFIG.MARKETPLACE_ADDRESS)
            const tokenId = parseInt(nft.id.tokenId, 16);
            const estimateGas = await mpContract.methods.createMarketItem(nft.contract.address, tokenId, price).estimateGas({from: web3Store.account})
            console.log(estimateGas.toString())
            const ListTx = await mpContract.methods.createMarketItem(nft.contract.address, tokenId, price).send({from: web3Store.account, gasLimit: estimateGas.toString()})
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
        await handleApprove()
        await handleListItem()
    }

    useEffect(() => {
        setNftData(nft)
    }, [])

    return (
        <>
            {
                nftdata && (
                    <Card className='m-2' style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={(nftdata.media[0].gateway !== '') ? nftdata.media[0].gateway : 'https://via.placeholder.com/300x300.png?text=NFT Image'} />
                        <Card.Body>
                            <Card.Title>{nftdata.metadata.name ? nftdata.metadata.name : "Refresh Data"}</Card.Title>
                            <p className="mb-3" style={{ fontSize: '14px' }}>{nftdata.contractMetadata && nftdata.contractMetadata.name}</p>
                            {nftdata.metadata.name && (
                                <button className='btn-custom-card' onClick={() => setOpenCheckout(true)}>List Now</button>
                            )}
                            {
                                !nftdata.metadata.name && (
                                    <button className='btn-custom-card' onClick={reloadData}>Refresh</button>
                                )
                            }
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