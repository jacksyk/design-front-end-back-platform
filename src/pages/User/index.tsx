import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { request } from '@umijs/max';
import { useMount } from 'ahooks';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
} from 'antd';
import { useState } from 'react';

interface UserType {
  id: number;
  username: string;
  student_id: string;
  email: string;
  createTime: string;
  role: string;
  avatar: string;
  introduction: string;
  college: string;
  contact: string;
}

const User = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserType[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [form] = Form.useForm();

  const handleEdit = (record: UserType) => {
    setCurrentUser(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      // TODO: 调用更新用户API

      const updatedData = data.map((item) =>
        item.id === currentUser?.id ? { ...item, ...values } : item,
      );
      setData(updatedData);
      message.success('编辑成功');
      setEditModalVisible(false);
    } catch (error) {
      message.error('表单验证失败');
    }
  };

  const handleDelete = (record: UserType) => {
    Modal.confirm({
      title: '删除用户',
      content: '确定要删除该用户吗？',
      onOk: () => {
        // TODO: 实现删除逻辑
        setData(data.filter((item) => item.id !== record.id));
        message.success('删除成功');
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '学号',
      dataIndex: 'student_id',
      key: 'student_id',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '角色',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '学院',
      dataIndex: 'college',
      key: 'college',
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: UserType) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    setLoading(true);
    // TODO: 实现搜索逻辑
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useMount(() => {
    request('/user/all').then((res) => {
      setData(res.data.data);
    });
  });

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索用户"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          total: data.length,
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title="编辑用户"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={currentUser || {}}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="student_id"
            label="学号"
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              options={[
                { value: 'student', label: '学生' },
                { value: 'admin', label: '管理员' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="college"
            label="学院"
            rules={[{ required: true, message: '请输入学院' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="联系方式"
            rules={[{ required: true, message: '请输入联系方式' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="introduction" label="个人简介">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default User;
