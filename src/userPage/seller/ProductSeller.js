import { useEffect, useState } from "react";
import {  Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { viewProductDetail } from "../../redux/Slice/product";
import EditProduct from "./EditProduct";
import getStar from "../../function/getStar";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { Pagination } from "antd";
import { BASE_URL } from "../../constant/constant";

const ProductSeller = ({ status,isSoldOut }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 12;
    const [allProduct, setAllProduct] = useState([]);
    const user=JSON.parse(localStorage.getItem("user"))
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number);
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

    const filteredProducts = allProduct.filter(product => product.status === status);
    const currentReviews = filteredProducts.slice(indexOfFirstReview, indexOfLastReview);

    const viewDetailProduct = (product) => {
        dispatch(viewProductDetail(product));
        localStorage.setItem("item", JSON.stringify(product));
        navigate(`/product/${product.idProduct}`);
    };

    const handleEditClick = (product) => {
        setSelectedProduct(selectedProduct?.idProduct === product.idProduct ? null : product);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allProductApi = await axios.get(`${BASE_URL}/product/shop/${user?.id}`);
                const updatedProduct = await Promise.all(allProductApi.data.map(async (product) => {
                    const star = await getStar(product.idProduct);
                    return { ...product, star: star };
                }))
                if(isSoldOut==="true"){
                    setAllProduct(updatedProduct.filter(product=>product?.remain===0))
                }else{
                    setAllProduct(updatedProduct.filter(product=>product?.remain!==0))
                }
            } catch (error) {
                console.log(error);
            }
        };
        if(!user){
            navigate('/signin')
        }else{
            fetchData();
        }
    }, []);  // Added allProduct as a dependency
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ background: "#F5F5F5", padding: "10px 0" }}>
            <Container>
                <Row>
                    {currentReviews.map(product => (
                        <Col key={product.idProduct} xs={2} style={{ padding: "5px" }}>
                            <div style={{ background: "white", padding: "10px", cursor: "pointer" }}>
                                <img
                                    src={`${product.image[0]}`}
                                    alt={product.name}
                                    style={{ maxWidth: "100%" }}
                                    onClick={() => viewDetailProduct(product)}
                                />
                                <div>
                                    <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "3em" }}>
                                        {(product?.name)}
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
                                                    <div style={{ background: "#F84A2F", color: "white", fontSize: "12px", padding: "0 2px" }}>Giảm {product?.sale}%</div>
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
                            <div style={{ background: "white" }}>
                                <Link onClick={() => handleEditClick(product)}>Sửa</Link>
                            </div>
                        </Col>
                    ))}
                </Row>
                {selectedProduct?.idProduct && (
                    <EditProduct product={selectedProduct} />
                )}
                {/* {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ margin: "0 5px" }}
                        >
                            {"<"}
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                                key={i}
                                variant="primary"
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    margin: "0 5px",
                                    backgroundColor: currentPage === i + 1 ? "#F75530" : "white",
                                    color: currentPage === i + 1 ? "white" : "black",
                                    border: currentPage === i + 1 ? "none" : "1px solid #ccc"
                                }}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ margin: "0 5px" }}
                        >
                            {">"}
                        </Button>
                    </div>
                )} */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                <Pagination
                    current={currentPage}
                    pageSize={reviewsPerPage}
                    total={allProduct.filter(product => product.status === status).length}
                    onChange={paginate}
                />
            </div>
            </Container>
        </div>
    );
};

export default ProductSeller;
