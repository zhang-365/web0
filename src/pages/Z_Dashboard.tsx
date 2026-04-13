import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  ProductOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <Space  size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>欢迎回来，{user.realName || '管理员'}</Title>
        </div>

        <Row gutter={16}>
          <Col span={4}>
            <Card>
              <Statistic title="用户总数" value={24} prefix={<UserOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="部门" value={8} prefix={<TeamOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="角色" value={4} prefix={<SafetyCertificateOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="菜单" value={16} prefix={<AppstoreOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="产品" value={68} prefix={<ProductOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="操作日志" value={1328} />
            </Card>
          </Col>
        </Row>

        <Card title="系统概况" style={{ borderRadius: 8 }}>
          <p>当前系统运行正常，权限体系完整，所有模块可用。</p>
          <p>已实现：登录、用户、部门、角色、菜单、产品、权限分配。</p>
        </Card>
      </Space>
    </div>
  );
};

export default Dashboard;