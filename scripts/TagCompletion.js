
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