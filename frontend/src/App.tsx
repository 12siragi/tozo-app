import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, Row, Col } from "antd";
import { UserAddOutlined, LoginOutlined, LockOutlined, AppstoreAddOutlined, CheckCircleOutlined, FileTextOutlined } from "@ant-design/icons";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import TaskList from "./components/TaskList";
import CreateTask from "./components/CreateTask";
import NotFoundPage from "./pages/NotFoundPage";

const { Header, Sider, Content } = Layout;

const routes: { path: string; element: React.ReactNode }[] = [
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/change-password", element: <ChangePasswordPage /> },
  { path: "/tasks", element: <TaskList /> },
  { path: "/create-task", element: <CreateTask /> },
  { path: "*", element: <NotFoundPage /> },
];

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Header */}
        <Header style={{ background: "#1A4D8A", padding: "0 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
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
        </Header>

        {/* Sidebar */}
        <Layout>
          <Sider width={250} className="site-layout-background" style={{ backgroundColor: "#ffffff", borderRight: "1px solid #ddd" }}>
            <Menu mode="inline" theme="light" style={{ height: "100%", borderRight: 0 }}>
              <Menu.Item key="1" icon={<UserAddOutlined />}>
                <Link to="/register">Register</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<LoginOutlined />}>
                <Link to="/login">Login</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<LockOutlined />}>
                <Link to="/change-password">Change Password</Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<AppstoreAddOutlined />}>
                <Link to="/tasks">Task List</Link>
              </Menu.Item>
              <Menu.Item key="5" icon={<AppstoreAddOutlined />}>
                <Link to="/create-task">Create Task</Link>
              </Menu.Item>
              {/* Static Menu Items */}
              <Menu.Item key="6" icon={<CheckCircleOutlined />}>
                Completed
              </Menu.Item>
              <Menu.Item key="7" icon={<FileTextOutlined />}>
                Task Detail
              </Menu.Item>
            </Menu>
          </Sider>

          {/* Main Content */}
          <Layout style={{ padding: "24px" }}>
            <Content style={{ padding: 24, margin: 0, minHeight: 280, backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
              <Routes>
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;