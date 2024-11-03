import React, { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import formatMoney from '../../function/formatMoney';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import reloadUser from '../../function/reloadUser';
import { BASE_URL } from '../../constant/constant';

const ResponseAfterDeposit = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);


    const vnp_Amount = searchParams.get('vnp_Amount');
    const [vnp_OrderInfo] = useState(searchParams.get('vnp_OrderInfo'));
    const [vnp_ResponseCode] = useState(searchParams.get('vnp_ResponseCode'));
    const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
    const vnp_PayDate = searchParams.get('vnp_PayDate');

    const paymentExecuted = useRef(false); // Track if paymentSuccess has been called

    useEffect(() => {
        if (vnp_ResponseCode === "00" && !paymentExecuted.current) {
            paymentSuccess(vnp_OrderInfo, vnp_ResponseCode);
            paymentExecuted.current = true; // Mark as executed
        }
    }, [vnp_ResponseCode, vnp_OrderInfo]);

    const paymentSuccess = async (vnp_OrderInfo, vnp_ResponseCode) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/payment/deposit-response-info?vnp_OrderInfo=${vnp_OrderInfo}&vnp_Amount=${vnp_Amount}&vnp_ResponseCode=${vnp_ResponseCode}`);
            console.log(response);
            const userLocal = JSON.parse(localStorage.getItem("user"))
            reloadUser(userLocal?.id)
        } catch (error) {
            console.log(error);
        }
    };
    function formatDateTime(dateTimeString) {
        // Extract parts of the string
        const year = dateTimeString.slice(0, 4);
        const month = dateTimeString.slice(4, 6);
        const day = dateTimeString.slice(6, 8);
        const hour = dateTimeString.slice(8, 10);
        const minute = dateTimeString.slice(10, 12);

        // Format the string
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to top, #265AA5, #4498D4)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3 style={{ color: "white" }}>Kết quả giao dịch</h3>
            </div>
            <Container
                style={{
                    width: "40%",
                    background: "white",
                    borderRadius: "10px",
                    padding: "40px 40px 30px 40px",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    {vnp_ResponseCode === "00" ? (
                        <IoIosCheckmarkCircle
                            style={{
                                color: "#63CD83",
                                fontSize: "70px",
                                border: "1px solid #EBF8F1",
                                borderRadius: "50%",
                                backgroundColor: "#EBF8F1",
                            }}
                        />
                    ) : (
                        <AiOutlineCloseCircle
                            style={{
                                color: "#E23E3E",
                                fontSize: "70px",
                                border: "1px solid #EBF8F1",
                                borderRadius: "50%",
                                backgroundColor: "#EBF8F1",
                            }}
                        />
                    )}
                    <div style={{ fontSize: "20px" }}>
                        {vnp_ResponseCode === "00" ? (
                            <div>Chuyển tiền thành công</div>
                        ) : (
                            <div>Thất bại</div>
                        )}
                    </div>
                    <div style={{ color: "#265AA5", fontSize: "28px", fontWeight: "bold" }}>
                        {formatMoney(vnp_Amount / 100)}đ
                    </div>
                    <div style={{ color: "#B3B4B6" }}>Mã giao dịch: {vnp_TransactionNo}</div>
                    <div
                        style={{
                            color: "#B3B4B6",
                            width: "100%",
                            textAlign: "center",
                            margin: "20px 0",
                        }}
                    >
                        {"-".repeat(80)}
                    </div>
                </div>
                <div
                    style={{
                        color: "#B3B4B6",
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "17px",
                        marginBottom: "10px"
                    }}
                >
                    <div>Thời gian giao dịch</div>
                    <div style={{ color: "black" }}>{formatDateTime(vnp_PayDate)}</div>
                </div>
                <div
                    style={{
                        color: "#B3B4B6",
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "17px"
                    }}
                >
                    <div>Thông tin giao dịch</div>
                    <div style={{ color: "black" }}>{vnp_OrderInfo.split(":")[0].trim()}</div>
                </div>
                <br /><br /><br /><br />
                <div style={{ height: "50px", textAlign: "center",display:"flex",justifyContent:"space-around" }}>
                    <button onClick={() => navigate("/")} style={{ border: "#265AA5", background: "#265AA5", color: "white", width: "230px", height: "100%", borderRadius: "20px" }}>
                        Về trang chủ
                    </button>
                    <button onClick={() => navigate("/user/wallet")} style={{ border: "black 1px solid", background: "white", width: "230px", height: "100%", borderRadius: "20px" }}>
                        Chuyển tới ví
                    </button>
                </div>
                <footer className="footer">
                    <p>&copy; VNPAY 2020</p>
                </footer>
            </Container>
        </div>
    );
};

export default ResponseAfterDeposit;
