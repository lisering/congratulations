var express = require('express');
var router = express.Router();
var db = require('../data/db');
var cache = require('../cache/cache');

/* GET state page. */
router.get('/:id', cache(10), function(req, res, next) {
  setTimeout(() => {
      let sql = `SELECT * FROM state WHERE id='${req.params.id}'`;
      let query = db.query(sql, (err, result) => {
          console.log(sql);
          if (err) {
              console.log(err);
          }
          res.render('add', { state: result[0] });
      });
  }, 500)
});

module.exports = router;
