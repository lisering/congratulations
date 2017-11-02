var express = require('express');
var router = express.Router();
var db = require('../data/db');
var url = require('url');
var multer = require('multer');
var cache = require('../cache/cache');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/v/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

var upload = multer({ storage: storage }).single('stateimg');
/* GET stateList page. */
router.get('/', cache(10), (req, res, next) => {
    db.getConnection((err, conn) => {
        setTimeout(() => {
            let sql = 'SELECT * FROM state ORDER BY recordTime';
            conn.query(sql, (err, result) => {
                conn.release();
                if (err) {
                    console.log(err);
                }
                let area = new Set();
                let states = [];
                result.forEach((i, v) => {
                    area.add(i.areaName);
                    if (i.stateImg) {
                        states.push(i);
                    }
                });
                res.render('index', { states: states, areas: [...area] });
            });
        }, 500);
    });
});

//搜索
router.get('/search', (req, res, next) => {
    var
        areaName = req.query.area,
        province = req.query.province,
        city = req.query.city,
        country = req.query.country,
        stateName = (req.query.state).trim(),
        stype = req.query.stype;

    var areaStr = areaName ? ' AND areaName="' + areaName + '"' : '';
    var provinceStr = province ? ' AND province="' + province + '"' : '';
    var cityStr = city ? ' AND city="' + city + '"' : '';
    var countryStr = country ? ' AND country="' + country + '"' : '';
    var stateNameStr = stateName ? ' AND stateName LIKE "%' + stateName + '%"' : '';

    var sql = 'SELECT * FROM state WHERE 1=1' + areaStr + provinceStr + cityStr + countryStr + stateNameStr;

    if (sql) {
        db.getConnection((err, conn) => {
            console.log(sql);
            conn.query(sql, (err, result) => {
                conn.release();
                if (err) {
                    res.json({ error: err });
                }
                var jsonData = {};
                var states = [];
                if (stype !== undefined  || stype !== 'null' || stype !== '') {
                    let tempSet = new Set();
                    result.forEach((i, v) => {
                        tempSet.add(i[stype]);
                        if (i.stateImg) {
                            states.push(i);
                        }
                    });
                    jsonData[stype] = [...tempSet];
                }
                jsonData.states = states;
                jsonData.allStates = result;
                res.json(jsonData);
            });
        });
    }
});

//投票
router.get('/vote', (req, res, next) => {
    let id = req.query.id;
    var currentDate = Date.now();
    var futureDate = (new Date("2017-11-08 00:00:00")).getTime(); //活动结束时间
    let sql = `UPDATE state SET stateVotes=stateVotes+1 WHERE id='${id}'`;
    console.log("currentDate: "+currentDate);
    console.log("futureDate: "+futureDate);
    if (currentDate > futureDate) {
        return res.json({passed: true});
    }
    db.getConnection((err, conn) => {
        conn.query(sql, (err, result) => {
            conn.release();
            if (err) {
                res.json({ error: err });
            }
            console.log(sql);
            res.json({ message: 'success' });
        });
    });
});

//修改站点信息
router.post('/poststate', (req, res, next) => {
    console.log('poststate');
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('上传成功');
            let body = req.body;
            let file = req.file;
            let stateData = {
                areaName: body.areaname,
                stateName: body.statename,
                stateImg: !!file ? file.path.replace('public', '').replace(/\\/g, '/') : req.body.oldstateimg,
                stateDescription: body.statedescription
            };
            let sql = 'UPDATE state SET ? WHERE id="' + req.body.stateid + '"';
            db.getConnection((err, conn) => {
                conn.query(sql, stateData, (err, result) => {
                    console.log(sql);
                    conn.release();
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/v/list');
                });
            });
        }
    });
});

//排序
router.get('/order/:orderby/:order', cache(10), (req, res, next) => {
    setTimeout(() => {
        var
            areaName = req.query.area,
            province = req.query.province,
            city = req.query.city,
            country = req.query.country,
            stateName = req.query.state,
            stype = req.query.stype;

        var areaStr = areaName ? ' AND areaName="' + areaName + '"' : '';
        var provinceStr = province ? ' AND province="' + province + '"' : '';
        var cityStr = city ? ' AND city="' + city + '"' : '';
        var countryStr = country ? ' AND country="' + country + '"' : '';
        var stateNameStr = stateName ? ' AND stateName LIKE "%' + stateName + '%"' : '';
        var orderBy = req.params.orderby ? (req.params.orderby === 'stateName' || req.params.orderby === 'areaName' || req.params.orderby === 'stateDescription' ? ' ORDER BY CONVERT(' + req.params.orderby + ' USING GBK)' : ' ORDER BY ' + req.params.orderby) : '';
        var order = req.params.order ? ' ' + req.params.order : '';
        var sql = 'SELECT * FROM state WHERE 1=1' + areaStr + provinceStr + cityStr + countryStr + stateNameStr + orderBy + order;

        db.getConnection((err, conn) => {
            conn.query(sql, (err, result) => {
                conn.release();
                if (err) {
                    console.log(err);
                }
                console.log(sql);
                res.json(result);
            });
        });
    }, 500);
});

module.exports = router;
