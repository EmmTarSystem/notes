// Initialisation variables
// -------------------------------------------------   GLOBAL        ------------------------------------------------
//  Définition des textes de notification

let arrayNotify ={
    emptyTitleField : "Le champ 'Titre' n'est pas renseignés !",
    emptyStepField : "Un champ d'étape est vide !",
    errorDate : "Les dates définies sont incorrectes !"
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
    taskStoreName = "taskList",
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
            dashboardStore.createIndex('dateStart','dateStart',{unique:false});
            dashboardStore.createIndex('dateEnd','dateEnd',{unique:false});
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



// // Formatage de la date du jour qui est en mode FR vers le mode Internationale
function onFormatDateToday() {
    let date = new Date();

    // Obtenir les composants de la date
    let jour = date.getDate();
    let mois = date.getMonth() + 1; // Les mois vont de 0 à 11, donc ajouter 1
    let annee = date.getFullYear();

    // Ajouter un zéro devant le jour et le mois si nécessaire
    jour = (jour < 10) ? '0' + jour : jour;
    mois = (mois < 10) ? '0' + mois : mois;

    // Créer la chaîne de date au format "yyyy-mm-dd"
    let dateDuJour = annee + '-' + mois + '-' + jour;

    return dateDuJour;
}



// Transforme les dates stockées du mode internationale vers le mode FR

function onFormatDateToFr(dateString) {
    // Créer un objet Date en analysant la chaîne de date
    let date = new Date(dateString);

    // Obtenir les composants de la date
    let jour = date.getDate();
    let mois = date.getMonth() + 1; // Les mois vont de 0 à 11, donc ajouter 1
    let annee = date.getFullYear();

    // Ajouter un zéro devant le jour et le mois si nécessaire
    jour = (jour < 10) ? '0' + jour : jour;
    mois = (mois < 10) ? '0' + mois : mois;

    // Créer la nouvelle chaîne de date au format "dd-mm-yyyy"
    let dateFormatee = jour + '-' + mois + '-' + annee;

    return dateFormatee;
}




// Desactivation de la page principale
let allDivToDisable = [];
    allDivToDisable.push(document.getElementById("divListBtnNote"));
    allDivToDisable.push(document.getElementById("divNoteView"));





// fonction de gestion de l'affichage
function onChangeDisplay(toHide,toDisplay,toDisable,toEnable) {
    // Cache les items
    toHide.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "none";
    });

    // Affiche les items
    toDisplay.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "block";
    });

    // Desactive les items
    toDisable.forEach(id=>{
       let itemRef = document.getElementById(id);
       itemRef.style.opacity = 0.1;
       itemRef.style.pointerEvents = "none";
    });

    // Active les items
    toEnable.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.opacity = 1;
        itemRef.style.pointerEvents = "all";
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
    }
    return tempDateDebut > tempDateFin ? true :false;


}


// Fonction de limite des nombres dans un input

function onlimitNumberLength(input, maxLength, maxValue) {
    let value = input.value;

    // Limite la longueur du nombre
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    // Limite la valeur maximale
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue > maxValue) {
      value = maxValue.toString();
    }

    input.value = value;
  }










//  --------------------------  Animation notification -------------------------------------

function eventNotify(textToSet,actionName) {
    let pNotifyTextRef = document.getElementById("pNotifyText");
    let divNotifyRef = document.getElementById("divNotify");
    pNotifyTextRef.innerHTML = "La tache '" + textToSet + "' a été  " + " " +actionName;
    

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


    // Gestion affichage
    onChangeDisplay(["divAccueil","divDashboard","divSetting","divInfo"],["divAccueil"],[],[]);
}


// Menu Dashboard
function onClickMenuDashboard() {

    // Gestion affichage
    onChangeDisplay(["divAccueil","divSetting","divInfo"],["divDashboard"],[],[]);
}


// Menu Setting
function onClickMenuSetting() {

    // Gestion affichage
    onChangeDisplay(["divAccueil","divDashboard","divInfo"],["divSetting"],[],[]);

    onDisplaySetting();
}


// Menu Info
function onClickMenuInfo() {


    // Gestion affichage
    onChangeDisplay(["divAccueil","divDashboard","divSetting"],["divInfo"],[],[]);
}







// Lancement de la database
onStartDataBase();





