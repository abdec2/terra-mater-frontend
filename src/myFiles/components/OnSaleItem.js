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
const OnSaleItem = ({ setFetchNfts, nft, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', height, onImgLoad }) => {
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

    const getUserOnSaleNFT = async () => {
        try {
            const res = await axios.get(`${api.baseUrl}/api/nft?filters[$and][0][owner]=${userInfo.address}&filters[$and][1][nft_status]=2&populate=*`)
            console.log(res.data.data)
            setNftData(res.data.data)
        } catch (e) {
            console.log(e)
        }
    }
    console.log('nftdata', nftdata)

    useEffect(() => {
        getUserOnSaleNFT()
        // setNftData(nft)
    }, [])

    return (
        <>
            {
                nftdata && (
                    (nftdata && nftdata.length > 0) ? (
                        nftdata.map((nft, i) => (
                            <Card key={i} className='m-2' style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={(nft.attributes.img_url !== '') ? nft.attributes.img_url : 'https://via.placeholder.com/300x300.png?text=NFT Image'} />
                                <Card.Body>
                                    <Card.Title>{nft.attributes.token_name}</Card.Title>
                                    <p className="mb-3" style={{ fontSize: '14px' }}>{nft.attributes.collection.data.attributes.name}</p>
                                    <button className='btn-custom-card' onClick={() => navigateTo(`/ItemDetail/${nft.id}`)}>View</button>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <h3 className='text-center fw-normal'>No items to display</h3>
                    )
                )
            }

        </>

    );
};

export default memo(OnSaleItem);