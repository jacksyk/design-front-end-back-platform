import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { request, useNavigate } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';
import styles from './index.less';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      // TODO: 实现登录逻辑
      request('/login', {
        method: 'post',
        data: {
          student_id: values.username,
          password: values.password,
        },
      })
        .then((res) => {
          console.log('res', res);
          message.success('登录成功!');
          localStorage.setItem('token', res.data.token);
          navigate('/home');
        })
        .catch(() => {
          message.error('登录失败！');
        });
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>校园信息交流平台</h1>
          <p>管理员登录</p>
        </div>
        <Form form={form} onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
