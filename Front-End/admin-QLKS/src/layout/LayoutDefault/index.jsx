import { Layout, Dropdown, Avatar, Menu, Space } from "antd";
import "./LayoutDefault.scss";
import logo from "../../Images/logo.png";
import logoFold from "../../Images/logo-fold.png";
import { MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getCurrentUser } from "../../services/authService";

const { Sider, Content } = Layout;

function LayoutDefault() {
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = getCurrentUser();
        setUser(userData);
    }, []);

    const handleLogout = () => {
        navigate('/logout');
    };

    const userMenu = (
        <Menu items={[
            {
                key: '1',
                icon: <UserOutlined />,
                label: user ? `${user.accountType === 'admin' ? 'Admin' : 'Staff'}: ${user.email}` : 'Tài khoản'
            },
            {
                key: '2',
                icon: <LogoutOutlined />,
                label: 'Đăng xuất',
                onClick: handleLogout
            },
        ]} />
    );

    return (
        <>
            <Layout className="layout-default">
                <header className="header">
                    <div className={"header__logo " + (collapsed && "header__logo--collapsed")}>
                        <img src={collapsed ? logoFold : logo} alt="Logo" />
                    </div>
                    <div className="header__nav">
                        <div className="header__nav-left">
                            <div className="header__collapse" onClick={() => setCollapsed(!collapsed)}>
                                <MenuUnfoldOutlined />
                            </div>
                        </div>
                        <div className="header__nav-right">
                            <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                                <div className="header__user">
                                    <Space>
                                        <Avatar icon={<UserOutlined />} />
                                        <span className="header__username">
                                            {user?.email ? user.email.split('@')[0] : 'User'}
                                        </span>
                                    </Space>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </header>
                <Layout>
                    <Sider 
                        width={250} 
                        collapsible 
                        collapsed={collapsed} 
                        trigger={null}
                        className="layout-sider"
                    >
                        <Sidebar />
                    </Sider>
                    <Content className="content">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default LayoutDefault;