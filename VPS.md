## 解决SSH中文乱码问题

1. 安装 locale 并设置 zh_CN.UTF-8

   ```shell
   apt-get install locales
   dpkg-reconfigure locales # 空格确认选择安装语言
   locale -a # 显示所有系统可用语言
   ```

2. 编辑文件 `/etc/profie`

   ```shell
   #vim /etc/profile
   export LC_ALL=zh_CN.utf8
   export LANG=zh_CN.utf8
   ```

3. 执行生效命令

   ```shell
   source /etc/profile
   ```



## SCP使用

> 主要使用到scp这个命令，加上 -r 参数就是传输目录

- **从服务器上下载文件**

  `scp username@servername:/path/filename /var/www/local_dir（本地目录）`

  例如 scp root@192.168.0.101:/var/www/test.txt /var/www/test.txt

  把192.168.0.101上的/var/www/test.txt 的文件下载到/var/www/local_dir（本地目录）

- **上传本地文件到服务器**

  `scp /path/filename username@servername:/path`

  例如 scp /var/www/test.php root@192.168.0.101:/var/www/

  把本机/var/www/目录下的test.php文件上传到192.168.0.101这台服务器上的/var/www/目录中

- **从服务器下载整个目录**

  `scp -r username@servername:/var/www/remote_dir/（远程目录） /var/www/local_dir（本地目录）`

  例如: scp -r root@192.168.0.101:/var/www/test /var/www/

- **上传目录到服务器**

  `scp -r local_dir username@servername:remote_dir`

  例如：scp -r test root@192.168.0.101:/var/www/

  把当前目录下的test目录上传到服务器的/var/www/ 目录



## 	Docker 安装

- **安装脚本：**

  `sudo curl -sSL get.docker.com | sh`

- **报错:**

  Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

  ```shell
  systemctl daemon-reload
  
  sudo service docker restart
  
  sudo service docker status 
  ```



## NodeJS安装

```shell
curl -sL https://deb.nodesource.com/setup_14.x| sudo -E bash -
# 注意安装版本
```



## `lsof`使用

- **查看端口和进程相关问题**

  ```shell
  lsof -i:8080：查看8080端口占用
  lsof abc.txt：显示开启文件abc.txt的进程
  lsof -c abc：显示abc进程现在打开的文件
  lsof -c -p 1234：列出进程号为1234的进程所打开的文件
  lsof -g gid：显示归属gid的进程情况
  lsof +d /usr/local/：显示目录下被进程开启的文件
  lsof +D /usr/local/：同上，但是会搜索目录下的目录，时间较长
  lsof -d 4：显示使用fd为4的进程
  lsof -i -U：显示所有打开的端口和UNIX domai文件
  ```



## 测速脚本

```shell
wget -qO- bench.sh | bash
wget -qO- git.io/superbench.sh | bash
bash <(curl -Lso- https://git.io/superspeed.sh)

curl -sL yabs.sh | bas
```

## 开启BBR

```shell
wget --no-check-certificate -O /opt/bbr.sh https://github.com/teddysun/across/raw/master/bbr.sh
chmod 755 /opt/bbr.sh
/opt/bbr.sh
```

## Linux镜像源切换

- **备份**

  mv /etc/apt/sources.list /etc/apt/sources.list.old

1. **替换为默认官方源**

   ```shell
   cat > /etc/apt/sources.list << EOF
   
   deb http://deb.debian.org/debian/ bullseye main contrib non-free
   deb-src http://deb.debian.org/debian/ bullseye main contrib non-free
   deb http://deb.debian.org/debian/ bullseye-updates main contrib non-free
   deb-src http://deb.debian.org/debian/ bullseye-updates main contrib non-free
   deb http://deb.debian.org/debian/ bullseye-backports main contrib non-free
   deb-src http://deb.debian.org/debian/ bullseye-backports main contrib non-free
   deb http://deb.debian.org/debian-security/ bullseye-security main contrib non-free
   deb-src http://deb.debian.org/debian-security/ bullseye-security main contrib non-free
   EOF
   ```

