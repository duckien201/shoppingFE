import { Button, Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import Footer from "../Footer"
import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL, READED, UNREAD } from "../../constant/constant"
import { useNavigate } from "react-router-dom"
import formatDate from "../../function/formatDate"
import { Pagination } from "antd"

const NotificationAdmin = () => {
    const [admin] = useState(JSON.parse(localStorage.getItem("admin")));
    const [noti, setNoti] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [notiPerPage] = useState(5); // Number of notifications per page
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const notiApi = await axios.post(`${BASE_URL}/user/notification?idUser=${admin?.id}`);
            setNoti(notiApi.data.reverse());
            console.log(notiApi.data);
        } catch (error) {
            console.log(error);
        }
    };

    const readAllNoti = async () => {
        const notiUnread = noti?.filter(noti => noti.status === UNREAD);
        const notiDto = [];
        notiUnread.forEach(noti => {
            notiDto.push({ id: noti?.id });
        });

        try {
            const response = await axios.post(`${BASE_URL}/readAllNoti`, notiDto);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        fetchData();
    };

    const clickNoti = async (idNoti, url) => {
        const notiDto = [];
        notiDto.push({ id: idNoti });
        try {
            const response = await axios.post(`${BASE_URL}/readAllNoti`, notiDto);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        fetchData();
        navigate(url);
    };

    // Calculate notifications to display
    const indexOfLastNoti = currentPage * notiPerPage;
    const indexOfFirstNoti = indexOfLastNoti - notiPerPage;
    const currentNoti = noti.slice(indexOfFirstNoti, indexOfLastNoti);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Move to the previous page
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Move to the next page
    const nextPage = () => {
        if (currentPage < Math.ceil(noti.length / notiPerPage)) setCurrentPage(currentPage + 1);
    };

    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={9} style={{ paddingRight: "30px" }}>
                        <Container style={{ background: "#FCFCFC" }}>
                            <div style={{ textAlign: "end", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                                <button onClick={() => readAllNoti()} style={{ border: "none", background: "none" }}>Đánh dấu đã đọc tất cả</button>
                            </div>
                            {currentNoti?.map(noti => (
                                <button onClick={() => clickNoti(noti?.id, noti?.url)} key={noti?.id} style={{ width: "100%", display: "flex", padding: "10px 0", border: "none", backgroundColor: noti?.status === READED ? "white" : "" }}>
                                    <div style={{ width: "100px", height: "100px", padding: "15px" }}>
                                        <img src={`${noti?.image}`} alt="error" style={{ width: "70px" }} />
                                    </div>
                                    <div style={{ textAlign: "start" }}>
                                        <div>{noti?.title}</div>
                                        <div style={{ color: "#917B7B" }}>{noti?.content}</div>
                                        <div style={{ color: "#917B7B" }}>{formatDate(noti?.date)}</div>
                                    </div>
                                </button>
                            ))}
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={notiPerPage}
                                    total={noti?.length}
                                    onChange={paginate}
                                />
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <br />
            <Footer />
        </div>
    )
}
export default NotificationAdmin