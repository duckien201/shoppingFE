import { message } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { BASE_URL, DEPOSIT, PAYMENT, RECEIVE, REFUND, TRANSFER, WITHDRAW } from "../../constant/constant"
import formatMoney from "../../function/formatMoney"
import formatDate from "../../function/formatDate"
import { SiTicktick } from "react-icons/si";

const DetailHistory = () => {
    const location = useLocation()
    const searchParam = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const code = searchParam.get('code')
    const [history, setHistory] = useState()
    const user = JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
        if (!user) {
            navigate("/signin")
        }
        fetchData(code)
    }, [])

    const fetchData = async (code) => {
        try {
            const response = await axios.get(`${BASE_URL}/wallet/getHistory?code=${code}`)
            if (response.data.user.id !== user.id) {
                navigate("/user/wallet")
            }
            setHistory(response.data)
        } catch (error) {
            console.log(error);
            navigate('/user/wallet')
        }
    }
    return (
        <Container style={{ backgroundColor: "white", display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <Container style={{ width: "600px", margin: "20px 0 30px 0", border: "2px solid #F5F5F5", borderRadius: "5px", padding: "20px" }}>
                <div iv style={{ display: "flex", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                    <div style={{ width: "4vw", height: "4vw", border: "2px solid #F5F5F5", display: "flex", alignContent: "center", textAlign: "center", borderRadius: "10px", padding: "5px" }}>
                        {history?.status === PAYMENT ? (
                            <img src="../images/icon/wallet.png" alt="error" />
                        ) : history?.status === WITHDRAW ? (
                            <img src="../images/icon/withdraw.png" alt="error" />
                        ) : history?.status === REFUND ? (
                            <img src="../images/icon/refund.png" alt="error" />
                        ) : (history?.status === DEPOSIT || history?.status === RECEIVE) ? (
                            <img src="../images/icon/deposit.png" alt="error" />
                        ) : history?.status === TRANSFER ? (
                            <img src="../images/icon/transfer.png" alt="error" />
                        )
                            : null}
                    </div>
                    <div style={{ marginLeft: "50px" }}>
                        <div style={{ fontSize: "20px", color: "#6F7479" }}>{history?.title}</div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            {(history?.status === PAYMENT || history?.status === WITHDRAW || history?.status === TRANSFER) ? (
                                <span style={{ fontSize: "20px", fontWeight: "bold" }}>- {formatMoney(history?.money)} đ</span>
                            ) : (history?.status === REFUND || history?.status === DEPOSIT || history?.status === RECEIVE) ? (
                                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#1AE271" }}>+ {formatMoney(history?.money)} đ</span>
                            )
                                : null}
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", marginTop: "50px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                    <div style={{ color: "#919498" }}>Trạng thái</div>
                    <div style={{ color: "green" }}><SiTicktick />Thành công</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px", marginTop: "20px" }}>
                    <div style={{ color: "#919498" }}>Thời gian</div>
                    <div>{formatDate(history?.date)}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px", marginTop: "20px" }}>
                    <div style={{ color: "#919498" }}>Phí giao dịch</div>
                    <div>Miễn phí</div>
                </div>
                <button style={{ fontWeight: "bold", color: "#1C6FDC", width: "100%", border: "none", background: "#C2DCFF", padding: "10px 0", borderRadius: "8px", marginTop: "13px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                    Liên hệ hỗ trợ
                </button>
                <h5 style={{ marginTop: "13px" }}>Thông tin thêm</h5>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px", marginTop: "20px" }}>
                    <div style={{ color: "#919498" }}>Mã giao dịch</div>
                    <div>{history?.code}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px", marginTop: "20px" }}>
                    <div style={{ color: "#919498" }}>Tên khách hàng</div>
                    <div>{history?.user.name}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px", marginTop: "20px" }}>
                    <div style={{ color: "#919498" }}>Số dư ví</div>
                    <div>{formatMoney(history?.newBalance)} đ</div>
                </div>
                <div style={{ color: "#EC082E", background: "#FCF1F2", marginTop: "13px", padding: "12px 0", textAlign: "center" }}>
                    Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
                </div>
            </Container>
        </Container>
    )
}
export default DetailHistory