2. **替换为腾讯云内网源**

   ```shell
   cat > /etc/apt/sources.list << EOF
   
   deb http://mirrors.tencentyun.com/debian/ bullseye main contrib non-free
   deb-src http://mirrors.tencentyun.com/debian/ bullseye main contrib non-free
   deb http://mirrors.tencentyun.com/debian/ bullseye-updates main contrib non-free
   deb-src http://mirrors.tencentyun.com/debian/ bullseye-updates main contrib non-free
   deb http://mirrors.tencentyun.com/debian/ bullseye-backports main contrib non-free
   deb-src http://mirrors.tencentyun.com/debian/ bullseye-backports main contrib non-free
   deb http://mirrors.tencentyun.com/debian-security/ bullseye-security main contrib non-free
   deb-src http://mirrors.tencentyun.com/debian-security/ bullseye-security main contrib non-free
   EOF
   ```

3. **替换为阿里云内网源**

   ```shell
   cat > /etc/apt/sources.list << EOF
   deb http://mirrors.cloud.aliyuncs.com/debian/ bullseye main contrib non-free
   deb-src http://mirrors.cloud.aliyuncs.com/debian/ bullseye main contrib non-free
   deb http://mirrors.cloud.aliyuncs.com/debian/ bullseye-updates main contrib non-free
   deb-src http://mirrors.cloud.aliyuncs.com/debian/ bullseye-updates main contrib non-free
   deb http://mirrors.cloud.aliyuncs.com/debian/ bullseye-backports main contrib non-free
   deb-src http://mirrors.cloud.aliyuncs.com/debian/ bullseye-backports main contrib non-free
   deb http://mirrors.cloud.aliyuncs.com/debian-security/ bullseye-security main contrib non-free
   deb-src http://mirrors.cloud.aliyuncs.com/debian-security/ bullseye-security main contrib non-free
   EOF
   ```


4. **替换为Linode源**

   ```shell
   cat > /etc/apt/sources.list << EOF
   deb http://mirrors.linode.com/debian/ bullseye main contrib non-free
   deb-src http://mirrors.linode.com/debian/ bullseye main contrib non-free
   deb http://mirrors.linode.com/debian/ bullseye-updates main contrib non-free
   deb-src http://mirrors.linode.com/debian/ bullseye-updates main contrib non-free
   deb http://mirrors.linode.com/debian/ bullseye-backports main contrib non-free
   deb-src http://mirrors.linode.com/debian/ bullseye-backports main contrib non-free
   deb http://mirrors.linode.com/debian-security/ bullseye-security main contrib non-free
   deb-src http://mirrors.linode.com/debian-security/ bullseye-security main contrib non-free
   EOF
   ```

   

## 网卡相关

- **Debian**

  `ifconfig` 或 `ip a`：查看网卡列表

  `nano /etc/default/grub`：编辑操作系统启动程序配置文件

  修改：`GRUB_CMDLINE_LINUX="net.ifnames=0 biosdevname=0"`

  更新grub引导配置文件：`update-grub`

  修改系统中网卡的配置文件：`nano /etc/network/interfaces`

  把其中的 ens3 全部改成 eth0

  重启网卡：`ifconfig eth0 stop` `ifconfig eth0 start`

  或：`ifdown eth0` `ifup eth0`

  或：`service network restart/stop/start`

- **CentOS**

  修改 ip `cd /etc/sysconfig/network-scripts`

- **vi/vim 使用**

  按i 进入insert状态可以进行编辑操作

  按ESC键 跳到命令模式（底部的insert消失，输入下面的命令可进行相应操作），然后：

  :q! 不保存文件，并退出vi

  :wq 保存文件并退出vi

  :w 保存文件但不退出vi

  :w file 将修改另外保存到file中，不退出vi

  :w! 强制保存，不推出vi

  :wq! 强制保存文件，并退出vi

- **直接在文件后面追加内容**

  `echo “nice to meet you"＞＞ /var/log/mysql/error.log`



## 部署MySQL及问题解决

### 安装

```shell
wget https://dev.mysql.com/get/mysql-apt-config_0.8.18-1_all.deb

sudo dpkg -i mysql-apt-config_0.8.18-1_all.deb

sudo apt updatesudo apt  install mysql-server
```

### 登录

```mysql
mysql -u root -p

输入密码
```

### 报错解决

- **添加软件源时**

   ![image-20230117104340039](C:\Users\Admin\Documents\Typora\VPS.assets\image-20230117104340039.png)

  ```shell
  sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 425956BB3E31DF51
  sudo apt update
  ```

