import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import formatMoney from "../../function/formatMoney"
import { FaStar } from "react-icons/fa"
import getStar from "../../function/getStar"
import { BASE_URL } from "../../constant/constant"

const SuggestProduct = ({ shop, idOrder }) => {
    const [allProduct, setAllProduct] = useState([])
    const navigate = useNavigate()

    console.log(shop)
    console.log(idOrder)

    useEffect(() => {
        const fetchData = async (idOrder) => {
            try {
                console.log("order: " + idOrder)
                if(idOrder != undefined) {
                    // Use API endpoint related to orders
                    const response = await axios.get(`http://localhost:5556/api/suggest?order_id=${idOrder}`)
                    const updatedProduct = await Promise.all(response.data.map(async (product) => {
                        const star = await getStar(product.idProduct);
                        return { ...product, star }; // Assuming getStar fetches star rating for each product
                    }))
                    setAllProduct(updatedProduct)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData(idOrder)
    }, [idOrder])

    const viewDetailProduct = (product) => {
        localStorage.setItem("item", JSON.stringify(product))
        navigate(`/product/${product.idProduct}`)
    }

    return (
        <Container>
            <div>CÁC SẢN PHẨM TƯƠNG TỰ</div>
            <br />
            <Row>
                {allProduct
                    // .filter(product =>
                    //     product.idProduct !== idOrder && // Ensure we don't show the product that was part of the order
                    //     product.remain !== 0 &&
                    //     product.status === "ok"
                    // )
                    .map(product => (
                        <Col xs={2} key={product.idProduct} onClick={() => viewDetailProduct(product)} style={{ background: "white" }}>
                            <img
                                src={`${product.image}`}// Corrected image source
                                alt={product.name}
                                style={{ maxWidth: "100%" }}
                            />
                            <div>
                                <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "3em" }}>
                                    {product?.name}
                                </div>
                                <div>
                                    {product?.sale === 0 ? (
                                        <div>
                                            <div style={{ color: "#EE4D2D" }}>
                                                {formatMoney(product.price)} đ
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div>
                                                <div style={{ fontSize: "12px", textDecoration: "line-through" }}>
                                                    {formatMoney(product.price)} đ
                                                </div>
                                                <div style={{ background: "#5f4632", color: "white", fontSize: "12px", padding: "0 2px" }}>Giảm {product?.sale}%</div>
                                            </div>
                                            <div style={{ color: "#EE4D2D", fontSize: "15px" }}>
                                                {formatMoney(Math.ceil(product?.price * (100 - product?.sale) / 100))} đ
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "7px" }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: 'center'
                                        }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    style={{ color: i < product.star ? "#F0D24A" : "#e4e5e9" }}
                                                />
                                            ))}
                                        </div>
                                        <div>Đã bán {product.number_of_sale}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
            </Row>
        </Container>
    )
}
export default SuggestProduct
