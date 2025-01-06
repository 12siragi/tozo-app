import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: "#1A4D8A", padding: "10px" }}>
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

export default Header;
