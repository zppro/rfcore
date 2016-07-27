/**
 * Created by zppro on 15-5-13.
 */
require("should");
var moment = require("moment");
var statHelper = require('../lib/statHelper');


describe("statHelper", function() {
    console.log(statHelper);
    var s1 = moment([2016,4,18]);

    var ret1 = statHelper.rangeDateAsMonth(s1);
    it("statHelper.rangeDateAsMonth('2016-05-18') should equal ['2016-05','2016-06','2016-07'].", function() {
        ret1[0].should.eql('2016-05');
        ret1[1].should.eql('2016-06');
        ret1[2].should.eql('2016-07');
    });
    var s2 = moment([2015,4,18]);
    var e2 = moment([2016,4,18]);
    var ret2 = statHelper.rangeDateAsYear(s2,e2);
    it("statHelper.rangeDateAsYear('2015-05-18','2016-05-18') should equal ['2015','2016'].", function() {
        ret2[0].should.eql('2015');
        ret2[1].should.eql('2016');
    });

    var s3 = moment([2016,4,18]);
    var e3 = moment([2016,4,24]);
    var ret3 = statHelper.rangeDateAsDay(s3,e3);
    it("statHelper.rangeDateAsDay('2016-05-18','2016-05-21') should equal ['2016-05-18','2016-05-19','2016-05-20','2016-05-21'].", function() {
        ret3[0].should.eql('2016-05-18');
        ret3[1].should.eql('2016-05-19');
        ret3[2].should.eql('2016-05-20');
        ret3[3].should.eql('2016-05-21');
    });

});
