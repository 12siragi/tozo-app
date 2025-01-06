import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { AppstoreAddOutlined, CheckCircleOutlined, FileTextOutlined, UserAddOutlined, LoginOutlined, LockOutlined } from "@ant-design/icons";

const Sidebar: React.FC = () => {
  return (
    <div style={{ width: 250, backgroundColor: "#ffffff", borderRight: "1px solid #ddd" }}>
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
    </div>
  );
};

export default Sidebar;
