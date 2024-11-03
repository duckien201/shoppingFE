import { Button, Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import { LiaProductHunt } from "react-icons/lia";
import { BiCategory } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LineChart from "./chart/LineChart";
import Footer from "../Footer";
import BarChart from "./chart/BarChart";
import { BASE_URL, COMPLETED } from "../../constant/constant";

const Overview = () => {
    const [product, setProduct] = useState()
    const [categories, setCategories] = useState()
    const [user, setUser] = useState()
    const [order, setOrder] = useState()
    const [report, setReport] = useState()
    const token = JSON.parse(localStorage.getItem("admin"))?.token

    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            // Chuyển hướng đến trang đăng nhập nếu không có token
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate])

    const fetchData = async () => {
        try {
            const productApi = await axios.get(`${BASE_URL}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setProduct(productApi.data)

            const categoryApi = await axios.get(`${BASE_URL}/category`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setCategories(categoryApi.data)

            const userApi = await axios.get(`${BASE_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUser(userApi.data)

            const orderApi = await axios.get(`${BASE_URL}/admin/allOrder`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setOrder(orderApi.data)
            console.log(orderApi.data)


            const reportAccountApi = await axios.get(`${BASE_URL}/admin/allReportAccount`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const reportProductApi = await axios.get(`${BASE_URL}/admin/allReportProduct`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setReport(reportAccountApi.data.length + reportProductApi.data.length)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10}>
                        <Container style={{ background: "#FCFCFC" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Tổng quan hệ thống</div>
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <Button onClick={() => navigate("/admin/products")} variant="primary" style={{ height: "150px", width: "225px", textAlign: "start", fontSize: "20px", fontWeight: "bold", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                                    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>Sản phẩm</div>
                                        <LiaProductHunt style={{ fontSize: "25px", }} />
                                    </div>
                                    <div>{product?.length}</div>
                                </Button>
                                <Button onClick={() => navigate("/admin/categories")} variant="warning" style={{ color: "white", height: "150px", width: "225px", textAlign: "start", fontSize: "20px", fontWeight: "bold", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                                    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>Danh mục</div>
                                        <BiCategory style={{ fontSize: "25px", }} />
                                    </div>
                                    <div>{categories?.length}</div>
                                </Button>
                                <Button onClick={() => navigate("/admin/categories")} variant="success" style={{ color: "white", height: "150px", width: "225px", textAlign: "start", fontSize: "20px", fontWeight: "bold", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                                    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>Người dùng</div>
                                        <MdOutlineAccountCircle style={{ fontSize: "25px", }} />
                                    </div>
                                    <div>{user?.length}</div>
                                </Button>
                                <Button onClick={() => navigate("/admin/orders")} variant="info" style={{ color: "white", height: "150px", width: "225px", textAlign: "start", fontSize: "20px", fontWeight: "bold", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                                    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>Đơn hàng</div>
                                        <CiShoppingCart style={{ fontSize: "25px", }} />
                                    </div>
                                    <div>{order?.length}</div>
                                </Button>
                                <Button onClick={() => navigate("/admin/reports")} variant="danger" style={{ color: "white", height: "150px", width: "225px", textAlign: "start", fontSize: "20px", fontWeight: "bold", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                                    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>Báo cáo vi phạm</div>
                                        <MdOutlineErrorOutline style={{ fontSize: "25px", }} />
                                    </div>
                                    <div>{report}</div>
                                </Button>
                            </div>
                        </Container>
                        <Container style={{ margin: "20px 10px", display: "flex", justifyContent: "space-between" }}>
                            <div style={{ width: "49%", borderRadius: "10px", border: "1px solid #F4F4F6", backgroundColor: "#F4F4F6", padding: "20px" }}>
                                <LineChart orders={order} />
                            </div>
                            <div style={{ width: "49%", borderRadius: "10px", border: "1px solid #F4F4F6", backgroundColor: "#F4F4F6", padding: "20px" }}>
                                <BarChart orders={order?.filter(order => order.status === COMPLETED)} />
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    )
}
export default Overview