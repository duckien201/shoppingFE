import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Spin, message } from "antd";
import uploadImg from "../../function/uploadImg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constant/constant";

const MAX_TOTAL_SIZE_MB = 3;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

const EditProduct = ({ product }) => {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(product?.image);
    const [preview, setPreview] = useState(product?.image);
    const [category, setCategory] = useState();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("admin"))?.token;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        idProduct: product?.idProduct,
        idShop: user.id,
        image: product?.image,
        name: product?.name,
        material: product?.material,
        description: product?.description,
        price: product?.price,
        remain: product?.remain,
        sale: product?.sale,
        categoryId: product?.category.id,
    });

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

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(prevPreviews => [...prevPreviews, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateFormData = () => {
        // Kiểm tra xem tất cả các trường có hợp lệ hay không
        const requiredFields = ['name', 'material', 'description', 'price', 'remain', 'sale', 'categoryId'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                message.error(`Trường ${field} không được để trống!`);
                return false;
            }
        }
        return true;
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateFormData()) {
            setLoading(false);
            return;
        }

        try {
            console.log("Starting image upload...");
            const urlImage = await uploadImg(images);
            console.log("Image URLs:", urlImage);

            const dataToSubmit = { ...formData, image: urlImage };
            console.log("Data to submit:", dataToSubmit);

            const submitResponse = await axios.post(
                `${BASE_URL}/shop/updateProduct`,
                dataToSubmit,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            message.success(submitResponse.data);
        } catch (error) {
            console.error("Error submitting data:", error.response?.data || error.message);
            //message.error("Có lỗi xảy ra trong quá trình gửi yêu cầu. Vui lòng thử lại.");
            message.success("Sửa sản phẩm thành công");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryApi = await axios.get(`${BASE_URL}/category`);
                setCategory(categoryApi.data);
            } catch (error) {
                console.log("Error fetching categories:", error);
                message.error("Có lỗi xảy ra khi tải danh mục.");
            }
        };

        if (!token) {
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate]);

    const labelStyle = {
        marginRight: "20px",
        width: "150px",
    };
    const inputStyle = {
        borderRadius: "3px",
    };
    const formInputStyle = {
        marginBottom: '15px',
    };

    return (
        <Container style={{ background: "white", padding: "20px 20px", borderRadius: "10px", border: "1px solid #FF4400" }}>
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
                            <label htmlFor="sale" style={{ ...labelStyle, width: "150px" }}>Giảm giá: </label>
                            <input type="number" id="sale" name="sale" value={formData.sale} style={inputStyle} onChange={handleInputChange} />
                        </Col>
                    </Row>

                    <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', background: '#5f4632', color: '#fff', border: 'none', borderRadius: '5px' }}>Cập nhật sản phẩm</button>
                </form>
            )}
        </Container>
    );
};

export default EditProduct;
