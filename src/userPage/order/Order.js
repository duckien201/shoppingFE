import { useEffect, useState } from "react";
import Header from "../Header";
import { Col, Container, Row } from "react-bootstrap";
import Footer from "../Footer";
import { FaLocationDot } from "react-icons/fa6";
import formatMoney from "../../function/formatMoney";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { BASE_URL } from "../../constant/constant";

const Order = () => {
    const [orderItem, setOrderItem] = useState(null);
    const [user, setUser] = useState(null);
    const [shopOrder, setShopOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalOrder, setTotalOrder] = useState(0)
    const [payMethod, setPayMethod] = useState("cod")
    const navigate = useNavigate()
    const token = JSON.parse(localStorage.getItem("user"))?.token

    useEffect(() => {
        if (!token) {
            // Chuyển hướng đến trang đăng nhập nếu không có token
            navigate('/signin');
        }
    }, [token, navigate])

    useEffect(() => {
        const orderItemLocal = JSON.parse(localStorage.getItem("order"));
        const userLocal = JSON.parse(localStorage.getItem("user"));
        const shopOrderLocal = JSON.parse(localStorage.getItem("shopOrder"));
        setTotalOrder(orderItemLocal?.reduce((total, item) => total + item.product.price * (100 - item.product.sale) / 100 * item.quantity, 0))


        setOrderItem(orderItemLocal);
        setUser(userLocal);
        setShopOrder(shopOrderLocal);
        setLoading(false);
    }, []);

    const shopStyle = {
        marginBottom: "20px",
        background: "white"
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    const handleOrder = async () => {
        if (!user.address || !user.phone) {
            message.error("Chưa có địa chỉ hoặc số điện thoại")
            return
        }
        const info = orderItem.map(order => {
            return { shopId: order.product.shop.id, productId: order.product.idProduct, quantity: order.quantity, price: order.quantity * (order.product.price * (100 - order.product.sale) / 100) }
        })
        const bill = {
            userId: user.id,
            orderItems: info,
            payMethod: payMethod
        }
        const idCartList = orderItem.map(order => {
            return order.id
        })
        try {
            const response = await axios.post(`${BASE_URL}/order`, bill,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            console.log(response);
            if (response.status === 200) {
                console.log("200");
                
                if (idCartList.length) {
                    for (const idCart of idCartList) {
                        try {
                            await axios.post(`${BASE_URL}/cart/delete?idCart=${idCart}`,
                                {},
                                {
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                })
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
                if (payMethod === "online") {
                    // lấy mảng id của các đơn order vừa đặt
                    const arrayIdOrder = response.data.map(order => {
                        return order?.id
                    })
                    //
                    banking(arrayIdOrder)

                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Đặt hàng thành công',
                        showConfirmButton: false,
                        html: '<p>Đang chuyển hướng đến trang đơn mua...</p>',
                        timer: 1500,
                    });
                    setTimeout(() => {
                        navigate('/user/purchaseOrder'); // Redirect to the signin page after 2 seconds
                    }, 2000);
                }
            }
        } catch (error) {
            console.log(error);
            if (error.response) {
                message.error(error.response.data);
            } else {
                message.error("Có lỗi xảy ra!");
            }
        }
    }
    const handlePayMethodChange = (event) => {
        setPayMethod(event.target.value);
    };

    const banking = async (listIdOrder) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/payment/create_payment`, listIdOrder)
            console.log(response);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Đặt hàng thành công',
                showConfirmButton: false,
                html: '<p>Đang chuyển hướng đến trang thanh toán...</p>',
                timer: 1500,
            });
            setTimeout(() => {
                window.location.assign(response.data.url); // đến trang thanh toán
            }, 2000);
        } catch (error) {
            console.log(error);
        }
    }
    const isButtonDisabled = payMethod === "wallet" && user?.wallet < totalOrder
    return (
        <div style={{ background: "#F5F5F5" }}>
            <Header />
            <Container style={{ background: "white", padding: "20px 20px", color: "#FC5731", borderBottom: "solid 1px #F5F5F5" }}>
                <div style={{ fontSize: "25px" }}>Thanh toán</div>
            </Container>
            <br />
            <Container style={{ background: "white", marginBottom: "10px", padding: "30px 25px" }}>
                <div style={{ fontSize: "18px" }}>
                    <span style={{ color: "#FC5731" }}><FaLocationDot /></span>
                    <span> Địa chỉ nhận hàng</span>
                </div>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ marginBottom: "0", fontWeight: "bold", marginRight: "20px" }}>
                            {user.name}&nbsp;&nbsp;&nbsp;{user.phone}
                        </div>
                        <div>{user.address}</div>
                        <button onClick={() => navigate('/user/profile')} style={{ background: "none", border: "none", color: "#008AD3", marginLeft: "20px" }}>Thay đổi</button>
                    </div>
                    <div>Phí vận chuyển: 20.000đ - 50.000đ</div>
                </div>
            </Container>
            <Container style={{ background: "white", padding: "20px 15px" }}>
                <div className="row" style={{ marginBottom: "30px" }}>
                    <Col xs={6} style={{ fontSize: "20px", color: "#AB9882" }}>
                        Sản phẩm
                    </Col>
                    <Col xs={6} className="row">
                        <Col xs={4} style={{ textAlign: "center" }}>Đơn giá</Col>
                        <Col xs={4} style={{ textAlign: "center" }}>Số lượng</Col>
                        <Col xs={4} style={{ textAlign: "center" }}>Thành tiền</Col>
                    </Col>
                </div>
            </Container>
            {shopOrder.map((shop) => (
                <Container key={shop.id} style={shopStyle}>
                    <div style={{ fontSize: "20px" }}>{shop?.name}</div>
                    {orderItem
                        .filter((item) => item.product.shop.id === shop.id)
                        .map((item) => (
                            <Row key={item.product.idProduct}>
                                <Col xs={6} style={{ marginBottom: "10px" }} className="row">
                                    <Col xs={2}>
                                        <img
                                            src={`${item?.product.image[0]}`}
                                            style={{ width: "100%" }}
                                            alt="Product"
                                        />
                                    </Col>
                                    <Col xs={10}>
                                        <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "3em" }}>
                                            {(item?.product.name)}
                                        </div>
                                    </Col>
                                </Col>
                                <Col xs={6} className="row">
                                    <Col xs={4} style={{ textAlign: "center" }}>{formatMoney(item.product.price * (100 - item.product.sale) / 100)} đ</Col>
                                    <Col xs={4} style={{ textAlign: "center" }}>{item.quantity}</Col>
                                    <Col xs={4} style={{ textAlign: "center", color: "#FC5731" }}>{formatMoney(item.product.price * (100 - item.product.sale) / 100 * item.quantity)} đ</Col>
                                </Col>
                            </Row>
                        ))}
                </Container>
            ))}
            <Container style={{ background: "white", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <h5 style={{ margin: 0 }}>
                        Phương thức thanh toán
                    </h5>
                    <div style={{ marginRight: "40px", marginLeft: "40px" }}>
                        <input id="wallet" type="radio" name="payMethod" value={"wallet"} checked={payMethod === "wallet"} onChange={handlePayMethodChange} />
                        <label htmlFor="wallet">Số dư ví</label>
                    </div>
                    <div style={{ marginRight: "40px", marginLeft: "40px" }}>
                        <input id="online" type="radio" name="payMethod" value={"online"} checked={payMethod === "online"} onChange={handlePayMethodChange} />
                        <label htmlFor="online">Ví VNPay</label>
                    </div>
                    <div>
                        <input id="cod" type="radio" name="payMethod" value={"cod"} checked={payMethod === "cod"} onChange={handlePayMethodChange} />
                        <label htmlFor="cod">Thanh toán khi nhận hàng</label>
                    </div>
                </div>
                <div style={{ marginLeft: "auto", display: "block", textAlign: "right", borderBottom: "solid 1px #E8E7E4" }}>
                    <div>
                        Tổng tiền hàng
                    </div>
                    <h4 style={{ color: "#FC5731" }}>{formatMoney(totalOrder)} đ</h4>
                </div>
                <div style={{ marginLeft: "auto", display: "block", textAlign: "right", marginTop: "10px" }}>
                    <button style={{ padding: "10px 30px", border: "none", background: "#FC5731", color: "white" }}
                        onClick={handleOrder}
                        disabled={isButtonDisabled}
                    >Đặt hàng</button>
                </div>
            </Container>
            <br />
            <Footer />
        </div>
    );
};

export default Order;
