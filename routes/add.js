var express = require('express');
var router = express.Router();
var db = require('../data/db');

/* GET state page. */
router.get('/:id', function(req, res, next) {
  let sql = `SELECT * FROM state WHERE id='${req.params.id}'`;
  let query = db.query(sql, (err, result) => {
    console.log(sql);
    if (err) {
      console.log(err);
    }
    res.render('add', { state: result[0] });
  });
});

module.exports = router;
