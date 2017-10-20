var express = require('express');
var router = express.Router();
var db = require('../data/db');
var cache = require('../cache/cache');

/* GET list page. */
router.get('/', cache(10), function(req, res, next) {
  setTimeout(() => {
      let sql = 'SELECT * FROM state ORDER BY stateImg ASC';
      let query = db.query(sql, (err, result) => {
          if (err) {
              console.log(err);
          }
        let area = new Set();
            result.forEach((i, v) => {
                area.add(i.areaName);
            });
          res.render('list', {states: result, areas: [...area]});
          console.log(result);
      });
  }, 500)
});

module.exports = router;
