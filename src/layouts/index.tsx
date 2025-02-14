// import { useAccess } from '@/hooks';
import { AccessComp } from '@/components/Guide';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu } from 'antd';
import { useState } from 'react';
import { history, Outlet, useLocation } from 'umi';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (location.pathname === '/login') {
    return <Outlet />;
  }

  const handleLogout = () => {
    history.push('/login');
  };

  const menuItems = [
    {
      key: '/user',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/activity',
      icon: <UserOutlined />,
      label: '活动管理',
    },
    {
      key: '/tools',
      icon: <UserOutlined />,
      label: '工具箱管理',
    },
    {
      key: '/tags',
      icon: <UserOutlined />,
      label: '工具箱标签管理',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AccessComp>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div
            style={{
              height: 64,
              lineHeight: '64px',
              textAlign: 'center',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              margin: 0,
            }}
          >
            {collapsed ? '校园' : '校园信息交流平台'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => history.push(key)}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0 }} title="校园信息交流平台">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: 24,
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 64, height: 64 }}
              />
              <div>
                <span style={{ marginRight: 16 }}>校园信息交流平台</span>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: '退出登录',
                        onClick: handleLogout,
                      },
                    ],
                  }}
                >
                  <Button icon={<UserOutlined />}>管理员</Button>
                </Dropdown>
              </div>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24 }}>
            <Outlet />
          </Content>
        </Layout>
      </AccessComp>
    </Layout>
  );
};

export default AdminLayout;
