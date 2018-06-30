var express = require('express');
var router = express.Router();
var allWalkins = require('../walkins');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("params", req.params);
  console.log("params", req.query);
  const walkin = allWalkins.filter((walkin) => walkin.id.toString() === req.query['id']);
  if(walkin.length !== 0) {
    res.render('walkin', 
    { 
      title: 'Express',
      walkin: walkin[0]
    });
  }
  else {
    res.render('index', 
    { 
      title: 'Index page of the application'
    });
  }
  
});

module.exports = router;


