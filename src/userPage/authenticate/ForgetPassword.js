import Footer from "../Footer";
import React, { useState } from 'react';
import { message, Spin } from "antd"
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
}
    from 'mdb-react-ui-kit';
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL, REGEX_EMAIL } from "../../constant/constant";

const ForgetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [resetPassword, setResetPassword] = useState({
        "username": "",
        "email": "",
        "otp": ""
    })
    const [error, setError] = useState({
        "code": "", // 1: cho phép submit, 0: chặn submit
        "message": ""
    })
    const { username, email, otp } = resetPassword

    const onInputChange = (e) => {
        setResetPassword({ ...resetPassword, [e.target.name]: e.target.value })
    }

    const isEmailValid = (email) => {
        return REGEX_EMAIL.test(email);
    };

    const reset = async (e) => {
        setLoading(true)
        e.preventDefault();
        if (username === '' || email === '' || otp === '') {
            message.error("Vui lòng điền đầy đủ theo mẫu")
            return
        }
        try {
            const response=await axios.post(`${BASE_URL}/resetPassword?username=${username}&email=${email}&otp=${otp}`)
            console.log(response);
            message.success("Thành công")
        } catch (error) {
            console.log(error);
            message.error("Thông tin bạn nhập sai, vui lòng thử lại")
        }
        setLoading(false)
    }

    const handleSendOTP = async () => {
        try {
            // Gửi yêu cầu gửi OTP tới email
            message.success("OTP đã được gửi tới email của bạn.");
            const response = await axios.post(`${BASE_URL}/sendOtpToReset?email=${email}`);
            console.log(response);
        } catch (error) {
            message.error("Tên đăng nhập hoặc email không đúng, vui lòng thử lại.");
            console.error(error);
        }
    };

    return (
        <Spin spinning={loading}>
            <div style={{ backgroundColor: "#FBFBFB", padding: "15px" }}>
                <Container>
                    <div style={{ display: "flex" }}>
                        <Link to="/"><img src="../images/logo2.png" alt="Logo" style={{ height: "70px" }} /></Link>
                        <h4 className="fw-normal mb-3 ps-5 " style={{ marginTop: "20px" }}>Trang đăng nhập</h4>

                    </div>
                </Container>
            </div>
            <MDBContainer fluid>
                <MDBRow>

                    <MDBCol sm='5'>

                        <div className='d-flex flex-row ps-5 pt-5'>
                            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }} />

                        </div>

                        <Form onSubmit={reset} className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

                            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Quên mật khẩu</h3>

                            <MDBInput name="username" value={username} onChange={onInputChange} wrapperClass='mb-4 mx-5 w-100' type='text' size="lg" placeholder="Tên đăng nhập" required />
                            <div className="d-flex mx-5 mb-4 w-100" style={{ display: "flex" }}>
                                <MDBInput
                                    name="email"
                                    value={email}
                                    onChange={onInputChange}
                                    wrapperClass='flex-grow-1' // Chiếm 80% chiều rộng

                                    type='email'
                                    size="lg"
                                    placeholder="Email"
                                    required
                                    style={{ marginRight: '10px', width: "90%" }} // Tạo khoảng cách giữa input và nút
                                />
                                <Button
                                    style={{ backgroundColor: 'white', color: 'black' }}
                                    onClick={handleSendOTP} // Hàm xử lý gửi OTP
                                    size="sm"
                                    disabled={!isEmailValid(email) || !email}
                                >
                                    Gửi OTP
                                </Button>
                            </div>
                            <MDBInput name="otp" value={otp} onChange={onInputChange} wrapperClass='mb-4 mx-5 w-100' type='text' size="lg" placeholder="Mã OTP" required />

                            {error.message && <p style={{ color: 'red', marginLeft: "50px" }}>{error.message}</p>}

                            <Button className="mb-4 px-5 mx-5 w-60" style={{ backgroundColor: '#FC5731', color: 'white' }} color='info' size='lg' type="submit"> {loading ? 'Đang gửi...' : 'Gửi'}</Button>
                            <p className="small mb-5 pb-lg-3 ms-5"><a className="text-muted" href="signin">Đăng nhập</a></p>
                            <p className='ms-5'>Không có tài khoản? <Link to={"/signupS"} className="link-info">Đăng ký</Link></p>

                        </Form>

                    </MDBCol>

                    <MDBCol sm='7' className='d-none d-sm-block px-0'>
                        <img src="./images/background.jpg"
                            alt="Login " className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                    </MDBCol>

                </MDBRow>

            </MDBContainer>
            <br /><br />
            <Footer />
        </Spin>
    )
}
export default ForgetPassword