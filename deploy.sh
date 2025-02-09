#!/bin/bash

# 配置信息
SERVER_IP="47.122.119.171"
SERVER_USER="root"
PROJECT_NAME="web-graduate-back-platform"
REMOTE_DIR="/www/wwwroot/web-back-platform"  # 服务器上的部署目录

# 颜色输出
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}开始部署...${NC}"

# 1. 清除远程目录
echo -e "${GREEN}1. 清除远程目录...${NC}"
ssh $SERVER_USER@$SERVER_IP "rm -rf $REMOTE_DIR/*"

# 2. 本地打包
echo -e "${GREEN}2. 开始打包项目...${NC}"
npm run build

# 检查必需文件是否存在
echo -e "${GREEN}检查部署文件...${NC}"
for file in dist docker-compose.yml nginx.conf Dockerfile; do
  if [ ! -f "$file" ] && [ ! -d "$file" ]; then
    echo -e "\033[0;31m错误: $file 不存在\033[0m"
    exit 1
  fi
done

# 传输文件到服务器
echo -e "${GREEN}3. 传输文件到服务器...${NC}"
ssh $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"
scp -r dist docker-compose.yml nginx.conf Dockerfile $SERVER_USER@$SERVER_IP:$REMOTE_DIR

# 4. 在服务器上部署
echo -e "${GREEN}4. 在服务器上部署...${NC}"
ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_DIR && docker-compose up --build -d"

echo -e "${GREEN}部署完成！${NC}"