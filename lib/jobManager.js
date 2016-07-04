/**
 * job Created by zppro on 16-6-29.
 * Target:通用任务
 * 参考job_rule设置：http://nodeclass.com/articles/78767
 */

var assert = require('assert').ok;
var schedule = require('node-schedule');
var _ = require('underscore');
var moment = require("moment");

var job_stores = {};

module.exports = {
    length:0,
    getJob: function (job_id) {
        return job_stores[job_id];
    },
    createJob: function () {
        var job_id, job_name, job_rule, job_exec, options;
        if (arguments.length == 5) {
            job_id = arguments[0];
            job_name = arguments[1];
            job_rule = arguments[2];
            job_exec = arguments[3];
            options = arguments[4];
        }
        else if (arguments.length == 4) {
            if (_.isFunction(arguments[3])) {
                job_id = arguments[0];
                job_name = arguments[1];
                job_rule = arguments[2];
                job_exec = arguments[3];
            }
            else {
                job_id = arguments[0];
                job_name = arguments[0];
                job_rule = arguments[1];
                job_exec = arguments[2];
                options = arguments[3];
            }
        }
        else if (arguments.length == 3) {
            job_id = arguments[0];
            job_name = arguments[0];
            job_rule = arguments[1];
            job_exec = arguments[2];
        }
        else {
            assert('invalid arguments');
        }
        options = _.defaults(options || {}, {autoStart: true, printLog: false});

        var job = job_stores[job_id];
        if (!job) {
            job = {
                id: job_id,
                name: job_name,
                stop: stopJob,
                start: startJob,
                suspend: suspendJob,
                resume: resumeJob,
                job_running: false,
                job_pause: false,
                scheduleJob: null,
                printLog: options.printLog
            };

            function startJob() {
                var self = this;
                if (!this.job_running) {
                    this.scheduleJob = schedule.scheduleJob(job_rule, ()=> {
                        if (!self.job_pause) {
                            job_exec();
                        }
                    });
                    this.job_running = true;
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is started.');
                }
                else {
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is already running.');
                }
            }

            function stopJob() {
                if (this.scheduleJob) {
                    this.scheduleJob.cancel();
                    this.job_running = false;
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is canceled.');
                }
            }

            function suspendJob() {
                if (this.scheduleJob) {
                    this.job_pause = true;
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is suspended.');
                }
            }

            function resumeJob() {
                if (this.scheduleJob) {
                    this.job_pause = false;
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is resumed.');
                }
            }

            job_stores[job_id] = job;
            this.length++;

            job.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is created.');

            if (options.autoStart) {
                job.start();
            }
        }

        return job;
    },
    destroyJob: function (job_id) {
        var job = job_stores[job_id];
        if (job) {
            job.stop();
            job_stores[job_id] = job = null;
            this.length--;
            this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is destroyed.');
        }
    }
};