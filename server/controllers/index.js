var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var util = require('util');
var _ = require('underscore');

exports.render = function(req, res, next) {
  res.render('index');
};

exports.scrape = function(req, res, next) {

  var results = [];
  var opts = {
    normalizeWhitespace: true,
    xmlMode: false
  };
  request(req.body.url, function(err, response, html) {
    if (err) return next(err);
    if (response.statusCode === 200) {
      var $ = cheerio.load(html, opts);
      var container = $('#search_results').children('.result');
      _.each(container, function(obj) {
        var listing = {};
        listing.title = $(obj).children('.column1').find('a').attr('title');
        listing.title = (listing.title.length > 28) ? listing.title.slice(0, 25) + '...' : listing.title;
        listing.href = 'http://www.rentals.com' + $(obj).children('.column1').find('a').attr('href');
        listing.imageLink = $(obj).children('.column1').children('.listing_photo').find('img').attr('data-original');
        listing.location = $(obj).children('.listing_details').children().find('h5').text();
        listing.price = $(obj).children('.listing_details').children().find('p.listing_price').text();
        listing.size = $(obj).children('.listing_details').children().find('p.listing_size').text();
        listing.size = listing.size.slice(1);
        listing.phone = $(obj).children('.listing_details').children().find('a.listing_phone').text();
        results.push(listing);
      });
      res.status(200).json(results);
    } else {
      res.status(401).json(results);
    }
  });
};
