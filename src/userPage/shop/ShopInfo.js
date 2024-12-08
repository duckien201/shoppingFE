import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AiOutlineShop } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineReport } from "react-icons/md";
import { message, Modal, Select, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import { BASE_URL } from "../../constant/constant";

const ShopInfo = ({ idShop }) => {
    const [shop, setShop] = useState();
    const [averageStar, setAverageStar] = useState(0);
    const [allRate, setAllRate] = useState([]);
    const [allProduct, setAllProduct] = useState([]);
    const [openReport, setOpenReport] = useState()
    const [title, setTitle] = useState()
    const [content, setContent] = useState()
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null; // Parse JSON nếu cần thiết
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const shopApi = await axios.get(`${BASE_URL}/shop/${idShop}`);
                setShop(shopApi.data.shop);
                setAllRate(shopApi.data.allRate);
                setAllProduct(shopApi.data.products.filter(product => product.status === "ok"));
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [idShop]);

    const navigate = useNavigate();

    useEffect(() => {
        if (allRate.length > 0) {
            const totalStar = allRate.reduce((total, star) => total + star.star, 0);
            setAverageStar((totalStar / allRate.length).toFixed(1));
        } else {
            setAverageStar(0);
        }
    }, [allRate]);

    const handleOk = async (e) => {
        e.preventDefault()
        const reportAccountDto = {
            title: title,
            content: content,
            idAccuser: user.id,
            idAccused: shop.id
        }
        if (title == null | content == null) {
            message.error("Thiếu tiêu đề hoặc mô tả")
            return
        }
        try {
            const response = await axios.post(`${BASE_URL}/reportAccount`, reportAccountDto)
            if (response.status === 200) {
                setContent('')
                message.success("Gửi thành công")
            }
        } catch (error) {
            console.log(error);
            message.error("Đã xảy ra lỗi")
        }
        setOpenReport(false)
    }

    const handleCancel = () => {
        setOpenReport(false)
    }



    return (
        <Container style={{ background: "white", padding: "15px 0 15px 40px" }}>
            <Row>
                <Col xs={4} style={{ borderRight: "solid 1px #FAE3E1" }}>
                    <Row>
                        <Col xs={4} style={{ borderRadius: "50%", overflow: "hidden", width: "100px", height: "100px", padding: "0" }}>
                            <img src={`${shop?.avatar}`} alt="avatar" width={"100%"}
                                style={{
                                    objectFit: "cover",
                                    height: "100%"
                                }} />
                        </Col>
                        <Col style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>{shop?.name}</div>
                                <Tooltip title="Báo cáo người bán này">
                                    <button style={{ border: "none", background: "none", fontSize: "20px" }} onClick={() => setOpenReport(true)}>
                                        <MdOutlineReport />
                                    </button>
                                </Tooltip>
                            </div>
                            <button onClick={() => navigate(`/shop/${shop?.id}`)} style={{
                                background: "#EDDCBE",
                                border: "solid 1px #5f4632",
                                padding: "5px 15px",
                                color: "#5f4632",
                                width: "125px",
                            }}><AiOutlineShop /> Xem Shop</button>
                        </Col>
                    </Row>
                </Col>
                <Col xs={8} style={{ flexDirection: "column", alignItems: "center" }}>
                    <Row style={{ alignItems: "center", textAlign: "center" }}>
                        <Col xs={3}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: 'center'
                            }}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        style={{ color: i < Math.round(averageStar) ? "#F0D24A" : "#e4e5e9", fontSize: "20px" }}
                                    />
                                ))}
                            </div>
                        </Col>
                        <Col xs={3}>
                            <span>Đánh giá:</span>
                            <span style={{ fontSize: "25px", marginLeft: "15px", color: "red" }}>
                                {averageStar !== undefined ? averageStar : 0}
                            </span>
                        </Col>
                        {/* <Col xs={3}>Tham gia vào: <span style={{ color: "red" }}>{moment().diff(shop?.dateSignup, 'years')} năm trước</span></Col> */}
                        <Col xs={3}>Sản phẩm: <span style={{ color: "red" }}>{allProduct.length}</span></Col>
                    </Row>
                </Col>
            </Row>

            <Modal
                title="Báo cáo người bán này"
                open={openReport}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>Lý do</div>
                <Select
                    style={{ width: "100%", margin: "10px 0" }}
                    onChange={(value) => setTitle(value)}
                    options={[
                        { value: 'Sản phẩm bị cấm buôn bán( động vật hoang dã, 18+,...)', label: 'Sản phẩm bị cấm buôn bán( động vật hoang dã, 18+,...)' },
                        { value: 'Người bán có dấu hiệu lừa đảo', label: 'Người bán có dấu hiệu lừa đảo' },
                        { value: 'Bán Hàng giả, hàng nhái', label: 'Bán Hàng giả, hàng nhái' },
                        { value: 'Bán Sản phẩm không rõ nguồn gốc, xuất xứ', label: 'Bán Sản phẩm không rõ nguồn gốc, xuất xứ' },
                        { value: 'Hình ảnh sản phẩm không rõ ràng', label: 'Hình ảnh sản phẩm không rõ ràng' },
                        { value: 'Bán Sản phẩm có hình ảnh hoặc nội dung phản cảm', label: 'Bán Sản phẩm có hình ảnh hoặc nội dung phản cảm' },
                        { value: 'Khác', label: 'Khác' }
                    ]}
                />
                <div>Mô tả tố cáo </div>
                <TextArea style={{ width: "100%", height: "100px", marginTop: "10px" }} value={content} onChange={(e) => setContent(e.target.value)}></TextArea>
            </Modal>
        </Container>
    );
};

export default ShopInfo;
