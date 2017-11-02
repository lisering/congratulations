var express = require('express');
var router = express.Router();
var db = require('../data/db');
var cache = require('../cache/cache');

/* GET state page. */
router.get('/:id', cache(10), function(req, res, next) {
  setTimeout(() => {
      db.getConnection((err, conn) => {
        let sql = `SELECT * FROM ?? WHERE ??='${req.params.id}'`;
        sql = conn.format(sql, ['state', 'id']);
        console.log(sql);
        conn.query(sql, (err, result) => {
            conn.release();
            if (err) {
                console.log(err);
            }
            res.render('add', { state: result[0] });
        });
      });
  }, 500);
});

module.exports = router;
