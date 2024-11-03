import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import Footer from "../Footer"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { viewProductDetail } from "../../redux/Slice/product"
import formatNumber from "../../function/formatMoney"
import { FaCheck } from "react-icons/fa";
import { MdDisabledByDefault } from "react-icons/md";
import AllProduct from "../../userPage/shop/allProduct"
import { Button, Checkbox, message, Modal, Pagination, Popconfirm } from "antd"
import TextArea from "antd/es/input/TextArea"
import { BASE_URL } from "../../constant/constant"

const ProductAdmin = () => {
    const [product, setproduct] = useState()
    const [ressonReject, setReasonReject] = useState()
    const [idProductReject, setIdProductReject] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [openReasonReject, setOpenReasonReject] = useState(false)
    const [openReasonRejectAll, setOpenReasonRejectAll] = useState(false)
    const token = JSON.parse(localStorage.getItem("admin"))?.token
    const [selectedItem, setSelectedItem] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5); // Number of products per page

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
            const productApi = await axios.get(`${BASE_URL}/products`)
            setproduct(productApi.data.filter(product => product.status === "Đang chờ duyệt"))
        } catch (error) {
            console.log(error);
        }
    }

    const selectAll = () => {
        setSelectedItem(
            selectedItem.length === product?.length ? [] : product?.map((product) => product)
        );
    };

    const handleSelect = (item) => {
        const index = selectedItem.findIndex(
            (selectedItem) => selectedItem.idProduct === item.idProduct
        );
        if (index === -1) {
            setSelectedItem([...selectedItem, item]);
        } else {
            const updatedItems = [...selectedItem];
            updatedItems.splice(index, 1);
            setSelectedItem(updatedItems);
        }
    };

    const isSelected = (item) => {
        return selectedItem.some(
            (selectedItem) => selectedItem.idProduct === item?.idProduct
        );
    };

    const agreeAllProduct = async () => {
        if (selectedItem.length === 0) {
            message.error("Chưa chọn sản phẩm nào")
            return
        }
        for (const product of selectedItem) {
            await agreeProduct(product.idProduct);
        }
        fetchData()
    }
    const rejectAll = async () => {
        for (const product of selectedItem) {
            try {
                await axios.post(`${BASE_URL}/admin/rejectProduct?idProduct=${product.idProduct}&reasonReject=${ressonReject}`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                fetchData()
            } catch (error) {
                console.log(error)
                message.error("Đã xảy ra lỗi")
            }
        }
        message.success("Từ chối thành công")
        setOpenReasonRejectAll(false)
    }
    const viewDetailProduct = (product) => {
        dispatch(viewProductDetail(product));
        localStorage.setItem("item", JSON.stringify(product));
        navigate(`/product/${product.idProduct}`);
    };

    const agreeProduct = async (idProduct) => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/agreeProduct?idProduct=${idProduct}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            if (response.status === 200) {
                message.success("Hoàn thành")
            }
            fetchData()
        } catch (error) {
            console.log(error);
            message.error("Đã xảy ra lỗi")
        }
    }

    const disAgreeProduct = async (idProduct) => {
        setOpenReasonReject(true)
        setIdProductReject(idProduct)
    }
    const handleOk = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${BASE_URL}/admin/rejectProduct?idProduct=${idProductReject}&reasonReject=${ressonReject}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            console.log(response.data);
            if (response.status === 200) {
                message.success("Đã từ chối")
            }
            fetchData()
        } catch (error) {
            console.log(error);
            message.error("Đã xảy ra lỗi")
        }

        setOpenReasonReject(false);
    };
    const handleCancel = () => {
        setOpenReasonReject(false);
    };
    // Calculate the indices for the products on the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = product?.slice(indexOfFirstProduct, indexOfLastProduct);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10} style={{ paddingRight: "30px" }}>
                        <Container style={{ background: "#FCFCFC" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Sản phẩm đợi duyệt</div>
                            <div>
                                <Popconfirm
                                    title="Duyệt sản phẩm"
                                    description="Bạn muốn duyệt những sản phẩm này?"
                                    onConfirm={agreeAllProduct}
                                    onCancel={() => { return }}
                                    okText="Đúng"
                                    cancelText="Hủy"
                                >
                                    <Button style={{ borderRadius: "5px", color: "#007bff", border: "none", marginRight: "10px", background: "#F0F0F0" }}>
                                        Duyệt
                                    </Button>
                                </Popconfirm>
                                <Button
                                    onClick={() => {
                                        if (selectedItem.length === 0) {
                                            message.error("Chưa chọn sản phẩm nào");
                                        } else {
                                            setOpenReasonRejectAll(true);
                                        }
                                    }}
                                    style={{ borderRadius: "5px", color: "#007bff", border: "none", background: "#F0F0F0" }}>
                                    Từ chối
                                </Button>

                            </div>
                            <Row style={{ padding: "10px 0" }}>
                                <Col xs={1}>
                                    <Checkbox
                                        type="checkbox"
                                        style={{ marginRight: "10px" }}
                                        checked={selectedItem.length === product?.length}
                                        onChange={selectAll}
                                    /> #
                                </Col>
                                <Col xs={4}>
                                    Hình ảnh sản phẩm
                                </Col>
                                <Col xs={2}>
                                    Tên sản phẩm (ấn để xem)
                                </Col>
                                <Col xs={1}>
                                    Giá
                                </Col>
                                <Col xs={3}>
                                    Mô tả
                                </Col>
                                <Col xs={1}>
                                    Thao tác
                                </Col>
                            </Row>
                            <Row style={{ marginLeft: 0 }}>
                                {currentProducts
                                    ?.map((product, index) => (
                                        <Col className="row" key={product.idProduct} xs={12} style={{ background: "white", padding: "5px", border: "1px solid #F5F5F5", borderRadius: "10px" }}>
                                            <Col xs={1} style={{ cursor: "pointer" }}>
                                                <Checkbox
                                                    id={index + 1}
                                                    type="checkbox"
                                                    style={{ marginRight: "10px", cursor: "pointer" }}
                                                    onChange={() => handleSelect(product)}
                                                    checked={isSelected(product)}
                                                />
                                                <label style={{ cursor: "pointer" }} htmlFor={index + 1}>{index + 1}</label>
                                            </Col>
                                            <Col xs={4} style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #F5F5F7" }}>
                                                {product?.image.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={product.name}
                                                        style={{ maxWidth: "20%" }}
                                                    />
                                                ))}
                                            </Col>
                                            <Col xs={2} onClick={() => viewDetailProduct(product)} style={{ cursor: "pointer" }}>
                                                <div style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "4.5em" }}>
                                                    {(product?.name)}
                                                </div>
                                            </Col>
                                            <Col xs={1} style={{ fontSize: "15px" }}>
                                                {formatNumber(product.price)} đ
                                            </Col>
                                            <Col xs={3}>
                                                <div style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "4.5em" }}>
                                                    {(product?.description)}
                                                </div>
                                            </Col>
                                            <Col xs={1}>
                                                <div style={{ display: "flex", justifyContent: "space-evenly", fontSize: "20px", padding: "5px 0" }}>
                                                    <button onClick={() => agreeProduct(product?.idProduct)} style={{ border: "none", background: "none", width: "50%" }}>
                                                        <FaCheck style={{ color: "green" }} />
                                                    </button>
                                                    |
                                                    <button onClick={() => disAgreeProduct(product?.idProduct)} style={{ border: "none", background: "none", width: "50%" }}>
                                                        <MdDisabledByDefault style={{ color: "red" }} />
                                                    </button>

                                                </div>
                                            </Col>

                                        </Col>
                                    ))
                                }
                            </Row>
                        </Container>
                        <div className="p" style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                            <Pagination
                                current={currentPage}
                                pageSize={productsPerPage}
                                total={product?.length}
                                onChange={paginate}
                            />
                        </div>
                        <br />
                        <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D", background: "#F5F5F5" }}>Tất cả sản phẩm</div>
                        <AllProduct status="ok" style />
                        <br />
                        <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D", background: "#F5F5F5" }}>Sản phẩm đã từ chối</div>
                        <AllProduct status="Từ chối" style />
                        <br />
                        <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D", background: "#F5F5F5" }}>Sản phẩm đang bị khóa</div>
                        <AllProduct status="Cấm" style />
                    </Col>
                </Row>
            </Container>
            <br />
            <Footer />
            <Modal
                title="Bạn đã từ chối sản phẩm này"
                open={openReasonReject}
                onOk={handleOk}
                onCancel={handleCancel}
            >

                <div>Lý do:  </div>
                <TextArea style={{ width: "100%", height: "100px", marginTop: "10px" }} value={ressonReject} onChange={e => setReasonReject(e.target.value)}></TextArea>
            </Modal>
            <Modal
                title="Từ chối những sản phẩm này"
                open={openReasonRejectAll}
                onOk={rejectAll}
                onCancel={() => setOpenReasonRejectAll(false)}
            >

                <div>Lý do:  </div>
                <TextArea style={{ width: "100%", height: "100px", marginTop: "10px" }} value={ressonReject} onChange={e => setReasonReject(e.target.value)}></TextArea>
            </Modal>
        </div>
    )
}
export default ProductAdmin