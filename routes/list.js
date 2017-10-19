var express = require('express');
var router = express.Router();
var db = require('../data/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  let sql = 'SELECT * FROM state ORDER BY stateImg ASC';
  let query = db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.render('list', {states: result});
    console.log(result);
  });
});

module.exports = router;
