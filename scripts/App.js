// Initialisation variables
// -------------------------------------------------   GLOBAL        ------------------------------------------------
//  Définition des textes de notification

let arrayNotify ={
    emptyField : "Erreur champ obligatoire ",
    errorDate : "Les dates définis sont incorrectes !"
};
    



// DATE DU jour
let currentDateFR,
    currentDateFormated;


// Set tous les éléments concernant la date du jour
function onSetDateDuJour() {
    // Date au format complet
    let fullDateFormated = new Date().toLocaleDateString('fr-fr', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

    console.log("fulldate : " + fullDateFormated);
    // Premiere lettre majuscule
    fullDateFormated = fullDateFormated.charAt(0).toUpperCase() + fullDateFormated.slice(1);

    document.getElementById("h1DateDuJour").innerHTML = fullDateFormated;

    // stockager de la Date du jour format FR pour plus tard
    let e = new Date();
    currentDateFR = e.toLocaleDateString("fr");
    currentDateFR = currentDateFR.replace(/\//gi,"-");

    console.log(currentDateFR);

    // Date du jour format international

    console.log(new Date());
    
}
onSetDateDuJour();







let db,
    dbName = "Planning-DataBase",
    taskStoreName = "TaskList",
    tagStoreName = "TAGList",
    dashBoardStoreName = "dashboard",
    version = 1;


// Lancement /création de la base de donnée

function onStartDataBase() {
    let openRequest = indexedDB.open(dbName,version);

    // Traitement selon résultat

   
    // Mise à jour ou création requise
    openRequest.onupgradeneeded = function () {
        console.log("Initialisation de la base de donnée");

        db = openRequest.result;
        if(!db.objectStoreNames.contains(taskStoreName)){
            // si le l'object store n'existe pas
            let noteStore = db.createObjectStore(taskStoreName, {keyPath:'key', autoIncrement: true});
            console.log("Creation du magasin " + taskStoreName);

            noteStore.createIndex('title','title',{unique:true});
            noteStore.createIndex('dateStart','dateStartUS',{unique:false});
            noteStore.createIndex('dateEnd','dateEndUS',{unique:false});
            noteStore.createIndex('status','status',{unique:false});
            noteStore.createIndex('tag','tag',{unique:false});
        }

        // Creation du store pour les TAG d'autocomplétion
        if (!db.objectStoreNames.contains(tagStoreName)) {
            let tagStore = db.createObjectStore(tagStoreName, {autoIncrement: true});
            console.log("Creation du magasin "+  tagStoreName);
        }

        // Creation du store pour le dashboard
        if (!db.objectStoreNames.contains(dashBoardStoreName)) {
            let dashboardStore = db.createObjectStore(dashBoardStoreName, {keyPath:'key',autoIncrement: true});
            console.log("Creation du magasin "+  dashBoardStoreName);

            dashboardStore.createIndex('tag','tag',{unique:false});
            dashboardStore.createIndex('duration','duration',{unique:false});
        }

    };

    openRequest.onerror = function(){
        console.error("Error",openRequest.error);
    };

    openRequest.onsuccess = function(){
        db = openRequest.result
        console.log("Data Base ready");

        // Premiere actualisation de la page
        onUpdatePage(true);
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
let allDivToDisable = [];
    allDivToDisable.push(document.getElementById("divListBtnNote"));
    allDivToDisable.push(document.getElementById("divNoteView"));


function onDisableMainPage(disable) {
    let isDisable = Boolean(disable === true);

    allDivToDisable.forEach(e =>{
        e.style.opacity = isDisable? 0.1 : 1;
        e.style.pointerEvents = isDisable? "none" : "all";
    });
    
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


// detection des champs vides obligatoires

function onCheckEmptyField(e) {
    if (e === "") {
        console.log("Champ vide obligatoire détecté !");
        alert(arrayNotify.emptyField);
    }
    return e === ""? true :false;
}

// Detection d'erreur de date

function onCheckDateError(dateDebut, dateFin) {

    // convezrtion des strings en objets Date;
    let tempDateDebut = new Date(dateDebut);
    let tempDateFin =new Date(dateFin);

    if (tempDateDebut > tempDateFin) {
        console.log("Dates choisies incorrecte !");
        alert(arrayNotify.errorDate);
    }
    return tempDateDebut > tempDateFin ? true :false;


}














//  --------------------------  Animation notification -------------------------------------

function eventNotify(textToSet) {
    let pNotifyTextRef = document.getElementById("pNotifyText");
    let divNotifyRef = document.getElementById("divNotify");
    pNotifyTextRef.innerHTML = "La tache '" + textToSet + "' a été ajouté !";
    

    // Affiche la div
    divNotifyRef.style.visibility = "visible";


    // Cache la div apres un delay
    setTimeout(() => {
        divNotifyRef.style.visibility = "hidden";
    }, 2000);


}


// ------------------------------- NAVIGATION MENU PRINCIPAL- -------------------------------------------------



// Menu Accueil
function onClickMenuAccueil() {
    onSetDivVisibility("divAccueil");
}


// Menu Dashboard
function onClickMenuDashboard() {
    onSetDivVisibility("divDashboard");
}


// Menu Setting
function onClickMenuSetting() {
    onSetDivVisibility("divSetting");
}


// Menu Info
function onClickMenuInfo() {
    onSetDivVisibility("divInfo");
}

// Affiche la div du menu en cours et cache les autres
function onSetDivVisibility(divTarget) {
    let allMainDiv = ["divAccueil","divDashboard","divSetting","divInfo"];

    allMainDiv.forEach(e=>{
        let divRef = document.getElementById(e);
        divRef.style.display = e === divTarget ? "block": "none";
    })

}



// Lancement de la database
onStartDataBase();





