import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
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

interface AllToolTypes {
  description: string;
  icon: string;
  id: number;
  link: string;
  tags: Tag[];
  title: string;
}

interface Tag {
  id: number;
  name: string;
}

const Tools = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<AllToolTypes[]>([]);
  const [tag, setTags] = useState<Tag[]>([]);

  useMount(() => {
    request('/tool-library/tool/all').then((res) => {
      setData(res.data);
    });
    request('/tool-library/tag/all').then((res) => {
      console.log('res.data', res.data);
      setTags(res.data);
    });
  });

  const handleCreate = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: AllToolTypes) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: AllToolTypes) => {
    Modal.confirm({
      title: '删除工具',
      content: '确定要删除该工具吗？',
      onOk: async () => {
        try {
          await request(`/tool-library/tool/${record.id}`, {
            method: 'DELETE',
          });
          setData(data.filter((item) => item.id !== record.id));
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '工具ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '工具名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '工具描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '工具链接',
      dataIndex: 'link',
      key: 'link',
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: Tag[]) => (
        <Space>
          {tags?.map((tag) => (
            <span key={tag.id}>{tag.name}</span>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AllToolTypes) => (
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      console.log('values', values);
      const isEdit = form.getFieldValue('id');

      if (isEdit) {
        // await request(`/tool/${values.id}`, {
        //   method: 'PUT',
        //   data: values,
        // });
        // setData(
        //   data.map((item) =>
        //     item.id === values.id ? { ...item, ...values } : item,
        //   ),
        // );
      } else {
        await request('/tool-library/tool', {
          method: 'POST',
          data: values,
        });
        // setData([...data, res.data]);
        request('/tool-library/tool/all').then((res) => {
          setData(res.data);
        });
      }

      message.success(`${isEdit ? '更新' : '创建'}成功`);
      setIsModalVisible(false);
    } catch (error) {
      message.error(`${form.getFieldValue('id') ? '更新' : '创建'}失败`);
    }
  };

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          添加工具
        </Button>
        <Input
          placeholder="搜索工具"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button icon={<SearchOutlined />}>搜索</Button>
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
        title={form.getFieldValue('id') ? '编辑工具' : '添加工具'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="工具名称"
            rules={[{ required: true, message: '请输入工具名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="工具描述"
            rules={[{ required: true, message: '请输入工具描述' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="link"
            label="工具链接"
            rules={[
              { required: true, message: '请输入工具链接' },
              { type: 'url', message: '请输入有效的URL' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tagIds"
            label="工具标签"
            rules={[{ required: true, message: '请选择工具标签' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择工具标签"
              style={{ width: '100%' }}
              options={tag.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="icon"
            label="工具图标"
            rules={[{ required: true, message: '请输入图标链接' }]}
          >
            <Input placeholder="请输入图标链接" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Tools;
