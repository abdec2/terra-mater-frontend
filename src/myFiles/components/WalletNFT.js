import React, { memo, useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';


const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 0px;
`;

//react functional component
const WalletNFT = ({ nft, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', height, onImgLoad }) => {
    const [nftdata, setNftData] = useState(null)
    const [openCheckout, setOpenCheckout] = useState(false);
    const nftPrice = useRef();
    const navigate = useNavigate();
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
            setNftData(response)
        } catch (e) {
            console.log(e)
        }
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
                            <p className="mb-3" style={{fontSize: '14px'}}>{nftdata.contractMetadata.name}</p>
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
                <div className='checkout'>
                    <div className='maincheckout'>
                        <button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                        <div className='heading'>
                            <h3>Listing your NFT</h3>
                        </div>
                        <p>
                            You are about to list your NFT on Terra Mater. You will make two transactions. first approve our smart contract to access your NFT then List
                        </p>
                        <Form.Control className='border border-secondary text-black-50' type='text' placeholder='Enter list price...' ref={nftPrice} />
                        <button className='btn-main '>Approve</button>
                        <button className='btn-main  '>List</button>
                    </div>
                </div>
            }
        </>

    );
};

export default memo(WalletNFT);