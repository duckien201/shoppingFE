import Footer from "../Footer";
import React, { useEffect, useState } from 'react';
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
import Swal from 'sweetalert2'
import { BASE_URL } from "../../constant/constant";


export default function SignupS() {
    const nav = useNavigate()
    const [account, setAccount] = useState({
        "phone": "",
        "username": "",
        "password": ""
    })
    const [allAccount, setAllAccount] = useState([])
    const [errorSDT, setErrorSDT] = useState({
        "code": "", // 1: cho phép submit, 0: chặn submit
        "message": ""
    })
    const [errorUSER, setErrorUSER] = useState({
        "code": "", // 1: cho phép submit, 0: chặn submit
        "message": ""
    })

    const { phone, username, password } = account
    const criteria = {
        hasUppercase: /[A-Z]/.test(password),
        hasDigit: /\d/.test(password),
        minLength: password.length >= 8
    };
    useEffect(() => {
        const getAllAccount = async () => {
            try {
                const accountApi = await axios.get(`${BASE_URL}/users`)
                setAllAccount(accountApi.data)
            } catch (error) {
                console.log(error);
            }
        }
        getAllAccount()
    }, [])

    const onInputChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value })
    }

    const checkPhone = (e) => {
        const phonePattern = /^[0-9]{10}$/
        if (phonePattern.test(phone) && !allAccount.find(account => account.phone === phone)) {
            setErrorSDT({ code: 1, message: "" })
        } else {
            setErrorSDT({ code: 0, message: 'Số điện thoại không đúng hoặc đã tồn tại' })
        }
    }
    const checkUsername = (e) => {
        if (!allAccount.find(account => account.username === username)) {
            setErrorUSER({ code: 1, message: "" })
        } else {
            setErrorUSER({ code: 0, message: 'Tên đăng nhập đã tồn tại' })
        }
    }
    const signup = async (e) => {
        e.preventDefault()
        if (errorSDT.code && errorUSER.code&&criteria.hasUppercase&&criteria.hasDigit&&criteria.minLength) {
            await axios.post(`${BASE_URL}/signup`, account)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Đăng ký thành công',
                showConfirmButton: false,
                html: '<p>Đang chuyển hướng về màn hình chính...</p>',
                timer: 1500,
                height: "200px"
            });
            setTimeout(() => {
                nav('/signin'); // Redirect to the signin page after 2 seconds
            }, 2000);
        }
    }
    return (
        <div>
            <div style={{ backgroundColor: "#FBFBFB", padding: "15px" }}>
                <Container>
                    <div style={{ display: "flex" }}>
                        <Link to="/"><img src="../images/logo5.png" alt="Logo" style={{ height: "70px" }} /></Link>
                        <h4 className="fw-normal mb-3 ps-5 " style={{ marginTop: "20px" }}>Trang đăng ký</h4>

                    </div>
                </Container>
            </div>
            <MDBContainer fluid>
                <MDBRow>

                    <MDBCol sm='5'>

                        <div className='d-flex flex-row ps-5 pt-5'>
                            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }} />

                        </div>

                        <Form className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4' onSubmit={signup}>

                            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Đăng ký bằng số điện thoại</h3>

                            <MDBInput wrapperClass='mb-4 mx-5 w-100' name="phone" value={phone} onChange={onInputChange} onBlur={checkPhone} type='text' size="lg" placeholder="Số điện thoại" required/>
                            {errorSDT.message && <p style={{ color: 'red', marginLeft: "50px" }}>{errorSDT.message}</p>}
                            <MDBInput wrapperClass='mb-4 mx-5 w-100' name="username" value={username} onChange={onInputChange} onBlur={checkUsername} type='text' size="lg" placeholder="Tên đăng nhập" required/>
                            {errorUSER.message && <p style={{ color: 'red', marginLeft: "50px" }}>{errorUSER.message}</p>}

                            <MDBInput wrapperClass='mb-4 mx-5 w-100' name="password" value={password} onChange={onInputChange} type='password' size="lg" placeholder="Mật khẩu" required />
                            <div style={{marginLeft:"40px"}}>
                                <p>
                                    <span style={{ color: criteria.hasUppercase ? 'green' : 'red' }}>
                                        {criteria.hasUppercase ? '✓' : '✗'} Mật khẩu chứa ít nhất 1 chữ viết hoa
                                    </span>
                                </p>
                                <p>
                                    <span style={{ color: criteria.hasDigit ? 'green' : 'red' }}>
                                        {criteria.hasDigit ? '✓' : '✗'} Mật khẩu chứa ít nhất 1 số
                                    </span>
                                </p>
                                <p>
                                    <span style={{ color: criteria.minLength ? 'green' : 'red' }}>
                                        {criteria.minLength ? '✓' : '✗'} Mật khẩu có ít nhất 8 ký tự
                                    </span>
                                </p>
                            </div>
                            <Button className="mb-4 px-5 mx-5 w-100" style={{ backgroundColor: '#FC5731', color: 'white' }} color='info' size='lg' type="submit">Đăng ký</Button>
                            <p className="small mb-5 pb-lg-3 ms-5"><Link className="text-muted" to="/signupE">Đăng ký với email</Link></p>
                            <p className='ms-5'>Đã có tài khoản? <Link to={"/signin"} className="link-info">Đăng nhập</Link></p>

                        </Form>

                    </MDBCol>

                    <MDBCol sm='7' className='d-none d-sm-block px-0'>
                        <img src="./images/backgroud1.png"
                            alt="Login" className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                    </MDBCol>

                </MDBRow>

            </MDBContainer>
            <br /><br />
            <Footer />
        </div>
    )
}