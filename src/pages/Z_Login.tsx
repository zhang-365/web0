import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css'

const Login = () => {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      //axios 返回数据必须取 .data
      const res = await loginApi(values);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      message.success('登录成功');
      nav('/manage_abc2026');
    } catch (err: any) {
      message.error(err?.response?.data || '登录失败');
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="login-container">
      <Card className="login-card" title="企业级后台管理系统">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="login-tips">
          <p>默认账号: admin</p>
          <p>默认密码: 123456</p>
        </div>
      </Card>
    </div>
  );

  // return (
  //   <div className="login-wrap">
  //     <Card className="login-card" title="后台管理系统登录">
  //       <Form onFinish={onFinish}>
  //         <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
  //           <Input prefix={<UserOutlined />} placeholder="账号" />
  //         </Form.Item>
  //         <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
  //           <Input.Password prefix={<LockOutlined />} placeholder="密码" />
  //         </Form.Item>
  //         <Form.Item>
  //           <Button type="primary" block htmlType="submit" loading={loading}>
  //             登录
  //           </Button>
  //         </Form.Item>
  //       </Form>
  //     </Card>
  //   </div>
  // );
};

export default Login;