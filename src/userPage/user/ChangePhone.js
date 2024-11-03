import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import reloadUser from "../../function/reloadUser";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constant/constant";
const ChangePhone = () => {
    const [user, setUser] = useState(null);
    const [newPhone, setNewPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem("user"));
        if (!userLocal) {
            navigate('/signin')
        }
        setUser(userLocal);
    }, []);

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const changePhone = async () => {
        if (!validatePhone(newPhone)) {
            setError('Số điện thoại phải có đúng 10 chữ số');
            return;
        }

        const newUser = {
            ...user,
            phone: newPhone
        };
        try {
            const response = await axios.post(`${BASE_URL}/user/updatePhone`, newUser);
            setUser(reloadUser(user.id))
            message.success(response.data)
        } catch (error) {
            console.log(error);
            if (error.response) {
                message.error(error.response.data);
            } else {
                message.error("Có lỗi xảy ra!");
            }
        }
    };

    return (
        <Container style={{ background: "white", padding: "20px 20px", height: "100%" }}>
            <div style={{ borderBottom: "1px solid #F5F5F5", paddingBottom: "20px" }}>
                <div style={{ fontSize: "20px" }}>Thay đổi số điện thoại</div>
            </div>
            <div style={{ display: "flex", marginTop: "30px" }}>
                <div style={{ width: "15%", display: "flex", justifyContent: "center", alignItems: "center" }}>Số điện thoại mới</div>
                <input
                    style={{ width: "60%", padding: "7px" }}
                    type="text"
                    onChange={(e) => {
                        setNewPhone(e.target.value);
                        setError(''); // Clear error when input changes
                    }}
                />
            </div>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            <button
                onClick={changePhone}
                style={{ border: "none", background: "#F05D40", color: "white", padding: "8px 25px", margin: "25px 0 0 170px" }}
                disabled={!validatePhone(newPhone)} // Disable button if phone is not valid
            >
                Lưu
            </button>
        </Container>
    );
};

export default ChangePhone;
