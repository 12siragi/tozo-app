import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, Switch } from "antd";

import HeaderComponent from "./components/Header";
import SidebarComponent from "./components/Sidebar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import TaskList from "./components/TaskList";
import CreateTask from "./components/CreateTask";
import ArchivedTasks from "./components/ArchivedTasks"; // Import ArchivedTasks
import NotFoundPage from "./pages/NotFoundPage";
import PasswordReset from "./components/PasswordReset"; // Import PasswordReset

const { Sider, Content } = Layout;

const routes: { path: string; element: React.ReactNode }[] = [
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/change-password", element: <ChangePasswordPage /> },
  { path: "/tasks", element: <TaskList /> },
  { path: "/create-task", element: <CreateTask /> },
  { path: "/archived-tasks", element: <ArchivedTasks /> }, // Add ArchivedTasks route
  { path: "/password-reset", element: <PasswordReset /> },
  { path: "*", element: <NotFoundPage /> },
];

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const themeStyles = {
    layout: {
      minHeight: "100vh",
      backgroundColor: darkMode ? "#1f1f1f" : "#f5f5f5",
    },
    sider: {
      backgroundColor: darkMode ? "#2a2a2a" : "#ffffff",
      borderRight: darkMode ? "1px solid #444" : "1px solid #ddd",
    },
    content: {
      backgroundColor: darkMode ? "#292929" : "#f9f9f9",
      color: darkMode ? "#ffffff" : "#000000",
      borderRadius: "8px",
      boxShadow: darkMode
        ? "0 2px 10px rgba(255,255,255,0.1)"
        : "0 2px 10px rgba(0,0,0,0.1)",
    },
  };

  return (
    <BrowserRouter>
      <Layout style={themeStyles.layout}>
        {/* Header */}
        <HeaderComponent>
          {/* Dark Mode Toggle */}
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </HeaderComponent>

        {/* Sidebar */}
        <Layout>
          <Sider width={250} style={themeStyles.sider}>
            <SidebarComponent />
          </Sider>

          {/* Main Content */}
          <Layout style={{ padding: "24px" }}>
            <Content style={themeStyles.content}>
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