- **设置远程连接权限**

  - 查看user表

    ```mysql
    mysql> use mysql;
    
    Database changed
    
    mysql> select host,user from user;
    ```

  - 该授权SQL语句的含义为root用户可用任何IP地址登录数据库，操作任何数据库中的任何对象。
  
    ```mysql
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
    # 参数说明
    # □ *.*参数：第一个星号（*）为数据库占位符，如果填*则代表所有数据库。第二个星号（*）为数据库表占位符，如果填*则代表数据库中所有表。
    # 'root'@'%'参数：root为授权登录的数据库账户，百分号（%）为IP地址占位符。假如要限制只能通过1.1.1.1的IP地址登录，则需要把%改成1.1.1.1。如果填%则代表允许任何IP地址登录。
    ```
    

- **执行如下SQL语句，刷新权限**

  ```mysql
  flush privileges;
  ```

  

## Screen使用

- **启动**：screen -S 名字

- **挂起**：C+a d

- **杀死**：C+a k

- **进入**：screen -r 名字

- **列表**：screen -ls

- **清除会话**：screen -wipe

- **杀死会话**:  screen -X -S <4588> quit



## PM2使用

- **安装：**`npm i pm2 -g`

- **启动：**`pm2 start app.js`
  - `--watch`：监听应用目录的变化
  - `-i`：启用多少个实例，可用于负载均衡。如果`-i 0`或者`-i max`，则根据当前机器核数确定实例数目。
  - `--ignore-watch`：排除监听的目录/文件，可以是特定的文件名，也可以是正则。比如`--ignore-watch="test node_modules "some scripts""` 
  - `-n`：应用的名称。查看应用信息的时候可以用到。
  - `-o <path>`：标准输出日志文件的路径。
  - `-e <path>`：错误输出日志文件的路径。
- **重启：**`pm2 restart app.js`
- **停止：**`pm2 stop app_name | app_id`
- **停止所有：**`pm2 stop all`
- **删除进程：**`pm2 delete app_name | app_id | all`
- **查看进程状态：**`pm2 ls`
- **日志查看：**`pm2 log`
- **查看资源消耗：**`pm2 monit`



## nginx配置文件

