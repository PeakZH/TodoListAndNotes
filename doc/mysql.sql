create database node_test;
--
--笔记表
CREATE TABLE
    TBL_RF_NOTE_LIST
    (
        id bigint NOT NULL AUTO_INCREMENT,
        title VARCHAR(128),
        DATE DATE,
        CONTENT VARCHAR(2048),
        namespace VARCHAR(64),
        category VARCHAR(64),
        TOPFLAG INT,
        MODIFY_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CREATE_TIME TIMESTAMP DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (id)
    );


--namespace表
CREATE TABLE
    TBL_RF_NAMESPACE
    (
        id bigint NOT NULL AUTO_INCREMENT,
        NAMESPACE VARCHAR(64),
        CREATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );


--category表
CREATE TABLE
    TBL_RF_CATEGORY
    (
        id bigint NOT NULL AUTO_INCREMENT,
        CATEGORY VARCHAR(64),
        CREATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        namespace_id bigint,
        PRIMARY KEY (id)
    );


--todo表
CREATE TABLE
    TBL_RF_TODO_LIST
    (
        id bigint NOT NULL AUTO_INCREMENT,
        CONTENT VARCHAR(1024),
        status VARCHAR(16) NOT NULL,
        MODIFY_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CREATE_TIME TIMESTAMP DEFAULT '0000-00-00 00:00:00',
        namespace VARCHAR(64),
        PRIMARY KEY (id)
    );
    

--oa work表
CREATE TABLE
    TBL_RF_OA_LIST
    (
        id bigint NOT NULL AUTO_INCREMENT,
        namespace VARCHAR(64),
        CONTENT VARCHAR(1024),
        status VARCHAR(16) NOT NULL,
        CREATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );
    
    
    
    -----初始化系统
    
    insert into tbl_rf_todo_list (id, CONTENT, status, MODIFY_TIME, CREATE_TIME, namespace) values (1, 'test todolist', 'init', '2014-07-27 10:45:46', '2014-07-27 10:45:47', 'yeepay.com');
insert into tbl_rf_todo_list (id, CONTENT, status, MODIFY_TIME, CREATE_TIME, namespace) values (2, 'test todolist', 'init', '2014-07-27 10:47:25', '2014-07-27 10:47:25', 'person');


insert into tbl_rf_oa_list (id, namespace, CONTENT, status, CREATE_TIME) values (1, 'yeepay.com', 'test oa', 'init', '2014-07-27 10:45:33');

insert into tbl_rf_note_list (id, title, DATE, CONTENT, namespace, category, TOPFLAG, MODIFY_TIME, CREATE_TIME) values (1, 'test', '2014-07-27', 'hello <font color="red">world</font>
<pre>
first row
second row
</pre>
', 'yeepay.com', 'test', 0, '2014-07-27 10:46:53', '2014-07-27 10:46:30');


