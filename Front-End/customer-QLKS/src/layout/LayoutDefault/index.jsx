import { Layout, Menu, Button, Form, DatePicker, Select, Input, Dropdown, Avatar } from "antd";
import { UserOutlined, LogoutOutlined, HistoryOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "../../pages/Register";
import Login from "../../pages/Login";
import "./LayoutDefault.scss"; 
import { setCookie, getCookie, deleteAllCookies } from "../../helper/cookie";

const { Content } = Layout;

function LayoutDefault() {
    const navigate = useNavigate();
    const location = useLocation();
    const [registerVisible, setRegisterVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const [current, setCurrent] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Kiểm tra token trong cookie thay vì localStorage
        const token = getCookie("accessToken");
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (token) {
            setIsLoggedIn(true);
            setUserData(user);
        }
    }, []);

    const handleLogout = () => {
        deleteAllCookies();
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const userMenuItems = [
        {
            key: '1',
            label: 'Thông Tin khách hàng',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile')
        },
        {
            key: '2',
            label: 'Lịch sử đặt phòng',
            icon: <HistoryOutlined />,
            onClick: () => navigate('/history-room')
        },
        {
            key: '3',
            label: 'Đăng Xuất',
            icon: <LogoutOutlined />,
            onClick: handleLogout
        },
    ];

    // Cập nhật menu item được chọn dựa trên đường dẫn hiện tại
    useEffect(() => {
        const pathname = location.pathname;
        if (pathname === '/') {
            setCurrent('home');
        } else if (pathname === '/room') {
            setCurrent('room');
        } else if (pathname === '/contact') {
            setCurrent('contact');
        } else if (pathname === '/introduce') {
            setCurrent('about');
        } else if (pathname === '/booking-amenities') {
            setCurrent('booking-amenities');
        }
    }, [location]);

    const showLoginModal = () => {
        setLoginVisible(true);
    };

    const hideLoginModal = () => {
        setLoginVisible(false);
    };

    const showRegisterModal = () => {
        setRegisterVisible(true);
    };

    const hideRegisterModal = () => {
        setRegisterVisible(false);
    };
    const handleMenuClick = (e) => {
        setCurrent(e.key);
        switch (e.key) {
            case 'home':
                navigate('/');
                break;
            case 'room':
                navigate('/room');
                break;
            case 'booking-amenities':
                navigate('/booking-amenities');
                break;
            case 'contact':
                navigate('/contact');
                break;
            case 'about':
                navigate('/introduce');
                break;
            default:
                navigate('/');
        }
    };

    return (
        <>
            <Layout className="layout">
                <header className="layout__header">
                    <div className="layout__logo" onClick={() => navigate('/')}>
                        <h1 className="layout__hotel-name">Live Room</h1>
                    </div>
                    <div className="layout__nav">
                        <Menu
                            mode="horizontal"
                            className="layout__menu"
                            overflowedIndicator={null}
                            disabledOverflow={true}
                            selectedKeys={[current]}
                            onClick={handleMenuClick}>
                            <Menu.Item key="home">Trang Chủ</Menu.Item>
                            <Menu.Item key="room">Phòng</Menu.Item>
                            <Menu.Item key="booking-amenities">Tiện Nghi</Menu.Item>
                            <Menu.Item key="contact">Liên Hệ</Menu.Item>
                            <Menu.Item key="about">Giới Thiệu</Menu.Item>
                        </Menu>
                        <div className="layout__auth">
                            {!isLoggedIn ? (
                                <>
                                    <Button type="default" className="layout__login-btn" onClick={showLoginModal}>
                                        Đăng Nhập
                                    </Button>
                                    <Button type="primary" className="layout__register-btn" onClick={showRegisterModal}>
                                        Đăng Ký
                                    </Button>
                                </>
                            ) : (
                                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                                    <div className="user-dropdown">
                                        <Avatar icon={<UserOutlined />} />
                                        <span className="username">{userData?.customerName || userData?.name || 'User'}</span>
                                    </div>
                                </Dropdown>
                            )}
                        </div>
                    </div>
                </header>

                <Layout>
                    <Content className="layout__content">
                        <Outlet />
                    </Content>
                </Layout>

                <footer className="layout__footer">
                    copyright @2025
                </footer>
            </Layout>

            <Login 
                visible={loginVisible} 
                onCancel={hideLoginModal} 
                onLoginSuccess={(user) => {
                    setIsLoggedIn(true);
                    setUserData(user);
                    hideLoginModal();
                }}
                onShowRegister={() => {
                    hideLoginModal();
                    showRegisterModal();
                }}
            />
            <Register 
              visible={registerVisible} 
              onCancel={hideRegisterModal} 
              onRegisterSuccess={(user) => {
                setIsLoggedIn(true);
                setUserData(user);
                hideRegisterModal();
              }}
            />
        </>
    );
}

export default LayoutDefault;