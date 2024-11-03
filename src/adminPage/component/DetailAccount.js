import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiEdit2 } from "react-icons/fi";
import uploadImg from "../../function/uploadImg";
import { Spin } from "antd";
import axios from "axios"
import { message } from "antd"
import formatDate from "../../function/formatDate"
import Footer from "../Footer"
import { BASE_URL } from "../../constant/constant"

const MAX_TOTAL_SIZE_MB = 1;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;
const DetailAccount = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("admin")) || null);
    const [avatar, setAvatar] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem("admin"));
        setUser(userLocal);
        if (!userLocal) {
            navigate('/signin');
        }

        if (userLocal?.birthday) {
            const date = new Date(userLocal.birthday);
            setDay(date.getDate());
            setMonth(date.getMonth() + 1);
            setYear(date.getFullYear());
        } else {
            setDay('1');
            setMonth('1');
            setYear('2024');
        }

        if (userLocal?.avatar) {
            setAvatar(`${userLocal.avatar}`);
        }
    }, [navigate]);

    const days = [];
    for (let i = 1; i <= 31; i++) {
        days.push(<option key={i} value={i}>{i}</option>);
    }

    const months = [];
    for (let i = 1; i <= 12; i++) {
        months.push(<option key={i} value={i}>Tháng {i}</option>);
    }

    const years = [];
    for (let i = new Date().getFullYear(); i >= 1920; i--) {
        years.push(<option key={i} value={i}>Năm {i}</option>);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file.size > MAX_TOTAL_SIZE_BYTES) {
            alert(`The total size of selected images exceeds ${MAX_TOTAL_SIZE_MB} MB.`);
            return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        document.getElementById('avatarUpload').click();
    };

    const updateUser = async () => {
        setLoading(true);

        let urlImage = user.avatar;

        if (selectedFile) {
            urlImage = await uploadImg(selectedFile);
            urlImage = urlImage[0]; // Giả sử `uploadImg` trả về mảng chứa URL ảnh
        }

        const userUpdate = {
            ...user,
            birthday: `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`,
            avatar: urlImage,
        };

        try {
            const response = await axios.post(`${BASE_URL}/user/updateUser`, userUpdate);
            console.log(response.data);

            // Cập nhật lại localStorage với thông tin mới
            localStorage.setItem("user", JSON.stringify(userUpdate));

            // Cập nhật lại state user để giao diện hiển thị ngay lập tức thông tin mới
            setUser(userUpdate);

            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10} style={{ background: "#FCFCFC" }}>
                    <Container style={{ background: "white", padding: "20px 20px" }}>
            {loading === true ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <div>
                    <div style={{ borderBottom: "1px solid #F5F5F5", paddingBottom: "20px" }}>
                        <div style={{ fontSize: "20px" }}>Hồ sơ của tôi</div>
                        <div>Cập nhật thông tin để bảo mật tài khoản</div>
                    </div>
                    <Row>
                        <Col xs={8} className="row">
                            <table style={{ marginTop: "20px" }}>
                                <tbody>
                                    <tr>
                                        <td>Tên đăng nhập</td>
                                        <td><input type="text" style={{ width: "100%", padding: "12px", border: "#D8D8D8 solid 1px" }} readOnly value={user?.username || ''} /></td>
                                    </tr>
                                    <tr>
                                        <td>Tên</td>
                                        <td>
                                            <input
                                                type="text"
                                                style={{ width: "100%", padding: "12px", border: "#D8D8D8 solid 1px" }}
                                                value={user?.name || ''}
                                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td><input type="email" style={{ width: "100%", padding: "12px", border: "#D8D8D8 solid 1px" }} value={user?.email || ''} onChange={(e) => setUser({ ...user, email: e.target.value })} /></td>
                                    </tr>
                                    <tr>
                                        <td>Số điện thoại</td>
                                        <td><input type="email" style={{ width: "100%", padding: "12px", border: "#D8D8D8 solid 1px" }} value={user?.phone || ''} onChange={(e) => setUser({ ...user, phone: e.target.value })} /></td>
                                    </tr>
                                    <tr>
                                        <td>Ngày sinh</td>
                                        <td style={{ display: "flex", justifyContent: "space-between", padding: "7px" }}>
                                            <select style={{ width: "30%", padding: "12px" }} value={day} onChange={(e) => setDay(e.target.value)}>
                                                {days}
                                            </select>
                                            <select style={{ width: "30%", padding: "12px" }} value={month} onChange={(e) => setMonth(e.target.value)}>
                                                {months}
                                            </select>
                                            <select style={{ width: "30%", padding: "12px" }} value={year} onChange={(e) => setYear(e.target.value)}>
                                                {years}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Địa chỉ</td>
                                        <td><input type="email" style={{ width: "100%", padding: "12px", border: "#D8D8D8 solid 1px" }} value={user?.address || ''} onChange={(e) => setUser({ ...user, address: e.target.value })} /></td>
                                    </tr>
                                </tbody>
                            </table>
                            <button onClick={updateUser} style={{ width: "80px", height: "40px", border: "none", color: "white", background: "#F05D40", margin: "auto" }}>Lưu</button>
                        </Col>
                        <Col xs={4} style={{ textAlign: "center" }}>
                            <div style={{ borderRadius: "50%", overflow: "hidden", width: "150px", height: "150px", padding: "0", margin: "auto", marginTop: "10px" }}>
                                <img src={avatar || `${user?.avatar}`} alt="avatar" width={"100%"}
                                    style={{
                                        objectFit: "cover",
                                        height: "100%"
                                    }} />
                            </div>
                            <input
                                type="file"
                                style={{ display: "none" }}
                                id="avatarUpload"
                                onChange={handleFileChange}
                            />
                            <button onClick={handleButtonClick} type="button" style={{ background: "none", border: "solid 1px #E3E3E3", padding: "10px 20px", margin: "10px 0" }}>Chọn ảnh</button>
                            <div>Dung lượng file tối đa 1 MB</div>
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
                    </Col>
                </Row>
            </Container>
            <br /><br />
            <Footer />
        </div>
    );
}
export default DetailAccount