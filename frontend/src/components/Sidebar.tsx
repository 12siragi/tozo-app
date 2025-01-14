import React, { useState } from "react";
import { Menu, Drawer, Button, Tooltip, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuOutlined,
  UserAddOutlined,
  LoginOutlined,
  LockOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  UnlockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const SidebarComponent: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false); // State to manage Drawer visibility
  const currentRoute = window.location.pathname; // Highlight the active menu item
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Logout function
  const handleLogout = () => {
    // Clear authentication tokens or session data
    localStorage.removeItem("authToken"); // Example of clearing a token from localStorage
    message.success("You have been logged out successfully."); // Display feedback message
    navigate("/login"); // Redirect to login page
  };

  const menuItems = [
    { key: "/register", icon: <UserAddOutlined />, label: "Register" },
    { key: "/login", icon: <LoginOutlined />, label: "Login" },
    { key: "/change-password", icon: <LockOutlined />, label: "Change Password" },
    { key: "/tasks", icon: <AppstoreAddOutlined />, label: "Task List" },
    { key: "/create-task", icon: <AppstoreAddOutlined />, label: "Create Task" },
    { key: "/completed", icon: <CheckCircleOutlined />, label: "Completed" },
    { key: "/archived-tasks", icon: <FileTextOutlined />, label: "Archived Task" }, // Updated label and route
    { key: "/password-reset", icon: <UnlockOutlined />, label: "Password Reset" },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout, // Attach logout handler
    },
  ];

  const renderMenu = () => (
    <Menu
      mode="inline"
      theme="light"
      style={{ height: "100%", borderRight: 0 }}
      selectedKeys={[currentRoute]} // Highlight the active menu item
    >
      {menuItems.map((item) => (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          onClick={item.onClick} // Handle click events, like logout
        >
          <Tooltip title={item.label} placement="right">
            {item.key === "/logout" ? (
              <span>{item.label}</span> // No link for logout
            ) : (
              <Link to={item.key}>{item.label}</Link>
            )}
          </Tooltip>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      {/* Button to toggle the Drawer (visible on mobile) */}
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setDrawerVisible(true)}
        style={{ marginBottom: "16px" }}
      >
        Open Sidebar
      </Button>

      {/* Sidebar for larger screens */}
      <div className="sidebar">{renderMenu()}</div>

      {/* Drawer for mobile devices */}
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {renderMenu()}
      </Drawer>
    </>
  );
};

export default SidebarComponent;
