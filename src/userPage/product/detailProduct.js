import { Col, Container, Row } from "react-bootstrap";
import Header from "../Header";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaStar, FaDropbox, FaShippingFast } from "react-icons/fa";
import { BsCartCheck } from "react-icons/bs";
import { RxReset } from "react-icons/rx";
import ShopInfo from "../shop/ShopInfo";
import Footer from "../Footer";
import DescriptionProduct from "./description";
import ReviewProduct from "./reviewProduct";
import OtherProduct from "./otherProduct";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../redux/Slice/cart";
import formatMoney from "../../function/formatMoney";
import { message, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BASE_URL } from "../../constant/constant";

const DetailProduct = () => {
    const [product, setProduct] = useState();
    const { id } = useParams();
    const [cart, setCart] = useState()
    const [rateProduct, setRateProduct] = useState([]);
    const [averageStar, setAverageStar] = useState();
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const item = JSON.parse(localStorage.getItem("item"));
    const [openReport, setOpenReport] = useState(false);
    const [titleReport, setTitleReport] = useState();
    const [contentReport, setContentReport] = useState();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const navigate = useNavigate()

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const productApi = await axios.get(`${BASE_URL}/product/${id}`);
            setProduct(productApi.data);

            const rateProductApi = await axios.get(`${BASE_URL}/product/rate/${id}`);
            setRateProduct(rateProductApi.data);
            
            const cartsApi = await axios.get(`${BASE_URL}/cart/${user?.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    }
                });
            setCart(
                cartsApi.data
                    .map((cart) => ({
                        ...cart
                    }))
                    .reverse()
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const totalStar = rateProduct?.reduce((total, star) => total + star.star, 0);
        setAverageStar((totalStar / rateProduct?.length).toFixed(1));
    }, [rateProduct]);

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const styleRating = {
        display: "flex",
        border: "none",
        background: "white",
        alignItems: "center",
        justifyContent: "center",
        paddingRight: "20px",
    };

    const handdleAddToCart = async () => {
        console.log(item);
        const newItem = {
            ...item,
            quantity: quantity,
        };
        dispatch(addItemToCart(newItem));
        fetchData()
    };

    const containerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        width: "100px",
        marginLeft: "40px",
    };

    const buttonStyle = {
        width: "30px",
        height: "30px",
        fontSize: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        background: "white",
        cursor: "pointer",
    };

    const quantityStyle = {
        fontSize: "20px",
        width: "60px",
        textAlign: "center",
        border: "1px solid #DBD9DB",
    };

    const labelText = {
        marginLeft: "25px",
        textAlign: "center",
        padding: "5px",
    };

    const buyButton = {
        marginLeft: "20px",
        border: "none",
        padding: "10px",
        width: "200px",
    };

    const handleOk = async (e) => {
        e.preventDefault();
        const reportProductDto = {
            title: titleReport,
            content: contentReport,
            idAccuser: user.id,
            idProduct: id,
        };
        if (titleReport == null || contentReport == null) {
            message.error("Thiếu tiêu đề hoặc mô tả");
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/reportProduct`, reportProductDto);
            if (response.status === 200) {
                setContentReport("");
                message.success("Gửi thành công");
            }
        } catch (error) {
            console.log(error);
            message.success("Gửi thành công");
        }
        setOpenReport(false);
    };

    const handleCancel = () => {
        setOpenReport(false);
    };

    const buyNow = () => {
        localStorage.setItem("order", JSON.stringify([{ product, quantity }]))
        localStorage.setItem("shopOrder", JSON.stringify([product?.shop]))
        navigate("/order");
    }

    const [mainImage, setMainImage] = useState(product?.image[0]); // Ảnh chính ban đầu
    useEffect(() => {
        if (product?.image.length > 0) {
            setMainImage(product?.image[0]);
        }
    }, [product?.image]);
    const containerRef = useRef(null);
    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };
    return (
        <div style={{ backgroundColor: "#F5F5F5" }}>
            <Header cart={cart?.length} />
            <br />
            <Container style={{ backgroundColor: "white" }}>
                <Row>
                    <Col xs={4} style={{ padding: "5px" }}>
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <img src={mainImage} alt="Main" style={{ width: "100%", maxHeight: "500px" }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <button onClick={scrollLeft} style={{ cursor: "pointer", marginRight: "10px" }}>
                                &lt;
                            </button>
                            <div
                                ref={containerRef}
                                style={{ display: "flex", overflowX: "hidden", flexGrow: 1 }}
                            >
                                {product?.image.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setMainImage(image)}
                                        style={{ cursor: "pointer", marginRight: "10px" }}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index}`}
                                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button onClick={scrollRight} style={{ cursor: "pointer", marginLeft: "10px" }}>
                                &gt;
                            </button>
                        </div>

                    </Col>
                    <Col xs={8} style={{ padding: "10px 10px 10px 20px" }}>
                        <div style={{ fontSize: "20px" }}>{product?.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex" }}>
                                {rateProduct?.length > 0 ? (
                                    <div style={{ display: "flex" }}>
                                        <button style={styleRating}>
                                            <div style={{ marginRight: "8px" }}>{averageStar}</div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        style={{
                                                            color: i < averageStar ? "#F0D24A" : "#e4e5e9",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </button>
                                        <button style={styleRating}>
                                            {rateProduct.length}{" "}
                                            <div style={{ marginLeft: "10px" }}>Đánh giá</div>
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            marginRight: "30px",
                                            borderRight: "solid 1px #999999",
                                            paddingRight: "40px",
                                        }}
                                    >
                                        Chưa có đánh giá
                                    </div>
                                )}
                                <div style={styleRating}>
                                    {product?.numberOfSale}{" "}
                                    <div style={{ marginLeft: "10px" }}>Đã bán</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpenReport(true)}
                                style={{
                                    ...styleRating,
                                    color: "#DBAC95",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginLeft: "10px",
                                }}
                            >
                                Tố cáo
                            </button>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                marginTop: "20px",
                                background: "#FAFAFA",
                                padding: "20px 0 20px 20px",
                            }}
                        >
                            {product?.sale === 0 ? (
                                <div>
                                    <h2 style={{ color: "#DB4343" }}>{formatMoney(product?.price)} đ</h2>
                                </div>
                            ) : (
                                <div style={{ display: "flex" }}>
                                    <h4
                                        style={{
                                            padding: "5px",
                                            color: "#DBAC95",
                                            textDecoration: "line-through",
                                            marginRight: "20px",
                                        }}
                                    >
                                        {formatMoney(product?.price)} đ
                                    </h4>
                                    <h2 style={{ color: "#DB4343" }}>
                                        {formatMoney((product?.price / 100) * (100 - product?.sale))} đ
                                    </h2>
                                    <h6
                                        style={{
                                            padding: "10px 0 10px 0",
                                            marginLeft: "15px",
                                        }}
                                    >
                                        Giảm {product?.sale}%
                                    </h6>
                                </div>
                            )}
                        </div>
                        <br />
                        <br />
                        <div style={{ display: "flex" }}>
                            <div style={labelText}>Số Lượng</div>
                            <div style={containerStyle}>
                                <button
                                    onClick={() => setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1))}
                                    style={buttonStyle}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        let value = Math.max(1, Math.min(product?.remain, Number(e.target.value)));
                                        setQuantity(value);
                                    }}
                                    min="1"
                                    max={product?.remain}
                                    style={quantityStyle}
                                />
                                <button
                                    onClick={() => setQuantity((prevQuantity) => Math.min(prevQuantity + 1, product.remain))}
                                    style={buttonStyle}
                                    disabled={quantity >= product?.remain}
                                >
                                    +
                                </button>
                            </div>
                            <div style={{ ...labelText, color: "#DB2121" }}>
                                Còn lại: {product?.remain}
                            </div>
                        </div>
                        <br />
                        <br />
                        <div>
                            <button
                                style={{
                                    ...buyButton,
                                    color: "#5f4632",
                                    border: "#5f4632 solid 1px",
                                    opacity: product?.remain === 0 ? 0.5 : 1,
                                    cursor: product?.remain === 0 ? "not-allowed" : "pointer",
                                }}
                                onClick={handdleAddToCart}
                                disabled={product?.remain === 0}
                            >
                                <BsCartCheck /> Thêm vào giỏ hàng
                            </button>
                            <button
                                onClick={buyNow}
                                style={{
                                    ...buyButton,
                                    color: "white",
                                    background: "#5f4632",
                                    opacity: product?.remain === 0 ? 0.5 : 1,
                                    cursor: product?.remain === 0 ? "not-allowed" : "pointer",
                                }}
                                disabled={product?.remain === 0}
                            >
                                Mua ngay
                            </button>
                        </div>

                        <br />
                        <br />
                        <Row
                            style={{
                                marginLeft: "5px",
                                paddingTop: "20px",
                                borderTop: "solid 1px #e4e5e9",
                            }}
                        >
                            <Col xs={4}>
                                <FaDropbox style={{ color: "#5f4632" }} /> Giao hàng nhanh chóng
                            </Col>
                            <Col xs={4}>
                                <FaShippingFast style={{ color: "#5f4632" }} /> Miễn phí vận chuyển
                            </Col>
                            <Col xs={4}>
                                <RxReset style={{ color: "#5f4632" }} /> Miễn phí hoàn hàng 15 ngày
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <br />
            <ShopInfo idShop={product?.shop.id} />
            <br />
            <DescriptionProduct product={product} />
            <br />
            <ReviewProduct rateProduct={rateProduct} />
            <br />
            <OtherProduct shop={product?.shop} idProduct={product?.idProduct} />
            <br />
            <Footer />
            <Modal
                title="Báo cáo sản phẩm này"
                open={openReport}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>Lý do</div>
                <Select
                    style={{ width: "100%", margin: "10px 0" }}
                    onChange={(value) => setTitleReport(value)}
                    options={[
                        {
                            value: "Sản phẩm bị cấm buôn bán( động vật hoang dã, 18+,...)",
                            label: "Sản phẩm bị cấm buôn bán( động vật hoang dã, 18+,...)",
                        },
                        {
                            value: "Sản phẩm có dấu hiệu lừa đảo",
                            label: "Sản phẩm có dấu hiệu lừa đảo",
                        },
                        { value: "Hàng giả, hàng nhái", label: "Hàng giả, hàng nhái" },
                        {
                            value: "Sản phẩm không rõ nguồn gốc, xuất xứ",
                            label: "Sản phẩm không rõ nguồn gốc, xuất xứ",
                        },
                        {
                            value: "Hình ảnh sản phẩm không rõ ràng",
                            label: "Hình ảnh sản phẩm không rõ ràng",
                        },
                        {
                            value: "Sản phẩm có hình ảnh hoặc nội dung phản cảm",
                            label: "Sản phẩm có hình ảnh hoặc nội dung phản cảm",
                        },
                        {
                            value: "Tên sản phẩm không phù hợp với hình ảnh",
                            label: "Tên sản phẩm không phù hợp với hình ảnh",
                        },
                        { value: "Khác", label: "Khác" },
                    ]}
                />
                <div>Mô tả tố cáo </div>
                <TextArea
                    style={{ width: "100%", height: "100px", marginTop: "10px" }}
                    value={contentReport}
                    onChange={(e) => setContentReport(e.target.value)}
                ></TextArea>
            </Modal>
        </div>
    );
};

export default DetailProduct;
