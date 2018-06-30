var express = require('express');
var router = express.Router();
var allWalkins = require('../walkins');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("params", req.params);
  console.log("params", req.query);
  allWalkins.filter((walkin) => walkin.id.toString() === req.query['id']);
  res.render('index', 
    { 
      title: 'Express',
      walkin: (allWalkins.length || {}) && allWalkins[0]
    });
});

module.exports = router;


