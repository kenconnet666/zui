FROM nginx:stable-bookworm

USER root

# 安装基本工具 + 设置时区
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        iputils-ping \
        curl \
        wget \
        nano \
        ca-certificates \
        tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Shanghai

COPY script/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist              /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
