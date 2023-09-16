// --------------------------INIT PAGE ------------------------------------------------

function onInitPage() {
    // Clear la page

    const recherche = new Promise((resolve, reject) => {
        
    })


    // Recherche les notes
    let notesEnCours = onSearchNotes("statut","En cours");

    notesEnCours.onsuccess = function(){
        if (notesEnCours !== undefined){
            console.log("Resultat de la recherche = ")
            console.log(notesEnCours);
            // Lance la fonction d'affichage des résultats
        }else{
            console.log("Aucun Resultat");
            return null;
        }
    }

    

    // Affiche les notes
}





// ----------------------------EDITION de Notes -----------------------------------------

// Variabilisation des items

let inputNoteTitleRef = document.getElementById("inputNoteTitle"),
    selectorNoteStatutRef = document.getElementById("selectorNoteStatut"),
    inputNoteDateStartRef = document.getElementById("inputNoteDateStart"),
    inputNoteStep1Ref = document.getElementById("inputNoteStep1"),
    inputNoteStep2Ref = document.getElementById("inputNoteStep2"),
    inputNoteStep3Ref = document.getElementById("inputNoteStep3"),
    textareaNoteDetailRef = document.getElementById("textareaNoteDetail"),
    inputNoteDateEndRef = document.getElementById("inputNoteDateEnd"),
    selectorNotePriorityRef = document.getElementById("selectorNotePriority"),
    checkboxNoteStep1Ref = document.getElementById("checkboxNoteStep1"),
    checkboxNoteStep2Ref = document.getElementById("checkboxNoteStep2"),
    checkboxNoteStep3Ref = document.getElementById("checkboxNoteStep3");


// Insertion d'un data
function onInsertData(e) {
    let transaction = db.transaction(objectStoreName,"readwrite");
    let store = transaction.objectStore(objectStoreName);

    let insertRequest = store.add(e);

    insertRequest.onsuccess = function () {
        console.log(e.title + "a été ajouté à la base");
    }

    insertRequest.onerror = function(){
        console.log("Error", insertRequest.error);
    }

    transaction.oncomplete = function(){
        console.log("transaction complete");
    }

}

// Formatage de la note
function onFormatNote(){
    console.log("Formatage de la nouvelle note");
    // Les dates
     let tempDateStart = onFormatSelectedDate(inputNoteDateStartRef.value);
     let tempDateEnd = onFormatSelectedDate(inputNoteDateEndRef.value);
     let tempDateStartFR = onFormatSelectedDateFR(inputNoteDateStartRef.value);
     let tempDateEndFR = onFormatSelectedDateFR(inputNoteDateEndRef.value);
     let tempDateCreated = onFormatDateCreated();

    console.log("date start = " + tempDateStart );
    console.log("date end = " + tempDateEnd );
    console.log("date created = " + tempDateCreated);


    // Mise en format variable

    let noteToInsert = {
        title :inputNoteTitleRef.value,
        dateStartFormated : tempDateStart,
        dateStart :tempDateStartFR,
        statut : selectorNoteStatutRef.value,
        item0 : inputNoteStep1Ref.value,
        item0Checked : checkboxNoteStep1Ref.checked,
        item1 : inputNoteStep2Ref.value,
        item1Checked : checkboxNoteStep2Ref.checked,
        item2 : inputNoteStep3Ref.value,
        item2Checked : checkboxNoteStep3Ref.checked,
        detail : textareaNoteDetailRef.value,
        dateEndFormated : tempDateEnd,
        dateEnd : tempDateEndFR,
        dateCreated : tempDateCreated,
        priority : selectorNotePriorityRef.value
    }

    console.log(noteToInsert);

    onInsertData(noteToInsert);

}


// ------------------------------------------ Recherche ---------------------------------

// Recherche dans les index par valeur
function onSearchNotes(indexName,value) {
    console.log("Recherche de note")
    console.log("index = " + indexName + " value = " + value);

    let transaction = db.transaction(objectStoreName);//Transaction en lecture
    let store = transaction.objectStore(objectStoreName);
    let statutIndex = store.index(indexName);

    let request = statutIndex.getAll(value);

    request.onsuccess = function(){
        if (request.result !== undefined){
            console.log("Resultat de la recherche = ")
            console.log(request.result);
            // Lance la fonction d'affichage des résultats
            return request.result;
        }else{
            console.log("Aucun Resultat");
            return null;
        }
    }
}

// Generation des resultats de recherche
function onDisplaySearchResult(resultArray){
    // Creation des resultat
    let divSearchResultRef = document.getElementById("divSearchResult");


    resultArray.forEach(e => {
        let button = document.createElement("button");
        button.type = "button";
        button.innerHTML = e.title;

        button.onclick = function(){
            alert(e.key);
        }

        divSearchResultRef.appendChild(button);
    });

}


// Affichage d'une note

function onDisplayNote(key) {
    
}