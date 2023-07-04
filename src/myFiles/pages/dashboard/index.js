import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from './../../../components/components/footer';
import * as selectors from '../../../store/selectors';
import { fetchCollections, fetchCollectionNfts, searchCollectionNFT } from "../../../store/actions/thunks";
import { useParams } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from 'react-bootstrap/Spinner';
import NftCard from '../../../components/components/NftCard';
import Form from 'react-bootstrap/Form';
import auth from './../../../core/auth'
import metrics from './../../../assets/metrics.png'
import Card from 'react-bootstrap/Card';
import axios from "axios";


//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../../../components/Styles';
import { DiscordIcon, EtherscanIcon, TwitterIcon, UsdtIcon, WebsiteIcon } from "./../../components/Icons";
import TooltipIcon from "./../../components/TooltipIcon";
import { Button, Table } from "react-bootstrap";
import CheckboxFilter from "../../../components/components/CheckboxFilter";
import { clearFilter, clearCollectionNfts } from "../../../store/actions";
import Tabs from "../../components/Tabs";
import { CONFIG } from "../../../config/config";
import Web3 from "web3";
import stakingAbi from './../../../config/staking.json'
import tokenAbi from './../../../config/natura.json'
import api from "../../../core/api";
import nft_abi from '../../../config/NftAbi.json'

//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        className="px-2"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}

    </a>
));

