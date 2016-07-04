/**
 * Created by zppro on 15-5-13.
 */
require("should");
var _ = require('underscore');
var schedule = require('node-schedule');
var moment = require("moment");
var jobManager = require('../lib/jobManager');


describe("jobManager", function() {

    var job_id_1 = 'testJob1';
    var job_name_1 = '测试任务1';
    var job_rule_1 = new schedule.RecurrenceRule();
    job_rule_1.second = _.range(1, 60);

    var counter_1 = 0;
    var job_exec_1 = () =>{
        console.log(moment().format('HH:mm:ss') + ' => counter1:' + counter_1++);
    };

    var job_id_2 = 'testJob2';
    var job_name_2 = '测试任务2';
    var job_rule_2 = new schedule.RecurrenceRule();
    job_rule_2.second = _.range(0, 60, 5);

    var counter_2 = 0;
    var job_exec_2 = () =>{
        console.log(moment().format('HH:mm:ss') + ' => counter2:' + counter_2++);
    };

    var job1 = jobManager.createJob(job_id_1,job_name_1,job_rule_1,job_exec_1);

    var job2 = jobManager.createJob(job_id_2,job_name_2,job_rule_2,job_exec_2);

    it("The job's id,name should equal job_id,job_name ", function() {
        job1.id.should.eql(job_id_1);
        job1.name.should.eql(job_name_1);

        job2.id.should.eql(job_id_2);
        job2.name.should.eql(job_name_2);
    });

    it("The jobManager's job quality should equal 2 ", function() {
        jobManager.length.should.eql(2);
    });

    it("The jobManager getJob(job_id_1) should equal job1 ", function() {
        jobManager.getJob(job_id_1).should.eql(job1);
    });

    it("The jobManager getJob(job_id_2) should equal job2 ", function() {
        jobManager.getJob(job_id_2).should.eql(job2);
    });


});
