import React from "react";
import { Col, Container, Row } from "react-bootstrap"

const DescriptionProduct = ({ product }) => {
    const titleStyle = {
        marginLeft: "20px",
        padding: "10px",
        background: "#FAFAFA"
    }
    const contentStyle = {
        marginLeft: "30px",
        padding: "10px",
        background: "white",
    }
    const topicStyle = {
        color: "#999999",

    }
    const formatDescription = (description) => {
        return description?.split('\r\n').map((text, index) => (
            <React.Fragment key={index}>
                {text}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <Container style={{ background: "white", padding: "20px" }}>
            <div style={titleStyle}>
                <h6>CHI TIẾT SẢN PHẨM</h6>
            </div>
            <Row style={contentStyle}>
                <Col xs={2} style={topicStyle}>Danh Mục</Col>
                <Col>{product?.category.name}</Col>
            </Row>
            <Row style={contentStyle}>
                <Col xs={2} style={topicStyle}>Chất liệu</Col>
                <Col>{product?.material}</Col>
            </Row>
            <Row style={contentStyle}>
                <Col xs={2} style={topicStyle}>Đã bán</Col>
                <Col>{product?.numberOfSale}</Col>
            </Row>
            <Row style={contentStyle}>
                <Col xs={2} style={topicStyle}>Số sản phẩm còn lại</Col>
                <Col>{product?.remain}</Col>
            </Row>
            <br />
            <div style={titleStyle}>
                <h6>MÔ TẢ SẢN PHẨM</h6>
            </div>
            <div style={contentStyle}>
                {formatDescription(product?.description)}
            </div>
        </Container>
    )
}
export default DescriptionProduct