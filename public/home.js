// When user clicks scrape articles
$('#scrape').on('click', function () {
  $('#article-holder').empty();
  $.getJSON("/scrape", function (data) {
    for (var i = 0; i < data.length; i++) {
      // Display each of the articles in cards
      $("#article-holder").append(
        `<div class='article ${data[i]._id} card border-success mb-3'>
            <h5 class="card-header bg-success">${data[i].title}</h5>
            <p class='card-text text-success ml-3 mt-3' style='font-size:22px;'>${data[i].summary}</p>
            <a class='ml-3 pb-3' href='${data[i].link}' target='_blank'>Read More</a><br><br>
            </div>
          </div>`)
      // If the article is not saved, append a button to save it
      if (!data[i].saved) {
        $(`.article.${data[i]._id}`).append(`
            <button class='save-it ${data[i]._id} btn btn-danger m-3' data-id='${data[i]._id}'>Save</button>
            </div>`)
      // else append an h5 stating it is already saved. 
      } else {
        $(`.article.${data[i]._id}`).append('<h5 class="text-success m-3">Article saved!</h5>')
      }
    }

  });

});

// when user clicks link to saved articles 
$('#saved').on('click', function () {
  $('#article-holder').empty();
  $.getJSON("/api/saved", function (data) {
    $("#article-holder").append('<h1>Saved Articles</h1>')
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display all articles where saved: true;
      $("#article-holder").append(
        `<div class='article card border-success mb-3' id='${data[i]._id}'>
              <h5 class='card-header bg-success'>${data[i].title}</h5>
              <p class='card-text text-success ml-3 mt-3' style='font-size:22px;'>${data[i].summary}</p>
              <a href='${data[i].link}' target='_blank' class='ml-3 pb-3'}'>Read More</a><br><br>
              <button class='delete-it btn btn-danger m-3' data-id='${data[i]._id}'>Delete from Saved</button>
              <button class='comment-it btn btn-danger m-3' data-toggle="modal" data-target="#exampleModalCenter" data-comment='${data[i].comment}' data-id='${data[i]._id}'>Comments</button>
              </div>`)
    }
  });

});

// Whenever someone clicks save button on an article
$('#article-holder').on("click", ".save-it", function () {

  let thisId = $(this).attr('data-id')

  $.ajax({
      method: "POST",
      url: "/api/articles/" + thisId,
      data: {
        id: thisId
      }
    })

    $(`.article.${thisId} .save-it`).toggle();
    $(`.article.${thisId}`).append('<h5 class="text-success m-3">Article saved!</h5>')
})

// whenever someone clicks to delete an article from saved, a POST request is sent to /api/saved:id
$('#article-holder').on("click", ".delete-it", function () {

  let thisId = $(this).attr('data-id')
  console.log(thisId)

  $.ajax({
      method: "POST",
      url: "/api/saved/:id" + thisId,
      data: {
        id: thisId
      }
    })

    $(`#${thisId}`).empty();
    $(`#${thisId}`).append('<h3 class="removed text-success m-3">Removed from saved!</h3>')

})

$('#article-holder').on("click", ".comment-it", function () {

  let thisId = $(this).attr('data-id')

  $('.save-comment').attr('data-id', `${thisId}`)

  // Empty the notes from the note section
  $("#notes").empty();

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // If there's a note in the article
      if (data.comment) {
        for (var i = 0; i < data.comment.length; i++) {
          $('#notes').append(`<div id='${data.comment[i]._id}'><h4>${data.comment[i].title}</h4>
        <p>${data.comment[i].body}</p>
        <button class='delete-comment btn btn-danger' data-id='${data.comment[i]._id}>X</button>
        </div>`)
        }
      }
    });
});

// whenever someone clicks save an article comment, a POST request is sent to /api/comment:id
$('.save-comment').on("click", function () {

  let thisId = $(this).attr('data-id')
  let title = $("#titleinput").val()
  let body = $("#bodyinput").val()

  if (body.length <6 || title.length < 6) {
    $("#ModalTitle").text('Please fill in title and comment of at least five characters!')
  } else {
  $.ajax({
      method: "POST",
      url: "/comment/" + thisId,
      data: {
        // Value taken from title input
        title: title,
        // Value taken from note textarea
        body: body
      }
    })
    // With that done
    .then(function () {

    }).catch(function (err) {
      console.log(err)
    })

    $('#ModalTitle').text('Comment saved!');
      $("#titleinput").val('');
      $("#bodyinput").val('');

  }
})

$('#notes').on('click', '.delete-comment', function () {

  let thisId = $(this).attr('data-id')

  $.ajax({
      method: "POST",
      url: "/comment/delete/" + thisId,
      data: {
        // Value taken from title input
        id: thisId
      }
    })
    // With that done
    .then(function () {
      $('#ModalTitle').text('Comment deleted!')
      $(`#${thisId}`).hide();

    }).catch(function (err) {
      console.log(err)
    })
})