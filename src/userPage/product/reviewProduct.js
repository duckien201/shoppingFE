import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { GiPenguin } from "react-icons/gi";
import { Pagination } from "antd";
import formatDate from "../../function/formatDate";

const ReviewProduct = ({ rateProduct }) => {
    const [averageStar, setAverageStar] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;

    useEffect(() => {
        const totalStar = rateProduct?.reduce((total, star) => total + star.star, 0);
        setAverageStar((totalStar / rateProduct.length).toFixed(1));
    }, [rateProduct]);

    // Calculate the reviews to display on the current page
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = rateProduct.slice(indexOfFirstReview, indexOfLastReview);

    // Handle pagination change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Container style={{ background: "white", padding: "20px" }}>
            <div style={{ marginLeft: "20px", padding: "10px" }}>
                {rateProduct?.length > 0 ? (
                    <div>
                        <h6>ĐÁNH GIÁ SẢN PHẨM</h6>
                        <Row style={{ background: "#FFFBF8", color: "#EE4D2D", padding: "15px" }}>
                            <Col xs={2}>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <h3>{averageStar}</h3>
                                    <span style={{ marginTop: "9px", marginLeft: "10px" }}> điểm</span>
                                </div>
                                <div style={{ textAlign: "center", fontSize: "25px" }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            style={{ color: i < averageStar ? "#F0D24A" : "#e4e5e9" }}
                                        />
                                    ))}
                                </div>
                            </Col>
                            <Col>Đánh giá chỉ mang tính chất tham khảo</Col>
                        </Row>
                        <br />
                        {currentReviews.map((rateProduct) => (
                            <div
                                key={rateProduct.id}
                                style={{
                                    borderBottom: "solid 1px #F0CBAD",
                                    display: "flex",
                                    paddingTop: "15px",
                                }}
                            >
                                <div
                                    style={{
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        width: "80px",
                                        height: "80px",
                                        padding: "0",
                                        margin: "20px",
                                    }}
                                >
                                    <img
                                        src={`${rateProduct?.userRate.avatar}`}
                                        alt="avatar"
                                        width={"100%"}
                                        style={{
                                            objectFit: "cover",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                                <div>
                                    <div>{rateProduct?.userRate.name}</div>
                                    <div style={{ fontSize: "12px" }}>
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                style={{ color: i < rateProduct?.star ? "#F0E32B" : "#e4e5e9" }}
                                            />
                                        ))}
                                    </div>
                                    <div style={{ fontSize: "11px", marginBottom: "10px" }}>
                                        {formatDate(rateProduct?.dateReview)}
                                    </div>
                                    <div>{rateProduct?.review}</div>
                                </div>
                            </div>
                        ))}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px",
                                alignItems: "center",
                            }}
                        >
                            <Pagination
                                current={currentPage}
                                pageSize={reviewsPerPage}
                                total={rateProduct.length}
                                onChange={handlePageChange}
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <h6> Chưa có đánh giá</h6>
                        <div style={{ fontSize: "30px" }}>
                            <GiPenguin />
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default ReviewProduct;
