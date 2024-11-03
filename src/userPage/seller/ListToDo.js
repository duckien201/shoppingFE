import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BASE_URL } from "../../constant/constant";

const ListToDo = ({ shop }) => {
    const [orders, setOrders] = useState()
    const [products, setProducts] = useState(

    )
    useEffect(() => {
        fetchData()
    }, [shop])

    const fetchData = async () => {
        try {
            const orderApi = await axios.get(`${BASE_URL}/shop/allOrder?idShop=${shop.id}`)
            setOrders(orderApi.data)

            const productsApi = await axios.get(`${BASE_URL}/product/shop/${shop?.id}`)
            setProducts(productsApi.data)
        } catch (error) {
            console.log(error);
        }
    }
    const numberStyle = {
        color: "#2773DD"
    }
    const elementStyle = {
        textAlign: "center"
    }

    return (
        <Container style={{ padding: "30px 20px", background: "white" }} >
            <h5>Trạng thái đơn hàng</h5>
            <Row style={{ padding: "20px 0" }}>
                <Col xs={3} style={elementStyle}>
                    <div style={numberStyle}>{orders?.length}</div>
                    <div>Tổng đơn hàng</div>
                </Col>
                <Col xs={3} style={elementStyle}>
                    <div style={numberStyle}>{orders?.filter(order => order.status === "Chờ xác nhận").length}</div>
                    Chờ xác nhận
                </Col>
                <Col xs={3} style={elementStyle}>
                    <div style={numberStyle}>{orders?.filter(order => order.status === "Đang chuẩn bị hàng").length}</div>
                    Đang chuẩn bị hàng
                </Col>
                <Col xs={3} style={elementStyle}>
                    <div style={numberStyle}>{orders?.filter(order => order.status === "Đang vận chuyển").length}</div>
                    Đang vận chuyển
                </Col>
                <Col xs={3} style={elementStyle}>
                    <div style={numberStyle}>{orders?.filter(order => order.status === "Hoàn thành").length}</div>
                    Hoàn thành
                </Col>
                <Col xs={3} style={elementStyle}>
                    <div style={numberStyle}>{orders?.filter(order => order.status === "Đã hủy").length}</div>
                    Đơn hủy
                </Col>
                <Col xs={3} style={elementStyle}>
                    <div style={numberStyle}>{products?.filter(product=>product.active===false).length}</div>
                    Sản phẩm bị tạm khóa
                </Col>
                <Col xs={3} style={elementStyle}>
                    <div style={numberStyle}>{products?.filter(product=>product.remain===0).length}</div>
                    Sản phẩm hết hàng
                </Col>
            </Row>
        </Container>
    )
}
export default ListToDo