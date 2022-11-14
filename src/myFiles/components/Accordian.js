import { Card } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'
import { CONFIG } from '../../config/config'

const Accordian = ({ nft }) => {
    return (
        <Accordion defaultActiveKey="0">
            <Card>
                <Accordion.Toggle className='nft_attr text-start' style={{ cursor: "pointer" }} as={Card.Header} eventKey="0">
                    <h5>Properties</h5>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <div className='row'>
                            {

                                nft.props && nft.props.map((item, key) => (
                                    <div key={key} className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="nft_attr">
                                            <h5>{item.Property}</h5>
                                            <h4>{item.value}</h4>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Accordion.Toggle className='nft_attr text-start' style={{ cursor: "pointer" }} as={Card.Header} eventKey="1">
                    <h5>Details</h5>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        <div className='row'>
                            <div className='col-12 col-sm-6'>
                                <h6>Contract Address </h6>
                            </div>
                            <div className='col-12 col-sm-6'>
                                <a href={`${CONFIG.BLOCKCHAIN_EXPLORER}address/${nft?.collection?.contract_address}`} target='_blank'>{`${nft?.collection?.contract_address.slice(0, 5)} ...... ${nft?.collection?.contract_address.slice(37, 42)}`}</a>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 col-sm-6'>
                                <h6>Token ID </h6>
                            </div>
                            <div className='col-12 col-sm-6'>
                                <p className='m-0'>{nft?.token_id}</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 col-sm-6'>
                                <h6>Token Standard </h6>
                            </div>
                            <div className='col-12 col-sm-6'>
                                <p className='m-0'>{nft?.token_standard}</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 col-sm-6'>
                                <h6>Chain </h6>
                            </div>
                            <div className='col-12 col-sm-6'>
                                <p className='m-0'>{nft?.collection?.chain_name}</p>
                            </div>
                        </div>
                        
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default Accordian