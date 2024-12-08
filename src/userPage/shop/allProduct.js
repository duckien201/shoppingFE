import { useEffect, useState } from "react";
import {  Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { viewProductDetail } from "../../redux/Slice/product";
import { FaStar } from "react-icons/fa";
import getStar from "../../function/getStar";
import axios from "axios";
import { Pagination } from "antd";
import { BASE_URL } from "../../constant/constant";

const AllProduct = ({ status }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 12;
    const [allProduct, setAllProduct] = useState()

    // Function to format number
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number);
    };

    // Calculate the reviews to display on the current page
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

    // Filter and slice the products
    const filteredProducts = allProduct?.filter(product => product.status === status);
    const currentReviews = filteredProducts?.slice(indexOfFirstReview, indexOfLastReview);

    // Calculate total pages

    const viewDetailProduct = (product) => {
        dispatch(viewProductDetail(product));
        localStorage.setItem("item", JSON.stringify(product));
        navigate(`/product/${product.idProduct}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productApi = await axios.get(`${BASE_URL}/products`);
                const updatedProducts = await Promise.all(productApi?.data.map(async (product) => {
                    const star = await getStar(product.idProduct);
                    return { ...product, star: star };
                }));
                setAllProduct(updatedProducts.filter(product=>product.remain!==0));
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [])
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ background: "#F5F5F5", padding: "10px 0" }}>
            <Container>
                <Row>
                    {currentReviews?.map(product => (
                        <Col key={product.idProduct} xs={2} style={{ padding: "5px" }}>
                            <div style={{ background: "white", padding: "10px", cursor: "pointer" }}
                                onClick={() => viewDetailProduct(product)}>
                                <img
                                    src={product.image?.[0] } 
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
                                                    {formatNumber(product.price)} đ
                                                </div>
                                                <div style={{ color: "white", fontSize: "8px" }}>asds</div>
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div>
                                                    <div style={{ fontSize: "12px", textDecoration: "line-through" }}>
                                                        {formatNumber(product.price)} đ
                                                    </div>
                                                    <div style={{ background: "#5f4632", color: "white", fontSize: "12px", padding: "0 2px" }}>Giảm {product?.sale}%</div>
                                                </div>
                                                <div style={{ color: "#EE4D2D", fontSize: "15px" }}>
                                                    {formatNumber(Math.ceil(product?.price * (100 - product?.sale) / 100))} đ
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
                                            <div>Đã bán {product.numberOfSale}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                    <Pagination
                        current={currentPage}
                        pageSize={reviewsPerPage}
                        total={allProduct?.filter(product => product.status === status).length}
                        onChange={paginate}
                    />
                </div>
            </Container>
        </div>
    );
};

export default AllProduct;
