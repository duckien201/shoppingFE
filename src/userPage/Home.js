import { Col, Container, Row } from "react-bootstrap";
import Header from "./Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import BestSeller from "./product/bestSeller";
import AllProduct from "./shop/allProduct";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constant/constant";
import { Chat } from "../userPage/chatbot/Chat"; // Import Chat

export default function Home() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryApi = await axios.get(`${BASE_URL}/category`);
                setCategory(categoryApi.data.filter(category => category.name !== "Khác"));

                const productApi = await axios.get(`${BASE_URL}/products`);
                setProduct(productApi.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ backgroundColor: "#F5F5F5" }}>
            <Header />
            <br /><br />
            <Container style={{ backgroundColor: "white" }}>
                <Slider {...settings}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <img src="../images/banner1.jpg" alt="Slide 1" style={{ width: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <img src="../images/banner2.jpg" alt="Slide 2" style={{ width: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <img src="../images/banner-3.png" alt="Slide 3" style={{ width: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                </Slider>
            </Container>

            <br />
            <Container style={{ backgroundColor: "white" }}>
                <Row>
                    <h5 style={{ color: "#A17575" }}>Danh mục</h5>
                    {category?.map(category => (
                        <Col key={category.id} xs={1} onClick={() => navigate(`/allProduct?category=${category?.name}`)}>
                            <img src={`${category.image}`} style={{ height: "100px", width: "100px" }} alt="..." />
                            <div style={{ textAlign: "center" }}>{category.name}</div>
                        </Col>
                    ))}
                </Row>
                <br />
            </Container>
            <br />
            <BestSeller />
            <br />
            <Container style={{ display: "flex", justifyContent: "space-between" }}>
                <h5>Tất cả sản phẩm</h5>
                <Link to={"/allProduct"} style={{ color: "#F84A2F", border: "none", background: "none", textDecoration: "none" }}>Xem thêm &gt;</Link>
            </Container>
            <AllProduct allProduct={product} status={"ok"} />
            <br />
            <Footer />
            <Chat /> {/* Thêm component Chat */}
        </div>
    );
}
