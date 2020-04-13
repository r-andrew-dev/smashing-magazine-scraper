$('#scrape').on('click', function () {
  $('#article-holder').empty();
  $.getJSON("/scrape", function (data) {
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#article-holder").append(
        `<div class='article ${data[i]._id} card border-success mb-3'>
            <h5 class="card-header bg-success">${data[i].title}</h5>
            <p class='card-text text-success ml-3 mt-3' style='font-size:22px;'>${data[i].summary}</p>
            <a class='ml-3 pb-3' href='${data[i].link}' target='_blank'>Read More</a><br><br>
            </div>
          </div>`)
      if (!data[i].saved) {
        $(`.article.${data[i]._id}`).append(`
            <button class='save-it ${data[i]._id} btn btn-danger m-3' data-id='${data[i]._id}'>Save</button>
            </div>`)
      } else {
        $(`.article.${data[i]._id}`).append('<h5 class="text-success m-3">Article already saved!</h5>')
      }
    }

  });

});

$('#saved').on('click', function () {
  $('#article-holder').empty();
  $.getJSON("/api/saved", function (data) {
    $("#article-holder").append('<h1>Saved Articles</h1>')
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
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

// Whenever someone clicks save button
$('#article-holder').on("click", ".save-it", function () {

  let thisId = $(this).attr('data-id')
  console.log(thisId)

  $.ajax({
      method: "POST",
      url: "/api/articles/" + thisId,
      data: {
        id: thisId
      }
    })
    // With that done
    .then(function () {
      console.log(this)
      $(`.${thisId}`).hide();
      $(`.article .${thisId}`).append('<h2>Saved!</h2>')

    }).catch(function (err) {
      console.log(err)
    })
})

// whenever someone clicks to delete an article, a POST request is sent to /api/saved:id
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
    // With that done
    .then(function () {

      $(`#${thisid}`).toggle();

    }).catch(function (err) {
      console.log(err)
    })
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

  if (!body || !title) {
    $("#ModalTitle").text('Please fill in title and comment!')
  }
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
      $('#ModalTitle').text('Comment saved!')
      $("#titleinput").empty()
      $("#bodyinput").empty()

    }).catch(function (err) {
      console.log(err)
    })
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