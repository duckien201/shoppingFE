import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { Col, Container, FormLabel, Row } from "react-bootstrap";
import { Checkbox, message } from "antd";
import Footer from "../Footer";
import formatMoney from "../../function/formatMoney";
import { viewProductDetail } from "../../redux/Slice/product";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../constant/constant";

const Cart = () => {
    const [idUser] = useState(JSON.parse(localStorage.getItem("user"))?.id)
    const [carts, setCarts] = useState([]);
    const [shops, setShops] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const checkedItem = useSelector((state) => state.cart.checkedItem);
    const [selectedItem, setSelectedItem] = useState(checkedItem);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedCart, setSelectedCart] = useState([]);
    const token = JSON.parse(localStorage.getItem("user"))?.token

    useEffect(() => {
        if (!token) {
            // Chuyển hướng đến trang đăng nhập nếu không có token
            navigate('/signin');
        } else {
            fetchData();
        }
    }, [token, navigate])

    const fetchData = async () => {
        try {
            const cartsApi = await axios.get(`${BASE_URL}/cart/${idUser}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            setCarts(
                cartsApi.data
                    .map((cart) => ({
                        ...cart
                    }))
                    .reverse()
            )
            const arrayShop = cartsApi.data.reverse().map((cart) => cart.product.shop);
            const uniqueShops = Array.from(
                new Map(arrayShop.map((item) => [item.id, item])).values()
            );
            setShops(uniqueShops);
        } catch (error) {
            console.log(error);
        }
    };

    const shopStyle = {
        background: "white",
        padding: "15px 20px",
        marginBottom: "20px"
    };
    const productStyle = {
        marginTop: "10px",
        padding: "15px 20px",
        borderBottom: "solid 1px #E8E8E8"
    };
    const containerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        width: "100px"
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
        cursor: "pointer"
    };
    const quantityStyle = {
        fontSize: "20px",
        width: "60px",
        textAlign: "center",
        border: "1px solid #DBD9DB"
    };

    const handleChangeQuantity = async (idCart, quantityChange) => {
        try {
            const updatedCarts = carts.map((cart) => {
                if (cart.id === idCart) {
                    return {
                        ...cart,
                        quantity: cart.quantity + quantityChange
                    };
                }
                return cart;
            });

            const selectedCartsToUpdate = updatedCarts.filter((cart) =>
                selectedItem.some((item) => item.idProduct === cart.product.idProduct)
            );

            const updatedSelectedItems = selectedCartsToUpdate.map((cart) => cart.product);

            setCarts(updatedCarts);
            setSelectedItem(updatedSelectedItems);

            await axios.post(`${BASE_URL}/cart/handleQuantity?idCart=${idCart}&quantity=${quantityChange}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        } catch (error) {
            console.log(error);
        }
    };

    const deleteCart = async (idCart) => {
        try {
            await axios.post(`${BASE_URL}/cart/delete?idCart=${idCart}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            fetchData();
            message.success("Xóa thành công")
        } catch (error) {
            console.log(error);
            message.error(error.response.data)
        }
    };
    const deleteAllCart = async () => {
        try {
            await axios.post(`${BASE_URL}/cart/deleteAll?idUser=${idUser}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            setCarts([])
            setShops([])
            fetchData()
            message.success("Xóa thành công")
        } catch (error) {
            message.error(error.response.data)
            console.log(error);
        }
    }
    const viewDetailProduct = (product) => {
        dispatch(viewProductDetail(product));
        localStorage.setItem("item", JSON.stringify(product));
        navigate(`/product/${product.idProduct}`);
    };

    const handleSelectCart = (item) => {
        const index = selectedItem.findIndex(
            (selectedItem) => selectedItem.idProduct === item.product.idProduct
        );
        if (index === -1) {
            setSelectedItem([...selectedItem, item.product]);
        } else {
            const updatedItems = [...selectedItem];
            updatedItems.splice(index, 1);
            setSelectedItem(updatedItems);
        }
    };

    const isSelected = (item) => {
        return selectedItem.some(
            (selectedItem) => selectedItem.idProduct === item.product.idProduct
        );
    };

    const selectAll = () => {
        setSelectedItem(
            selectedItem.length === carts?.length ? [] : carts?.map((cart) => cart.product)
        );
    };

    const selectAllOfShop = (idShop) => {
        const allCartOfShop = carts?.filter((cart) => cart.product.shop.id === idShop) || [];
        const selectedItemOfShop =
            selectedItem?.filter((item) => item.shop.id === idShop) || [];
        if (allCartOfShop.length === selectedItemOfShop.length) {
            const updatedSelectedItems = selectedItem.filter(
                (item) => item.shop.id !== idShop
            );
            setSelectedItem(updatedSelectedItems);
        } else {
            // If not all items are selected, add all items of the shop to the selected items
            const newCartsToSelect = allCartOfShop.filter(
                (cartItem) =>
                    !selectedItem.some(
                        (selectedItem) =>
                            selectedItem.idProduct === cartItem.product.idProduct
                    )
            );
            const newItemsToSelect = newCartsToSelect.map((cart) => cart.product);
            setSelectedItem([...selectedItem, ...newItemsToSelect]);
        }
    };

    useEffect(() => {
        const selectedCart = carts?.filter((cart) =>
            selectedItem.some((item) => item.idProduct === cart.product.idProduct)
        );
        if (selectedCart?.length === 0) {
            setTotalPrice(0);
        } else {
            const total = selectedCart?.reduce(
                (total, item) =>
                    total + (item.product.price * item.quantity * (100 - item.product.sale)) / 100, 0);
            setTotalPrice(total);
            setSelectedCart(selectedCart);
        }
    }, [selectedItem, carts]);

    const order = () => {
        if (selectedItem.length === 0) {
            message.error("Bạn chưa chọn sản phẩm nào. ");
        } else {
            localStorage.setItem("order", JSON.stringify(selectedCart))
            localStorage.setItem("shopOrder", JSON.stringify(shops?.filter(shop => selectedCart.some(selectedCart => selectedCart.product.shop.id === shop.id))))
            navigate("/order");
        }
    };

    return (
        <div style={{ background: "#F5F5F5" }}>
            <Header cart={carts?.length } />

            <Container style={{ background: "white", padding: "20px 20px", color: "#FC5731", borderBottom: "solid 1px #F5F5F5" }}>
                <div style={{ fontSize: "25px" }}>Giỏ hàng</div>
            </Container>

            <Container style={shopStyle}>
                <Row>
                    <Col xs={5}>
                        <Checkbox
                            id="selectAll"
                            style={{ marginRight: "1.5rem" }}
                            checked={selectedItem.length === carts?.length}
                            onChange={selectAll}
                        />
                        <FormLabel htmlFor="selectAll">Chọn tất cả</FormLabel>
                    </Col>
                    <Col
                        xs={7}
                        className="row"
                        style={{ color: "#A8A8A8", textAlign: "center" }}
                    >
                        <Col xs={3}>Đơn giá</Col>
                        <Col xs={3}>Số lượng</Col>
                        <Col xs={3}>Thành tiền</Col>
                        <Col xs={3}>Thao tác</Col>
                    </Col>
                </Row>
            </Container>
            {shops?.map((shop) => (
                <Container style={{ ...shopStyle }} key={shop.id}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "solid 1px #E8E8E8"
                        }}
                    >
                        <Checkbox
                            checked={
                                carts?.filter((cart) => cart.product.shop.id === shop.id).length === selectedItem?.filter((item) => item.shop.id === shop.id).length
                            }
                            onChange={() => selectAllOfShop(shop?.id)}
                        />
                        <div
                            style={{
                                borderRadius: "50%",
                                overflow: "hidden",
                                width: "40px",
                                height: "40px",
                                padding: "0",
                                margin: "20px"
                            }}
                        >
                            <img
                                src={`${shop?.avatar}`}
                                alt="avatar"
                                width={"100%"}
                                style={{
                                    objectFit: "cover",
                                    height: "100%"
                                }}
                            />
                        </div>
                        <div>{shop.name}</div>
                    </div>
                    {carts
                        ?.filter((cart) => cart.product.shop.id === shop.id)
                        .map((cart) => (
                            <Row style={productStyle} key={cart.id}>
                                <Col xs={5} className="row">
                                    <Col
                                        xs={1}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Checkbox
                                            onChange={() =>
                                                handleSelectCart(cart)
                                            }
                                            checked={isSelected(cart)}
                                        />
                                    </Col>
                                    <Col
                                        xs={5}
                                        style={{
                                            width: "100px",
                                            alignItems: "center"
                                        }}
                                    >
                                        <img
                                            src={`${cart.product.image[0]}`}
                                            style={{ width: "100%" }}
                                            alt="productimg"
                                            onClick={() =>
                                                viewDetailProduct(cart.product)
                                            }
                                        />
                                    </Col>
                                    <Col
                                        xs={6}
                                        style={{ padding: "0" }}
                                    >
                                        <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "3em" }}>
                                            {(cart.product?.name)}
                                        </div>
                                    </Col>

                                </Col>
                                <Col
                                    xs={7}
                                    className="row"
                                    style={{ textAlign: "center" }}
                                >
                                    <Col
                                        xs={4}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center"
                                        }}
                                    >
                                        {cart.product?.sale === 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <div>
                                                    {formatMoney(
                                                        cart.product?.price
                                                    )}{" "}
                                                    đ
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-around"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        textDecoration:
                                                            "line-through",
                                                        marginRight: "5px"
                                                    }}
                                                >
                                                    {formatMoney(
                                                        cart.product?.price
                                                    )}{" "}
                                                    đ
                                                </div>
                                                <div>
                                                    {formatMoney((cart.product?.price / 100) * (100 - cart.product?.sale))}{" "}đ
                                                </div>
                                            </div>
                                        )}
                                    </Col>
                                    <Col
                                        xs={3}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <div style={containerStyle}>
                                            <button
                                                style={buttonStyle}
                                                onClick={() =>
                                                    handleChangeQuantity(cart.id, -1)
                                                }
                                            >
                                                -
                                            </button>
                                            <span style={quantityStyle}>
                                                {cart?.quantity}
                                            </span>
                                            <button
                                                style={buttonStyle}
                                                onClick={() =>
                                                    handleChangeQuantity(cart.id, 1)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </Col>
                                    <Col
                                        xs={3}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center"
                                        }}
                                    >
                                        {cart.product?.sale === 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <div style={{ color: "red" }}>
                                                    {formatMoney(cart.product?.price * cart?.quantity)}{" "}đ
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    color: "red"
                                                }}
                                            >
                                                {formatMoney((cart.product?.price / 100) * (100 - cart.product?.sale) * cart?.quantity)}{" "}đ
                                            </div>
                                        )}
                                    </Col>
                                    <Col
                                        xs={2}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <button
                                            onMouseEnter={(e) =>
                                            (e.currentTarget.style.color =
                                                "red")
                                            }
                                            onMouseLeave={(e) =>
                                            (e.currentTarget.style.color =
                                                "black")
                                            }
                                            style={{
                                                border: "none",
                                                background: "white"
                                            }}
                                            onClick={() =>
                                                deleteCart(cart?.id)
                                            }
                                        >
                                            Xóa
                                        </button>
                                    </Col>
                                </Col>
                            </Row>
                        ))}
                </Container>
            ))}
            <Container
                style={{ ...shopStyle, fontSize: "18px" }}
            >
                <Row>
                    <Col
                        xs={4}
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <Checkbox
                                id="selectAll"
                                style={{ marginRight: "1.5rem" }}
                                checked={
                                    selectedItem.length === carts?.length
                                }
                                onChange={selectAll}
                            />
                            Chọn tất cả ({carts?.length})
                        </div>
                        <button
                            style={{
                                border: "none",
                                background: "white"
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color = "red")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color = "black")
                            }
                            onClick={deleteAllCart}
                        >
                            Xóa hết
                        </button>
                    </Col>
                    <Col xs={8} className="row">
                        <Col
                            xs={4}
                            style={{
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            Tổng thanh toán ({selectedItem.length} sản phẩm):
                        </Col>
                        <Col
                            xs={4}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                color: "red",
                                fontSize: "25px"
                            }}
                        >
                            {formatMoney(totalPrice || 0)} đ
                        </Col>
                        <Col xs={4}>
                            <button
                                style={{
                                    border: "none",
                                    background: "#F05D40",
                                    color: "white",
                                    padding: "10px 40px"
                                }}
                                onClick={order}
                            >
                                Thanh toán
                            </button>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default Cart;
