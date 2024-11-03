import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import Footer from "../Footer"
import { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import formatMoney from "../../function/formatMoney"
import { Checkbox, Pagination } from "antd"
import { BASE_URL, CANCEL, COMPLETED, PREPARING_ORDER, SHIPPING, WAIT_FOR_CONFIRM_ORDER, WAIT_FOR_PAYMENT } from "../../constant/constant"

const OrderAdmin = () => {
    const [orders, setOrders] = useState([])
    const [itemOrder, setItemOrder] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const location = useLocation()
    const navigate = useNavigate()
    const token = JSON.parse(localStorage.getItem("admin"))?.token
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate, location, selectedStatuses]);

    const fetchData = async () => {
        try {
            const orderApi = await axios.get(`${BASE_URL}/admin/allOrder`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            let filteredOrders = orderApi.data.reverse();

            if (selectedStatuses.length > 0) {
                filteredOrders = filteredOrders.filter(order => selectedStatuses.includes(order.status));
            }

            setOrders(filteredOrders);

            const itemOrderApi = await axios.get(`${BASE_URL}/admin/allOrderItem`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setItemOrder(itemOrderApi.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleStatusChange = (status) => {
        if (status === "Tất cả") {
            setSelectedStatuses([]);
        } else {
            setSelectedStatuses(prev =>
                prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
            );
        }
        setCurrentPage(1); // Reset to the first page when filtering
    };

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAction = (status) => {
        switch (status) {
            case 'Đã hủy':
                return (<Col xs={2} >
                    <div style={{ color: "red" }}>
                        <div>{status}</div>
                    </div>
                </Col>);
            case 'Hoàn thành':
                return (<Col xs={2} >
                    <div style={{ color: "green" }}>
                        <div>{status}</div>
                    </div>
                </Col>);
            default:
                return (<Col xs={2}>
                    <div >
                        <div>{status}</div>
                    </div>
                </Col>);
        }
    };

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
                            <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Tất cả đơn hàng</div>
                            <div style={{ padding: "10px 0 20px 0" }}>
                                <Checkbox
                                    name="checkbox"
                                    style={{ marginRight: "5px" }}
                                    id="all"
                                    onChange={() => handleStatusChange("Tất cả")}
                                    checked={selectedStatuses.length === 0}
                                />
                                <label htmlFor="all">Tất cả</label>
                                <Checkbox
                                    name="checkbox"
                                    style={{ marginRight: "5px", marginLeft: "50px" }}
                                    id="Chờ thanh toán"
                                    onChange={() => handleStatusChange(WAIT_FOR_PAYMENT)}
                                    checked={selectedStatuses.includes(WAIT_FOR_PAYMENT)}
                                />
                                <label htmlFor="Chờ thanh toán">Chờ thanh toán</label>
                                <Checkbox
                                    name="checkbox"
                                    style={{ marginRight: "5px", marginLeft: "50px" }}
                                    id="Chờ xác nhận"
                                    onChange={() => handleStatusChange(WAIT_FOR_CONFIRM_ORDER)}
                                    checked={selectedStatuses.includes(WAIT_FOR_CONFIRM_ORDER)}
                                />
                                <label htmlFor="Chờ xác nhận">Chờ xác nhận</label>
                                <Checkbox
                                    name="checkbox"
                                    style={{ marginRight: "5px", marginLeft: "50px" }}
                                    id="Đang chuẩn bị hàng"
                                    onChange={() => handleStatusChange(PREPARING_ORDER)}
                                    checked={selectedStatuses.includes(PREPARING_ORDER)}
                                />
                                <label htmlFor="Đang chuẩn bị hàng">Đang chuẩn bị hàng</label>
                                <Checkbox
                                    name="checkbox"
                                    style={{ marginRight: "5px", marginLeft: "50px" }}
                                    id="shipping"
                                    onChange={() => handleStatusChange(SHIPPING)}
                                    checked={selectedStatuses.includes(SHIPPING)}
                                />
                                <label htmlFor="shipping">Đang vận chuyển</label>
                                <Checkbox
                                    name="checkbox"
                                    style={{ marginRight: "5px", marginLeft: "50px" }}
                                    id="completed"
                                    onChange={() => handleStatusChange(COMPLETED)}
                                    checked={selectedStatuses.includes(COMPLETED)}
                                />
                                <label htmlFor="completed">Hoàn thành</label>
                                <Checkbox
                                    name="checkbox"
                                    style={{ marginRight: "5px", marginLeft: "50px" }}
                                    id="cancel"
                                    onChange={() => handleStatusChange(CANCEL)}
                                    checked={selectedStatuses.includes(CANCEL)}
                                />
                                <label htmlFor="cancel">Đã hủy</label>
                            </div>

                            {orders.length === 0 ? (<h5 style={{ padding: "20px 0" }}>Chưa có đơn hàng nào</h5>) : (
                                <div>
                                    <Container>
                                        <Row style={{ borderBottom: "2px solid #F5F5F5", padding: "15px 0" }}>
                                            <Col xs={1}>
                                                #
                                            </Col>
                                            <Col xs={1} style={{ padding: "0" }}>
                                                Người mua
                                            </Col>
                                            <Col xs={2}>
                                                Mã đơn hàng
                                            </Col>
                                            <Col xs={2}>
                                                Sản phẩm
                                            </Col>
                                            <Col xs={2} style={{ textAlign: "end" }}>
                                                Số lượng
                                            </Col>
                                            <Col xs={2} style={{ textAlign: "center" }}>
                                                Đơn giá
                                            </Col>
                                            <Col xs={2} style={{ textAlign: "start" }}>
                                                Trạng thái
                                            </Col>
                                        </Row>
                                    </Container>
                                    {currentOrders.map((order, index) => (
                                        <Row key={order.id} style={{ borderBottom: "solid 3px #F5F5F5", padding: "12px 0  0 0" }}>
                                            <Col xs={1}>{indexOfFirstOrder + index + 1}</Col>
                                            <Col xs={1}>
                                                <button style={{ border: "none", background: "none" }} onClick={() => navigate(`/admin/detailAccount?idUser=${order?.user.id}`)}>
                                                    {order?.user.username}
                                                </button>
                                            </Col>
                                            <Col xs={2} onClick={() => navigate(`/user/detailOrder?idOrder=${order?.id}`)} style={{ cursor: "pointer", textDecoration: "underline" }}>
                                                {order?.code}
                                            </Col>
                                            <Col xs={4}>
                                                {itemOrder
                                                    ?.filter(item => item.order.id === order.id)
                                                    .map(item => (
                                                        <Row key={item.id} style={{ borderBottom: "solid 1px #F5F5F5", padding: "10px 0" }}>
                                                            <Col xs={2}>
                                                                <img style={{ width: "100%" }} src={`${item?.product.image[0]}`} alt="imgproduct" />
                                                            </Col>
                                                            <Col xs={8} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "3em" }}>
                                                                {(item?.product.name)}
                                                            </Col>
                                                            <Col xs={2} style={{ textAlign: "center" }}>
                                                                x {item?.quantity}
                                                            </Col>
                                                        </Row>
                                                    ))}
                                            </Col>
                                            <Col xs={2} style={{ display: "flex", justifyContent: "center" }}>
                                                {formatMoney(order?.totalOrder)} đ
                                            </Col>

                                            {handleAction(order?.status)}

                                        </Row>
                                    ))}
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                                        <Pagination
                                            current={currentPage}
                                            pageSize={itemsPerPage}
                                            total={orders?.length}
                                            onChange={paginate}
                                        />
                                    </div>
                                </div>
                            )}
                        </Container>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    )
}
export default OrderAdmin;
