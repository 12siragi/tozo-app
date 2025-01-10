import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";

const HeaderComponent: React.FC = () => {
  return (
    <header
      style={{
        background: "#1A4D8A",
        padding: "0 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        height: "60px", // Increased height
        lineHeight: "80px", // Adjust line height to center text vertically
      }}
    >
      <Row justify="end">
        <Col>
          <Link to="/login" style={{ color: "#fff", marginLeft: 20 }}>
            Login
          </Link>
        </Col>
        <Col>
          <Link to="/register" style={{ color: "#fff", marginLeft: 20 }}>
            Register
          </Link>
        </Col>
      </Row>
    </header>
  );
};

export default HeaderComponent;
