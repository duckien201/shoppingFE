import { useEffect, useState } from "react";
import { Container, Form, InputGroup } from "react-bootstrap"
import axios from "axios";
import { BASE_URL, DEPOSIT, PAYMENT, RECEIVE, REFUND, TRANSFER, WITHDRAW } from "../../constant/constant";
import formatDate from "../../function/formatDate";
import formatMoney from "../../function/formatMoney";
import { Alert, Button, message, Modal, Pagination, Steps } from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

const Wallet = () => {
    const [user, setUser] = useState();
    const [history, setHistory] = useState()
    const [openDeposit, setOpenDeposit] = useState(false)
    const [openWithdraw, setOpenWithdraw] = useState(false)
    const [openTransfer, setOpenTransfer] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phoneReceive, setPhoneReceive] = useState('')
    const [userReceive, setUserReceive] = useState()
    const [money, setMoney] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [alert, setAlert] = useState({ message: "", type: "" });
    const navigate = useNavigate()
    const [searchCode, setSearchCode] = useState('')

    const formatMoneyInput = (value) => {
        const stringValue = value?.toString() || "";
        const cleanedValue = stringValue.replace(/\D/g, "");
        return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    const removeLastNonDigitChar = (str) => {
        let stringValue = str?.toString() || "";

        // Loại bỏ ký tự không phải số cuối cùng
        while (stringValue && isNaN(stringValue.slice(-1))) {
            stringValue = stringValue.slice(0, -1);
        }

        // Loại bỏ số 0 ở đầu chuỗi nếu có
        while (stringValue && stringValue.charAt(0) === "0" && stringValue.length > 1) {
            stringValue = stringValue.slice(1);
        }

        return stringValue;
    };

    const steps = [
        {
            title: '',
            content: (
                <div>
                    <div>Số điện thoại tài khoản nhận tiền: </div>
                    <InputGroup size="lg">
                        <Form.Control
                            aria-label="Large"
                            aria-describedby="inputGroup-sizing-sm"
                            type="text"
                            maxLength={10}
                            required
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                if (value.length <= 10) {
                                    getUserReceive(value);
                                    setPhoneReceive(value);
                                }
                            }}
                            value={phoneReceive}
                        />
                    </InputGroup>
                    {userReceive ? (
                        <Container style={{ border: "1px solid #F5F5F5", display: "flex", marginTop: "10px", borderRadius: "5px", padding: "10px" }}>
                            <div style={{ borderRadius: "50%", overflow: "hidden", width: "80px", height: "80px", padding: "0" }}>
                                <img src={`${userReceive?.avatar}`} alt="avatar" width={"100%"}
                                    style={{
                                        objectFit: "cover",
                                        height: "100%"
                                    }} />
                            </div>
                            <div style={{ marginLeft: "30px", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                                <div style={{ fontSize: "20px" }}>
                                    {userReceive?.name}
                                </div>
                                <div>
                                    tên đăng nhập: <span style={{ marginLeft: "10px", fontSize: "18px" }}>{userReceive?.username}</span>
                                </div>
                            </div>
                        </Container>
                    ) : null}
                </div>
            ),
        },
        {
            title: '',
            content: (
                <div>
                    <div>Nhập số tiền bạn muốn chuyển: </div>
                    <InputGroup size="lg">
                        <Form.Control
                            aria-label="Large"
                            aria-describedby="inputGroup-sizing-sm"
                            type="text"
                            required
                            onChange={(e) => {
                                let rawValue = e.target.value.replace(/\./g, "");
                                if (parseInt(rawValue, 10) > parseInt(user?.wallet)) {
                                    rawValue = user?.wallet;
                                }
                                setMoney(removeLastNonDigitChar(rawValue));
                                e.target.value = formatMoneyInput(rawValue);

                            }}
                            value={formatMoneyInput(money)}
                        />
                    </InputGroup>
                    {/* <div style={{height:"110px"}}></div> */}
                    {userReceive ? (
                        <Container style={{ border: "1px solid #F5F5F5", display: "flex", marginTop: "10px", borderRadius: "5px", padding: "10px" }}>
                            <div style={{ borderRadius: "50%", overflow: "hidden", width: "80px", height: "80px", padding: "0" }}>
                                <img src={`${userReceive?.avatar}`} alt="avatar" width={"100%"}
                                    style={{
                                        objectFit: "cover",
                                        height: "100%"
                                    }} />
                            </div>
                            <div style={{ marginLeft: "30px", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                                <div style={{ fontSize: "20px" }}>
                                    {userReceive?.name}
                                </div>
                                <div>
                                    tên đăng nhập: <span style={{ marginLeft: "10px", fontSize: "18px" }}>{userReceive?.username}</span>
                                </div>
                            </div>
                        </Container>
                    ) : null}
                </div>
            ),
        },
        {
            title: '',
            content: (
                <div>
                    <div>Nhập mật khẩu tài khoản: </div>
                    <InputGroup size="lg">
                        <Form.Control
                            aria-label="Large"
                            aria-describedby="inputGroup-sizing-sm"
                            value={confirmPassword} type="password" required onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                console.log(e.target.value);

                            }}
                        />
                    </InputGroup>
                    {/* <div style={{height:"110px"}}></div> */}
                    {userReceive ? (
                        <Container style={{ border: "1px solid #F5F5F5", display: "flex", marginTop: "10px", borderRadius: "5px", padding: "10px" }}>
                            <div style={{ borderRadius: "50%", overflow: "hidden", width: "80px", height: "80px", padding: "0" }}>
                                <img src={`${userReceive?.avatar}`} alt="avatar" width={"100%"}
                                    style={{
                                        objectFit: "cover",
                                        height: "100%"
                                    }} />
                            </div>
                            <div style={{ marginLeft: "30px", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                                <div style={{ fontSize: "20px" }}>
                                    {userReceive?.name}
                                </div>
                                <div>
                                    tên đăng nhập: <span style={{ marginLeft: "10px", fontSize: "18px" }}>{userReceive?.username}</span>
                                </div>
                            </div>
                        </Container>
                    ) : null}
                </div>
            ),
        },
    ];

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem("user"))
        if (!userLocal) {
            navigate('/signin')
        }
        fetchData(userLocal?.id)
    }, []);

    const fetchData = async (userId) => {
        try {
            const historyApi = await axios.get(`${BASE_URL}/wallet?idUser=${userId}`)
            setHistory(historyApi.data.reverse())

            const userApi = await axios.post(`${BASE_URL}/reloadUser?idUser=${userId}`)
            setUser(userApi.data)
        } catch (error) {
            console.log(error)
        }
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = history?.slice(indexOfFirstItem, indexOfLastItem);

    const deposit = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/payment/deposit?money=${money}&idUser=${user?.id}`)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tạo yêu cầu thành công',
                showConfirmButton: false,
                html: '<p>Đang chuyển hướng đến trang thanh toán...</p>',
                timer: 1500,
            });
            setTimeout(() => {
                window.location.assign(response.data.url); // đến trang thanh toán
            }, 2000);
        } catch (error) {
            console.log(error);

        }
    }
    const withdraw = () => {

    }

    const transfer = async () => {
        const transferDto = {
            idUser: user?.id,
            money: money,
            password: confirmPassword,
            phoneReceiveMoney: phoneReceive
        }
        console.log(transferDto)
        try {
            const response = await axios.post(`${BASE_URL}/wallet/transfer`, transferDto)
            if (response.status === 200) {
                fetchData(user?.id)
                setOpenTransfer(false)
                message.success("Gửi thành công")
            } else {
                setOpenTransfer(false)
            }
            setMoney('')
            setConfirmPassword('')
            setPhoneReceive('')
            setUserReceive('')
        } catch (error) {
            console.log(error)
            message.error(error.response.data)
        }
    }

    const getUserReceive = async (phone) => {
        try {
            const response = await axios.get(`${BASE_URL}/user/getUserByPhone?phone=${phone}`)
            if (response.data) {
                setUserReceive(response.data)
            } else {
                setUserReceive()
            }
        } catch (error) {
            console.log(error);
        }
    }
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <Container style={{ background: "white", padding: "20px 20px", height: "100%" }}>
            {alert.message && (
                <Alert message={alert.message} type={alert.type} />
            )}
            <div style={{ borderBottom: "1px solid #F5F5F5", paddingBottom: "20px" }}>
                <div style={{ fontSize: "20px" }}>Số dư ví: <span style={{ fontSize: "25px", marginLeft: "30px", color: "#FC5731" }}>{formatMoney(user?.wallet)} đ</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "15px 0 20px 0", borderBottom: "1px solid #F5F5F5" }}>
                <button onClick={() => setOpenDeposit(true)} style={{ border: "none", background: "none", width: "15%" }}>
                    <img style={{ width: "4vw", height: "4vw" }} src="../images/icon/deposit.png" alt="error" />
                    <div>Nạp tiền</div>
                </button>
                <button onClick={() => setOpenWithdraw(true)} style={{ border: "none", background: "none", width: "15%" }}>
                    <img style={{ width: "4vw", height: "4vw" }} src="../images/icon/withdraw.png" alt="error" />
                    <div>Rút tiền</div>
                </button>
                <button onClick={() => setOpenTransfer(true)} style={{ border: "none", background: "none", width: "10%" }}>
                    <img style={{ width: "4vw", height: "4vw" }} src="../images/icon/transfer.png" alt="error" />
                    <div>Chuyển tiền</div>
                </button>
                <button style={{ border: "none", background: "none", width: "15%" }}>
                    <img style={{ width: "4vw", height: "4vw" }} src="../images/icon/qr.png" alt="error" />
                    <div>QR Nhận tiền</div>
                </button>
                <button style={{ border: "none", background: "none", width: "15%" }}>
                    <img style={{ width: "4vw", height: "4vw" }} src="../images/icon/credit-card.png" alt="error" />
                    <div>Liên kết ngân hàng</div>
                </button>
            </div>
            <div style={{ borderBottom: "1px solid #F5F5F5", paddingBottom: "20px" }}>
                <div style={{ fontSize: "20px" }}>Lịch sử giao dịch</div>
            </div>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">
                            <Button type="submit"><CiSearch /></Button>
                        </InputGroup.Text>
                        <Form.Control onChange={(e) => setSearchCode(e.target.value)} type="text" placeholder="Tìm kiếm bằng mã giao dịch" />
                    </InputGroup>
                </Form.Group>
            </Form>
            {currentItems
                ?.filter(history => searchCode === "" ? history : history.code === searchCode)
                ?.map(history => (
                    <div onClick={() => { navigate(`/user/detailHistory?code=${history?.code}`) }} key={history?.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F5F5F5", padding: "10px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "21%" }}>
                            <div style={{ width: "3vw", height: "3vw", border: "2px solid #F5F5F5", display: "flex", alignContent: "center", textAlign: "center", borderRadius: "10px", padding: "5px" }}>
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
                            <div>
                                <div style={{ fontSize: "17px" }}>{history?.title}</div>
                                <div style={{ fontSize: "15px", color: "#AFA7AC" }}>Số dư cuối: <span style={{ color: "#1D1D97", fontWeight: "bold", width: "90px", display: "inline-block" }}>{formatMoney(history?.newBalance)} đ</span></div>
                                <div style={{ fontSize: "15px", color: "#AFA7AC" }}>{formatDate(history?.date)}</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                            {(history?.status === PAYMENT || history?.status === WITHDRAW || history?.status === TRANSFER) ? (
                                <span style={{ fontSize: "17px", fontWeight: "bold" }}>- {formatMoney(history?.money)} đ</span>
                            ) : (history?.status === REFUND || history?.status === DEPOSIT || history?.status === RECEIVE) ? (
                                <span style={{ fontSize: "17px", fontWeight: "bold", color: "#1AE271" }}>+ {formatMoney(history?.money)} đ</span>
                            )
                                : null}
                        </div>
                    </div>
                ))}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={history?.length}
                    onChange={paginate}
                />
            </div>
            <Modal
                title="Bạn đang tạo yêu cầu nạp tiền vào ví"
                open={openDeposit}
                onOk={deposit}
                onCancel={() => setOpenDeposit(false)}
            >
                <div>Nhập số tiền bạn muốn nạp: </div>
                <input type="text" required onChange={(e) => {
                    const rawValue = e.target.value.replace(/\./g, "");
                    setMoney(rawValue);
                    e.target.value = formatMoneyInput(e.target.value);
                }} />
            </Modal>
            <Modal
                title="Bạn đang tạo yêu cầu rút tiền từ ví"
                open={openWithdraw}
                onOk={withdraw}
                onCancel={() => setOpenWithdraw(false)}
            >
                <div>Nhập mật khẩu tài khoản: </div>
                <input type="password" required onChange={(e) => setConfirmPassword(e.target.value)} />
                <div>Nhập số tiền bạn muốn rút: </div>
                <input type="text" required onChange={(e) => {
                    const rawValue = e.target.value.replace(/\./g, "");
                    setMoney(rawValue);
                    e.target.value = formatMoneyInput(e.target.value);
                }} />
            </Modal>
            <Modal
                title="Bạn đang tạo yêu cầu chuyển tiền tới ví khác"
                open={openTransfer}
                // onOk={transfer}
                onCancel={() => setOpenTransfer(false)}
                footer={null}
            >
                <Steps current={current} items={items} />
                <div >{steps[current].content}</div>
                <div style={{ marginTop: "24px" }}>
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}
                            disabled={
                                (current === 0 && !userReceive) || (current === 1 && money === '')
                            }>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={transfer} disabled={!confirmPassword}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                </div>
            </Modal>
        </Container >
    )
}
export default Wallet