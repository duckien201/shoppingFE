import SideBar from "./component/SideBar"
import Header from "./Header"
import { Col, Container, Row } from "react-bootstrap"
import Footer from "./Footer"

const HomeAdmin = () => {
    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10}>
                        
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default HomeAdmin