import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./VerifyEmail.css"
import { useEffect, useState } from "react";
import Footer from "../Footer";
import { IoMdHome } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../constant/constant";

const VerifyEmail = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const location = useLocation()
    const [email, setEmail] = useState()
    const navigate = useNavigate()
    const [message, setMessage] = useState({ code: 0, message: "" })
    useEffect(() => {
        document.getElementById("otp-0").focus();
        console.log(location.state.email);
        setEmail(location.state.email)
    }, []);

    useEffect(() => {
        if (otp.every(value => value !== "")) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [otp]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value.slice(-1); // Take only the last character in case of multiple inputs

        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.removeAttribute("disabled");
            element.nextSibling.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pastedValue = (event.clipboardData || window.clipboardData).getData('text').slice(0, 6);
        const newOtp = Array(6).fill("");
        pastedValue.split("").forEach((value, index) => {
            newOtp[index] = value || "";
            if (value !== "") {
                document.getElementById(`otp-${index}`).removeAttribute("disabled");
            }
        });
        setOtp(newOtp);
    };

    const areAllElementsNumbers = (arr) => {
        return arr.every(element => !isNaN(element) && element !== null && element !== '');
    };

    const sendOTP = async () => {
        if (areAllElementsNumbers(otp)) {
            const otpString = otp.join('');
            try {
                const response = await axios.post(`${BASE_URL}/verifyEmail`,
                    null,
                    {
                        params: { email: email, otp: otpString }
                    })
                if (response.data === "Verify OTP success") {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Xác thực tài khoản thành công',
                        showConfirmButton: false,
                        html: '<p>Đang chuyển hướng đến trang đăng nhập...</p>',
                        timer: 1500,
                        height: "200px"
                    });
                    setTimeout(() => {
                        navigate('/signin'); // Redirect to the signin page after 2 seconds
                    }, 2000);
                } else if (response.data === "Verify OTP failed") {
                    setMessage({ code: 0, message: "Mã xác thực sai, vui lòng thử lại" })
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    const reSendOTP = async () => {
        try {
            const response = await axios.post("http://localhost:3000/sendOTP",
                null,
                {
                    params: { email: email }
                })
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <section className="container-fluid bg-body-tertiary d-block">
            <div className="row justify-content-center" style={{ padding: "100px", alignItems: "center", background: "#FAD4BD" }}>
                <div className="col-12 col-md-6 col-lg-4" style={{ minWidth: "500px" }}>
                    <div className="card bg-white mb-5 mt-5 border-0" style={{ boxShadow: "0 12px 15px rgba(0, 0, 0, 0.02)" }}>
                        <Link to={"/"} style={{ color: "black", marginLeft: "5px" }}><IoMdHome /></Link>
                        <div className="card-body p-5 text-center">
                            <h4>Xác thực email</h4>
                            <p>Mã otp đã được gửi đến tài khoản email của bạn</p>

                            <div className="otp-field mb-4" onPaste={handlePaste}>
                                {otp.map((data, index) => (
                                    <input
                                        className="otp-input"
                                        type="text"
                                        name="otp"
                                        maxLength="1"
                                        key={index}
                                        value={data}
                                        id={`otp-${index}`}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onFocus={(e) => e.target.select()}
                                    />
                                ))}
                            </div>
                            {message.code ? (
                                <div style={{ color: "#11E51F" }}>{message.message}</div>
                            ) : (
                                <div style={{ color: "red" }}>{message.message}</div>
                            )}
                            <button className="btn btn-primary mb-3" disabled={isButtonDisabled} onClick={sendOTP}>
                                Enter
                            </button>

                            <p className="resend text-muted mb-0">
                                Chưa nhận được mã ? <Link to={"#"} onClick={reSendOTP}>Nhấn để gửi lại</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
}
export default VerifyEmail
