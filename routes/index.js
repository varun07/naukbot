var express = require('express');
var router = express.Router();
var allWalkins = require('../walkins');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("params", req.params);
  console.log("query", req.query);
  console.log(allWalkins);
  const walkins = allWalkins.filter((walkin) => walkin.id.toString() === req.query['id']);
  console.log(walkins);
  if(walkins.length !== 0) {
    res.render('walkin', 
    { 
      title: walkins[0].organization.toUpperCase(),
      walkin: walkins[0]
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


