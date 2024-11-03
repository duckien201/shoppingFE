import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import Profile from "./Profile";
import PurchaseOrder from "./Purchaseorder";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import ChangePhone from "./ChangePhone";
import { IoIosPhonePortrait } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import ChangePassword from "./ChangePassword";
import { IoNotificationsOutline } from "react-icons/io5";
import Notification from "./Notification";
import DetailOrder from "../order/DetailOrder";
import { IoWalletOutline } from "react-icons/io5";
import Wallet from "./Wallet";
import ChangeAdress from "./ChangeAdress";
import { CiLocationOn } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import AddressForSeller from "./AddressForSeller";
import DetailHistory from "./DetailHistory";
import axios from "axios";
import { BASE_URL, UNREAD } from "../../constant/constant";

const User = ({ view }) => {
    const [user, setUser] = useState(null);
    const [section, setSection] = useState(view)
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate()
    const location = useLocation();
    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem("user"));
        setUser(userLocal);
    }, [user?.id]);

    useEffect(() => {
        if (location.pathname.includes("profile")) {
            setSection("profile");
        } else if (location.pathname.includes("wallet")) {
            setSection("wallet");
        } else if (location.pathname.includes("detailHistory")) {
            setSection("detailHistory");
        } else if (location.pathname.includes("purchaseOrder")) {
            setSection("purchaseOrder");
        } else if (location.pathname.includes("detailOrder")) {
            setSection("detailOrder");
        } else if (location.pathname.includes("phone")) {
            setSection("phone")
        } else if (location.pathname.includes("password")) {
            setSection("password")
        } else if (location.pathname.includes("address")) {
            setSection("address")
        } else if (location.pathname.includes("pickupAddress")) {
            setSection("pickupAddress")
        } else if (location.pathname.includes("notification")) {
            setSection("notification")
            fetchData()
        }
    }, [location.pathname]);

    const fetchData = async () => {
        try {
            const notiApi = await axios.post(`${BASE_URL}/user/notification?idUser=${JSON.parse(localStorage.getItem("user")).id}`);
            setNotifications(notiApi.data.reverse());
            setUnreadCount(notiApi.data.filter(noti => noti.status === UNREAD).length);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };
    const markAsReadAll = () => {
        setNotifications(prevNoti =>
            prevNoti.map(noti => ({ ...noti, status: 'READED' }))
        );
        setUnreadCount("0");
    };

    const markAsRead = (idNoti) => {
        setNotifications(prevNoti =>
            prevNoti.map(noti =>
                noti.id === idNoti ? { ...noti, status: 'READED' } : noti
            )
        );
        setUnreadCount(prevCount => prevCount - 1);
    };

    const navLeftStyle = {
        width: "100%",
        border: "none",
        textAlign: "start",
        display: "flex",
        alignItems: 'center',
        background: "none",
        padding: "5px 0"
    }

    const subNavLeft = {
        ...navLeftStyle,
        textAlign: "end"
    }

    const renderSection = () => {
        switch (section) {
            case "profile":
                return <Profile />;
            case "wallet":
                return <Wallet />;
            case "detailHistory":
                return <DetailHistory />;
            case "purchaseOrder":
                return <PurchaseOrder />;
            case "detailOrder":
                return <DetailOrder />
            case "phone":
                return <ChangePhone />
            case "password":
                return <ChangePassword />
            case "address":
                return <ChangeAdress />
            case "pickupAddress":
                return <AddressForSeller />
            case "notification":
                return <Notification notifications={notifications}
                    markAsRead={markAsRead}
                    markAsReadAll={markAsReadAll} />
            default:
                return <Profile />;
        }
    };



    return (
        <div style={{ background: "#F5F5F5" }}>
            <Header unreadCount={unreadCount} />
            <br />
            <Container >
                <Row>
                    <Col xs={2}>
                        <div style={{ display: "flex", marginBottom: "20px" }}>
                            <div style={{ borderRadius: "50%", overflow: "hidden", width: "80px", height: "80px", padding: "0" }}>
                                <img src={`${user?.avatar}`} alt="avatar" width={"100%"}
                                    style={{
                                        objectFit: "cover",
                                        height: "100%"
                                    }} />
                            </div>
                            <div>
                                <div style={{ paddingLeft: "6px" }}>{user?.name}</div>
                                <button style={{ fontSize: "12px", color: "#888888", border: "none" }}><FiEdit2 /> Sửa hồ sơ</button>
                            </div>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <td><FaUser /></td>
                                    <td><button onClick={() => {
                                        setSection("profile")
                                        navigate("/user/profile")
                                    }} style={navLeftStyle}> Tài khoản của tôi</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><IoIosPhonePortrait /></td>
                                    <td><button onClick={() => {
                                        setSection("phone")
                                        navigate("/user/phone")
                                    }} style={subNavLeft}>Số điện thoại</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><CiLocationOn /></td>
                                    <td><button onClick={() => {
                                        setSection("address")
                                        navigate("/user/address")
                                    }} style={subNavLeft}>Địa chỉ</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><FaLocationDot /></td>
                                    <td><button onClick={() => {
                                        setSection("pickupAddress")
                                        navigate("/user/pickupAddress")
                                    }} style={subNavLeft}>Địa chỉ lấy hàng</button>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: "solid 1px #D8D8D8" }}>
                                    <td><RiLockPasswordLine /></td>
                                    <td>
                                        <button onClick={() => {
                                            setSection("password")
                                            navigate("/user/password")
                                        }} style={subNavLeft}>Đổi mật khẩu</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><IoWalletOutline style={{ marginRight: "3px" }} /></td>
                                    <td>
                                        <button onClick={() => {
                                            setSection("wallet")
                                            navigate("/user/wallet")
                                        }} style={navLeftStyle}>Ví</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><MdContentPaste style={{ marginRight: "3px" }} /></td>
                                    <td>
                                        <button onClick={() => {
                                            setSection("purchaseOrder")
                                            navigate("/user/purchaseOrder")
                                        }} style={navLeftStyle}>Đơn mua</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><IoNotificationsOutline style={{ marginRight: "3px" }} /></td>
                                    <td>
                                        <button onClick={() => {
                                            setSection("notification")
                                            navigate("/user/notification")
                                        }} style={navLeftStyle}>Thông báo</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col xs={10} style={{ padding: "0" }}>
                        {renderSection()}
                    </Col>
                </Row>
            </Container>
            <br />
            <Footer />
        </div>
    )
}
export default User