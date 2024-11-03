import { Avatar, message, Pagination } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { CiLock, CiUnlock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import SideBar from "./SideBar";
import Footer from "../Footer";
import { BASE_URL } from "../../constant/constant";

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // State to manage filtered users
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6); // Number of users per page
    const [onlySellers, setOnlySellers] = useState(false); // State to manage checkbox value
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("admin"))?.token;

    useEffect(() => {
        if (!token) {
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate]);

    const fetchData = async () => {
        try {
            const userApi = await axios.get(`${BASE_URL}/users`);
            setUsers(userApi.data.filter(user => user.role === "USER"));
            setFilteredUsers(userApi.data.filter(user => user.role === "USER"));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        filterUsers();
    }, [onlySellers, users]);

    const filterUsers = () => {
        if (onlySellers) {
            setFilteredUsers(users.filter(user => user.pickupAddress));
        } else {
            setFilteredUsers(users);
        }
    };

    const changeStatusAccount = async (idUser) => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/changeStatusAccount?idUser=${idUser}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                message.success("Thành công");
            } else {
                message.error("Đã xảy ra lỗi");
            }
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const avatarStyle = {
        height: "50px",
        width: "50px"
    };

    // Calculate the index of the first and last users on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10}>
                        <Container style={{ background: "#FCFCFC" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#EE4D2D" }}>Quản lý tài khoản người dùng</div>
                            <div style={{ padding: "10px 20px" }}>
                                <input 
                                    type="checkbox" 
                                    id="onlySeller" 
                                    checked={onlySellers} 
                                    onChange={(e) => setOnlySellers(e.target.checked)} 
                                />
                                <label htmlFor="onlySeller">Chỉ hiện người bán</label>
                            </div>
                            <table style={{ width: "100%", textAlign: "center" }} className="table table-striped">
                                <thead>
                                    <tr>
                                        <td>#</td>
                                        <td>Tài khoản</td>
                                        <td>Tên đăng nhập</td>
                                        <td>Email</td>
                                        <td>Họ tên</td>
                                        <td>Vai trò</td>
                                        <td>Trạng thái tài khoản</td>
                                        <td>Thao tác</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers?.map((user, index) => (
                                        <tr key={user?.id} style={{ height: "70px", alignItems: "center" }} >
                                            <td>{indexOfFirstUser + index + 1}</td>
                                            <td>
                                                {user?.avatar ? (
                                                    <Avatar src={user?.avatar} style={avatarStyle} onClick={() => navigate(`/admin/detailAccount?idUser=${user?.id}`)} />
                                                ) : (
                                                    <Avatar style={avatarStyle} onClick={() => navigate(`/admin/detailAccount?idUser=${user?.id}`)}>{user?.username[0].toUpperCase()}</Avatar>
                                                )}
                                            </td>
                                            <td>{user?.username}</td>
                                            <td>{user?.email}</td>
                                            <td>{user?.name}</td>
                                            <td>Người mua {user?.pickupAddress ? <div>Người bán</div> : null}</td>
                                            <td>{user?.status ? (<span style={{ color: "green" }}>Bình thường</span>) : (<span style={{ color: "red" }}>Bị Khóa</span>)}</td>
                                            <td>{user?.status ?
                                                (<button onClick={() => changeStatusAccount(user?.id)} style={{ border: "none", background: "none" }}>
                                                    <CiLock />
                                                </button>) :
                                                (<button onClick={() => changeStatusAccount(user?.id)} style={{ border: "none", background: "none" }}>
                                                    <CiUnlock />
                                                </button>)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p" style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={usersPerPage}
                                    total={filteredUsers.length}
                                    onChange={paginate}
                                />
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default ListUser;
