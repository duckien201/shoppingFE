import { Col, Container, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom";
import ListToDo from "./ListToDo";
import AllOrder from "./AllOrder";
import Footer from "../Footer";
import SideBar from "./SideBar";
import React, { useEffect } from "react";
import AddProduct from "./AddProduct";
import ProductSeller from "./ProductSeller";

const SellerHome = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user")) || ''
    if (!user) {
        navigate('/signin');
    }
    // const [allProduct, setAllProduct] = useState([])
    console.log(user.pickupAddress);
    useEffect(() => {

        if (!user.pickupAddress) {
            navigate('/user/pickupAddress')
        }
    })
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const shopApi = await axios.get(`BASE_URL/shop/${user?.id}`)
    //             setAllProduct(shopApi.data.products || [])
    //             // console.log(shopApi.data.products);
    //         } catch (error) {
    //             console.log(error);
    //             setAllProduct([])
    //         }
    //     }
    //     fetchData()
    // }, [user?.id, navigate])



    return (
        <div style={{ background: "#F5F5F5", }}>

            <div style={{ borderBottom: "1px solid #F5F5F5", background: "white" }}>
                <Container style={{ padding: "25px 0", }}>
                    <div style={{ fontSize: "25px", display: "flex" }}>
                        <Link to={"/"}><img src="../images/logo5.png" alt="logo" style={{ height: "70px", marginRight: "50px" }} /></Link>
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>Kênh người bán</div>
                    </div>
                </Container>
            </div>
            <Row style={{ padding: "0 15px" }}>
                <Col xs={2}>
                    <SideBar />
                </Col>
                <Col xs={10} >
                    <ListToDo shop={user} />
                    <AllOrder shop={user} />
                    <h5 style={{ marginTop: "20px" }}>Tất cả sản phẩm</h5>
                    <ProductSeller status={"ok"} isSoldOut={"false"} />

                    <h5 style={{ marginTop: "20px" }}>Đang chờ duyệt</h5>
                    <ProductSeller status={"Đang chờ duyệt"} isSoldOut={"false"} />

                    <h5 style={{ marginTop: "20px" }}>Bị từ chối</h5>
                    <ProductSeller status={"Từ chối"} isSoldOut={"false"} />

                    <h5 style={{ marginTop: "20px" }}>Sản phẩm bị khóa</h5>
                    <ProductSeller status={"Cấm"} isSoldOut={"false"} />

                    <h5 style={{ marginTop: "20px" }}>Bán hết</h5>
                    <ProductSeller status={"ok"} isSoldOut={"true"} />

                    <h5 style={{ marginTop: "20px" }}>Thêm mới sản phẩm</h5>
                    <AddProduct />
                </Col>
            </Row>
            <br />
            <Footer />
        </div>
    )
}
export default SellerHome