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

