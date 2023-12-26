
// Initialisation variables

let allTagCompletion = [];//les tag enregistrés pour l'autocomplétion





// ----------------------------------   LECTURE TAG       ------------------------------

function onReadTagFromStore() {
    let transaction = db.transaction(tagStoreName);//readonly
    let objecStore = transaction.objectStore(tagStoreName);
    let indexStore = objecStore.index("tag");
    let request = indexStore.getAll();

    request.onsuccess = function (){
        console.log("Les TAG ont été récupérés dans le store");

        allTagCompletion = request.result;
        console.log("stockage des tag dans le tableau temporaire");
        console.log(allTagCompletion);
    }

    request.onerror = function () {
        console.log("Erreur de requette sur le store TAG");
    }



}






// ---------------------------    ENREGISTREMENT TAG    ----------------------------------------



// Vérifie si besoin de l'enregistrement d'un nouveau tag
function onCheckTagExist(tagTarget) {
    console.log("traitement TAG autocomplétion");
    console.log("valeur de tagTarget : "+ tagTarget);
    if (!allTagCompletion.includes(tagTarget)) {
        onInsertTagInStore(tagTarget);
        console.log("le TAG COMPLETION " + tagTarget + "n'existe pas");
    }else{
        onUpdatePage(true);
    }
}


// Enregistre le tag dans le store

function onInsertTagInStore(e) {
    let transaction = db.transaction(tagStoreName,"readwrite");
    let store = transaction.objectStore(tagStoreName);

    let insertRequest = store.add(e);

    insertRequest.onsuccess = function (){
        console.log("Le TAG COMPLETION" + e + " a été ajouté dans le store");
    }

    insertRequest.onerror = function (){
        console.log("Error", insertRequest.onerror);
        alert(insertRequest.onerror);
    }

    transaction.oncomplete = function (){
        console.log("Transaction pour le TAG TAG COMPLETION completée");

        onUpdatePage(true);
    }
}



//  ------------------------------- AUTO COMPLETION - ---------------------------------





function autocomplete(inputElement, completionArray) {
    var currentInput = inputElement.value.toLowerCase();
    var suggestions = [];

    for (var i = 0; i < completionArray.length; i++) {
        var suggestion = completionArray[i];
        var index = suggestion.toLowerCase().indexOf(currentInput);

        if (index !== -1) {
            suggestions.push({
                before: suggestion.substring(0, index),
                match: suggestion.substring(index, index + currentInput.length),
                after: suggestion.substring(index + currentInput.length),
            });
        }
    }

    var suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = '';

    for (var j = 0; j < suggestions.length; j++) {
        var suggestionItem = document.createElement('li');
        var suggestionHtml =
            '<span class="suggestion-before">' + suggestions[j].before + '</span>' +
            '<span class="suggestion-match">' + suggestions[j].match + '</span>' +
            '<span class="suggestion-after">' + suggestions[j].after + '</span>';

        suggestionItem.innerHTML = suggestionHtml;
        suggestionItem.addEventListener('click', function() {
            inputElement.value = this.textContent.replace(/\n/g, '');;
            suggestionList.innerHTML = '';
        });
        suggestionList.appendChild(suggestionItem);
    }
}

function handleInput() {
    var inputElement = document.getElementById('inputNoteTag');
    autocomplete(inputElement, allTagCompletion);
}



// Il faudra faire en sorte que les éléments qui suivent ne se déclenchent que lorsque l'accueil est active.


// Ajout de cet écouteur d'événement pour déclencher l'autocomplétion
document.getElementById('inputNoteTag').addEventListener('input', handleInput);


// Ajout de cet écouteur d'événement pour masquer la liste de suggestions lorsqu'on clique en dehors de l'input
document.addEventListener('click', function(event) {
    if (!event.target.matches('#inputNoteTag')) {
        document.getElementById('suggestionList').innerHTML = '';
    }
});

