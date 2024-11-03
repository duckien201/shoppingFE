import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import formatNameProduct from "../../function/formatNameProduct"
import formatMoney from "../../function/formatMoney"
import { Link, useLocation } from "react-router-dom"
import { Checkbox, Pagination } from "antd"
import { BASE_URL, CANCEL, COMPLETED, PREPARING_ORDER, SHIPPING, WAIT_FOR_CONFIRM_ORDER, WAIT_FOR_PAYMENT } from "../../constant/constant"

const AllOrder = ({ shop }) => {
    const [orders, setOrders] = useState([])
    const [itemOrder, setItemOrder] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const location = useLocation()
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    useEffect(() => {
        fetchData()
    }, [shop, location])

    const fetchData = async () => {
        try {
            const orderApi = await axios.get(`${BASE_URL}/shop/allOrder?idShop=${shop.id}`)
            const searchParams = new URLSearchParams(location.search)
            const filteredOrders = (searchParams.get("statusOrder") === "Tất cả" || searchParams.get("statusOrder") === null) ? orderApi.data.reverse() : orderApi.data.reverse().filter(order => order.status === searchParams.get("statusOrder"))
            setOrders(filteredOrders)

            const idOrder = orderApi.data.map(order => order.id)
            const itemOrderApi = await axios.post(`${BASE_URL}/shop/allOrderItem`, idOrder)
            setItemOrder(itemOrderApi.data)
        } catch (error) {
            console.log(error)
        }
    }
    const filteredOrders = selectedStatuses.length === 0
        ? orders
        : orders.filter(order => selectedStatuses.includes(order.status));

    // Calculate the indices of the orders to display
    const indexOfLastOrder = currentPage * itemsPerPage
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const changeStatusOrder = async (idOrder, status) => {
        try {
            const response = await axios.post(`${BASE_URL}/shop/changeStatusOrder?idOrder=${idOrder}&status=${status}`)
            console.log(response.data);
            fetchData()
        } catch (error) {
            console.log(error);
        }
    }

    const handleAction = (status, orderId) => {
        switch (status) {
            case 'Chờ xác nhận':
                return (<Col xs={3} style={{ display: "flex", justifyContent: "space-between" }}>
                    <div xs={2} style={{ display: "flex", justifyContent: "center", color: "red" }}>
                        <div>{status}</div>
                    </div>
                    <button style={{ width: "100px", border: "none", marginTop: "5px", fontSize: "15px" }}
                        onClick={() => changeStatusOrder(orderId, status)}
                    >Đang chuẩn bị hàng</button>
                </Col>)
            case 'Đang chuẩn bị hàng':
                return (<Col xs={3} style={{ display: "flex", justifyContent: "space-between" }}>
                    <div xs={2} style={{ display: "flex", justifyContent: "center" }}>
                        <div>{status}</div>
                    </div>
                    <button style={{ width: "100px", border: "none", marginTop: "5px", color: "blue", fontSize: "15px" }}
                        onClick={() => changeStatusOrder(orderId, status)}
                    >Đang vận chuyển</button>
                </Col>)
            default:
                return (<Col xs={3} style={{ display: "flex", justifyContent: "space-between" }}>
                    <div xs={2} style={{ display: "flex", justifyContent: "center" }}>
                        <div>{status}</div>
                    </div>
                </Col>)

        }
    }
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

    return (
        <Container style={{ background: "white", marginTop: "10px" }}>
            <div style={{ padding: "10px 0 20px 0", border: "1px solid #F5F5F5" }}>
                <Checkbox
                    name="checkbox"
                    style={{ margin: " 0 5px 0 10px" }}
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
            {filteredOrders.length === 0 ? (<h5 style={{ padding: "20px 0" }}>Bạn chưa có đơn hàng nào</h5>) : (
                <div>
                    <Row style={{ borderBottom: "2px solid #F5F5F5", padding: "15px 0" }}>
                        <Col xs={2}>
                            Mã đơn hàng
                        </Col>
                        <Col xs={3}>
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
                        <Col xs={1} style={{ padding: "0" }}>
                            Thao tác
                        </Col>
                    </Row>
                    {currentOrders.map(order => (
                        <Row key={order.id} style={{ borderBottom: "solid 3px #F5F5F5", padding: "12px 0  0 0" }}>
                            <Col xs={2}>
                                <Link to={`/user/detailOrder?idOrder=${order?.id}`} style={{ color: "black" }}>
                                    {order?.code}
                                </Link>
                            </Col>
                            <Col xs={5}>
                                {itemOrder
                                    ?.filter(item => item.order.id === order.id)
                                    .map(item => (
                                        <Row key={item.id} style={{ borderBottom: "solid 1px #F5F5F5", padding: "10px 0" }}>
                                            <Col xs={2}>
                                                <img style={{ width: "100%" }} src={`${item?.product.image[0]}`} alt="imgproduct" />
                                            </Col>
                                            <Col xs={8}>
                                                {formatNameProduct(item?.product.name)}
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

                            {handleAction(order?.status, order?.id)}

                        </Row>
                    ))}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                        <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={orders.length}
                            onChange={paginate}
                        />
                    </div>
                </div>
            )}
        </Container>
    )
}

export default AllOrder
