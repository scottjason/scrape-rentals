angular.module('ScrapeRentals')
  .service('DataService', function() {

    'use strict'

    var map = {
      'AL': 'Alabama',
      'AK': 'Alaska',
      'AZ': 'Arizona',
      'AR': 'Arkansas',
      'CA': 'California',
      'CO': 'Colorado',
      'CT': 'Connecticut',
      'DE': 'Delaware',
      'DC': 'District-Of-Columbia',
      'FL': 'Florida',
      'GA': 'Georgia',
      'HI': 'Hawaii',
      'ID': 'Idaho',
      'IL': 'Illinois',
      'IN': 'Indiana',
      'IA': 'Iowa',
      'KS': 'Kansas',
      'KY': 'Kentucky',
      'LA': 'Louisiana',
      'ME': 'Maine',
      'MD': 'Maryland',
      'MA': 'Massachusetts',
      'MI': 'Michigan',
      'MN': 'Minnesota',
      'MS': 'Mississippi',
      'MO': 'Missouri',
      'MT': 'Montana',
      'NE': 'Nebraska',
      'NV': 'Nevada',
      'NH': 'New-Hampshire',
      'NJ': 'New-Jersey',
      'NM': 'New-Mexico',
      'NY': 'New-York',
      'NC': 'North-Carolina',
      'ND': 'North-Dakota',
      'OH': 'Ohio',
      'OK': 'Oklahoma',
      'OR': 'Oregon',
      'PA': 'Pennsylvania',
      'RI': 'Rhode-Island',
      'SC': 'South-Carolina',
      'SD': 'South-Dakota',
      'TN': 'Tennessee',
      'TX': 'Texas',
      'UT': 'Utah',
      'VT': 'Vermont',
      'VA': 'Virginia',
      'WA': 'Washington',
      'WV': 'West-Virginia',
      'WI': 'Wisconsin',
      'WY': 'Wyoming',
    };

    function generateOpts(obj, cb) {
      var opts = {};
      var arr = (obj.address.formatted_address).split(',');
      arr.forEach(function(elem, index) {
        if (index === 0) {
          opts.city = elem.trim();
        } else if (index === 1) {
          opts.state = elem.trim();
        }
      });
      opts.url = 'http://www.rentals.com/';
      var arr = opts.city.split(' ');
      if (arr.length > 1) {
        opts.city = '';
        arr.forEach(function(elem, index) {
          if (index !== arr.length - 1) {
            opts.city += (elem + '-');
          } else {
            opts.city += elem;
          }
        });
      }
      opts.url += map[opts.state] + '/' + opts.city + '/'
      cb(opts);
    };

    return ({
      generateOpts: generateOpts
    });
  });
