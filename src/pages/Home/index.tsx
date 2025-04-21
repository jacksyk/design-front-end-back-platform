import { Card, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  useEffect(() => {
    localStorage.setItem('last-login', dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }, []);

  return (
    <div className={styles.container}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2}>欢迎使用校园信息管理系统</Title>

          <Paragraph>尊敬的管理员，欢迎回来！</Paragraph>

          <Card title="系统信息" bordered={false}>
            <Space direction="vertical">
              <Paragraph>
                <strong>系统时间：</strong>{' '}
                {dayjs().format('YYYY-MM-DD HH:mm:ss')}
              </Paragraph>
              <Paragraph>
                <strong>当前角色：</strong> {'管理员'}
              </Paragraph>
              <Paragraph>
                <strong>上次登录：</strong>{' '}
                {localStorage.getItem('last-login') ?? '-'}
              </Paragraph>
            </Space>
          </Card>

          <Card title="导航list" bordered={false}>
            <Paragraph>
              • 用户管理：管理系统用户信息，包括学生和教师账号
            </Paragraph>
            <Paragraph>• 信息发布：发布和管理校园公告、新闻等信息</Paragraph>
            <Paragraph>• 系统设置：配置系统参数，管理系统权限</Paragraph>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default HomePage;
