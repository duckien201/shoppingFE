import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Spin, message } from "antd";
import uploadImg from "../../function/uploadImg";
import { BASE_URL } from "../../constant/constant";
import { useNavigate } from "react-router-dom";

const MAX_TOTAL_SIZE_MB = 5;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const [formData, setFormData] = useState({
        idShop: user?.id,
        image: [],
        name: '',
        material: '',
        description: '',
        price: '',
        remain: '',
        sale: '',
        categoryId: '1'
    });

    useEffect(() => {
        if (!token) {
            message.warning("Vui lòng đăng nhập lại.");
            navigate("/signin");
        } else {
            fetchCategories();
        }
    }, [token, navigate]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/category`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCategory(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length < 3) {
            alert('Please select at least 3 images.');
            return;
        }

        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        if (totalSize > MAX_TOTAL_SIZE_BYTES) {
            alert(`The total size of selected images exceeds ${MAX_TOTAL_SIZE_MB} MB.`);
            return;
        }

        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== files.length) {
            alert('Please select only image files.');
            return;
        }

        setImages(imageFiles);
        setPreview([]);

        imageFiles.map(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(prevPreviews => [...prevPreviews, reader.result]);
            };
            reader.readAsDataURL(file);
            return reader.result;
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const urlImage = await uploadImg(images);
        const dataToSubmit = { ...formData, image: urlImage };

        try {
            await axios.post(`${BASE_URL}/shop/addProduct`, dataToSubmit, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            message.success("Thêm sản phẩm mới thành công");
            setFormData({
                idShop: user.id,
                image: [],
                name: '',
                material: '',
                description: '',
                price: '',
                remain: '',
                sale: '',
                categoryId: '1'
            });
            setImages([]);
            setPreview([]);
        } catch (error) {
            message.success("Thêm sản phẩm mới thành công");
            console.error(error);
        }
        setLoading(false);
    };

    const labelStyle = {
        marginRight: "20px",
        width: "150px"
    };
    const inputStyle = {
        borderRadius: "3px"
    };
    const formInputStyle = {
        marginBottom: '15px'
    };

    return (
        <Container style={{ background: "white", padding: "20px 20px", borderRadius: "10px" }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <form onSubmit={submit} style={{ maxWidth: '1000px', margin: "auto" }}>
                    <div style={formInputStyle}>
                        <label htmlFor="imageInput" style={labelStyle}>Tải lên ít nhất 3 ảnh sản phẩm: </label>
                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                    </div>

                    {preview.length > 0 && (
                        <div style={{ marginBottom: '15px' }}>
                            {preview.map((imgSrc, index) => (
                                <img
                                    key={index}
                                    src={imgSrc}
                                    alt={`Preview ${index}`}
                                    style={{ maxWidth: '100px', height: 'auto', marginRight: '10px' }}
                                    multiple
                                />
                            ))}
                        </div>
                    )}

                    <div style={{ ...formInputStyle, display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="name" style={{ ...labelStyle, marginRight: '10px' }}>Tên sản phẩm: </label>
                        <textarea
                            id="name"
                            name="name"
                            value={formData.name}
                            style={inputStyle}
                            onChange={handleInputChange}
                            rows="2"
                            cols="105"
                        />
                    </div>
                    
                    <div style={{ display: "flex" }}>
                        <div style={{ ...formInputStyle, marginRight: "150px" }}>
                            <label htmlFor="cate" style={labelStyle}>Danh mục: </label>
                            <select
                                id="cate"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                style={inputStyle}
                            >
                                {category?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={formInputStyle}>
                            <label htmlFor="material" style={labelStyle}>Chất liệu: </label>
                            <input type="text" id="material" name="material" value={formData.material} style={inputStyle} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div style={formInputStyle}>
                        <label htmlFor="description" style={labelStyle}>Mô tả sản phẩm: </label>
                        <textarea
                            id="textareaInput"
                            name="description"
                            value={formData.description}
                            rows="5"
                            style={{ ...inputStyle, display: 'block', width: '100%', padding: '10px', margin: '5px 0' }}
                            onChange={handleInputChange}
                        />
                    </div>

                    <Row>
                        <Col xs={3}>
                            <label htmlFor="price" style={labelStyle}>Giá tiền: </label>
                            <input type="number" id="price" name="price" value={formData.price} style={inputStyle} onChange={handleInputChange} />
                        </Col>
                        <Col xs={4}>
                            <label htmlFor="remain" style={{ ...labelStyle, width: "170px" }}>Số sản phẩm hiện có: </label>
                            <input type="number" id="remain" name="remain" value={formData.remain} style={inputStyle} onChange={handleInputChange} />
                        </Col>
                        <Col xs={3}>
                            <label htmlFor="sale" style={labelStyle}>Giảm giá (%): </label>
                            <input type="number" name="sale" value={formData.sale} id="sale" style={inputStyle} onChange={handleInputChange} />
                        </Col>
                    </Row>

                    <button type="submit" style={{ marginTop: "20px", background: "#5f4632", border: "none", color: "white", padding: "13px 30px", borderRadius: "5px" }}>
                        Thêm sản phẩm
                    </button>
                </form>
            )}
        </Container>
    );
};

export default AddProduct;
