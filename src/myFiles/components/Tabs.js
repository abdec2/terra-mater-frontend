import { memo, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import OnSaleItem from './OnSaleItem';
import WalletNFT from './WalletNFT';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from 'react-bootstrap/Spinner';

function Tabs({ nfts, setFetchNfts }) {
  const [height, setHeight] = useState(0);
  const onImgLoad = ({ target: img }) => {
    let currentHeight = height;
    if (currentHeight < img.offsetHeight) {
      setHeight(img.offsetHeight);
    }
  }

  return (
    <Tab.Container id="collection-tabs" defaultActiveKey="collected">
      <Row>
        <Col sm={12}>
          <Nav variant="" className="flex-row collectionTabs border-bottom borderColor">
            <Nav.Item>
              <Nav.Link className='fs-5 me-3' eventKey="collected">Collected</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='fs-5 ' eventKey="onsale">On Sale</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Tab.Content>
            <Tab.Pane eventKey="collected">
              <div className="row mt-5">
                  {
                     (nfts && nfts.result.length > 0) ? (
                        <InfiniteScroll
                          dataLength={nfts.result.length}
                          next={() => setFetchNfts(true)}
                          hasMore={nfts.result.length < nfts.total}
                          loader={<Spinner animation="border" />}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="row">
                            {nfts.result.map((item, index) => (
                              <WalletNFT setFetchNfts={setFetchNfts} nft={item} key={index} onImgLoad={onImgLoad} height={height} className="d-item col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4" />
                            ))}
                          </div>
                        </InfiniteScroll>
                     ) : (
                      <h3 className='text-center fw-normal'>No items to display</h3>
                     )
                  }
                  
                
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="onsale">
              <div className="row mt-5">
                
                  <OnSaleItem /> 
                  {/* <h3 className='text-center fw-normal'>No items to display</h3> */}
                
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default memo(Tabs);