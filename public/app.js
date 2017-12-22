$(document).ready(function () {

  $(".button-collapse").sideNav();

  $(document).on("click", ".scrapeButton", function () {

    $.ajax({
      method: "GET",
      url: "/scrape",
    }).done(function () {
      console.log("hello");
      window.location.href = "/";
    });
  });
  $('.modal').modal();
});

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  if (data.length !== 0) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<div class = 'col s9'>" +
        "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + "</div>" + "<div class = 'col s3'>" + "<button class='save waves-effect waves-light btn blue' id='" + data[i]._id + "'>Save Article</button>" + "</div>");
    }
  } else {
    var noArticles = $("#articles").append("<h3>UH OH! Looks like we don't have any articles.</h3>");
  }
});

// Grab the articles as a json
$.getJSON("/saved", function (data) {
  if (data.length !== 0) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      $("#savedArticles").append("<div class = 'col s9'>" +
        "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" +
        "</div>" +
        "<div class = 'col s3'>" + "<a data-id='" + data[i]._id + "' class='note waves-effect waves-light btn modal-trigger center blue' id='" + data[i]._id + "' href='#modal" + data[i]._id + "'>Add a Note</a>" + "<div id='modal" + data[i]._id + "' class='modal'>" +
        "<div class='modal-content'>" + "<h4>Notes For Article: " + data[i].title + "<h4>" + "<div class='row'>" + "<form class='col s12'>" + "<div class='row'>" + "<div class='input-field col s12'>" + "<textarea id='title" + data[i]._id + "' name='title' class='materialize-textarea'></textarea>" + "<label for='titleInput'>Title</label>" + "</div>" + "<div class='input-field col s12'>" + "<textarea id='body" + data[i]._id + "' name='body' class='materialize-textarea'></textarea>" + "<label for='bodyInput'>Enter Note</label>" + "</div>" + "</div>" +
        "</form>" + "</div>" + "</div>" + "<div class='modal-footer'>" + "<a data-id='" + data[i]._id + "' href='#!' id='savenote' class='modal-action modal-close waves-effect waves-green btn-flat'>Save Note</a>" + "</div>" + "</div>");
    }
  } else {
    var noArticles = $("#savedArticles").append("<h3>No articles to display!</h3>");
  }
});

$(document).on("click", ".save", function () {
  var thisId = $(this).attr("id");
  $.ajax({
    method: "POST",
    url: "/saved" + thisId
  }).done(function (data) {
    $("#modalSaved").modal("open");
  });
});

// Whenever someone clicks a p tag
$(document).on("click", ".note", function () {

  // Save the id from the p tag
  var thisId = $(this).attr("id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/savedArticles/" + thisId
    })
    // With that done, add the note information to the page
    .done(function (data) {

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#title" + thisId).text(data.note.title);
        // Place the body of the note in the body textarea
        $("#body" + thisId).text(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/savedArticles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#title" + thisId).val(),
        // Value taken from note textarea
        body: $("#body" + thisId).val()
      }
    })
    // With that done
    .done(function (data) {});
});

$(document).on("click", ".savedArticlesButton", function () {

  $.ajax({
    method: "GET",
    url: "/saved",
    success: function (data) {
      window.location.href = "/savedArticles";
    }
  });
});