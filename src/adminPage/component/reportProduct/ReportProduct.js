import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import formatDate from "../../../function/formatDate";
import { useNavigate } from "react-router-dom";
import { message, Modal, Pagination } from "antd";
import TextArea from "antd/es/input/TextArea";
import { BASE_URL, REJECT_REPORT } from "../../../constant/constant";

const ReportProduct = () => {
    const [reportProduct, setReportProduct] = useState([]);
    const [currentPageProcessing, setCurrentPageProcessing] = useState(1);
    const [currentPageProcessed, setCurrentPageProcessed] = useState(1);
    const [itemsPerPage] = useState(5);
    const [openRejectReport, setOpenRejectReport] = useState(false);
    const [reasonReject, setReasonReject] = useState('');
    const [idReport, setIdReport] = useState();
    const [openLockProduct, setOpenLockProduct] = useState(false);
    const [idLockProduct, setIdLockProduct] = useState();
    const token = JSON.parse(localStorage.getItem("admin"))?.token;
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/allReportProduct`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReportProduct(response.data.reverse());
        } catch (error) {
            console.log(error);
        }
    };

    const handleOk = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/admin/rejectReportProduct?idReport=${idReport}&reasonReject=${reasonReject}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            message.success("Đã từ chối");
            fetchData();
        } catch (error) {
            console.log(error);
            message.error("Đã xảy ra lỗi");
        }
        setOpenRejectReport(false);
    };

    const acceptReport = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/admin/acceptReportProduct?idReportProduct=${idLockProduct}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            message.success("Sản phẩm đã được khóa");
            fetchData();
        } catch (error) {
            console.log(error);
            message.error("Không thể khóa, đã có lỗi xảy ra");
        }
        setOpenLockProduct(false);
    };

    // Phân trang cho bảng "Sản phẩm bị tố cáo"
    const indexOfLastProcessingNoti = currentPageProcessing * itemsPerPage;
    const indexOfFirstProcessingNoti = indexOfLastProcessingNoti - itemsPerPage;
    const currentProcessingReports = reportProduct.filter(report => report.status === "Đang chờ xử lý").slice(indexOfFirstProcessingNoti, indexOfLastProcessingNoti);

    // Phân trang cho bảng "Tố cáo đã xử lý"
    const indexOfLastProcessedNoti = currentPageProcessed * itemsPerPage;
    const indexOfFirstProcessedNoti = indexOfLastProcessedNoti - itemsPerPage;
    const currentProcessedReports = reportProduct.filter(report => report.status !== "Đang chờ xử lý").slice(indexOfFirstProcessedNoti, indexOfLastProcessedNoti);

    return (
        <Container>
            <Container style={{ background: "#FCFCFC", padding: "12px", marginBottom: "15px" }}>
                <div style={{ fontSize: "20px", padding: "20px", color: "#5f4632" }}>Sản phẩm bị tố cáo</div>
                <Table style={{ width: "100%" }} striped bordered hover>
                    <thead>
                        <tr>
                            <td>Sản phẩm bị báo cáo</td>
                            <td>Tiêu đề</td>
                            <td>Nội dung</td>
                            <td>Ngày gửi</td>
                            <td style={{ textAlign: "center" }}>Xử lý</td>
                            <td>Người gửi</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProcessingReports.map(report => (
                            <tr key={report?.id} style={{ height: "100px" }}>
                                <td style={{ width: "470px" }}>
                                    <Row>
                                        <Col xs={2}>
                                            <button style={{ border: "none", background: "none" }} onClick={() => navigate(`/product/${report?.product.idProduct}`)}>
                                                <img src={report?.product.image[0]} alt="img product" style={{ width: "60px", height: "auto" }} />
                                            </button>
                                        </Col>
                                        <Col xs={10} style={{ display: "flex", alignItems: "center" }}>
                                            <button onClick={() => navigate(`/product/${report?.product.idProduct}`)} style={{ border: "none", background: "none", textAlign: "start" }}>
                                                <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>{report?.product.name}</div>
                                            </button>
                                        </Col>
                                    </Row>
                                </td>
                                <td>{report?.title}</td>
                                <td>{report?.content}</td>
                                <td>{formatDate(report?.dateSend)}</td>
                                <td>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button onClick={() => {
                                            setOpenLockProduct(true);
                                            setIdLockProduct(report?.product.idProduct);
                                        }} style={{ border: "1px solid black", borderRadius: "5px", width: "50px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            Khóa
                                        </button>
                                        <button onClick={() => {
                                            setIdReport(report?.id);
                                            setOpenRejectReport(true);
                                        }} style={{ border: "none", background: "none", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            Bỏ qua
                                        </button>
                                    </div>
                                </td>
                                <td>{report?.accuser.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="p" style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                    <Pagination
                        current={currentPageProcessing}
                        pageSize={itemsPerPage}
                        total={reportProduct.filter(report => report.status === "Đang chờ xử lý").length}
                        onChange={page => setCurrentPageProcessing(page)}
                    />
                </div>
                <Modal
                    title="Bạn muốn khóa sản phẩm này ?"
                    open={openLockProduct}
                    onOk={acceptReport}
                    onCancel={() => setOpenLockProduct(false)}
                >
                </Modal>
                <Modal
                    title="Báo cáo này không được duyệt"
                    open={openRejectReport}
                    onOk={handleOk}
                    onCancel={() => setOpenRejectReport(false)}
                >
                    <div>Lý do:</div>
                    <TextArea style={{ width: "100%", height: "100px", marginTop: "10px" }} value={reasonReject} onChange={e => setReasonReject(e.target.value)} />
                </Modal>
            </Container>
            <Container style={{ background: "#FCFCFC", padding: "12px", marginBottom: "15px" }}>
                <div style={{ fontSize: "20px", padding: "20px", color: "#5f4632" }}>Tố cáo đã xử lý</div>
                <Table style={{ width: "100%" }} striped bordered hover>
                    <thead>
                        <tr>
                            <td>Sản phẩm bị báo cáo</td>
                            <td>Tiêu đề</td>
                            <td>Nội dung</td>
                            <td>Ngày gửi</td>
                            <td>Trạng thái</td>
                            <td>Lý do</td>
                            <td>Người gửi</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProcessedReports.map(report => (
                            <tr key={report?.id} style={{ height: "100px" }}>
                                <td style={{ width: "470px" }}>
                                    <Row>
                                        <Col xs={2}>
                                            <button style={{ border: "none", background: "none" }} onClick={() => navigate(`/product/${report?.product.idProduct}`)}>
                                                <img src={report?.product.image[0]} alt="img product" style={{ width: "60px", height: "auto" }} />
                                            </button>
                                        </Col>
                                        <Col xs={10} style={{ display: "flex", alignItems: "center" }}>
                                            <button onClick={() => navigate(`/product/${report?.product.idProduct}`)} style={{ border: "none", background: "none", textAlign: "start" }}>
                                                <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>{report?.product.name}</div>
                                            </button>
                                        </Col>
                                    </Row>
                                </td>
                                <td>{report?.title}</td>
                                <td>{report?.content}</td>
                                <td>{formatDate(report?.dateSend)}</td>
                                <td>{report?.status === REJECT_REPORT ? (
                                    <div style={{ color: "red" }}>{report?.status}</div>
                                ) : (
                                    <div style={{ color: "green" }}>{report?.status}</div>
                                )}
                                </td>
                                <td>{report?.reasonReject}</td>
                                <td>{report?.accuser.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="p" style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                    <Pagination
                        current={currentPageProcessed}
                        pageSize={itemsPerPage}
                        total={reportProduct.filter(report => report.status !== "Đang chờ xử lý").length}
                        onChange={page => setCurrentPageProcessed(page)}
                    />
                </div>
            </Container>
        </Container>
    );
};

export default ReportProduct;
