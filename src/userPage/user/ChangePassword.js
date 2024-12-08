import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { message } from "antd";
import reloadUser from "../../function/reloadUser";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constant/constant";
const ChangePassword = () => {
    const [user, setUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [error, setError] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem("user"));
        if (!userLocal) {
            navigate('/signin')
        }
        setUser(userLocal);
    }, []);

    const inputStyle = {
        padding: "10px",
        width: "100%",
        position: "relative" // Needed for positioning the eye icon
    };

    const validatePassword = (password) => {
        const criteria = {
            hasUppercase: /[A-Z]/.test(password),
            hasDigit: /\d/.test(password),
            minLength: password.length >= 8
        };

        if (!criteria.hasUppercase) {
            return 'Mật khẩu mới phải có ít nhất một chữ hoa.';
        }
        if (!criteria.hasDigit) {
            return 'Mật khẩu mới phải có ít nhất một chữ số.';
        }
        if (!criteria.minLength) {
            return 'Mật khẩu mới phải có ít nhất 8 ký tự.';
        }
        return '';
    };

    const handleChangePassword = async () => {
        setError('');

 if (!currentPassword || !newPassword || !confirmNewPass) {
            setError('Vui lòng điền đầy đủ tất cả các trường.');
            return;
        }

        const validationError = validatePassword(newPassword);
        if (validationError) {
            setError(validationError);
            return;
        }
        
        if (newPassword !== confirmNewPass) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        const changePass = []
        changePass.push(user.id)
        changePass.push(currentPassword)
        changePass.push(newPassword)
        changePass.push(confirmNewPass)

        try {
            const response = await axios.post(`${BASE_URL}/user/changePassword`, changePass)
            if (response.status === 200) {
                message.success(response.data)
                setUser(reloadUser(user.id))
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError("Đã xảy ra lỗi, vui lòng thử lại sau");
            }
        }
    };

    return (
        <Container style={{ background: "white", padding: "20px 20px" }}>
            <div style={{ borderBottom: "1px solid #F5F5F5", paddingBottom: "20px" }}>
                <div style={{ fontSize: "20px" }}>Đổi mật khẩu</div>
            </div>
            <table style={{ marginTop: "20px", width: "500px" }}>
                <tbody>
                    <tr>
                        <td style={{ width: "50%" }}>Mật khẩu hiện tại</td>
                        <td style={{ position: "relative" }}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                style={inputStyle}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none" }}
                            >
                                {showCurrentPassword ? "🙈" : "👁️"}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>Mật khẩu mới</td>
                        <td style={{ position: "relative" }}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                style={inputStyle}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none" }}
                            >
                                {showNewPassword ? "🙈" : "👁️"}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>Nhập lại mật khẩu mới</td>
                        <td style={{ position: "relative" }}>
                            <input
                                type={showConfirmNewPass ? "text" : "password"}
                                style={inputStyle}
                                value={confirmNewPass}
                                onChange={(e) => setConfirmNewPass(e.target.value)}
                            />
                            <button
                                onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}
                                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none" }}
                            >
                                {showConfirmNewPass ? "🙈" : "👁️"}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            <button
                onClick={handleChangePassword}
                style={{ border: "none", background: "#5f4632", color: "white", padding: "8px 25px", margin: "25px 0 0 170px" }}
            >
                Lưu
            </button>
        </Container>
    );
};

export default ChangePassword;
