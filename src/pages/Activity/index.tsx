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
  Modal,
  Select,
  Space,
  Table,
  message,
} from 'antd';
import { useState } from 'react';

interface UserType {
  id: number;
  username: string | null;
  student_id: string;
  password: string;
  email: string;
  role: string;
  avatar: string | null;
  introduction: string | null;
  college: string | null;
  contact: string | null;
}

interface ActivityType {
  id: number;
  title: string;
  description: string;
  created_at: string;
  user_id: number;
  likes: number;
  views: number;
  collections: number;
  tags: string;
  // userName: string;
  user: UserType;
  studentId: string;
}

const map = new Map();

const Activity = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<ActivityType[]>([]);

  const columns = [
    {
      title: '活动id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      key: 'likes',
    },
    {
      title: '收藏数',
      dataIndex: 'collections',
      key: 'collections',
    },
    {
      title: '浏览数',
      dataIndex: 'views',
      key: 'views',
    },
    {
      title: '用户学号',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ActivityType) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            查看
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

  const handleCreate = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: ActivityType) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: ActivityType) => {
    Modal.confirm({
      title: '删除活动',
      content: '确定要删除该活动吗？',
      onOk: () => {
        request(`/activity/${record.id}`, {
          method: 'delete',
        })
          .then(() => {
            setData(data.filter((item) => item.id !== record.id));
            message.success('删除成功');
          })
          .catch(() => {
            message.error('删除失败');
          });
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      // TODO: 实现保存逻辑
      message.success('保存成功');
      setIsModalVisible(false);
    });
  };

  const handleSearch = () => {
    if (searchText === '') {
      setData(map.get('all'));
      return;
    }

    if (map.has(searchText)) {
      setData(map.get(searchText));
      return;
    }

    request(`/activity/searchKeyword/${searchText}`).then((res) => {
      let tmp = res.data.data;
      // @ts-ignore
      tmp = tmp.map((item) => {
        item.studentId = item.user.student_id;
        return item;
      });

      map.set(searchText, tmp);

      setData(tmp);
    });
  };

  useMount(() => {
    // 先不支持分页
    request('/activity?page=1&limit=10000').then((res) => {
      let tmp = res.data.data;
      // @ts-ignore
      tmp = tmp.map((item) => {
        item.studentId = item.user.student_id;
        return item;
      });
      map.set('all', tmp);

      setData(tmp);
    });
  });

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索活动"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{
          x: '100%',
        }}
      />

      <Modal
        title="活动详情"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item name="created_at" label="创建时间">
            <Input disabled />
          </Form.Item>
          <Form.Item name="userName" label="创建者">
            <Input disabled />
          </Form.Item>
          <Space
            size="large"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <Form.Item name="likes" label="点赞数">
              <Input disabled />
            </Form.Item>
            <Form.Item name="collections" label="收藏数">
              <Input disabled />
            </Form.Item>
            <Form.Item name="views" label="浏览数">
              <Input disabled />
            </Form.Item>
          </Space>
          <Form.Item name="tags" label="活动标签">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              disabled
              options={[
                { value: '文艺活动', label: '文艺活动' },
                { value: '体育活动', label: '体育活动' },
                { value: '学术活动', label: '学术活动' },
                { value: '社团活动', label: '社团活动' },
              ]}
            />
          </Form.Item>
          <Form.Item name={['user', 'college']} label="所属学院">
            <Input disabled />
          </Form.Item>
          <Form.Item name={['user', 'contact']} label="联系方式">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Activity;
