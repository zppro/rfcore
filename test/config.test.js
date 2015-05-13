/**
 * Created by zppro on 15-5-12.
 */
require("should");
var util = require('../lib/util');
var config = require('../lib/config');


describe("test config", function() {
    var testConfig = {
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
    config(testConfig,['user=zppro','password=abc','server=192.168.1.11','port=1001','database=testdb','authSecret=token']);
    it("The testConfig.db.sqlserver.user should be zppro", function() {
        testConfig.db.sqlserver.user.should.eql("zppro");
    });
    it("The testConfig.db.sqlserver.password should be abc", function() {
        testConfig.db.sqlserver.password.should.eql("abc");
    });
    it("The testConfig.db.sqlserver.server should be 192.168.1.11", function() {
        testConfig.db.sqlserver.server.should.eql("192.168.1.11");
    });
    it("The testConfig.db.sqlserver.port should be 1001", function() {
        testConfig.db.sqlserver.port.should.eql("1001");
    });
    it("The testConfig.db.sqlserver.database should be testdb", function() {
        testConfig.db.sqlserver.database.should.eql("testdb");
    });
    it("The testConfig.secure.authSecret should be token ", function() {
        testConfig.secure.authSecret.should.eql("token");
    });

    var testConfig2 = {
        user:"数据库用户",
        password: '密码'
    }
    config(testConfig2,['user=zppro2','password=efg']);
    it("The testConfig2.user should be zppro2", function() {
        testConfig2.user.should.eql("zppro2");
    });

    it("The testConfig2.password should be efg", function() {
        testConfig2.password.should.eql("efg");
    });
});