import React, { useState } from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
} from 'mdb-react-ui-kit';
import { message, Spin } from 'antd';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {BASE_URL} from "../../constant/constant"

function SigninAdmin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState({
        "code": "", // 1: cho phép submit, 0: chặn submit
        "message": ""
    })

    const loginAdmin = async () => {
        setLoading(true)
        const hash = btoa(`${username}:${password}`);
        try {
            const response = await axios.post(`${BASE_URL}/signinAdmin`, {},
                {
                    headers: {
                        Authorization: `Basic ${hash}`,
                    },
                })
            console.log(response);

            localStorage.setItem("admin", JSON.stringify(response.data));
            localStorage.setItem("isAdminAuthenticated", true);
            navigate("/admin")
        } catch (error) {
            console.log(error);
            message.error(error.response.data)
        }
        setLoading(false)
    }
    return (
        <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
            {loading === true ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <MDBRow style={{ margin: "auto" }}>
                    <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
                        <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: "#FF5C43" }}>
                            Trang dành riêng cho quản lý
                        </h1>
                    </MDBCol>

                    <MDBCol md='6' className='position-relative'>
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                        <MDBCard className='my-5 bg-glass'>
                            <MDBCardBody className='p-5'>
                                <MDBInput
                                    wrapperClass='mb-4'
                                    label='Tên đăng nhập'
                                    id='form3'
                                    type='text'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                    <MDBInput
                                        label='Mật khẩu'
                                        id='form4'
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ paddingRight: '2.5rem' }}
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '0px',
                                            top: '25%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                <Button variant="primary" style={{ color: "white" }} onClick={loginAdmin} className='w-100 mb-4' size='md'>Đăng nhập</Button>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            )}
        </MDBContainer>
    );
}

export default SigninAdmin;
