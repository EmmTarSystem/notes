// Nbre de jour par défaut avant suppression
let delayToDelete = 7,
isDeleteAllReadyChecked = false;//pour ne checker les "items à supprimer" qu'une seule fois
// Refence miliseconde/jour
const milisecondRef = 86400000;



// Traitement des items "TERMINER" à supprimer au lancement de l'application
function onCheckItemToDelete(arrayResult) {
    console.log("Vérification des items à supprimer");
    isDeleteAllReadyChecked = true;
    // Traitement des items "TERMINER"
    // Filtre sur le status
    let tempNoteStatus2 = arrayResult.filter(item=>{
        return item.status === statusArray[2];
    })

    console.log("Valeur de tempNoteStatus2 = ")
    console.log(tempNoteStatus2);
    // Traite chaque note filtrée
    tempNoteStatus2.forEach(e=>{
        onDeleteNoteTerminer(e)
    })


}




// Vérification des condition de delay dépasser pour suppression
function onDeleteNoteTerminer(e) {
    console.log("je traite la suppresion pour la note = " + e.title);

    let delayToAdd = (delayToDelete * milisecondRef);
    let millisecondDuJour = Date.now();

    
    // Supprime les tache qui ont le statut "Terminer" et dont la date de passage à Terminer + le delay est dépassé.
    if (millisecondDuJour >= (e.dateToDelete + delayToAdd)) {
        console.log("Suppression automatique de la note avec la key : " + e.key);
        let transaction = db.transaction(objectStoreName,"readwrite");//transaction en écriture
        let objectStore = transaction.objectStore(objectStoreName);
        let request = objectStore.delete(IDBKeyRange.only(e.key));
    
    
        request.onsuccess = function (){
            console.log("Requete de suppression automatique réussit");
        
            // Action à définir
        };

        request.onerror = function (){
            console.log("Erreur lors de la requete de suppression automatique");
                
        };
    }
}