import Footer from "../Footer";
import React, { useState } from 'react';
import { Spin } from "antd"

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
import { signin } from "../../redux/Slice/auth"
import { BASE_URL } from "../../constant/constant";

export default function Signin() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState({
        "username": "",
        "password": ""
    })
    const [error, setError] = useState({
        "code": "", // 1: cho phép submit, 0: chặn submit
        "message": ""
    })
    const { username, password } = account

    const onInputChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value })
    }

    const login = async (e) => {
        setLoading(true)
        e.preventDefault();
        const hash = btoa(`${account.username}:${account.password}`);

        try {
            const response = await axios.post(`${BASE_URL}/signin`, {},
                {
                    headers: {
                        Authorization: `Basic ${hash}`,
                    },
                })
            console.log(response);
            if (response.data === "Tên đăng nhập hoặc mật khẩu không đúng") {
                setError({ code: 1, message: "Tên đăng nhập hoặc mật khẩu không đúng" })
            } else if (response.data === "Xảy ra lỗi khi đăng nhập") {
                setError({ code: 1, message: "Xảy ra lỗi khi đăng nhập" })
            } else if (response.data === "Không thể đăng nhập, tài khoản đã bị khóa") {
                setError({ code: 1, message: "Không thể đăng nhập, tài khoản đã bị khóa" })
            } else {
                dispatch(signin(response.data))
                nav("/")
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }

    return (
        <Spin spinning={loading}>
            <div style={{ backgroundColor: "#FBFBFB", padding: "15px" }}>
                <Container>
                    <div style={{ display: "flex" }}>
                        <Link to="/"><img src="../images/logo6.png" alt="Logo" style={{ height: "70px" }} /></Link>
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

                        <Form onSubmit={login} className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

                            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Đăng nhập</h3>

                            <MDBInput name="username" value={username} onChange={onInputChange} wrapperClass='mb-4 mx-5 w-100' type='text' size="lg" placeholder="Tên đăng nhập" />
                            <MDBInput name="password" value={password} onChange={onInputChange} wrapperClass='mb-4 mx-5 w-100' type='password' size="lg" placeholder="Mật khẩu" />
                            {error.message && <p style={{ color: 'red', marginLeft: "50px" }}>{error.message}</p>}

                            <Button className="mb-4 px-5 mx-5 w-100" style={{ backgroundColor: '#5f4632', color: 'white' }} color='info' size='lg' type="submit"> {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Button>
                            <p className="small mb-5 pb-lg-3 ms-5"><a className="text-muted" href="forgetPassword">Quên mật khẩu</a></p>
                            <p className='ms-5'>Không có tài khoản? <Link to={"/signupS"} className="link-info">Đăng ký</Link></p>

                        </Form>

                    </MDBCol>

                    <MDBCol sm='7' className='d-none d-sm-block px-0'>
                        <img src="./images/backgroud1.png"
                            alt="Login " className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                    </MDBCol>

                </MDBRow>

            </MDBContainer>
            <br /><br />
            <Footer />
        </Spin>)
}