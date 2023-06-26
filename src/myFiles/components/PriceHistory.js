import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { Card } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'
import { CONFIG } from '../../config/config'
import api from '../../core/api'
import "./pricehistory.css"

const PriceHistory = ({ nft }) => {
    const [tx, setTx] = useState([])
    const loadTransaction = async() => {
        try {
            const res = await axios.get(`${api.baseUrl+api.transaction}?filters[nft_v_1]=${nft.id}&sort[1]=publishedAt%3Adesc`)
            console.log(res.data.data)
            setTx(res.data.data)
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        loadTransaction()
    }, [nft.id])

    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header><h5>Price History</h5></Accordion.Header>
                <Accordion.Body>
                    <div className='price_history'>
                        <table>
                            <tbody>
                                <tr>
                                    <th className='text-center'>From</th>
                                    <th className='text-center'>To</th>
                                    <th className='text-center'>Price</th>
                                    <th className='text-center'>Description</th>
                                </tr>
                                {
                                    tx.length > 0 ? (
                                        <>
                                            {
                                                tx.map((item,i) => (
                                                    <tr key={i}>
                                                        <td className='text-center'>{`${item.attributes.from_address.slice(0,5)}...${item.attributes.from_address.slice(37,42)}`}</td>
                                                        <td className='text-center'>{`${item.attributes.to_address.slice(0,5)}...${item.attributes.to_address.slice(37,42)}`}</td>
                                                        <td className='text-center'>{item.attributes.price} USDT</td>
                                                        <td className='text-center'>{item.attributes.desc}</td>
                                                    </tr>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={4}> No Items to display</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                            

                        </table>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default PriceHistory