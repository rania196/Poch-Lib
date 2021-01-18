function setFavori(item) {
  return $('<div class="livre">' +
  '<button class="trash" id="'+item.id+'" onclick="trash(\''+item.id+'\')"><i class="fa fa-trash fa_custom fa-1x"></i></button>' +
  '<h3>Titre : ' + item.name + '</h3>' +
  '<h5> Id :' + item.id + '</h5>' +
  '<h5> Auteur : ' + item.author +'</h5>' +
  '<p> Description: ' + item.description+ '</p>' +
  '<img src=' + item.image + '>'+
  '</div>');
}


function favori(item) {
  let pochList = [];
  if(sessionStorage.getItem("maPochList") !== null) {
    pochList = JSON.parse(sessionStorage.getItem("maPochList"));
  }
 
  if (pochList.includes(item)) {
    alert("Vous ne pouvez pas ajouter deux fois le même livre!")
  }
  else {
    pochList.push(item);

    sessionStorage.setItem("maPochList", JSON.stringify(pochList));
    item = JSON.parse(item);
    $('#content').append(setFavori(item));
  }
}

function trash(id) {
  let pochList = [];
  if(sessionStorage.getItem("maPochList") !== null) {
    pochList = JSON.parse(sessionStorage.getItem("maPochList"));
  }

  for(var i in pochList) {
    var item = JSON.parse(pochList[i]);
    if(item.id == id) {
      pochList.splice(i, 1);
      $('#'+id).parent().remove();
      sessionStorage.setItem('maPochList', JSON.stringify(pochList));
    }
  }
}

$(document).ready(function () {

  //Creation of the button that add a book
  let btn = $("<button id='addBook'>Ajouter un livre</button>");
  $("hr").before(btn);

  // creation of the labels
  let $label1 = $("<label>").text('Titre du livre');
  let $label2 = $("<label>").text('Auteur');

  //Creation of the Inputs
  let $Input1 = $('<input id="inputtitle">');
  let $Input2 = $('<input id="inputautor">');

  // Assotiation of inputs and labels
  $Input1.appendTo($label1);
  $Input2.appendTo($label2);

  //Creation of a DIV containing Labels
  let divForm = $('<div id="newBook"></div>');
  $label1.appendTo(divForm);
  $label2.appendTo(divForm);

  //Creation of the search button
  let searchBtn = $("<button id='search'>Rechercher</button>");
  searchBtn.appendTo(divForm);

  //Creation of cancel button
  let cancelBtn = $("<button id='cancel'>Annuler</button>");
  cancelBtn.appendTo(divForm);

  //Injection of the div in the html code
  $("BUTTON").after(divForm);
  $("BUTTON").after("<br/>");
  $Input1.before("<br/>");
  $label1.after("<br/>");
  $Input2.before("<br/>");
  $label2.after("<br/>");

  //display of the onclick form
  btn.click(function () {
    divForm.show();
    btn.hide();
  })

  // Creation of DIV containing the result search
  let divResult = $('<div id="requette"><h2 id="resultats">Résultats de recherche</h2></div>');
  let divCarte = [];
  divCarte = $('<section id="carte"></section>');
  divCarte.appendTo(divResult);
  $("#myBooks").append(divResult);

  //Hide form by clicking cancel button
  cancelBtn.click(function () {
    divForm.hide();
    divResult.hide();
    $("#content").show();
    btn.show();
  })

  //Show Favorites
  let pochList = [];
  if(sessionStorage.getItem("maPochList") !== null) {
    pochList = JSON.parse(sessionStorage.getItem("maPochList"));
  }

  for (var i in pochList) {
    var item = JSON.parse(pochList[i]);
    $('#content').append(setFavori(item));
  }
  


  //getting the result after clicking search button
  searchBtn.click(function () {

    if ($Input1.val() == '' && $Input2.val() == '') {
      alert("Veuillez entrer le nom de l'auteur ou le titre du livre");
    }
    else {
      const title = $Input1.val();
      const author = $Input2.val();
      let livres = [];
      $("#content").hide();
      divResult.show();
      $.ajax({
        //L'URL de la requête 
        url: "https://www.googleapis.com/books/v1/volumes?q=" + title + "+inauthor:" + author,

        //La méthode d'envoi (type de requête)
        method: "GET",
        //Le format de réponse attendu
        dataType: "json",
      })
        //Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
        /*On peut par exemple convertir cette réponse en chaine JSON et insérer
      * cette chaine dans un div id="res"*/
        .done(function (response) {
          livres = response.items;
          divCarte.empty();
          if (livres) {
            for (i in livres) {
              let description = livres[i].volumeInfo.description ? livres[i].volumeInfo.description.substr(0, 200) : "Aucune";
              let image =  livres[i].volumeInfo.imageLinks.smallThumbnail ?  livres[i].volumeInfo.imageLinks.smallThumbnail : "/commingimg.png";
              let livre = $('<div class="livre">' +
                '<button class="bookmark" data-id="'+livres[i].id+'" data-title="'+livres[i].volumeInfo.title+'" data-description="'+description+'" data-author ="'+ livres[i].volumeInfo.authors + '" data-image ="'+ livres[i].volumeInfo.imageLinks.smallThumbnail +'"><i class="fa fa-bookmark fa_custom fa-1x"></i></button>' +
                '<h3>Titre : ' + livres[i].volumeInfo.title + '</h3>' +
                '<h5> Id :' + livres[i].id + '</h5>' +
                '<h5> Auteur : ' + livres[i].volumeInfo.authors + '</h5>' +
                '<p> Description: ' + description+ '</p>' +
                '<img src=' + image + '>'+
                '</div>');
               

              $(divCarte).append(livre);
            }
            $(".bookmark").on('click', function(){
              var book = '{"id": "'+this.dataset.id+'", "name": "'+this.dataset.title+'", "description" : "'+this.dataset.description+'", "author" : "'+this.dataset.author+'", "image": "'+this.dataset.image+'"}';
              favori(book);
            });

          }
          else {
            let errorMessage = $('<div id="erreur">Aucun livre n a été trouvé </div>');
            $(divCarte).append(errorMessage);
          }

          // let data = JSON.stringify(response);
          console.log(livres[1].volumeInfo.title);

        })

        //On peut afficher les informations relatives à la requête et à l'erreur
        .fail(function (error) {
          alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
        })
    }
    
  })


})








