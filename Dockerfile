# 使用官方的 Node.js 镜像作为基础镜像
FROM node:20 AS build

# 设置工作目录
WORKDIR /app

# 将本地代码拷贝到容器中
COPY . .
# 拷贝 package.json 和 yarn.lock（如果有的话）
COPY package.json yarn.lock ./
# 安装依赖
RUN yarn install

# 打包应用
RUN yarn run build

# 使用轻量级的 Nginx 镜像来提供静态文件
FROM nginx:alpine

# 拷贝构建好的文件到 Nginx 的静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html/web
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露 80 端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
