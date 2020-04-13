$('#scrape').on('click', function() {
  $('#article-holder').empty();
  $.getJSON("/scrape", function(data) {
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#article-holder").append(
          `<div class='article ${data[i]._id}'>
            <h3>${data[i].title}</h3>
            <br>
            <p>${data[i].summary}</p>
            <a href='${data[i].link}' target='_blank'>Read More</a></div>
            <button class='save-it ${data[i]._id} btn btn-danger' data-id='${data[i]._id}'>Save</button>
            </div>`)
      }
    });
  
  });
  
  $('#saved').on('click', function() {
    $('#article-holder').empty();
    $.getJSON("/api/saved", function(data) {
      $("#article-holder").append('<h1>Saved Articles</h1>')
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          $("#article-holder").append(
            `<div class='article' id=${data[i]._id}>
              <h3>${data[i].title}</h3>
              <br>
              <p>${data[i].summary}</p>
              <a href='${data[i].link}' target='_blank' style='{color:red; font-size: 22px;}'>Read More</a></div>
              <p>${data[i].comment}</p>
              <button class='delete-it btn btn-danger' data-id='${data[i]._id}'>Delete from Saved</button>
              <button class='comment-it btn btn-danger' data-toggle="modal" data-target="#exampleModalCenter" data-id='${data[i]._id}''>Comment</button>
              </div>`)

        }
      });
    
    });
  
  // Whenever someone clicks save button
  $('#article-holder').on("click", ".save-it", function() {
    
    const thisId = $(this).attr('data-id')
    console.log(thisId)

    $.ajax({
            method: "POST",
            url: "/api/articles/" + thisId,
            data: {
              id: thisId
            }
          })
            // With that done
            .then(function() {

        $(`.save-it ${thisId}`).toggle();
        $(`.article ${thisId}`).append('<h2>Saved!</h2>')

            }).catch(function(err) {
              console.log(err)
            })
  })
  
  // whenever someone clicks to delete an article, a POST request is sent to /api/saved:id
  $('#article-holder').on("click", ".delete-it", function() {
    
    const thisId = $(this).attr('data-id')
    console.log(thisId)

    $.ajax({
            method: "POST",
            url: "/api/saved/:id" + thisId,
            data: {
              id: thisId
            }
          })
            // With that done
            .then(function() {

        $(`#${thisid}`).toggle();

            }).catch(function(err) {
              console.log(err)
            })
  })
  


//     // Now make an ajax call for the Article
//     $.ajax({
//       method: "GET",
//       url: "/articles/" + thisId
//     })
//       // With that done, add the note information to the page
//       .then(function(data) {
//         console.log(data);
//         // The title of the article
//         $("#notes").append("<h2>" + data.title + "</h2>");
//         // An input to enter a new title
//         $("#notes").append("<input id='titleinput' name='title' >");
//         // A textarea to add a new note body
//         $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//         // A button to submit a new note, with the id of the article saved to it
//         $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
//         // If there's a note in the article
//         if (data.note) {
//           // Place the title of the note in the title input
//           $("#titleinput").val(data.note.title);
//           // Place the body of the note in the body textarea
//           $("#bodyinput").val(data.note.body);
//         }
//       });
//   });
  
//   // When you click the savenote button
//   $(document).on("click", "#savenote", function() {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");
  
//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//       method: "POST",
//       url: "/articles/" + thisId,
//       data: {
//         // Value taken from title input
//         title: $("#titleinput").val(),
//         // Value taken from note textarea
//         body: $("#bodyinput").val()
//       }
//     })
//       // With that done
//       .then(function(data) {
//         // Log the response
//         console.log(data);
//         // Empty the notes section
//         $("#notes").empty();
//       });
  
//     // Also, remove the values entered in the input and textarea for note entry
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
//   });
  