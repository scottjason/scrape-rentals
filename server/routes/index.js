var express = require('express');
var router = express.Router();
var indexCtrl = require('../controllers')

router.get('/', indexCtrl.render);
router.post('/', indexCtrl.scrape);

module.exports = router;
