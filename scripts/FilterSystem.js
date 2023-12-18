

let allTagList = [];
let genericTAG = "TOUTES LES TACHES";


let currentTagFilter = genericTAG;

// Recupère les TAG existants
function onListTAG(dataToFilter) {
    console.log(dataToFilter);
    let tempTagList = [];

    dataToFilter.forEach(e => {
        
        if (!tempTagList.includes(e.tag)) {
            tempTagList.push(e.tag);
        }
        
    });

    console.log("tempTagList = ");
    console.log(tempTagList);

    onUpdateTagList(tempTagList,dataToFilter);
}




// Met à jour mon tableau de TAG
function onUpdateTagList(tempTagList,arrayResult) {


    // Traitement des tag à ajouter
    console.log("traitement des TAG à ajouter");
    tempTagList.forEach(e=>{
        if (!allTagList.includes(e)) {
            allTagList.push(e);
            console.log("J'ajoute = " + e);
        }
    })

    // Traitement des tag à retirer
    console.log("traitement des TAG à retirer");
    allTagList.forEach(e=>{
        if (!tempTagList.includes(e)) {
            // Recupère l'index de l'indésirable
            let indexToDelete = allTagList.indexOf(e);
            console.log("index a supprimer = " + indexToDelete);
            // Retrait de l'indésirable
            allTagList.splice(indexToDelete,1);
            console.log("Je retire = " + e);
        }
    })

    // Ajoute le TAG 'Toutes les taches' au début de l'array si n'existe pas

    if (!allTagList.includes(genericTAG)) {
        allTagList.unshift(genericTAG);
    }

    console.log("final TAG result = ");
    console.log(allTagList);


    // Filtre pour voir si le filtre sur le tag en cours existe toujours
    let isCurrentTagIsValid = allTagList.includes(currentTagFilter);

    if (isCurrentTagIsValid) {
        console.log("le tag en cours existe toujours");
    }else{
        console.log("le tag en cours n'existe plus = réinitialisation");
        currentTagFilter = genericTAG;
    }


    onSetSelectTagList(allTagList,arrayResult);
}




// Creation d'une option dans le selecteur pour chaque TAG
let selectTagFilterRef = document.getElementById("selectTagFilter");
function onSetSelectTagList(TagToAdd,arrayResult) {
    // Vide le selecteur
    selectTagFilterRef.innerHTML ="";

    // Ajoute le TAG par défaut :
    let defaultOption = document.createElement("option");
        defaultOption.value = genericTAG;
        defaultOption.innerHTML = genericTAG;

        selectTagFilterRef.appendChild(defaultOption);

    // Set les nouveaux tag
    TagToAdd.forEach(e=>{
        let newOption = document.createElement("option");
        newOption.value = e;
        newOption.innerHTML = e;

        selectTagFilterRef.appendChild(newOption);
    })

    // set la valeur du tag actuel
    selectTagFilterRef.value = currentTagFilter;


    onSortItem(arrayResult);
}



// Changement du filtre via action de l'utilisateur
function onSelectorTagChange(){
    console.log("changement de selecteur pour = " + selectTagFilterRef.value);
    currentTagFilter = selectTagFilterRef.value;
    onUpdatePage(false);
}