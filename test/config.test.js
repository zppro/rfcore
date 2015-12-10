/**
 * Created by zppro on 15-5-12.
 */
require("should");
var util = require('../lib/util');
var config = require('../lib/config');
var _ = require('underscore');

describe("test config", function() {
    var testConfig1 ={
        name:'配置名称'
    };


    //type=1
    config(testConfig1,['name=myconfig'],1);
    it("The testConfig1.name should be myconfig", function() {
        testConfig1.name.should.eql("myconfig");
    });

    var testConfig2 = {

        db: {
            //mssql数据库配置
            sqlserver: {
                user: '数据库用户',
                password: '密码',
                server: '服务器IP',
                port: '服务器端口',
                database: '数据库名'
            }
        },
        secure:{
            authSecret:'认证密钥'
        }
    };

    //type=2
    config(testConfig2,['user=zppro','password=abc','server=192.168.1.11','port=1001','database=testdb','authSecret=token'],2);

    it("The testConfig2.db.sqlserver.user should be zppro", function() {
        testConfig2.db.sqlserver.user.should.eql("zppro");
    });
    it("The testConfig2.db.sqlserver.password should be abc", function() {
        testConfig2.db.sqlserver.password.should.eql("abc");
    });
    it("The testConfig2.db.sqlserver.server should be 192.168.1.11", function() {
        testConfig2.db.sqlserver.server.should.eql("192.168.1.11");
    });
    it("The testConfig2.db.sqlserver.port should be 1001", function() {
        testConfig2.db.sqlserver.port.should.eql("1001");
    });
    it("The testConfig2.db.sqlserver.database should be testdb", function() {
        testConfig2.db.sqlserver.database.should.eql("testdb");
    });
    it("The testConfig2.secure.authSecret should be token ", function() {
        testConfig2.secure.authSecret.should.eql("token");
    });

    var testConfig = {
        db: {
            default: 'mongodb',
            //mssql数据库配置
            sqlserver: {
                user: '数据库用户',
                password: '密码',
                server: '服务器IP',
                port: '服务器端口',
                database: '数据库名'
            },
            mongodb: {
                user: '数据库用户',
                password: '密码',
                server: '服务器IP',
                port: '服务器端口',
                database: '数据库名'
            }
        }
    };

    config(testConfig,['db.default=mongodb','db.mongodb.user=zppro','db.mongodb.password=abc','db.mongodb.server=192.168.1.11','db.mongodb.port=1001','db.mongodb.database=testdb']);
    it("The testConfig.db.default should be mongodb", function() {
        testConfig.db.default.should.eql("mongodb");
    });
    it("The testConfig.db.mongodb.user should be zppro", function() {
        testConfig.db.mongodb.user.should.eql("zppro");
    });
    it("The testConfig.db.mongodb.password should be abc", function() {
        testConfig.db.mongodb.password.should.eql("abc");
    });
    it("The testConfig.db.mongodb.server should be 192.168.1.11", function() {
        testConfig.db.mongodb.server.should.eql("192.168.1.11");
    });
    it("The testConfig.db.mongodb.port should be 1001", function() {
        testConfig.db.mongodb.port.should.eql("1001");
    });
    it("The testConfig.db.mongodb.database should be testdb", function() {
        testConfig.db.mongodb.database.should.eql("testdb");
    });

    //var testConfig2 = {
    //    user:"数据库用户",
    //    password: '密码'
    //}
    //config(testConfig2,['user=zppro2','password=efg']);
    //it("The testConfig2.user should be zppro2", function() {
    //    testConfig2.user.should.eql("zppro2");
    //});
    //
    //it("The testConfig2.password should be efg", function() {
    //    testConfig2.password.should.eql("efg");
    //});
});