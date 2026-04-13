import { useState, useEffect, ReactNode } from 'react';
import { Layout, Menu, Typography, Button, Dropdown } from 'antd';
import * as AntIcons from '@ant-design/icons';
import {
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { getCurrentMenusApi } from '../api/menuApi';
import "./MainLayout.css";
import MessageBell from '../components/MessageBell';
import '../assets/css/common.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 加载动态菜单
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await getCurrentMenusApi();
        const formatMenus = (list: any[]): any[] => {
          return list
            .filter((item) => item.type === 'menu')
            .map((item) => {
              const Icon = (AntIcons as any)[item.icon || 'AppstoreOutlined'];
              return {
                key: item.id,
                label: item.menuName,
                path: item.path,
                icon: Icon ? <Icon /> : <AntIcons.AppstoreOutlined />,
                children: item.children ? formatMenus(item.children) : undefined,
              };
            });
        };
        const menus = formatMenus(res.data || []);
        setMenuItems(menus);
      } catch (err) {
        console.error('菜单加载失败', err);
      }
    };
    fetchMenus();
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  // 菜单跳转
  const handleMenuClick = ({ item }: any) => {
    const path = item.props.path;
    if (path) navigate(path);
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/manage_abc2026/login';
  };

  const userMenu = {
    items: [
      {
        key: 'logout',
        label: '退出登录',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
        danger: true,
      },
    ],
  };

  return (
    <Layout className="main-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        className="layout-sider"
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
      >
        <div className="logo-box">
          <Title level={5} className="logo-text">
            {collapsed ? '后台' : '企业管理系统'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* 右侧整体布局 */}
      <Layout className="layout-content-wrapper" 
              style={{ marginLeft: collapsed ? 80 : 200 }}>
        
        <Header className="layout-header" 
                style={{ 
                  position: 'fixed', 
                  top: 0, 
                  right: 0, 
                  left: collapsed ? 80 : 200, 
                  zIndex: 99,
                  height: 64,
                  lineHeight: '64px',
                  padding: '0 16px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}>
          <div className="header-right">
            <MessageBell />
            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              trigger={['hover']}
              classNames={{
                root: 'user-dropdown'
              }}
            >
              <button className="user-btn">
                <UserOutlined className="user-icon" />
                <span className="user-name">{user.realName || '管理员'}</span>
              </button>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区自动避开固定 Header */}
        <Content className="layout-content" 
                 style={{ 
                   marginTop: 64, 
                   minHeight: 'calc(100vh - 64px)'
                 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;