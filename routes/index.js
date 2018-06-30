var express = require('express');
var router = express.Router();
var allWalkins = require('../walkins');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("params", req.params);
  allWalkins.filter((walkin) => walkin.id.toString() === req.params['id']);
  res.render('index', 
    { 
      title: 'Express',
      walkin: (allWalkins.length || {}) && allWalkins[0]
    });
});

module.exports = router;


