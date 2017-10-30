var express = require('express');
var router = express.Router();
var db = require('../data/db');
var cache = require('../cache/cache');

/* GET state page. */
router.get('/:id', cache(10), function(req, res, next) {
  setTimeout(() => {
      db.getConnection((err, conn) => {
        let sql = `SELECT * FROM state WHERE id='${req.params.id}'`;
        conn.query(sql, (err, result) => {
            conn.release();
            console.log(sql);
            if (err) {
                console.log(err);
            }
            res.render('add', { state: result[0] });
        });
      });
  }, 500);
});

module.exports = router;
