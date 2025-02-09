# 生产阶段
FROM nginx:alpine

# 复制本地构建的文件
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80