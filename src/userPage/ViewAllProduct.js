import { Col, Container, Row } from "react-bootstrap";
import Header from "./Header";
import { IoMenu } from "react-icons/io5";
import { HiOutlineFilter } from "react-icons/hi";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewProductDetail } from "../redux/Slice/product";
import { message, Pagination } from "antd";
import Footer from "./Footer";
import { BASE_URL } from "../constant/constant";

const ViewAllProduct = () => {
    const [category, setCategory] = useState([]);
    const [allProduct, setProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(12);
    const [selectedCategory, setSelectedCategory] = useState()
    const [priceFrom, setPriceFrom] = useState()
    const [priceTo, setPriceTo] = useState()

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()

    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number);
    };

    useEffect(() => {
        fetchData();
    }, [location.search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [allProduct]);

    const fetchData = async () => {
        try {
            const categoryApi = await axios.get(`${BASE_URL}/category`);
            setCategory(categoryApi.data);

            const productApi = await axios.get(`${BASE_URL}/products`);

            const queryParams = new URLSearchParams(location.search);
            const filterCategory = queryParams.get('category');
            const filterRating = queryParams.get('rating');
            const filterPriceFrom = queryParams.get('priceFrom');
            const filterPriceTo = queryParams.get('priceTo');
            const filterName = queryParams.get('name');

            setSelectedCategory(filterCategory)

            let filteredProducts = productApi.data.filter(product => product.status === "ok");

            if (filterCategory) {
                filteredProducts = filteredProducts.filter(product => product.category.name === filterCategory);
            }

            if (filterName) {
                filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(filterName.toLowerCase()));  // Thêm dòng này để lọc sản phẩm theo tên
            }

            const updatedArrayProduct = await Promise.all(filteredProducts.map(async (product) => {
                const star = await getStar(product.idProduct);
                return { ...product,  star: star };
            }));
            
            if (filterRating) {
                filteredProducts = updatedArrayProduct.filter(product => product.star >= filterRating)
            }
            if (filterPriceFrom === null && filterPriceTo === null) {

            } else {
                if (filterPriceFrom * filterPriceTo === 0 || (filterPriceFrom < 0 && filterPriceFrom < 0) || filterPriceFrom > filterPriceTo) {
                    message.error("Vui lòng nhập đúng định dạng để thực hiện lọc")
                } else {
                    filteredProducts = filteredProducts.filter(product => product.price >= filterPriceFrom && product.price <= filterPriceTo)
                }
            }
            setProduct(filteredProducts);
            return filteredProducts
        } catch (error) {
            console.log(error);
        }
    };

    const viewDetailProduct = (product) => {
        dispatch(viewProductDetail(product));
        localStorage.setItem("item", JSON.stringify(product));
        navigate(`/product/${product.idProduct}`);
    };

    const indexOfLastProduct = currentPage * reviewsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - reviewsPerPage;
    const currentProducts = allProduct?.slice(indexOfFirstProduct, indexOfLastProduct);

    const getStar = async (idProduct) => {
        try {
            const response = await axios.get(`${BASE_URL}/product/rate/${idProduct}`)
            if (response.data.length === 0) {
                return 0
            } else {
                const totalStar = response.data.reduce((total, rate) => total + rate.star, 0)
                return totalStar / (response.data.length) ? totalStar / (response.data.length) : 0
            }
        } catch (error) {
            console.log(error);
        }
    }

    const addQueryParams = (params) => {
        const queryParams = new URLSearchParams(location.search);

        Object.entries(params).forEach(([key, value]) => {
            queryParams.set(key, value);
        });

        navigate({ search: queryParams.toString() });
    };
    const sortBySales = () => {
        setProduct([...allProduct].sort((a, b) => b.numberOfSale - a.numberOfSale));
    };
    const sortProducts = (sortOption) => {
        let sortedProducts = [...allProduct];
        if (sortOption === "minToHigh") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === "highToMin") {
            sortedProducts.sort((a, b) => b.price - a.price);
        }
        setProduct(sortedProducts);
    };
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ background: "#F5F5F5" }}>
            <Header />
            <br />
            <Container>
                <Row>
                    <Col xs={2}>
                        <div style={{ display: "flex", borderBottom: "1px solid #E8E8E8", marginBottom: "15px" }}>
                            <IoMenu style={{ margin: "2px 5px 0 0" }} />
                            <h6>Tất cả danh mục</h6>
                        </div>
                        <div>
                            {category.map(category => (
                                <div key={category.id}>
                                    <button
                                        style={{ border: "none", background: "none", padding: "7px 0", width: "100%", textAlign: "start", color: category.name === selectedCategory ? "#EE4D2D" : "black" }}
                                        onClick={() => addQueryParams({ category: category?.name })}
                                    >
                                        {category?.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <br />
                        <div style={{ display: "flex", borderBottom: "1px solid #E8E8E8", marginBottom: "15px" }}>
                            <HiOutlineFilter style={{ margin: "2px 5px 0 0" }} />
                            <h6>Bộ lọc</h6>
                        </div>
                        <div>Khoảng giá</div>
                        <div style={{ textAlign: "center", borderBottom: "solid 1px #E8E8E8", marginBottom: "15px", paddingBottom: "20px" }}>
                            <input style={{ width: "40%" }} placeholder="Từ" onChange={(e) => setPriceFrom(e.target.value)} />
                            <span style={{ margin: "0 12px" }}>-</span>
                            <input style={{ width: "40%" }} placeholder="Đến" onChange={(e) => setPriceTo(e.target.value)} />
                            <button onClick={() => {
                                addQueryParams({ priceFrom, priceTo });
                            }} style={{ border: "none", background: "#5f4632", color: "white", padding: "7px 20px", marginTop: "10px" }}>Áp dụng</button>
                        </div>
                        <div>Đánh giá</div>
                        <ul style={{ borderBottom: "solid 1px #E8E8E8", marginBottom: "15px", paddingBottom: "20px" }}>
                            <button style={{ border: "none", background: "none", padding: "5px 0" }} onClick={() => addQueryParams({ rating: 5 })}>
                                <FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} />
                            </button>
                            <button style={{ border: "none", background: "none", padding: "5px 0" }} onClick={() => addQueryParams({ rating: 4 })}>
                                <FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} /><FaRegStar /> trở lên
                            </button>
                            <button style={{ border: "none", background: "none", padding: "5px 0" }} onClick={() => addQueryParams({ rating: 3 })}>
                                <FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} /><FaRegStar /><FaRegStar /> trở lên
                            </button>
                            <button style={{ border: "none", background: "none", padding: "5px 0" }} onClick={() => addQueryParams({ rating: 2 })}>
                                <FaStar style={{ color: "#F0D24A" }} /><FaStar style={{ color: "#F0D24A" }} /><FaRegStar /><FaRegStar /><FaRegStar /> trở lên
                            </button>
                            <button style={{ border: "none", background: "none", padding: "5px 0" }} onClick={() => addQueryParams({ rating: 1 })}>
                                <FaStar style={{ color: "#F0D24A" }} /><FaRegStar /><FaRegStar /><FaRegStar /><FaRegStar /> trở lên
                            </button>
                        </ul>
                        <div style={{ textAlign: "center" }}>
                            <button onClick={() => navigate({ search: '' })} style={{ border: "none", background: "#5f4632", color: "white", padding: "7px 25px " }}>Xóa tất cả</button>
                        </div>
                    </Col>
                    <Col xs={10}>
                        <Row style={{ background: "#EDEDED", padding: "20px 0", marginBottom: "10px" }}>
                            <Col xs={6} style={{ display: "flex", justifyContent: "space-around" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>Sắp xếp theo</div>
                                <button onClick={() => setProduct([...allProduct].reverse())} style={{ border: "none", background: "white", padding: "7px 7px" }}>Mới nhất</button>
                                <button onClick={sortBySales} style={{ border: "none", background: "white", padding: "7px 7px" }}>Bán chạy</button>
                                <select style={{ border: "none", width: "200px" }} onChange={(e) => sortProducts(e.target.value)} >
                                    <option value={"minToHigh"}>Thấp đến Cao</option>
                                    <option value={"highToMin"}>Cao đến Thấp</option>
                                </select>
                            </Col>
                        </Row>
                        <Row>
                            {currentProducts
                                ?.filter(product => product?.remain !== 0)
                                ?.map(product => (
                                    <Col key={product.idProduct} xs={3} style={{ padding: "5px" }}>
                                        <div
                                            style={{ background: "white", padding: "10px", cursor: "pointer" }}
                                            onClick={() => viewDetailProduct(product)}
                                        >
                                            <img
                                                src={`${product.image[0]}`}
                                                alt={product.name}
                                                style={{ maxWidth: "100%" }}
                                            />
                                            <div>
                                                <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "3em" }}>
                                                    {(product?.name)}
                                                </div>
                                                <div>
                                                    {product.sale === 0 ? (
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
                                                                <div style={{ background: "#5f4632", color: "white", fontSize: "12px", padding: " 0 2px" }}>Giảm {product?.sale}%</div>
                                                            </div>
                                                            <div style={{ color: "#EE4D2D", fontSize: "15px" }}>
                                                                {formatNumber(Math.ceil(product.price * (100 - product.sale) / 100))} đ
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
                                total={allProduct?.length}
                                onChange={paginate}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
            <br />
            <Footer />
        </div>
    );
};

export default ViewAllProduct;
