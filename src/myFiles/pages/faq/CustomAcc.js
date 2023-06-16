import "./accordion.css";
import chevronRight from "./chevron-right.svg";
import { Accordion, Container, Card, Row, Col } from "react-bootstrap";
export default function AccordionDisplay({
  children,
  title,
  arrowPosition,
  forceDefaultHide = false,
}) {
  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Accordion.Collapse eventKey={forceDefaultHide ? "1" : "0"}>
          <Container>
            <Card.Body>
              <div>{children}</div>
            </Card.Body>
          </Container>
        </Accordion.Collapse>
        <Accordion.Toggle
          as={Card.Header}
          eventKey={forceDefaultHide ? "1" : "0"}
        >
          <Container>
            <Row>
              <Col className="col-10 px-3">
                <div
                  className="d-flex align-items-center"
                  style={{ height: "100%" }}
                >
                  {title}
                </div>
              </Col>
              <Col
                className="col-2 align-self-center pl-2 py-2"
                style={{ textAlign: arrowPosition ? arrowPosition : "left" }}
              >
                <img
                  className="accordion-arrow"
                  src={chevronRight}
                  width="18"
                  height="18"
                  alt="chevron-right"
                />
              </Col>
            </Row>
          </Container>
        </Accordion.Toggle>
      </Card>
    </Accordion>
  );
}