const Dashboard = function () {
    const { userId } = useParams();
    const [data, setData] = useState({
        goldReserve: null,
        btcReserve: null,
        miscReserve: null,
        otherNaturaReleased: null,
        naturaPrice: null,
        stakingRewards: null
    })
    const [col, setCol] = useState([])
    const dispatch = useDispatch();
    const store = useSelector(state => state)
    const userInfo = auth.getUserInfo()
    const web3 = new Web3(process.env.REACT_APP_ALCHEMY_KEY)

    const fetchContractData = async () => {
        const stakingContract = new web3.eth.Contract(stakingAbi, CONFIG.STAKING_ADDRESS)
        const tokenContract = new web3.eth.Contract(tokenAbi, CONFIG.NATURA_TOKEN_ADDRESS)

        const goldReserve = await tokenContract.methods._getGoldReserves().call().then(result => result)
        const btcReserve = await tokenContract.methods._getBitcoinReserves().call().then(result => result)
        const miscReserve = await tokenContract.methods._getMiscReserves().call().then(result => result)
        const otherNaturaReleased = await tokenContract.methods._getOtherNaturaReleased().call().then(result => result)
        const naturaPrice = await tokenContract.methods.getNaturaPrice().call().then(result => result)
        const stakingRewards = await stakingContract.methods.totalRewardsClaimed().call().then(result => result)

        setData({
            goldReserve,
            btcReserve: web3.utils.fromWei(btcReserve, 'ether'),
            miscReserve,
            otherNaturaReleased: web3.utils.fromWei(otherNaturaReleased, 'ether'),
            naturaPrice: (parseFloat(naturaPrice.toString()) / Math.pow(10, 6)),
            stakingRewards: web3.utils.fromWei(stakingRewards, 'ether')
        })
    }

    const getMarketPrice = async (collectionId) => {
        const res = await axios.get(`${api.baseUrl}/api/transactions?filters[collection]=${collectionId}&sort[0]=publishedAt:desc&sort[1]=price:asc`)
        const data = res.data.data
        return data
    }

    const getCollections = async () => {
        try {
            const res = await axios.get(`${api.baseUrl}/api/collections?filters[status]=Active&filters[feature]=true`)
            const collections = res.data.data
            if (collections.length > 0) {
                const collectionData = await Promise.all(collections.map(async (item) => {
                    const contract = new web3.eth.Contract(nft_abi, item.attributes.contract_address)
                    const stcontract = new web3.eth.Contract(stakingAbi, CONFIG.STAKING_ADDRESS)
                    let stakingPoolLength = await stcontract.methods.poolLength().call().then(result => result)
                    stakingPoolLength = parseInt(stakingPoolLength.toString())
                    if (stakingPoolLength > 0) {
                        for (let i = 0; i < stakingPoolLength; i++) {
                            let pool = await stcontract.methods.poolInfo(i).call().then(result => result)
                            if (pool.nftAddress.toLowerCase() === item.attributes.contract_address.toLowerCase()) {
                                item.pid = i
                                item.marketPrice = parseFloat(pool.cost) / Math.pow(10, 6)
                            }
                        }
                    }
                    const tradeData = await getMarketPrice(item.id);
                    if (tradeData.length > 0) {
                        item.ltp = tradeData[0].attributes.price
                    } else {
                        item.ltp = 0
                    }
                    let totalSupply = await contract.methods.maxSupply().call().then(result => result)
                    totalSupply = parseFloat(totalSupply.toString())
                    let cost = await contract.methods.cost().call().then(result => result)
                    cost = parseFloat(cost) / Math.pow(10, 6)
                    const totalValue = (item.marketPrice !== undefined && parseFloat(item.marketPrice) !== 0) ? totalSupply * parseFloat(item.marketPrice) : totalSupply * cost
                    item.totalSupply = totalSupply
                    item.totalValue = totalValue
                    item.floorPrice = cost
                    return item
                }))
                setCol(collectionData)
                console.log(collectionData)
            }

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchContractData()
        getCollections()
    }, [])

    return (
        <div className="greyscheme min-vh-100">
            <StyledHeader theme={theme} />
            <section id='profile_banner' className='jumbotron breadcumb ' style={{ background: 'url("./img/background/6.jpg")' }}>
                <div className='mainbreadcumb'>
                    <h1 className="text-center">Dashboard</h1>
                </div>
            </section>

            <section className="container">
                <div className="row px-2 px-md-5">
                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <Card style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <Card.Header className="position-relative">
                                <div className="position-absolute rounded" style={{ background: '#d1d100', width: '64px', height: '64px', marginTop: '-30px' }}>
                                    <div className="position-relative " style={{ height: '64px' }}>
                                        <svg className="position-absolute top-50 left-50" style={{ transform: 'translate(50%, -50%)' }} width={30} fill="white" viewBox="0 0 512 512">
                                            <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V304v5.7V336zm32 0V304 278.1c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5V272c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432c0 44.2-86 80-192 80S0 476.2 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-end" style={{color: 'rgb(144,144,144)'}}>
                                    Gold Reserves
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title className="text-end fs-4">$ {data.goldReserve ? data.goldReserve : 0}</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <Card style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <Card.Header className="position-relative">
                                <div className="position-absolute rounded" style={{ background: '#1e88e5', width: '64px', height: '64px', marginTop: '-30px' }}>
                                    <div className="position-relative " style={{ height: '64px' }}>
                                        <svg className="position-absolute top-50 left-50" style={{ transform: 'translate(50%, -50%)' }} width={30} fill="white" viewBox="0 0 512 512">
                                            <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-141.651-35.33c4.937-32.999-20.191-50.739-54.55-62.573l11.146-44.702-27.213-6.781-10.851 43.524c-7.154-1.783-14.502-3.464-21.803-5.13l10.929-43.81-27.198-6.781-11.153 44.686c-5.922-1.349-11.735-2.682-17.377-4.084l.031-.14-37.53-9.37-7.239 29.062s20.191 4.627 19.765 4.913c11.022 2.751 13.014 10.044 12.68 15.825l-12.696 50.925c.76.194 1.744.473 2.829.907-.907-.225-1.876-.473-2.876-.713l-17.796 71.338c-1.349 3.348-4.767 8.37-12.471 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.147 35.414 8.827c6.588 1.651 13.045 3.379 19.4 5.006l-11.262 45.213 27.182 6.781 11.153-44.733a1038.209 1038.209 0 0 0 21.687 5.627l-11.115 44.523 27.213 6.781 11.262-45.128c46.404 8.781 81.299 5.239 95.986-36.727 11.836-33.79-.589-53.281-25.004-65.991 17.78-4.098 31.174-15.792 34.747-39.949zm-62.177 87.179c-8.41 33.79-65.308 15.523-83.755 10.943l14.944-59.899c18.446 4.603 77.6 13.717 68.811 48.956zm8.417-87.667c-7.673 30.736-55.031 15.12-70.393 11.292l13.548-54.327c15.363 3.828 64.836 10.973 56.845 43.035z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-end" style={{color: 'rgb(144,144,144)'}}>
                                    Bitcoin Reserves
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title className="text-end fs-4">BTC {data.btcReserve ? data.btcReserve : 0}</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <Card style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <Card.Header className="position-relative">
                                <div className="position-absolute rounded" style={{ background: '#e53935', width: '64px', height: '64px', marginTop: '-30px' }}>
                                    <div className="position-relative " style={{ height: '64px' }}>
                                        <svg className="position-absolute top-50 left-50" style={{ transform: 'translate(50%, -50%)' }} width={30} fill="white" viewBox="0 0 576 512">
                                            <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-end" style={{color: 'rgb(144,144,144)'}}>
                                    Natura Token Price
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title className="text-end fs-4">$ {data.naturaPrice ? data.naturaPrice : 0}</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <Card style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <Card.Header className="position-relative">
                                <div className="position-absolute rounded" style={{ background: '#43a047', width: '64px', height: '64px', marginTop: '-30px' }}>
                                    <div className="position-relative " style={{ height: '64px' }}>
                                        <svg className="position-absolute top-50 left-50" style={{ transform: 'translate(50%, -50%)' }} width={30} fill="white" viewBox="0 0 512 512">
                                            <path d="M320 96H192L144.6 24.9C137.5 14.2 145.1 0 157.9 0H354.1c12.8 0 20.4 14.2 13.3 24.9L320 96zM192 128H320c3.8 2.5 8.1 5.3 13 8.4C389.7 172.7 512 250.9 512 416c0 53-43 96-96 96H96c-53 0-96-43-96-96C0 250.9 122.3 172.7 179 136.4l0 0 0 0c4.8-3.1 9.2-5.9 13-8.4zm84 88c0-11-9-20-20-20s-20 9-20 20v14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1l0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4V424c0 11 9 20 20 20s20-9 20-20V410.2c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l0 0-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7V216z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-end" style={{color: 'rgb(144,144,144)'}}>
                                    Miscellaneous Reserve
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title className="text-end fs-4">$ {data.miscReserve ? data.miscReserve : 0}</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <Card style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <Card.Header className="position-relative">
                                <div className="position-absolute rounded" style={{ background: '#fb8c00', width: '64px', height: '64px', marginTop: '-30px' }}>
                                    <div className="position-relative " style={{ height: '64px' }}>
                                        <svg className="position-absolute top-50 left-50" style={{ transform: 'translate(50%, -50%)' }} width={30} fill="white" viewBox="0 0 512 512">
                                            <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V304v5.7V336zm32 0V304 278.1c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5V272c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432c0 44.2-86 80-192 80S0 476.2 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-end" style={{color: 'rgb(144,144,144)'}}>
                                    Other Natura Released
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title className="text-end fs-4">NATURA {data.otherNaturaReleased ? data.otherNaturaReleased : 0}</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 mb-4">
                        <Card style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <Card.Header className="position-relative">
                                <div className="position-absolute rounded" style={{ background: '#8e24aa', width: '64px', height: '64px', marginTop: '-30px' }}>
                                    <div className="position-relative " style={{ height: '64px' }}>
                                        <svg className="position-absolute top-50 left-50" style={{ transform: 'translate(50%, -50%)' }} width={30} fill="white" viewBox="0 0 512 512">
                                            <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V304v5.7V336zm32 0V304 278.1c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5V272c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432c0 44.2-86 80-192 80S0 476.2 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-end" style={{color: 'rgb(144,144,144)'}}>
                                    Staking Rewards Claimed
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title className="text-end fs-4">NATURA {data.stakingRewards ? parseFloat(data.stakingRewards).toFixed(4) : 0}</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>

                </div>

                <div className="row px-2 px-md-5 mt-5">
                    <div>
                        <h3>NFT Collections</h3>
                        <Table responsive className="border-0 rounded " style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>
                            <thead>
                                <tr className="border-bottom border-dark" style={{background: 'black'}}>
                                    <th className="border-0 text-uppercase text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>NFT Collection</th>
                                    <th className="border-0 text-uppercase text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Total Value</th>
                                    <th className="border-0 text-uppercase text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Total Supply</th>
                                    <th className="border-0 text-uppercase text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Start Price</th>
                                    <th className="border-0 text-uppercase text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Market Price</th>
                                    <th className="border-0 text-uppercase text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>Last Trade Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    col.length > 0 && (
                                        <>
                                            {
                                                col.map((item, i) => (
                                                    <tr key={i} style={{background: 'black'}}>
                                                        <td className="border-0 text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{item.attributes.name}</td>
                                                        <td className="border-0 text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{item.totalValue}</td>
                                                        <td className="border-0 text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>{item.totalSupply}</td>
                                                        <td className="border-0 text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>USDT {item.floorPrice}</td>
                                                        <td className="border-0 text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>USDT {item.marketPrice}</td>
                                                        <td className="border-0 text-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgb(144,144,144)' }}>USDT {item.ltp}</td>
                                                    </tr>
                                                ))
                                            }
                                        </>
                                    )
                                }

                            </tbody>
                        </Table>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
export default memo(Dashboard);