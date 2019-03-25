// Make sure we wait to attach our handlers until the DOM is fully loaded.

$(document).ready(function () {

  $("#scrapeArticles").click(function () {
    console.log("start scrape");
    $.get("/scrape");
    $("#magGlass").addClass("test-animation");

    setTimeout(function () {
      location.replace("/articles");

    }, 6000);

  });



  console.log("ready!");
  // reference specific clicked item.
  this.globalClick = function (article, noteBody) {
    const thisId = article;
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: noteBody
      }
    })
  }

  this.globalDelete = function (article) {
    const thisId = article;
    $.ajax({
      method: "DELETE",
      url: "/articles/" + thisId,
      data: {
        body: noteBody
      }
    })
  }

});


// $(".delete-cat").on("click", function(event) {
//   var id = $(this).data("id");

//   // Send the DELETE request.
//   $.ajax("/api/cats/" + id, {
//     type: "DELETE"
//   }).then(
//     function() {
//       console.log("deleted cat", id);
//       // Reload the page to get the updated list
//       location.reload();
//     }
//   );
// });









// $(function() {
//   $(".change-sleep").on("click", function(event) {
//     var id = $(this).data("id");
//     var newSleep = $(this).data("newsleep");

//     var newSleepState = {
//       sleepy: newSleep
//     };

//     // Send the PUT request.
//     $.ajax("/api/cats/" + id, {
//       type: "PUT",
//       data: newSleepState
//     }).then(
//       function() {
//         console.log("changed sleep to", newSleep);
//         // Reload the page to get the updated list
//         location.reload();
//       }
//     );
//   });

//   $(".create-form").on("submit", function(event) {
//     // Make sure to preventDefault on a submit event.
//     event.preventDefault();

//     var newCat = {
//       name: $("#ca").val().trim(),
//       sleepy: $("[name=sleepy]:checked").val().trim()
//     };

//     // Send the POST request.
//     $.ajax("/api/cats", {
//       type: "POST",
//       data: newCat
//     }).then(
//       function() {
//         console.log("created new cat");
//         // Reload the page to get the updated list
//         location.reload();
//       }
//     );
//   });

  // $(".delete-cat").on("click", function(event) {
  //   var id = $(this).data("id");

  //   // Send the DELETE request.
  //   $.ajax("/api/cats/" + id, {
  //     type: "DELETE"
  //   }).then(
  //     function() {
  //       console.log("deleted cat", id);
  //       // Reload the page to get the updated list
  //       location.reload();
  //     }
  //   );
  // });
// });
