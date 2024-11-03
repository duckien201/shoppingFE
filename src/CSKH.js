import { Container } from "react-bootstrap"
import Header from "./userPage/Header"
import Footer from "./userPage/Footer"

const CSKH = () => {
    return (
        <div>
            <Header />
            <div style={{textAlign:"center",padding:"50px 0",borderBottom:"1px solid #F5F5F5"}}>
                <h2 style={{ color: "#EE4D2D" }}>Trang hỗ trợ khách hàng</h2>
            </div>
            <Container style={{marginTop:"10px"}}>
                <div style={{fontSize:"20px"}}>Liên hệ với chúng tôi qua:</div>
                <div>Email: example@gmail.com</div>
                <div>Hotline: 1900.1111</div>
            </Container>
            <br/>
            <Footer/>
        </div>
    )
}
export default CSKH