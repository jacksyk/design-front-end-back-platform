import { request } from '@umijs/max';
import { Card, Col, Row, Table, Typography, Statistic } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const { Title } = Typography;

interface Performance {
  id: number;
  path: string;
  timestamp: number;
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  resourceLoadTimes: {
    name: string;
    duration: number;
    size: number;
    type: string;
  }[];
  deviceInfo: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    deviceMemory: number;
    connection: string;
  };
  userId: string; // 添加用户ID
  username: string; // 添加用户名
}

const PerformancePanel: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const response = await request('/performance');
      setPerformanceData(response.data.data);
    } catch (error) {
      console.error('获取性能数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 计算平均性能指标
  const averageMetrics = {
    ttfb: performanceData.reduce((acc, curr) => acc + curr.timeToFirstByte, 0) / performanceData.length,
    fcp: performanceData.reduce((acc, curr) => acc + curr.firstContentfulPaint, 0) / performanceData.length,
    lcp: performanceData.reduce((acc, curr) => acc + curr.largestContentfulPaint, 0) / performanceData.length,
    cls: performanceData.reduce((acc, curr) => acc + curr.cumulativeLayoutShift, 0) / performanceData.length,
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      fixed: 'left',
      width: 120,
    },
    {
      title: '访问路径',
      dataIndex: 'path',
      key: 'path',
      fixed: 'left',
      width: 150,
    },
    {
      title: '访问时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (text: string) => dayjs(Number(text)).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '性能指标',
      children: [
        {
          title: 'TTFB(ms)',
          dataIndex: 'timeToFirstByte',
          key: 'ttfb',
          width: 100,
          render: (text: number) => text.toFixed(2),
        },
        {
          title: 'FCP(ms)',
          dataIndex: 'firstContentfulPaint',
          key: 'fcp',
          width: 100,
          render: (text: number) => text.toFixed(2),
        },
        {
          title: 'LCP(ms)',
          dataIndex: 'largestContentfulPaint',
          key: 'lcp',
          width: 100,
          render: (text: number) => text.toFixed(2),
        },
        {
          title: 'CLS',
          dataIndex: 'cumulativeLayoutShift',
          key: 'cls',
          width: 80,
          render: (text: number) => text.toFixed(3),
        },
      ],
    },
    {
      title: '设备信息',
      children: [
        {
          title: '分辨率',
          key: 'resolution',
          width: 120,
          render: (_, record: Performance) =>
            `${record.deviceInfo.screenWidth}x${record.deviceInfo.screenHeight}`,
        },
        {
          title: '内存(GB)',
          key: 'memory',
          width: 100,
          render: (_, record: Performance) => record.deviceInfo.deviceMemory,
        },
        {
          title: '网络',
          dataIndex: ['deviceInfo', 'connection'],
          key: 'network',
          width: 100,
        },
        {
          title: '浏览器信息',
          dataIndex: ['deviceInfo', 'userAgent'],
          key: 'browser',
          width: 200,
          ellipsis: true,
        },
      ],
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>性能监控面板</Title>
      
      {/* 平均性能指标面板 */}
      <Card title="平均性能指标" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="平均TTFB"
              value={averageMetrics.ttfb.toFixed(2)}
              suffix="ms"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均FCP"
              value={averageMetrics.fcp.toFixed(2)}
              suffix="ms"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均LCP"
              value={averageMetrics.lcp.toFixed(2)}
              suffix="ms"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均CLS"
              value={averageMetrics.cls.toFixed(3)}
            />
          </Col>
        </Row>
      </Card>

      {/* 性能数据表格 */}
      <Card>
        <Table
          dataSource={performanceData}
          columns={columns}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1500 }}
          bordered
          size="middle"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
          }}
        />
      </Card>
    </div>
  );
};

export default PerformancePanel;
