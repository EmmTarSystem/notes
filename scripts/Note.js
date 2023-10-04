// --------------------------UPDATE  PAGE ------------------------------------------------
let notesEncoursArray= [],//les notes en cours
    notesAFaireArray =[];//les notes à faire
    
    



function onUpdatePage() {
    console.log("update Page");
    // Clear la page
    // Reset les array
    notesEncoursArray = [];
    notesAFaireArray = [];

    // Vide les div de boutons
    onClearDIV("divBtnNotesEnCours");
    onClearDIV("divBtnNotesAFaire");



    // recupere les éléments dans la base et les stock dans une grosse variable temporaire
    
    let transaction = db.transaction(objectStoreName);//readonly
    let objectStore = transaction.objectStore(objectStoreName);
    let indexStore = objectStore.index("title");
    let request = indexStore.getAll();

   request.onsuccess = function (){
        console.log("Les éléments ont été récupéré dans la base");
        console.log("stockage dans le tableau temporaire");

        console.log("request.result : " + request.result);
        let arrayResult = request.result;
        console.log("arrayResult : " + arrayResult);

        // fonction de trie
        onSortItem(arrayResult)
        // Referme l'accès base
        
    }
    request.error = function (){
        console.log("Erreur de requete sur la base");
    }
}



// Trie et stock dans les variables avec uniquement key/titre/priorité
function onSortItem(arrayResult) {
    

    //Filtre sur les notes en cours
    console.log("Trie des éléments 'En cours'");
    let tempNoteEnCoursArray = arrayResult.filter((item) =>{
        return item.status === "En cours";
    })

    // Ne recupère que les valeurs nécessaires
    tempNoteEnCoursArray.forEach(e=>{
        notesEncoursArray.push({key:e.key,title:e.title,priority:e.priority})
    })



    //Filtre sur les notes A FAIRE
    console.log("Trie des éléments 'A faire'");
    let tempNoteAFaireArray = arrayResult.filter((item) =>{
        return item.status === "A faire";
    })

    // Ne recupère que les valeurs nécessaires
    tempNoteAFaireArray.forEach(e=>{
       notesAFaireArray.push({key:e.key,title:e.title,priority:e.priority})
    })

    // Creation des boutons par catégories
    onSetButtonNotes("divBtnNotesEnCours",notesEncoursArray);
    onSetButtonNotes("divBtnNotesAFaire",notesAFaireArray);
}



// Crée les boutons des notes selon la catégorie
function onSetButtonNotes(divNotesTarget,noteArray) {
    let CurrentDivNotesRef = document.getElementById(divNotesTarget);

    console.log("création des boutons de notes pour la div : " + divNotesTarget);

    noteArray.forEach(e=>{
        let button = document.createElement("button");
        button.type = "button";
        button.innerHTML = e.priority + " - " +e.title;
        button.onclick = function(){
            onDisplayNotes(e.key);
        }
        CurrentDivNotesRef.appendChild(button);

    })
}

// fonction de vidage des div
function onClearDIV(divID) {
    let currentDivRef = document.getElementById(divID);
    currentDivRef.innerHTML = "";
}

// ----------------------------EDITION de Notes -----------------------------------------

// Variabilisation des items

let inputNoteTitleRef = document.getElementById("inputNoteTitle"),
    selectorNoteStatusRef = document.getElementById("selectorNoteStatus"),
    inputNoteDateStartRef = document.getElementById("inputNoteDateStart"),
    inputNoteStep1Ref = document.getElementById("inputNoteStep1"),
    inputNoteStep2Ref = document.getElementById("inputNoteStep2"),
    inputNoteStep3Ref = document.getElementById("inputNoteStep3"),
    inputNoteStep4Ref = document.getElementById("inputNoteStep4"),
    inputNoteStep5Ref = document.getElementById("inputNoteStep5"),
    textareaNoteDetailRef = document.getElementById("textareaNoteDetail"),
    inputNoteDateEndRef = document.getElementById("inputNoteDateEnd"),
    selectorNotePriorityRef = document.getElementById("selectorNotePriority"),
    checkboxNoteStep1Ref = document.getElementById("checkboxNoteStep1"),
    checkboxNoteStep2Ref = document.getElementById("checkboxNoteStep2"),
    checkboxNoteStep3Ref = document.getElementById("checkboxNoteStep3"),
    checkboxNoteStep4Ref = document.getElementById("checkboxNoteStep4"),
    checkboxNoteStep5Ref = document.getElementById("checkboxNoteStep5");



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
        status : selectorNoteStatusRef.value,
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


// Insertion d'un nouvelle note
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


// ------------------------------------------ Afficher notes ---------------------------------

function onDisplayNotes(keyRef) {
    console.log("Affichage de la note avec la key :  " + keyRef);
}