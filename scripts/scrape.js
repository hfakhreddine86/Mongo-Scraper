// scrape script

// Require request and cheerio
var request = require("request");
var cheerio = require("cheerio");


var scrapeInScriptsFile = function (cb) {

  request("http://www.articlesfactory.com/articles/technology.html", function (err, res, body) {

    var $ = cheerio.load(body);

    var articles = [];

    $(".post-item-frontpage").each(function (i, element) {

      var head = $(this).children("header").children(".entry-title").text().trim();

      var url = $(this).children("header").children(".entry-title").children("a").attr("href");

      var sum = $(this).children(".item__content").children(".entry-summary").children("p").text().trim();

      if (head && sum && url) {

        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: url
        };

        articles.push(dataToAdd);
      }
    });
    cb(articles);
  });
};

// Export the function
module.exports = scrapeInScriptsFile;
