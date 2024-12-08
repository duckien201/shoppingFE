import { Col, Container, Row, Table } from "react-bootstrap";
import Header from "../Header";
import SideBar from "./SideBar";
import Footer from "../Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, message, Modal, Select, Pagination, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import formatDate from "../../function/formatDate";
import TextArea from "antd/es/input/TextArea";
import ReportProduct from "./reportProduct/ReportProduct";
import { ACCEPT_REPORT, BASE_URL, REJECT_REPORT } from "../../constant/constant";

const ReportAdmin = () => {
    const [reportAccount, setReportAccount] = useState([]);
    const [currentPageProcessing, setCurrentPageProcessing] = useState(1);
    const [currentPageProcessed, setCurrentPageProcessed] = useState(1);
    const [itemsPerPage] = useState(5);
    const [openLockAccount, setOpenLockAccount] = useState(false);
    const [openRejectReport, setOpenRejectReport] = useState(false);
    const [idAccountLock, setIdAccountLock] = useState();
    const [timeLockAccount, setTimeLockAccount] = useState(1);
    const [reasonReject, setReasonReject] = useState('');
    const [idReport, setIdReport] = useState();
    const token = JSON.parse(localStorage.getItem("admin"))?.token;
    const navigate = useNavigate();
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/allReportAccount`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReportAccount(response.data.reverse());
        } catch (error) {
            console.log(error);
        }
    };

    const handleStatusChange = (status) => {
        setSelectedStatuses(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        )
        setCurrentPageProcessed(1); // Reset to the first page when filtering
    };
    const filteredReports = reportAccount.filter(report =>
        report.status !== "Đang chờ xử lý" && (selectedStatuses.length === 0 || selectedStatuses.includes(report.status))
    );
    const acceptReport = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/admin/acceptReportAccount?idReportAccount=${idReport}&idUser=${idAccountLock}&timeLockAccount=${timeLockAccount}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            if (response.status === 200) {
                message.success(response.data);
            }
            fetchData();
        } catch (error) {
            console.log(error);
            message.error("Không thể khóa, đã có lỗi xảy ra");
        }
    };

    const handleOk = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/admin/rejectReportAccount?idReport=${idReport}&reasonReject=${reasonReject}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            if (response.status === 200) {
                message.success("Đã từ chối");
            }
            fetchData();
        } catch (error) {
            console.log(error);
            message.error("Đã xảy ra lỗi");
        }
        setOpenRejectReport(false);
    };

    const handleCancel = () => {
        setOpenRejectReport(false);
    };

    // Phân trang cho bảng "Tài khoản bị tố cáo"
    const indexOfLastProcessingNoti = currentPageProcessing * itemsPerPage;
    const indexOfFirstProcessingNoti = indexOfLastProcessingNoti - itemsPerPage;
    const currentProcessingReports = reportAccount.filter(report => report.status === "Đang chờ xử lý").slice(indexOfFirstProcessingNoti, indexOfLastProcessingNoti);

    // Phân trang cho bảng "Tố cáo đã xử lý"
    const indexOfLastProcessedNoti = currentPageProcessed * itemsPerPage;
    const indexOfFirstProcessedNoti = indexOfLastProcessedNoti - itemsPerPage;
    const currentProcessedReports = filteredReports.slice(indexOfFirstProcessedNoti, indexOfLastProcessedNoti);

    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10}>
                        <Container style={{ background: "#FCFCFC", padding: "12px", marginBottom: "15px" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#5f4632" }}>Tài khoản bị tố cáo</div>
                            <Table style={{ width: "100%" }} striped bordered hover>
                                <thead>
                                    <tr>
                                        <td style={{ width: "200px" }}>Tài khoản bị báo cáo</td>
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
                                            <td>
                                                <Row>
                                                    <Col xs={3}>
                                                        <button style={{ border: "none", background: "none" }}>
                                                            {report?.accused.avatar ? (
                                                                <Avatar src={report?.accused.avatar} style={{ height: "50px", width: "50px" }} onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)} />
                                                            ) : (
                                                                <Avatar style={{ height: "50px", width: "50px" }} onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)}>{report?.accused.username[0].toUpperCase()}</Avatar>
                                                            )}
                                                        </button>
                                                    </Col>
                                                    <Col xs={9} style={{ display: "flex", alignItems: "center" }}>
                                                        <button onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)} style={{ border: "none", background: "none" }}>
                                                            <div>{report?.accused.name}</div>
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
                                                        setOpenLockAccount(true);
                                                        setIdReport(report?.id);
                                                        setIdAccountLock(report?.accused.id);
                                                    }} style={{ border: "none", width: "100px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        Khóa tài khoản
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
                                    total={reportAccount.filter(report => report.status === "Đang chờ xử lý").length}
                                    onChange={page => setCurrentPageProcessing(page)}
                                />
                            </div>
                        </Container>
                        <Container style={{ background: "#FCFCFC", padding: "12px", marginBottom: "15px" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#5f4632" }}>Tố cáo đã xử lý</div>
                            <div>
                                <Checkbox
                                    name="checkbox"
                                    style={{ marginRight: "5px" }}
                                    id="accept"
                                    onChange={() => handleStatusChange(ACCEPT_REPORT)}
                                />
                                <label htmlFor="accept">Chấp nhận</label>
                                <Checkbox
                                    name="checkbox"
                                    style={{ marginRight: "5px", marginLeft: "50px" }}
                                    id="reject"
                                    onChange={() => handleStatusChange(REJECT_REPORT)}
                                />
                                <label htmlFor="reject">Từ chối</label>
                            </div>
                            <Table style={{ width: "100%" }} striped bordered hover>
                                <thead>
                                    <tr>
                                        <td style={{ width: "200px" }}>Tài khoản bị báo cáo</td>
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
                                            <td>
                                                <Row>
                                                    <Col xs={3}>
                                                        <button style={{ border: "none", background: "none" }}>
                                                            {report?.accused.avatar ? (
                                                                <Avatar src={report?.accused.avatar} style={{ height: "50px", width: "50px" }} onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)} />
                                                            ) : (
                                                                <Avatar style={{ height: "50px", width: "50px" }} onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)}>{report?.accused.username[0].toUpperCase()}</Avatar>
                                                            )}
                                                        </button>
                                                    </Col>
                                                    <Col xs={9} style={{ display: "flex", alignItems: "center" }}>
                                                        <button onClick={() => navigate(`/admin/detailAccount?idUser=${report?.accused.id}`)} style={{ border: "none", background: "none" }}>
                                                            <div>{report?.accused.name}</div>
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
                                    current={currentProcessedReports}
                                    pageSize={itemsPerPage}
                                    total={filteredReports.length}
                                    onChange={page => setCurrentPageProcessed(page)}
                                />
                            </div>
                        </Container>
                        <ReportProduct />
                    </Col>
                </Row>
            </Container>
            <Footer />
            <Modal
                title="Bạn muốn khóa tài khoản này?"
                open={openLockAccount}
                onOk={acceptReport}
                onCancel={() => setOpenLockAccount(false)}
            >
                <div>Thời gian:</div>
                <Select
                    defaultValue="1"
                    style={{ width: 120 }}
                    onChange={value => setTimeLockAccount(value)}
                    options={[
                        { value: '1', label: '1 ngày' },
                        { value: '3', label: '3 ngày' },
                        { value: '7', label: '7 ngày' },
                        { value: '30', label: '30 ngày' },
                        { value: '0', label: 'Vĩnh viễn' },
                    ]}
                />
            </Modal>
            <Modal
                title="Báo cáo này không được duyệt"
                open={openRejectReport}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>Lý do:</div>
                <TextArea style={{ width: "100%", height: "100px", marginTop: "10px" }} value={reasonReject} onChange={e => setReasonReject(e.target.value)} />
            </Modal>
        </div>
    );
};

export default ReportAdmin;
