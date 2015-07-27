var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var util = require('util');
var _ = require('underscore');

exports.render = function(req, res, next) {
  res.render('index');
};

exports.scrape = function(req, res, next) {

  async.waterfall([
      function(callback) {
        var rentals = [];
        var opts = {
          normalizeWhitespace: true,
          xmlMode: false
        };
        request(req.body.rentalsUrl, function(err, response, html) {
          if (err) return callback(err);
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
              rentals.push(listing);
            });
            callback(null, rentals);
          } else {
            callback(null, rentals);
          }
        });
      },
      function(rentals, callback) {
        var trulia = [];
        var opts = {
          normalizeWhitespace: true,
          xmlMode: false
        };
        request(req.body.truliaUrl, function(err, response, html) {
          console.log(response.statusCode);
          if (err) return callback(err);
          if (response.statusCode === 200) {
            var $ = cheerio.load(html, opts);
            var container = $('#listView').children();
            _.each(container, function(obj) {
              console.log('trulia obj', obj);
              var listing = {};
              // listing.title = $(obj).find('a').attr('title');
              // listing.title = (listing.title.length > 28) ? listing.title.slice(0, 25) + '...' : listing.title;
              // listing.href = $(obj).find('a').attr('href');
              // listing.imageLink = $(obj).children('.placardContent').children('div.media').children('div.imageContainer').children('.carouselInner').children('div.item').find('meta').attr('content');
              // listing.location = $(obj).children('.placardContent').children('div.propertyInfo').children('div.location').children('.cityState').children('.city').attr('title');
              // listing.location = (listing.location.indexOf('&#39') !== 1) ? listing.location.replace("&#39;", "") : listing.location;
              // listing.location = listing.location.replace(/(\r\n|\n|\r)/gm, "");
              // listing.price = $(obj).children('.placardContent').children('div.propertyInfo').children('div.apartmentRentRollupContainer').find('p.altRentDisplay').text();
              // listing.size = $(obj).children('.placardContent').children('div.propertyInfo').children('div.apartmentRentRollupContainer').find('p.unitLabel').text();
              // console.log('#### listing', listing);
              // trulia.push(listing);
            });
            callback(null, rentals, trulia);
          } else {
            callback(null, rentals, trulia);
          }
        });
      },
    ],
    function(err, rentals, trulia) {
      if (err) return next(err);
      res.status(200).send({
        rentals: rentals,
        trulia: trulia
      })
    }
  )
};
