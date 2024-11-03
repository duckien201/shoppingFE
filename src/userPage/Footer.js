import { Col, Container, Row } from "react-bootstrap";
import { FaFacebook,FaLinkedin,FaInstagramSquare  } from "react-icons/fa";


export default function Footer() {
    const styleUl = {
        listStyle: "none",
        padding: 0
    }

    return (
        <div style={{ backgroundColor: "#FBFBFB" }}>
            <Container  >
                <br />
                <Row>
                    <Col xs={3}>
                        <h6>Chăm sóc khách hàng</h6>
                        <ul style={styleUl}>
                            <li>Trung tâm trợ giúp</li>
                            <li>Hướng dẫn mua hàng</li>
                            <li>Hướng dẫn bán hàng</li>
                            <li>Thanh toán</li>
                            <li>Vận chuyển</li>
                            <li>Chăm sóc khách hàng</li>
                            <li>Chính sách bảo hành</li>
                        </ul>
                    </Col>
                    <Col xs={3}>
                        <h6>Về chúng tôi</h6>
                        <ul style={styleUl}>
                            <li>Giới thiệu</li>
                            <li>Kênh người bán</li>
                            <li>Flash sale</li>
                            <li>Chính hãng</li>
                        </ul>
                    </Col>
                    <Col xs={3}>
                        <h6>Thanh toán</h6>
                        <ul style={styleUl} className="row">
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "50px", height: "20px" }} src="../images/thanh_toan/tt-1.png" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "50px", height: "20px" }} src="../images/thanh_toan/tt-2.jpg" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "50px", height: "20px" }} src="../images/thanh_toan/tt-3.png" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "50px", height: "20px" }} src="../images/thanh_toan/tt-4.png" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "50px", height: "20px" }} src="../images/thanh_toan/tt-5.jpg" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "50px", height: "20px" }} src="../images/thanh_toan/tt-6.png" /></a>
                            </li>
                        </ul>
                        <h6>Vận chuyển</h6>
                        <ul style={styleUl} className="row">
                            <li className="col-3" style={{ display: "inline", padding: "5px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "60px", height: "35px" }} src="../images/van_chuyen/vc-1.jpg" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "60px", height: "35px" }} src="../images/van_chuyen/vc-2.png" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "60px", height: "35px" }} src="../images/van_chuyen/vc-3.png" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "60px", height: "35px" }} src="../images/van_chuyen/vc-4.webp" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "60px", height: "35px" }} src="../images/van_chuyen/vc-5.jpg" /></a>
                            </li>
                            <li className="col-3" style={{ display: "inline", padding: "10px", border: "1px solid #CCD4D0", margin: "3px", borderRadius: "5px" }}>
                                <a style={{ display: "inline" }} href="#"><img style={{ width: "60px", height: "35px" }} src="../images/van_chuyen/vc-6.jpg" /></a>
                            </li>
                        </ul>
                    </Col>
                    <Col xs={3}>
                        <h6>Theo dõi chúng tôi trên</h6>
                        <ul style={styleUl}>
                            <div><a href="https://www.facebook.com" style={{textDecoration:"none"}}><FaFacebook/> Facebook</a></div>
                            <div><a href="https://www.linkedin.com" style={{textDecoration:"none"}}><FaLinkedin/> Linked In</a></div>
                            <div><a href="https://www.linkedin.com" style={{textDecoration:"none"}}><FaInstagramSquare /> Instagram</a></div>

                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}