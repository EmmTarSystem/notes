// Initialisation variables
// -------------------------------------------------GLOBAL------------------------------------------------

// DATE DU jour
let currentDateFR,
    currentDateFormated;


// Set tous les éléments concernant la date du jour
function onSetDateDuJour() {
    // Date au format complet
    document.getElementById("h1DateDuJour").innerHTML = new Date().toLocaleDateString('fr-fr', { weekday:"long", year:"numeric", month:"short", day:"numeric"})

    // Date du jour format FR
    let e = new Date();
    currentDateFR = e.toLocaleDateString("fr");
    currentDateFR = currentDateFR.replace(/\//gi,"-");

    console.log(currentDateFR);

    // Date du jour format international

    console.log(new Date());
    
}
onSetDateDuJour();







let db,
    dbName = "MyDataBase",
    objectStoreName = "TaskList",
    version = 1;


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
            noteStore.createIndex('status','status',{unique:false});
            noteStore.createIndex('tag','tag',{unique:false});
        }
    };

    openRequest.onerror = function(){
        console.error("Error",openRequest.error);
    };

    openRequest.onsuccess = function(){
        db = openRequest.result
        console.log("Data Base ready");

        // Premiere actualisation de la page
        onUpdatePage();
    };




}



// fonction simplification - formatage date du jour
function onFormatDateCreated() {
    e = new Date();
    let tempDate = e.toLocaleDateString("fr");

    let finalDateFR = tempDate.replace(/\//gi,"-");
     return finalDateFR;
}



// Formatage des dates sélectionnées en mode universel
function onFormatSelectedDate(e){
    let dateFormated = e.replace(/-/gi,"");
    console.log(dateFormated);
    return dateFormated;
}



// Formatage des dates sélectionnées en mode FR
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

// Formatage des dates sélectionnées en mode US
function onFormatSelectedDateUS(e) {
    
    let tempDateUS = e.split("-");
    

    let finalDateUS = "";
    for (const i of tempDateUS) {
        finalDateUS = finalDateUS + "-" + i
    }; 
    // Suppression de premier "-"
    finalDateUS = finalDateUS.replace("-","");
    return finalDateUS
}


// Desactivation de la page principale
let divMainRef = document.getElementById("divMain");

function onDisableMainPage(disable) {
    let isDisable = Boolean(disable === true);

    divMainRef.style.opacity = isDisable? 0.1 : 1;
    divMainRef.style.pointerEvents = isDisable? "none" : "all";
}

//formatage =  tout en majuscule
function onSetToUppercase(e) {
    let upperCase = e.toUpperCase();
    return upperCase;
}

function onSetFirstLetterUppercase(e) {
    let firstLetterUpperCase = e.charAt(0).toUpperCase() + e.slice(1);
    return firstLetterUpperCase;
}


// Lancement de la database
onStartDataBase();