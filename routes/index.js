var express = require('express');
var router = express.Router();
var db = require('../data/db');
var url = require('url');
var multer = require('multer');
var cache = require('../cache/cache');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
  
var upload = multer({ storage: storage }).single('stateimg');
/* GET stateList page. */
router.get('/', cache(10), (req, res, next) => {
    setTimeout(() => {
        let sql = 'SELECT * FROM state ORDER BY recordTime';
        let query = db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            let area = new Set();
            result.forEach((i, v) => {
                area.add(i.areaName);
            });
            // let province = new Set();
            // result.forEach((i, v) => {
            //     province.add(i.province);
            // });
            // let city = new Set();
            // result.forEach((i, v) => {
            //     city.add(i.city);
            // });
            // let country = new Set();
            // result.forEach((i, v) => {
            //     country.add(i.area);
            // });
            // res.render('index', {states: result, areas: [...area], provinces: [...province], cities: [...city], countries: [...country]});
            res.render('index', {states: result, areas: [...area]});
        });
    }, 500);
});

//搜索
router.get('/search', (req, res, next) => {
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
    
    var sql = 'SELECT * FROM state WHERE 1=1' + areaStr + provinceStr + cityStr + countryStr + stateNameStr;

    if (sql) {
        console.log(sql);
        db.query(sql, (err, result) => {
            if (err) {
                res.json({error: err});
            }
            var jsonData = {};
            if (stype !== undefined || stype !== '') {
                let tempSet = new Set();
                result.forEach((i, v) => {
                    tempSet.add(i[stype]);
                });
                jsonData[stype] = [...tempSet];
            }
            jsonData.states = result;
            res.json(jsonData);
        });
    }
});

//投票
router.get('/vote', (req, res, next) => {
    let id = req.query.id;
    let sql = `UPDATE state SET stateVotes=stateVotes+1 WHERE id='${id}'`;
    let iquery = db.query(sql, (err, result) => {
        if (err) {
            res.json({error: err});
        }
        console.log(sql);
        res.json({message: 'success'});
    });
    // var openId = req.query.openId,
    //     stateName = req.query.stateName;
    // if (openId) {
    //     let sql = `SELECT * FROM vote WHERE stateName='${stateName}' AND openid='${openId}'`;
    //     console.log(sql);
    //     let query = db.query(sql, (err, result) => {
    //         if (err) {
    //             res.json({error: err});
    //         }
    //         console.log(sql);
    //         console.log(result);
    //         if (!!result && result.length === 0) {
    //             let isql = 'INSERT INTO vote SET ?';
    //             let iquery = db.query(isql, {openid: openId, stateName: stateName}, (err, result) => {
    //                 if (err) {
    //                     res.json({error: err});
    //                 }
    //                 let usql = `UPDATE state SET stateVotes=stateVotes+1 WHERE stateName='${stateName}'`;
    //                 let uquery = db.query(usql, (err, result) => {
    //                     console.log(usql);
    //                     if (err) {
    //                         res.json({error: err});
    //                     }
    //                     console.log(result);
    //                     res.json({message: 'success'});
    //                 });
    //             });
    //         } else {
    //             res.json({
    //                 message: 'failed'
    //             });
    //         }
    //     });
    // }
});

//修改站点信息
router.post('/poststate', (req, res, next) => {
  console.log('poststate');
  upload(req, res, function(err) {
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
      let query = db.query(sql, stateData, (err, result) => {
        console.log(sql);
        if (err) {
          console.log(err);
        }
        res.redirect('/list');
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
    var orderBy = req.params.orderby ? ' ORDER BY CONVERT('+req.params.orderby+' USING GBK) ': '';
    var order = req.params.order ? ' ' + req.params.order : '';
    var sql = 'SELECT * FROM state WHERE 1=1' + areaStr + provinceStr + cityStr + countryStr + stateNameStr + orderBy + order;

    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(sql);
            res.json(result);
        });
    }, 500);
});

module.exports = router;
