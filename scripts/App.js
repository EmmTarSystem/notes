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



