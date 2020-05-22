# Vue-Twitter

<!-- [Clone](https://www.inflearn.com/course/Vue-nodebird-sns/dashboard) -->

## Client

- Vue.js
- Nuxt.js
- Vuex
- Vuetify
- Infinite Scroll

---

## Server

- Node.js
- Express
- MySQL (ver 8.x)
- ORM(시퀄라이즈)
- Passport
- multer(S3)

<!--
```bash
$ npm i sequelize mysql2
$ npm i -D sequelize-cli
# Sequelize Initialize
$ npx sequelize init

# Model 생성 ---

# 현재 Local db에 table 생성 [현재 rootDir에서]
$ npx sequelize db:create
```

# sequelize => 자바스크립트로 sql을 표현할 수 있도록
# mysql2 => node와 mysql을 연동해주는 driver

```bash
# Front/Back 공통
$ sudo apt-get update
$ sudo apt-get install -y build-essential
$ sudo apt-get install curl
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash --
$ sudo apt-get install -y nodejs

# Back(MySQL 설치)
$ sudo apt-get install -y mysql-server
$ mysql_secure_installation # 패스워드 설정
$ mysql -u root -p
```

```mysql
$ ALTER USER root@localhost IDENTIFIED WITH mysql_native_password BY 'password';
```

결과값으로 아래와 같이 나오면 성공적

> Query OK, 0 rows affected (0.01 sec)

```bash
# Background back server 실행
$ npm i pm2

# Ubuntu
$ npm i -g pm2  # pm2 명령어 접근
$ pm2 list  # 현재 백그라운드에서 실행되고 있는 Server List
$ pm2 kill  # 현재 백그라운드 Server 끄기
$ pm2 monit # 접속, 요청 Log가 남음
$ pm2 reload all # 현재 실행되는 Server 재시작
```
-->
