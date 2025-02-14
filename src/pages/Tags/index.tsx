import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { useMount } from 'ahooks';
import { Button, Card, Form, Input, Modal, Space, Table, message } from 'antd';
import { useState } from 'react';

interface TagType {
  id: number;
  name: string;
}

const Tags = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<TagType[]>([]);

  const handleEdit = (record: TagType) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: TagType) => {
    Modal.confirm({
      title: '删除标签',
      content: '确定要删除该标签吗？',
      onOk: async () => {
        try {
          await request(`/tool-library/tag/${record.id}`, { method: 'DELETE' });
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
      title: '标签ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TagType) => (
        <Space>
          {/* <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button> */}
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const isEdit = form.getFieldValue('id');

      if (isEdit) {
        await request(`/tool-library/tag/${values.id}`, {
          method: 'PUT',
          data: values,
        });
        setData(
          data.map((item) =>
            item.id === values.id ? { ...item, ...values } : item,
          ),
        );
      } else {
        await request('/tool-library/tag', {
          method: 'POST',
          data: values,
        });

        request('/tool-library/tag/all').then((res) => {
          setData(res.data);
        });
      }

      message.success(`${isEdit ? '更新' : '创建'}成功`);
      setIsModalVisible(false);
    } catch (error) {
      message.error(`${form.getFieldValue('id') ? '更新' : '创建'}失败`);
    }
  };

  useMount(() => {
    setLoading(true);
    request('/tool-library/tag/all')
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          添加标签
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={form.getFieldValue('id') ? '编辑标签' : '添加标签'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Tags;
