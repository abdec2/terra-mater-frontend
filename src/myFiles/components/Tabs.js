import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

function Tabs() {

  return (
    <Tab.Container id="collection-tabs" defaultActiveKey="items">
      <Row>
        <Col sm={12}>
          <Nav variant="" className="flex-row collectionTabs border-bottom border-dark">
            <Nav.Item>
              <Nav.Link className='fs-5 me-3' eventKey="items">Items</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='fs-5 ' eventKey="activity">Activity</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="items">
              <p>Hello World</p>
            </Tab.Pane>
            <Tab.Pane eventKey="activity">
              <p>Hello second</p>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default Tabs;