```nginx
######Nginx配置文件nginx.conf中文详解#####

#定义Nginx运行的用户和用户组
user www www;

#nginx进程数，建议设置为等于CPU总核心数。
worker_processes 8;
 
#全局错误日志定义类型，[ debug | info | notice | warn | error | crit ]
error_log /usr/local/nginx/logs/error.log info;

#进程pid文件
pid /usr/local/nginx/logs/nginx.pid;

#指定进程可以打开的最大描述符：数目
#工作模式与连接数上限
#这个指令是指当一个nginx进程打开的最多文件描述符数目，理论值应该是最多打开文件数（ulimit -n）与nginx进程数相除，但是nginx分配请求并不是那么均匀，所以最好与ulimit -n 的值保持一致。
#现在在linux 2.6内核下开启文件打开数为65535，worker_rlimit_nofile就相应应该填写65535。
#这是因为nginx调度时分配请求到进程并不是那么的均衡，所以假如填写10240，总并发量达到3-4万时就有进程可能超过10240了，这时会返回502错误。
worker_rlimit_nofile 65535;


events
{
    #参考事件模型，use [ kqueue | rtsig | epoll | /dev/poll | select | poll ]; epoll模型
    #是Linux 2.6以上版本内核中的高性能网络I/O模型，linux建议epoll，如果跑在FreeBSD上面，就用kqueue模型。
    #补充说明：
    #与apache相类，nginx针对不同的操作系统，有不同的事件模型
    #A）标准事件模型
    #Select、poll属于标准事件模型，如果当前系统不存在更有效的方法，nginx会选择select或poll
    #B）高效事件模型
    #Kqueue：使用于FreeBSD 4.1+, OpenBSD 2.9+, NetBSD 2.0 和 MacOS X.使用双处理器的MacOS X系统使用kqueue可能会造成内核崩溃。
    #Epoll：使用于Linux内核2.6版本及以后的系统。
    #/dev/poll：使用于Solaris 7 11/99+，HP/UX 11.22+ (eventport)，IRIX 6.5.15+ 和 Tru64 UNIX 5.1A+。
    #Eventport：使用于Solaris 10。 为了防止出现内核崩溃的问题， 有必要安装安全补丁。
    use epoll;

    #单个进程最大连接数（最大连接数=连接数*进程数）
    #根据硬件调整，和前面工作进程配合起来用，尽量大，但是别把cpu跑到100%就行。每个进程允许的最多连接数，理论上每台nginx服务器的最大连接数为。
    worker_connections 65535;

    #keepalive超时时间。
    keepalive_timeout 60;

    #客户端请求头部的缓冲区大小。这个可以根据你的系统分页大小来设置，一般一个请求头的大小不会超过1k，不过由于一般系统分页都要大于1k，所以这里设置为分页大小。
    #分页大小可以用命令getconf PAGESIZE 取得。
    #[root@web001 ~]# getconf PAGESIZE
    #4096
    #但也有client_header_buffer_size超过4k的情况，但是client_header_buffer_size该值必须设置为“系统分页大小”的整倍数。
    client_header_buffer_size 4k;

    #这个将为打开文件指定缓存，默认是没有启用的，max指定缓存数量，建议和打开文件数一致，inactive是指经过多长时间文件没被请求后删除缓存。
    open_file_cache max=65535 inactive=60s;

    #这个是指多长时间检查一次缓存的有效信息。
    #语法:open_file_cache_valid time 默认值:open_file_cache_valid 60 使用字段:http, server, location 这个指令指定了何时需要检查open_file_cache中缓存项目的有效信息.
    open_file_cache_valid 80s;

    #open_file_cache指令中的inactive参数时间内文件的最少使用次数，如果超过这个数字，文件描述符一直是在缓存中打开的，如上例，如果有一个文件在inactive时间内一次没被使用，它将被移除。
    #语法:open_file_cache_min_uses number 默认值:open_file_cache_min_uses 1 使用字段:http, server, location  这个指令指定了在open_file_cache指令无效的参数中一定的时间范围内可以使用的最小文件数,如果使用更大的值,文件描述符在cache中总是打开状态.
    open_file_cache_min_uses 1;
    
    #语法:open_file_cache_errors on | off 默认值:open_file_cache_errors off 使用字段:http, server, location 这个指令指定是否在搜索一个文件时记录cache错误.
    open_file_cache_errors on;
}
 
 
 
#设定http服务器，利用它的反向代理功能提供负载均衡支持
http
{
    #文件扩展名与文件类型映射表
    include mime.types;

    #默认文件类型
    default_type application/octet-stream;

    #默认编码
    #charset utf-8;

    #服务器名字的hash表大小
    #保存服务器名字的hash表是由指令server_names_hash_max_size 和server_names_hash_bucket_size所控制的。参数hash bucket size总是等于hash表的大小，并且是一路处理器缓存大小的倍数。在减少了在内存中的存取次数后，使在处理器中加速查找hash表键值成为可能。如果hash bucket size等于一路处理器缓存的大小，那么在查找键的时候，最坏的情况下在内存中查找的次数为2。第一次是确定存储单元的地址，第二次是在存储单元中查找键 值。因此，如果Nginx给出需要增大hash max size 或 hash bucket size的提示，那么首要的是增大前一个参数的大小.
    server_names_hash_bucket_size 128;

    #客户端请求头部的缓冲区大小。这个可以根据你的系统分页大小来设置，一般一个请求的头部大小不会超过1k，不过由于一般系统分页都要大于1k，所以这里设置为分页大小。分页大小可以用命令getconf PAGESIZE取得。
    client_header_buffer_size 32k;

    #客户请求头缓冲大小。nginx默认会用client_header_buffer_size这个buffer来读取header值，如果header过大，它会使用large_client_header_buffers来读取。
    large_client_header_buffers 4 64k;

    #设定通过nginx上传文件的大小
    client_max_body_size 8m;

    #开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成off。
    #sendfile指令指定 nginx 是否调用sendfile 函数（zero copy 方式）来输出文件，对于普通应用，必须设为on。如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络IO处理速度，降低系统uptime。
    sendfile on;

    #开启目录列表访问，合适下载服务器，默认关闭。
    autoindex on;

    #此选项允许或禁止使用socke的TCP_CORK的选项，此选项仅在使用sendfile的时候使用
    tcp_nopush on;
     
    tcp_nodelay on;

    #长连接超时时间，单位是秒
    keepalive_timeout 120;

    #FastCGI相关参数是为了改善网站的性能：减少资源占用，提高访问速度。下面参数看字面意思都能理解。
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 128k;

    #gzip模块设置
    gzip on; #开启gzip压缩输出
    gzip_min_length 1k;    #最小压缩文件大小
    gzip_buffers 4 16k;    #压缩缓冲区
    gzip_http_version 1.0;    #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
    gzip_comp_level 2;    #压缩等级
    gzip_types text/plain application/x-javascript text/css application/xml;    #压缩类型，默认就已经包含textml，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn。
    gzip_vary on;

    #开启限制IP连接数的时候需要使用
    #limit_zone crawler $binary_remote_addr 10m;



    #负载均衡配置
    upstream jh.w3cschool.cn {
     
        #upstream的负载均衡，weight是权重，可以根据机器配置定义权重。weigth参数表示权值，权值越高被分配到的几率越大。
        server 192.168.80.121:80 weight=3;
        server 192.168.80.122:80 weight=2;
        server 192.168.80.123:80 weight=3;

        #nginx的upstream目前支持4种方式的分配
        #1、轮询（默认）
        #每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。
        #2、weight
        #指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。
        #例如：
        #upstream bakend {
        #    server 192.168.0.14 weight=10;
        #    server 192.168.0.15 weight=10;
        #}
        #2、ip_hash
        #每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题。
        #例如：
        #upstream bakend {
        #    ip_hash;
        #    server 192.168.0.14:88;
        #    server 192.168.0.15:80;
        #}
        #3、fair（第三方）
        #按后端服务器的响应时间来分配请求，响应时间短的优先分配。
        #upstream backend {
        #    server server1;
        #    server server2;
        #    fair;
        #}
        #4、url_hash（第三方）
        #按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。
        #例：在upstream中加入hash语句，server语句中不能写入weight等其他的参数，hash_method是使用的hash算法
        #upstream backend {
        #    server squid1:3128;
        #    server squid2:3128;
        #    hash $request_uri;
        #    hash_method crc32;
        #}

        #tips:
        #upstream bakend{#定义负载均衡设备的Ip及设备状态}{
        #    ip_hash;
        #    server 127.0.0.1:9090 down;
        #    server 127.0.0.1:8080 weight=2;
        #    server 127.0.0.1:6060;
        #    server 127.0.0.1:7070 backup;
        #}
        #在需要使用负载均衡的server中增加 proxy_pass http://bakend/;

        #每个设备的状态设置为:
        #1.down表示单前的server暂时不参与负载
        #2.weight为weight越大，负载的权重就越大。
        #3.max_fails：允许请求失败的次数默认为1.当超过最大次数时，返回proxy_next_upstream模块定义的错误
        #4.fail_timeout:max_fails次失败后，暂停的时间。
        #5.backup： 其它所有的非backup机器down或者忙的时候，请求backup机器。所以这台机器压力会最轻。

        #nginx支持同时设置多组的负载均衡，用来给不用的server来使用。
        #client_body_in_file_only设置为On 可以讲client post过来的数据记录到文件中用来做debug
        #client_body_temp_path设置记录文件的目录 可以设置最多3层目录
        #location对URL进行匹配.可以进行重定向或者进行新的代理 负载均衡
    }
     
     
     
    #虚拟主机的配置
    server
    {
        #监听端口
        listen 80;

        #域名可以有多个，用空格隔开
        server_name www.w3cschool.cn w3cschool.cn;
        index index.html index.htm index.php;
        root /data/www/w3cschool;

        #对******进行负载均衡
        location ~ .*.(php|php5)?$
        {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            include fastcgi.conf;
        }
         
        #图片缓存时间设置
        location ~ .*.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires 10d;
        }
         
        #JS和CSS缓存时间设置
        location ~ .*.(js|css)?$
        {
            expires 1h;
        }
         
        #日志格式设定
        #$remote_addr与$http_x_forwarded_for用以记录客户端的ip地址；
        #$remote_user：用来记录客户端用户名称；
        #$time_local： 用来记录访问时间与时区；
        #$request： 用来记录请求的url与http协议；
        #$status： 用来记录请求状态；成功是200，
        #$body_bytes_sent ：记录发送给客户端文件主体内容大小；
        #$http_referer：用来记录从那个页面链接访问过来的；
        #$http_user_agent：记录客户浏览器的相关信息；
        #通常web服务器放在反向代理的后面，这样就不能获取到客户的IP地址了，通过$remote_add拿到的IP地址是反向代理服务器的iP地址。反向代理服务器在转发请求的http头信息中，可以增加x_forwarded_for信息，用以记录原有客户端的IP地址和原来客户端的请求的服务器地址。
        log_format access '$remote_addr - $remote_user [$time_local] "$request" '
        '$status $body_bytes_sent "$http_referer" '
        '"$http_user_agent" $http_x_forwarded_for';
         
        #定义本虚拟主机的访问日志
        access_log  /usr/local/nginx/logs/host.access.log  main;
        access_log  /usr/local/nginx/logs/host.access.404.log  log404;
         
        #对 "/" 启用反向代理
        location / {
            proxy_pass http://127.0.0.1:88;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
             
            #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             
            #以下是一些反向代理的配置，可选。
            proxy_set_header Host $host;

            #允许客户端请求的最大单文件字节数
            client_max_body_size 10m;

            #缓冲区代理缓冲用户端请求的最大字节数，
            #如果把它设置为比较大的数值，例如256k，那么，无论使用firefox还是IE浏览器，来提交任意小于256k的图片，都很正常。如果注释该指令，使用默认的client_body_buffer_size设置，也就是操作系统页面大小的两倍，8k或者16k，问题就出现了。
            #无论使用firefox4.0还是IE8.0，提交一个比较大，200k左右的图片，都返回500 Internal Server Error错误
            client_body_buffer_size 128k;

            #表示使nginx阻止HTTP应答代码为400或者更高的应答。
            proxy_intercept_errors on;

            #后端服务器连接的超时时间_发起握手等候响应超时时间
            #nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_connect_timeout 90;

            #后端服务器数据回传时间(代理发送超时)
            #后端服务器数据回传时间_就是在规定时间之内后端服务器必须传完所有的数据
            proxy_send_timeout 90;

            #连接成功后，后端服务器响应时间(代理接收超时)
            #连接成功后_等候后端服务器响应时间_其实已经进入后端的排队之中等候处理（也可以说是后端服务器处理请求的时间）
            proxy_read_timeout 90;

            #设置代理服务器（nginx）保存用户头信息的缓冲区大小
            #设置从被代理服务器读取的第一部分应答的缓冲区大小，通常情况下这部分应答中包含一个小的应答头，默认情况下这个值的大小为指令proxy_buffers中指定的一个缓冲区的大小，不过可以将其设置为更小
            proxy_buffer_size 4k;

            #proxy_buffers缓冲区，网页平均在32k以下的设置
            #设置用于读取应答（来自被代理服务器）的缓冲区数目和大小，默认情况也为分页大小，根据操作系统的不同可能是4k或者8k
            proxy_buffers 4 32k;

            #高负荷下缓冲大小（proxy_buffers*2）
            proxy_busy_buffers_size 64k;

            #设置在写入proxy_temp_path时数据的大小，预防一个工作进程在传递文件时阻塞太长
            #设定缓存文件夹大小，大于这个值，将从upstream服务器传
            proxy_temp_file_write_size 64k;
        }
         
         
        #设定查看Nginx状态的地址
        location /NginxStatus {
            stub_status on;
            access_log on;
            auth_basic "NginxStatus";
            auth_basic_user_file confpasswd;
            #htpasswd文件的内容可以用apache提供的htpasswd工具来产生。
        }
         
        #本地动静分离反向代理配置
        #所有jsp的页面均交由tomcat或resin处理
        location ~ .(jsp|jspx|do)?$ {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:8080;
        }
         
        #所有静态文件由nginx直接读取不经过tomcat或resin
        location ~ .*.(htm|html|gif|jpg|jpeg|png|bmp|swf|ioc|rar|zip|txt|flv|mid|doc|ppt|
        pdf|xls|mp3|wma)$
        {
            expires 15d; 
        }
         
        location ~ .*.(js|css)?$
        {
            expires 1h;
        }
    }
}
######Nginx配置文件nginx.conf中文详解#####

```

