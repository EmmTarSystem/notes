// Initialisation variables
// -------------------------------------------------GLOBAL------------------------------------------------

// DATE DU jour
// new Date().toLocaleDateString('fr-fr', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
// "vendredi 2 juillet 2021"


let db,
    dbName = "BaseTest",
    objectStoreName = "TaskList",
    version = 4;


// Lancement /création de la base de donnée

function onStartDataBase() {
    let openRequest = indexedDB.open(dbName,version);

    // Traitement selon résultat


    // Mise à jour ou création requise
    openRequest.onupgradeneeded = function () {
        console.log("Initialisation de la base de donnée");

        db = openRequest.result;
        if(!db.objectStoreNames.contains(objectStoreName)){
            // si le l'object store n'existe pas
            let noteStore = db.createObjectStore(objectStoreName, {keyPath:'key', autoIncrement: true});
            console.log("creation du magasin " + objectStoreName);

            noteStore.createIndex('title','title',{unique:true});
            noteStore.createIndex('dateStart','dateStart',{unique:false});
            noteStore.createIndex('dateEnd','dateEnd',{unique:false});
            noteStore.createIndex('dateStartFormated','dateStartFormated',{unique:false});
            noteStore.createIndex('dateEndFormated','dateEndFormated',{unique:false});
            noteStore.createIndex('statut','statut',{unique:false});
        }
    };

    openRequest.onerror = function(){
        console.error("Error",openRequest.error);
    };

    openRequest.onsuccess = function(){
        db = openRequest.result
        console.log("Base ready");
    };




}



// fonction simplification - formatage date du jour
function onFormatDateCreated() {
    e = new Date();
    let tempDate = e.toLocaleDateString("fr");

    let finalDateFR = tempDate.replace(/\//gi,"-");

    return finalDateFR
}


// Formatage des dates selectionnées en mode universel
function onFormatSelectedDate(e){
    let dateFormated = e.replace(/-/gi,"");
    console.log(dateFormated);
    return dateFormated;
}



// Formatage des dates en mode FR
function onFormatSelectedDateFR(e) {
    
    let tempDateFR = e.split("-");
    tempDateFR = tempDateFR.reverse();

    let finalDateFR = "";
    for (const i of tempDateFR) {
        finalDateFR = finalDateFR + "-" + i
    }; 
    // Suppression de premier "-"
    finalDateFR = finalDateFR.replace("-","");
    return finalDateFR
}



// ----------------------------NEW NOTE -----------------------------------------

// Variabilisation des items

let newNoteInputTitleRef = document.getElementById("newNoteInputTitle"),
    newNoteInputStatutRef = document.getElementById("newNoteInputStatut"),
    newNoteInputDateStartRef = document.getElementById("newNoteInputDateStart"),
    newNoteInputElement0Ref = document.getElementById("newNoteInputElement0"),
    newNoteInputElement1Ref = document.getElementById("newNoteInputElement1"),
    newNoteInputElement2Ref = document.getElementById("newNoteInputElement2"),
    newNoteInputDetailRef = document.getElementById("newNoteInputDetail"),
    newNoteInputDateEndRef = document.getElementById("newNoteInputDateEnd"),
    newNoteInputPriorityRef = document.getElementById("newNoteInputPriority");

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

// Formatage de la nouvelle note créé
function onFormatnewNoteInput(){
    console.log("Formatage de la nouvelle note");
    // Les dates
     let tempDateStart = onFormatSelectedDate(newNoteInputDateStartRef.value);
     let tempDateEnd = onFormatSelectedDate(newNoteInputDateEndRef.value);
     let tempDateStartFR = onFormatSelectedDateFR(newNoteInputDateStartRef.value);
     let tempDateEndFR = onFormatSelectedDateFR(newNoteInputDateEndRef.value);
     let tempDateCreated = onFormatDateCreated();

    console.log("date start = " + tempDateStart );
    console.log("date end = " + tempDateEnd );
    console.log("date created = " + tempDateCreated);


    // Mise en format variable

    let noteToInsert = {
        title :newNoteInputTitleRef.value,
        dateStartFormated : tempDateStart,
        dateStart :tempDateStartFR,
        statut : newNoteInputStatutRef.value,
        item0 : newNoteInputElement0Ref.value,
        item0Checked : false,
        item1 : newNoteInputElement1Ref.value,
        item1Checked : false,
        item2 : newNoteInputElement2Ref.value,
        item2Checked : false,
        detail : newNoteInputDetailRef.value,
        dateEndFormated : tempDateEnd,
        dateEnd : tempDateEndFR,
        dateCreated : tempDateCreated,
        priority : newNoteInputPriorityRef.value
    }

    console.log(noteToInsert);

    onInsertData(noteToInsert);

}


// ------------------------------------------ Recherche ---------------------------------

// Recherche dans les notes
function onSearchNotes(index,value) {
    console.log("Recherche de note")
    console.log("index = " + index + " value = " + value);

    let transaction = db.transaction(objectStoreName);//Transaction en lecture
    let store = transaction.objectStore(objectStoreName);
    let statutIndex = store.index(index);

    let request = statutIndex.getAll(value);

    request.onsuccess = function(){
        if (request.result !== undefined){
            console.log("Resultat de la recherche = ")
            console.log(request.result);
        }else{
            console.log("Aucun Resultat");
        }
    }
}