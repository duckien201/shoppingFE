import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import reloadUser from "../../function/reloadUser";
import { BASE_URL } from "../../constant/constant";

const ChangeAddress = () => {
    const [user, setUser] = useState(null);
    const [street, setStreet] = useState('');
    const [ward, setWard] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem("user"));
        if (!userLocal) {
            navigate('/signin');
        } else {
            setUser(userLocal);
            if (userLocal.address) {
                const [street, ward, district, province] = userLocal.address.split(',').map(part => part.trim());
                setStreet(street);
                setWard(ward);
                setDistrict(district);
                setProvince(province);
            }
        }
    }, [navigate]);

    const submit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        if(ward===''||district===''||province===''){
            message.error("Nhập đầy đủ địa chỉ")
            return
        }
        const address = `${street},${ward},${district},${province}`;
        const updatedUser = { ...user, address: address };
        try {
            const response = await axios.post(`${BASE_URL}/user/updateUser`, updatedUser);
            if (response.status === 200) {
                setUser((prevUser) => ({ ...prevUser, address }));
                reloadUser(user.id)
                message.success("Địa chỉ đã được cập nhật thành công!");
            }
        } catch (error) {
            console.error("Error updating address:", error);
        }
    };

    return (
        <Container style={{ background: "white", padding: "20px" }}>
            <div style={{ borderBottom: "1px solid #F5F5F5", paddingBottom: "20px" }}>
                <div style={{ fontSize: "20px" }}>Đổi địa chỉ</div>
            </div>
            <Form style={{ marginTop: "20px" }} onSubmit={submit}>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="formWard">
                            <Form.Label>Phường, xã *</Form.Label>
                            <Form.Control
                                type="text"
                                value={ward}
                                onChange={(e) => setWard(e.target.value)}
                                placeholder="Nhập phường, xã" 
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formDistrict">
                            <Form.Label>Quận, huyện, thành phố *</Form.Label>
                            <Form.Control
                                type="text"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                placeholder="Nhập quận, huyện, thành phố"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formProvince">
                            <Form.Label>Tỉnh *</Form.Label>
                            <Form.Control
                                type="text"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                placeholder="Nhập tỉnh"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3" controlId="formStreet">
                    <Form.Label>Số nhà, đường, thôn, xóm</Form.Label>
                    <Form.Control
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Nhập số nhà, đường, thôn, xóm"
                    />
                </Form.Group>
                <Button variant="primary" type="submit" style={{ backgroundColor: "#EF5D40" }}>
                    Cập nhật địa chỉ
                </Button>
            </Form>
        </Container>
    );
};

export default ChangeAddress;
