import axios from 'axios';
import { memo, useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import api from '../../core/api';
import ListCollections from './ListCollections';

function CategoryTabs({ nfts }) {
    const [categories, setCategories] = useState(null)

    const getCategories = async () => {
        try {
            const response = await axios.get(`${api.baseUrl + api.categories}`)
            console.log(response)
            setCategories(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <Tab.Container id="category-tabs" defaultActiveKey="all">
            <Row>
                <Col sm={12}>
                    <Nav variant="" className="flex-row categoryTabs border-bottom borderColor">
                        <Nav.Item>
                            <Nav.Link className='fs-5 me-3' eventKey="all">All</Nav.Link>
                        </Nav.Item>
                        {/* Add Nav Items  */}
                        {
                            categories && categories.data.map((item, index) => (
                                <Nav.Item key={index}>
                                    <Nav.Link className='fs-5 me-3' eventKey={item.attributes.category.toLowerCase()}>{item.attributes.category}</Nav.Link>
                                </Nav.Item>
                            ))
                        }
                    </Nav>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Tab.Content>
                        <Tab.Pane eventKey="all">
                            <div className="row mt-5">
                                <ListCollections />
                            </div>
                        </Tab.Pane>
                        {/* Add tabs pane */}
                        {
                            categories && categories.data.map((item, index) => (
                                <Tab.Pane eventKey={item.attributes.category.toLowerCase()} key={index}>
                                    <div className="row mt-5">
                                        <ListCollections categoryId={item.id} />
                                    </div>
                                </Tab.Pane>
                            ))
                        }
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}

export default memo(CategoryTabs);