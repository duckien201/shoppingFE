import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { Avatar, Dropdown } from "antd";
import { useEffect, useState } from "react";
import { BASE_URL, UNREAD } from "../constant/constant";
import axios from "axios";

const Header = () => {
    const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")));
    const navigate = useNavigate();
    const [newNoti, setNewNoti] = useState([]);

    useEffect(() => {
        const adminLocal = JSON.parse(localStorage.getItem("admin"));
        setAdmin(adminLocal);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const notiApi = await axios.post(`${BASE_URL}/user/notification?idUser=${admin.id}`);
            setNewNoti(notiApi.data.filter(noti => noti.status === UNREAD));
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const items = [
        {
            label: "Tài khoản",
            key: "/admin/detailAccount",
        },
        {
            label: "Đăng xuất",
            key: "logout",
        },
    ];

    const handleDropdownItemClick = (e) => {
        if (e.key === "logout") {
            localStorage.removeItem("admin");
            localStorage.removeItem("isAdminAuthenticated");
            navigate("/admin/signin");
        } else {
            navigate(e.key);
        }
    };

    return (
        <div style={{ borderBottom: "3px solid #5f4632", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)", marginBottom: "5px" }}>
            <Container style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="col-sm-2" style={{ height: "130px", paddingTop: "20px" }}>
                    <Link to="/admin"><img src="../images/logo6.png" alt="Logo" style={{ width: "auto", height: "80%" }} /></Link>
                </div>
                <div style={{ height: "130px", display: "flex" }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button onClick={()=>navigate("/admin/notification")} style={{ position: 'relative', marginRight: "20px",border:"none",background:"none" }}>
                            <IoNotificationsOutline  style={{ border: "solid 1px #F5F5F5", fontSize: "30px", color: "#8E92BC", borderRadius: "50%", padding: "10px", height: "35%", width: "auto" }} />
                            {newNoti.length !== 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-2px',
                                    right: '1px',
                                    height: '15px',
                                    width: '15px',
                                    borderRadius: '50%',
                                    backgroundColor: 'red',
                                    display: 'block',
                                    content: '""'
                                }}></span>
                            )}
                        </button>
                        <Dropdown
                            menu={{ onClick: handleDropdownItemClick, items: items }}
                            arrow
                            placement="bottom"
                            style={{ marginTop: "20px" }}
                        >
                            {admin?.avatar ? (
                                <Avatar src={admin?.avatar} style={{ height: "45px", width: "auto" }}></Avatar>
                            ) : (
                                <Avatar>{admin?.username[0].toUpperCase()}</Avatar>
                            )}
                        </Dropdown>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Header;
