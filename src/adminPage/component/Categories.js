import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import axios from "axios"
import Footer from "../Footer"
import uploadImg from "../../function/uploadImg"
import { message, Spin } from "antd"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../constant/constant"

const MAX_TOTAL_SIZE_MB = 1
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024

const Categories = () => {
    const [category, setCategory] = useState()
    const [selectedFile, setSelectedFile] = useState()
    const [newImage, setNewImage] = useState('');
    const [newName, setNewName] = useState('')
    const [loading, setLoading] = useState(false)
    const token = JSON.parse(localStorage.getItem("admin"))?.token
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            // Chuyển hướng đến trang đăng nhập nếu không có token
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate])

    const fetchData = async () => {
        try {
            const categoryApi = await axios.get(`${BASE_URL}/category`)
            setCategory(categoryApi.data.filter(category => category.name !== "Khác"))
        } catch (error) {
            console.log(error);
        }
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file.size > MAX_TOTAL_SIZE_BYTES) {
            alert(`The total size of selected images exceeds ${MAX_TOTAL_SIZE_MB} MB.`);
            return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const addNewCategory = async () => {
        setLoading(true)
        const urlImage = await uploadImg(newImage)
        const dto = {
            name: newName,
            image: urlImage[0]
        }
        try {
            const response = await axios.post(`${BASE_URL}/category/add`, dto,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            console.log(response);
            message.success("Thêm mới thành công")
        } catch (error) {
            message.error("Đã xảy ra lỗi")
            console.log(error);
        }
        setNewName('')
        setNewImage('')
        setLoading(false)
    }

    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10} style={{ paddingRight: "30px" }}>
                        <Container style={{ background: "#FCFCFC" }}>
                            <div style={{ fontSize: "20px", padding: "20px", color: "#5f4632" }}>Tất cả danh mục</div>
                            <Row>
                                {category?.map(category => (
                                    <Col key={category.id} xs={1}>
                                        <img src={`${category.image}`} style={{ height: "100px", width: "100px" }} alt="..." />
                                        <div style={{ textAlign: "center" }}>{category.name}</div>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                        {loading === true ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Container style={{ background: "#FCFCFC", marginTop: "10px" }}>
                                <div style={{ fontSize: "20px", padding: "20px", color: "#5f4632" }}>Thêm danh mục mới</div>
                                <div style={{ marginBottom: "20px" }}>
                                    <span style={{ marginRight: "20px" }}>Nhập tên</span>
                                    <input type="text" name="name" onChange={(e) => setNewName(e.target.value)} />
                                </div>
                                <div style={{ marginBottom: "10px" }}>Chọn ảnh</div>
                                <img src={newImage} style={{ height: "150px", width: "auto", marginRight: "40px" }} />
                                <input type="file" name="image" onChange={handleFileChange} />
                                <div style={{ width: "300px", textAlign: "center", marginTop: "40px" }}>
                                    <button onClick={addNewCategory} style={{ border: "none", background: "#5f4632", color: "white", borderRadius: "5px", padding: "10px 20px" }}>Thêm mới</button>
                                </div>
                            </Container>
                        )}
                    </Col>
                </Row>
            </Container>
            <br />
            <Footer />
        </div>
    )
}
export default Categories