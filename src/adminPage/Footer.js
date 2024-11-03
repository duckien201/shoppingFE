import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer style={{ backgroundColor: "#f8f9fa",padding:"30px 0" }}>
            <Container>
                <Row className="text-center">
                    <Col md={6}>
                        <h5>Company Name</h5>
                        <p>© {new Date().getFullYear()} All Rights Reserved</p>
                    </Col>
                    
                    <Col md={6}>
                        <h5>Follow Us</h5>
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FaFacebook size={25} color="#3b5998" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={25} color="#00acee" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin size={25} color="#0e76a8" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <FaGithub size={25} color="#171515" />
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