精简文件

```nginx
user  root;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    # x-ui
    server {
        listen       80;
        
         listen 443 ssl http2;
        server_name rn.120001.xyz;
        index index.php index.html index.htm default.php default.htm default.html;
        
        # 强制跳转 Https
         if ($server_port !~ 443){
             rewrite ^(/.*)$ https://$host$1 permanent;
         }
        # 证书地址
         ssl_certificate    /root/cert/public.pem;
         ssl_certificate_key    /root/cert/private.pem;
         ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
        
        location / {
          proxy_pass http://127.0.0.1:35001;
          
          proxy_http_version  1.1;
          proxy_cache_bypass  $http_upgrade;
      
          proxy_set_header Upgrade           $http_upgrade;
          proxy_set_header Connection        "upgrade";
          proxy_set_header Host              $host;
          proxy_set_header X-Real-IP         $remote_addr;
          proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_set_header X-Forwarded-Host  $host;
          proxy_set_header X-Forwarded-Port  $server_port;
        }

    }
    
    # chfs地址
    server {
      listen 80;
      server_name file.433433.xyz;
      index index.php index.html index.htm default.php default.htm default.html;
      
      listen 443 ssl http2;
      # 强制跳转
      if ($server_port !~ 443){
          rewrite ^(/.*)$ https://$host$1 permanent;
      }
      # 证书地址
      ssl_certificate    /root/.acme.sh/433433.xyz/fullchain.cer;
      ssl_certificate_key    /root/.acme.sh/433433.xyz/433433.xyz.key;
      ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
      
      location / {
        proxy_pass http://127.0.0.1:35002;
      }
    }
    
    # Qbittorrent地址
    server {
      listen 80;
      server_name qb.433433.xyz;
      index index.php index.html index.htm default.php default.htm default.html;
      
      listen 443 ssl http2;
      # 强制跳转
      if ($server_port !~ 443){
          rewrite ^(/.*)$ https://$host$1 permanent;
      }
      # 证书地址
      ssl_certificate    /root/.acme.sh/433433.xyz/fullchain.cer;
      ssl_certificate_key    /root/.acme.sh/433433.xyz/433433.xyz.key;
      ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
      
      location / {
        proxy_pass http://127.0.0.1:35003;
        
        proxy_http_version  1.1;
        proxy_cache_bypass  $http_upgrade;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Port  $server_port;
      }
    }
    
    
    # SpeedTest
    server {
      listen 80;
      server_name speed.433433.xyz;
      index index.php index.html index.htm default.php default.htm default.html;
      
      listen 443 ssl http2;
      # 强制跳转
      if ($server_port !~ 443){
          rewrite ^(/.*)$ https://$host$1 permanent;
      }
      # 证书地址
      ssl_certificate    /root/.acme.sh/433433.xyz/fullchain.cer;
      ssl_certificate_key    /root/.acme.sh/433433.xyz/433433.xyz.key;
      ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
      
      location / {
        proxy_pass http://127.0.0.1:9001;
        
        proxy_http_version  1.1;
        proxy_cache_bypass  $http_upgrade;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Port  $server_port;
      }
    }
    
    #订阅链接
    server {
      listen 80;
      server_name dy.120001.xyz;
      index index.php index.html index.htm default.php default.htm default.html;  
      
      listen 443 ssl http2;
      # 强制跳转
      if ($server_port !~ 443){
          rewrite ^(/.*)$ https://$host$1 permanent;
      }
      # 证书地址
      ssl_certificate    /root/.acme.sh/120001.xyz/fullchain.cer;
      ssl_certificate_key    /root/.acme.sh/120001.xyz/120001.xyz.key;
      ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
      
      location / {
        proxy_pass http://127.0.0.1:35004;
        
        proxy_http_version  1.1;
        proxy_cache_bypass  $http_upgrade;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Port  $server_port;
      }
    } 
    
    # 测试链接
    server {
      listen 80;
      server_name test.120001.xyz;
      index index.php index.html index.htm default.php default.htm default.html;  
      root /root/test/;
      
      listen 443 ssl http2;
      # 强制跳转 https
      if ($server_port !~ 443){
          rewrite ^(/.*)$ https://$host$1 permanent;
      }
      # 证书地址
      ssl_certificate    /root/.acme.sh/120001.xyz/fullchain.cer;
      ssl_certificate_key    /root/.acme.sh/120001.xyz/120001.xyz.key;
      ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    }      
}

```

1. `ps -ef | grep nginx`, 查找所有nginx进程
2. `sudo kill -9 xxx xxx xxx`或者`sudo pkill nginx`
3. `sudo systemctl restart nginx`
4. `sudo nginx -t`



## 安装QBittorrent

```shell
apt install qbittorrent-nox -y
vim /etc/systemd/system/qbittorrent-nox.service



[Unit]
Description=qBittorrent Command Line Client
After=network.target

[Service]
Type=forking
User=root
Group=root
UMask=007
ExecStart=/usr/bin/qbittorrent-nox -d --webui-port=8080
Restart=on-failure

[Install]
WantedBy=multi-user.target



systemctl daemon-reload
systemctl enable qbittorrent-nox
systemctl status qbittorrent-nox

```

