import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row, Table } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import StatusOrder from "./component/StatusOrder"
import { AiOutlineShop } from "react-icons/ai"
import formatMoney from "../../function/formatMoney"
import { BASE_URL } from "../../constant/constant"


const DetailOrder = () => {
    const location = useLocation()

    const searchParam = new URLSearchParams(location.search)
    const [idOrder] = useState(searchParam.get('idOrder'))
    const [orderInfo, setOrderInfo] = useState()
    const [orderItem, setOrderItem] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const orderInfoApi = await axios.get(`${BASE_URL}/getOrderInfo?idOrder=${idOrder}`)
            setOrderInfo(orderInfoApi.data)

            const orderItemApi = await axios.get(`${BASE_URL}/getItemsOfOrder?idOrder=${idOrder}`)
            setOrderItem(orderItemApi.data)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Container>
            <div style={{ display: "flex", justifyContent: "end", background: "white", padding: "10px 20px", marginBottom: "2px" }}>
                <div>Mã đơn hàng: {orderInfo?.code}</div>
                <div style={{ margin: "0 20px" }} >|</div>
                <div style={{ color: "red" }}>{orderInfo?.status}</div>
            </div>
            <div style={{ background: "white", marginBottom: "2px" }}>
                <StatusOrder order={orderInfo} />
            </div>
            <div style={{ background: "white", marginBottom: "2px", padding: "30px 0" }}>
                <Container>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h5>Địa chỉ nhận hàng</h5>
                        <div>SPX Express</div>
                    </div>
                    <div>
                        <div>{orderInfo?.user.name}</div>
                        <div style={{ color: "#B7BAB0" }}>{orderInfo?.phone}</div>
                        <div style={{ color: "#B7BAB0" }}>{orderInfo?.address}</div>
                    </div>
                </Container>
            </div>
            <Container style={{ background: "#FAFAFA" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #7F7F7F" }}>
                    <div style={{ display: "flex", padding: "10px 0" }}>
                        <h5 >{orderInfo?.shop.name}</h5>
                        <button onClick={() => navigate(`/shop/${orderInfo?.shop.id}`)} style={{
                            background: "white",
                            border: "solid 1px #E8E8E8",
                            marginLeft: "20px"
                        }}><AiOutlineShop /> Xem Shop</button>
                    </div>
                </div>
                {orderItem?.map(item => (
                    <Container key={item.id}>
                        <Row onClick={()=>navigate(`/product/${item.product.idProduct}`)} style={{ marginTop: "10px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                            <Col xs={2}>
                                <img src={`${item?.product.image[0]}`}
                                    alt="imgPro"
                                    style={{ width: "100%" }}
                                />
                            </Col>
                            <Col xs={7}>
                                <div style={{ fontSize: "18px" }}>{item?.product.name}</div>
                                <div>x {item?.quantity}</div>
                            </Col>
                            <Col xs={3}>
                                {item?.product.sale ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
                                        <div style={{ fontSize: "15px", textDecoration: "line-through", color: "#7F7F7F", marginRight: "5px" }}>{formatMoney(item?.product.price * item?.quantity)} đ</div>
                                        <div style={{ fontSize: "15px", color: "#EE4D2D" }}>{formatMoney(item?.product.price * item?.quantity * (100 - item?.product.sale) / 100)} đ</div>
                                    </div>
                                ) : (
                                    <div style={{ color: "#EE4D2D", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        {formatMoney(item?.product.price)} đ
                                    </div>
                                )}
                            </Col>
                        </Row>

                    </Container>
                ))}
            </Container>
            <div style={{paddingBottom:"20px"}}>
                <Table bordered style={{ border: "#F5F5F5", textAlign: "end", marginBottom: "0px" }}  >
                    <tbody>
                        <tr>
                            <td style={{ width: "75%", color: "#AFA7AC" }}>Tiền hàng</td>
                            <td>
                                {formatMoney(orderItem?.reduce((total, item) => total + item?.product.price*item?.quantity, 0))} đ
                            </td>
                        </tr>
                        <tr>
                            <td style={{ color: "#AFA7AC" }}>Giảm giá</td>
                            <td>{formatMoney(orderItem?.reduce((total, item) => total + item?.product.price*item?.quantity, 0) - orderInfo?.totalOrder)} đ</td>
                        </tr>
                        <tr>
                            <td style={{ color: "#AFA7AC" }}>Thành tiền</td>
                            <td style={{ fontSize: "20px", color: "red" }}>{formatMoney(orderInfo?.totalOrder)} đ</td>
                        </tr>
                    </tbody>
                </Table>
                {orderInfo?.payMethod === "cod" ? (
                    <div style={{ background: "#FFFEFA", border: "1px solid #E8E1CA", fontSize: "13px", padding: "14px " }}>
                        <div>
                            Vui lòng thanh toán <span style={{ color: "red" }}>{formatMoney(orderInfo?.totalOrder)} đ</span> + tiền ship khi nhận hàng
                        </div>
                        <div>Tiền ship từ 20.000đ - 50.000đ tùy thuộc vào khoảng cách của bạn và shop</div>
                    </div>
                ) : (
                    <div style={{ background: "#FFFEFA", border: "1px solid #E8E1CA", fontSize: "13px", padding: "14px " }}>
                        <div>
                            Vui lòng thanh toán tiền ship khi nhận hàng
                        </div>
                        <div>Tiền ship từ 20.000đ - 50.000đ tùy thuộc vào khoảng cách của bạn và shop</div>
                    </div>
                )}
                <Table bordered style={{ border: "#F5F5F5", textAlign: "end", marginBottom: "0px" }}  >
                    <tbody>
                        <tr>
                            <td style={{ width: "75%", color: "#AFA7AC" }}>Phương thức thanh toán</td>
                            <td>{orderInfo?.payMethod === "cod"
                                ? "Thanh toán khi nhận hàng"
                                : orderInfo?.payMethod === "online"
                                    ? "Thanh toán qua ví VNPay"
                                    : "Thanh toán bằng số dư ví"}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Container>
    )
}
export default DetailOrder