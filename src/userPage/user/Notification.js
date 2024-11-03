import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import formatDate from "../../function/formatDate";
import { BASE_URL, READED, UNREAD } from "../../constant/constant";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";

const Notification = ({ notifications, markAsRead, markAsReadAll }) => {
    const [user] = useState(JSON.parse(localStorage.getItem("user")));
    const [noti, setNoti] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [notiPerPage] = useState(5); // Number of notifications per page
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/signin')
        } else {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const notiApi = await axios.post(`${BASE_URL}/user/notification?idUser=${user?.id}`);
            setNoti(notiApi.data.reverse());
        } catch (error) {
            console.log(error);
        }
    };

    const readAllNoti = async () => {
        const notiUnread = noti?.filter(noti => noti.status === UNREAD);
        const notiDto = notiUnread.map(noti => ({ id: noti?.id }));
        try {
            await axios.post(`${BASE_URL}/readAllNoti`, notiDto);
            markAsReadAll()
        } catch (error) {
            console.log(error);
        }
        fetchData();
    };

    const clickNoti = async (idNoti, url) => {
        const notiDto = [];
        notiDto.push({ id: idNoti });
        try {
            await axios.post(`${BASE_URL}/readAllNoti`, notiDto);
            markAsRead(idNoti);
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

    return (
        <Container style={{ background: "white", padding: "20px 20px" }}>
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
            <div className="p" style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                <Pagination
                    current={currentPage}
                    pageSize={notiPerPage}
                    total={noti.length}
                    onChange={paginate}
                />
            </div>
        </Container>
    );
};

export default Notification;