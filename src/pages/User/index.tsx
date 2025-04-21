import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { request } from '@umijs/max';
import { useMount } from 'ahooks';
import { Button, Card, Form, Input, message, Modal, Space, Table } from 'antd';
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
  isActive: string;
}

const map = new Map();

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

  const handleForbidden = (record: UserType) => {
    const str = `${record.isActive !== '是' ? '封禁' : '解封'}`;
    Modal.confirm({
      title: `${str}用户`,
      content: `确定要${str}该用户吗？`,
      onOk: () => {
        request(`/user/ban/${record.id}`)
          .then(() => {
            setData(
              data.map((item) => {
                if (item.id === record.id) {
                  return {
                    ...item,
                    isActive: item.isActive === '是' ? '否' : '是',
                  };
                }
                return item;
              }),
            );
            message.success('操作成功');
          })
          .catch((err) => {
            console.log('err', err);
          });
      },
    });
  };

  const handleDelete = (record: UserType) => {
    Modal.confirm({
      title: '删除用户',
      content: '确定要删除该用户吗？',
      onOk: () => {
        request(`/user/delete/${record.id}`)
          .then(() => {
            setData(data.filter((item) => item.id !== record.id));
            message.success('删除成功');
          })
          .catch((err) => {
            console.log('err', err);
          });
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
      title: '是否被封号',
      dataIndex: 'isActive',
      key: 'isActive',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
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
      render: (_: any, record: UserType) => (
        <Space>
          <Button
            danger
            icon={<EditOutlined />}
            onClick={() => handleForbidden(record)}
          >
            {record.isActive !== '是' ? '封禁' : '解封'}
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
    // console.log(map, 'map');
    // console.log('searchText', searchText);
    if (searchText.length === 0) {
      setData(map.get('all'));
      return;
    }
    if (map.has(searchText)) {
      setData(map.get(searchText));
      return;
    }

    request(`/user/search/${searchText}`).then((res) => {
      const data = res.data.data.map((item: any) => {
        return {
          ...item,
          isActive: item.isActive ? '否' : '是',
        };
      });
      map.set(searchText, data);
      setData(data);
    });
  };

  useMount(() => {
    request('/user/all').then((res) => {
      const allData = res.data.data.map((item: any) => {
        return {
          ...item,
          isActive: item.isActive ? '否' : '是',
        };
      });

      map.set('all', allData);

      setData(allData);
    });
  });

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索关键词"
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
        scroll={{
          x: '100%',
        }}
        loading={loading}
        pagination={{
          total: data.length,
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Card>
  );
};

export default User;
