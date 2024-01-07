




let noteStatus1Array= [],//les notes en cours
    notesStatus0Array =[],//les notes à faire
    currentKeyNoteInView,//la key de la note en cours de visualisation
    currentNoteInView,//le contenu de la note en cours de visualisation
    boolEditNoteCreation,//mode d'ouverture de l'editeur de note en mode création ou modification
    noteStatus1IndexToStart,//pour l'affichage des notes avec les boutons next et previous
    noteStatus0IndexToStart,//pour l'affichage des notes avec les boutons next et previous
    maxBtnNoteToDisplay = 6,//nbre de bouton maximum qui sont affiché dans la liste
    btnNoteStatus1PreviousRef = document.getElementById("btnNoteStatus1Previous"),//les boutons de navigation des notes
    btnNoteStatus1NextRef = document.getElementById("btnNoteStatus1Next"),//les boutons de navigation des notes
    btnNoteStatus0PreviousRef = document.getElementById("btnNoteStatus0Previous"),//les boutons de navigation des notes
    btnNoteStatus0NextRef = document.getElementById("btnNoteStatus0Next");//les boutons de navigation des notes


let statusArray = ["A faire","En cours","Terminer"];
let priorityArray = ["Routine","Urgent","Flash"];
let defaultTagValue = "divers";
    




// --------------------------              UPDATE  PAGE                ------------------------------------------------



function onUpdatePage(isUpdateTagListRequired) {
    console.log("update Page");
    // Clear la page
    // Reset les array
    noteStatus1Array = [];
    notesStatus0Array = [];
    noteStatus1IndexToStart = 0;
    noteStatus0IndexToStart = 0;
    allTagCompletion = [];



    // recupere les éléments dans la base et les stock dans une grosse variable temporaire
    
    let transaction = db.transaction([taskStoreName,tagStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(taskStoreName);
    let indexStoreTask = objectStoreTask.index("title");
    let requestTask = indexStoreTask.getAll();

    requestTask.onsuccess = function (){
        console.log("Les éléments ont été récupéré dans la base");
        console.log("stockage dans le tableau temporaire");

    }
    requestTask.error = function (){
        console.log("Erreur de requete sur la base");
    }


    // les TAG COMPLETION
    let objectStoreTAG = transaction.objectStore(tagStoreName);
    let requestTag = objectStoreTAG.getAll();
    
    


    requestTag.onsuccess = function () {
        console.log("les TAG de complétion ont été récupéré dans le store");
        // actualise les TAG de complétion
        let tagCompletionResult = requestTag.result;
        allTagCompletion = tagCompletionResult.sort();
    }






    transaction.oncomplete = function (){
        let arrayResult = requestTask.result;
        
        

        // Filtre se mise à jour du selecteur de tag
        if (isUpdateTagListRequired === true) {
            // TEST FILTRE  PAR TAG
            onListTAG(arrayResult);
        }else{
            // fonction de trie 
            onSortItem(arrayResult);
            
        }
        
    }
}






// Trie et stock dans les variables avec uniquement key/titre/priorité/tag
function onSortItem(arrayResult) {
    
    
    //Filtre sur les notes en cours avec le filtre du tag
    console.log("Trie des éléments " + statusArray[1]);
    let tempNoteStatus1Array = arrayResult.filter((item) =>{

        if (currentTagFilter === genericTAG) {
            return item.status === statusArray[1];
        }else{
            return item.status === statusArray[1] && item.tag === currentTagFilter;
            
        }
        
    })

    // Ne recupère que les valeurs nécessaires
    tempNoteStatus1Array.forEach(e=>{
        noteStatus1Array.push({key:e.key,title:e.title,priority:e.priority,tag:e.tag})
    })



    //Filtre sur les notes A FAIRE avec le filtre du tag
    console.log("Trie des éléments " + statusArray[0]);
    let tempNoteStatus0Array = arrayResult.filter((item) =>{

        if (currentTagFilter === genericTAG) {
            return item.status === statusArray[0];
        }else{
            return item.status === statusArray[0] && item.tag === currentTagFilter;
            
        }
        
    })

    // Ne recupère que les valeurs nécessaires
    tempNoteStatus0Array.forEach(e=>{
       notesStatus0Array.push({key:e.key,title:e.title,priority:e.priority,tag:e.tag})
    })


    
    // Creation des liste de notes par catégories
    onSetListNotes("divBtnNoteStatus1",noteStatus1Array,noteStatus1IndexToStart,"pTxtStatus1",statusArray[1]);
    onSetListNotes("divBtnNoteStatus0",notesStatus0Array,noteStatus0IndexToStart,"pTxtStatus0",statusArray[0]);
}



// Crée les boutons des notes selon la catégorie
function onSetListNotes(divNotesTarget,noteArray,indexToStart,thIDRef,currentStatus) {
    // Reference pour le nombre de tache 
    let currentThRef = document.getElementById(thIDRef);

    // Vide la div de note
    onClearDIV(divNotesTarget);


    let CurrentDivNotesRef = document.getElementById(divNotesTarget);

    console.log("création des boutons de notes pour la div : " + divNotesTarget);


    // condition si il y a des notes ou non
    if (noteArray.length > 0 ) {
        let nbreIteration = 0;

        for (let i = indexToStart ; i < noteArray.length ; i++){
            let e = noteArray[i];
        
            // Creation de la div
            let div = document.createElement("div");
            div.onclick = function(){
                onSearchNotesToDisplay(e.key);
            }
            

           
                // Set la class  de la divbouton selon l'urgence
                if (e.priority === priorityArray[0]) { div.className ="divBtnListNote divBtnListNotePriority0" };
                if (e.priority === priorityArray[1]) { div.className ="divBtnListNote divBtnListNotePriority1" };
                if (e.priority === priorityArray[2]) { div.className ="divBtnListNote divBtnListNotePriority2" };
          
 
           
            

            // Creation du texte dans la div
            let title = document.createElement("p");
            title.innerHTML = `<i>[ ${e.tag} ] </i>- - - ${e.title}`;
            title.className = "listNoteTitle";

            // insertion des éléments créés dans la div
            div.appendChild(title);


            CurrentDivNotesRef.appendChild(div);

            nbreIteration++
            // Met fin a la generation si atteind le nbre d'iteration max d'affichage
            if ( nbreIteration === maxBtnNoteToDisplay) {
                break;
            }
            
        }

        
        // Set le nombre de tâche
        currentThRef.innerHTML = `${currentStatus} ( ${noteArray.length} )   <i>${indexToStart + 1} - ${indexToStart + nbreIteration}</i>`;     

    }else{
        console.log("Aucune note pour " + divNotesTarget);
        CurrentDivNotesRef.innerHTML = "Aucune note";
        // Set le nombre de tâche à zero
        currentThRef.innerHTML = `${currentStatus} ( 0 )   <i> 0 - 0 </i>`;
    }

    // Gestion de visibilité des boutons de notes
    onSetBtnNavNotesVisibility();
}



// fonction de vidage des div
function onClearDIV(divID) {
    let currentDivRef = document.getElementById(divID);
    currentDivRef.innerHTML = "";
}


// Gestion des boutons de navigation de notes
// Visibilité
function onSetBtnNavNotesVisibility() {
    
    // Bouton note A faire "suivant"
    btnNoteStatus0NextRef.style.visibility = (noteStatus0IndexToStart + maxBtnNoteToDisplay >= notesStatus0Array.length) ? "hidden" : "visible";
    
    // Bouton note A faire "précédent"
    btnNoteStatus0PreviousRef.style.visibility = noteStatus0IndexToStart === 0 ? "hidden" : "visible";

    // Bouton note En cours "suivant"
    btnNoteStatus1NextRef.style.visibility = (noteStatus1IndexToStart + maxBtnNoteToDisplay >= noteStatus1Array.length) ? "hidden" : "visible";
    
    // Bouton note En cours "précédent"
    btnNoteStatus1PreviousRef.style.visibility = noteStatus1IndexToStart === 0 ? "hidden" : "visible";

}


// Navigation dans les boutons de notes
// Notes en cours
function onClickNavNoteStatus1Previous() {
    noteStatus1IndexToStart -= maxBtnNoteToDisplay;
    onSetListNotes("divBtnNoteStatus1",noteStatus1Array,noteStatus1IndexToStart,"pTxtStatus1",statusArray[1]);
}

function onClickNavNoteStatus1Next() {
    noteStatus1IndexToStart += maxBtnNoteToDisplay;
    onSetListNotes("divBtnNoteStatus1",noteStatus1Array,noteStatus1IndexToStart,"pTxtStatus1",statusArray[1]);
}

// Notes à faire
function onClickNavNoteStatus0Previous() {
    noteStatus0IndexToStart -= maxBtnNoteToDisplay;
    onSetListNotes("divBtnNoteStatus0",notesStatus0Array,noteStatus0IndexToStart,"pTxtStatus0",statusArray[0]);
}

function onClickNavNoteStatus0Next() {
    noteStatus0IndexToStart += maxBtnNoteToDisplay;
    onSetListNotes("divBtnNoteStatus0",notesStatus0Array,noteStatus0IndexToStart,"pTxtStatus0",statusArray[0]);
}






// ----------------------------       EDITION de Notes           -----------------------------------------








// Variabilisation des items

let divNoteEditorRef = document.getElementById("divNoteEditor"),
    divPopupDeleteRef = document.getElementById("divPopupDelete"),
    divPopupTerminerRef = document.getElementById("divPopupTerminer"),
    inputNoteTagRef = document.getElementById("inputNoteTag"),
    inputNoteTitleRef = document.getElementById("inputNoteTitle"),
    inputNoteDateStartRef = document.getElementById("inputNoteDateStart"),
    textareaNoteDetailRef = document.getElementById("textareaNoteDetail"),
    selectorNotePriorityRef = document.getElementById("selectorNotePriority"),
    selectorNoteStatusRef = document.getElementById("selectorNoteStatus"),
    inputNoteDateEndRef = document.getElementById("inputNoteDateEnd"),
    legendNoteEditorRef = document.getElementById("legendNoteEditor"),
    ulNoteEditorStepRef = document.getElementById("ulNoteEditorStep"),
    currentNbreEditorStep = 0;


// Generation des options de l'editeur de note
    
priorityArray.forEach(e=>{
    let newOption = document.createElement("option");
    newOption.value = e;
    newOption.innerHTML =e;
    
    selectorNotePriorityRef.appendChild(newOption);
})
    
statusArray.forEach(e=>{
    let newOption = document.createElement("option");
    newOption.value = e;
    newOption.innerHTML =e;
    
    selectorNoteStatusRef.appendChild(newOption);
})    
    


// Création d'une note
function onCreateNote() {
    // clear l'editeur de note
    onClearNoteEditor();

    // Gestion affichage
    onChangeDisplay(["divNoteView"],["divNoteEditor"],["divListBtnNote"],["divNoteEditor"]);

    onDisplayNoteEditor(true);
}



// Modification d'une note
function onEditNote() {
    // clear l'editeur de note
    onClearNoteEditor();

    // Gestion affichage
    onChangeDisplay(["divNoteView"],["divNoteEditor"],["divListBtnNote"],["divNoteEditor"]);

    onDisplayNoteEditor(false);
}



function onDisplayNoteEditor(boolModeCreation){


    


    // Set le mode d'ouverture de l'editeur de note
    boolEditNoteCreation = boolModeCreation;

    if (boolEditNoteCreation === true) {
        console.log("ouverture de l'editeur en mode création");

        legendNoteEditorRef.innerHTML = "Créer une note";
    }else{
        console.log("ouverture de l'editeur en mode Modification");

        legendNoteEditorRef.innerHTML = "Modifier une note";
        // Set l'editeur de note avec les éléments de la note en cours
        onSetNoteEditor(currentNoteInView);
    }



}



// Remplit l'éditeur de note lorsqu'il est ouvert en mode "Modification"
function onSetNoteEditor(e) {
    console.log("set l'editeur pour modification");
    inputNoteTagRef.value = e.tag;
    inputNoteTitleRef.value = e.title;
    selectorNoteStatusRef.value = e.status;
    inputNoteDateStartRef.value = e.dateStart;
    inputNoteDateEndRef.value = e.dateEnd;
    textareaNoteDetailRef.value = e.detail;
    selectorNotePriorityRef.value = e.priority;

    // set les étapes si il y en a
    if (e.stepArray.length > 0) {
        e.stepArray.forEach((i)=>onAddStep(true,i));
    }
    

}




// Vide l'editeur de note
function onClearNoteEditor() {
    console.log("Clear l'editeur de note");
    inputNoteTagRef.value = "";
    inputNoteTitleRef.value = "";
    textareaNoteDetailRef.value = "";
    inputNoteDateStartRef.value = "";
    inputNoteDateEndRef.value = "";
    selectorNoteStatusRef.value = statusArray[0];
    selectorNotePriorityRef.value = priorityArray[0];
    ulNoteEditorStepRef.innerHTML = "";
    currentNbreEditorStep = 0;
};






// fonction de vérification pour création de nouvelle étape.
function onCheckStepEmpty() {
    let allStepToCheck = document.querySelectorAll('[id^="' + "inputNoteStep" + '"]');
    let isErrorStepDetected = false;
        if(allStepToCheck.length > 0){
            allStepToCheck.forEach(e=>{
                if(e.value === ""){
                    console.log("champ input vide détecté !");
                    isErrorStepDetected = true;
                    return
                }
                
            })
        }
        return isErrorStepDetected;
}





// Ajout d'une étape supplementaire

// resultat Attendu : 

    // <li>
    //     
    //         <input class="input-field" id="inputNoteStep1" type="text" placeholder="Etape 1" maxlength="80"/>
    //         <input id="checkboxNoteStep1" type="checkbox">
    //         <button class="blabla" onclick="onDeleteStep()">x</button>
    // </li>
function onAddStep(isStepToSet,inputValue) {


    // Vérification si un step est vide n'en crée par d'autre
    // Uniquement lors de l'action l'utilisateur.
    
    if (isStepToSet === false) {
       if (onCheckStepEmpty()){
            console.log("Champ vide détécté : ne crée pas de step supplémentaire");
            return
       }
    }



    //création des l'ID 
    let currentListID = "liNoteStep" + currentNbreEditorStep;
    let currentInputStepID = "inputNoteStep" + currentNbreEditorStep;

    // creation de la liste
    let newLi = document.createElement("li");
    newLi.id = currentListID;
    newLi.name = "stepList";
    newLi.className = "editorListStep";

    // Creation input texte
    let newInput = document.createElement("input");
    newInput.type = "text";
    newInput.id = currentInputStepID;
    newInput.className ="input-field-step";
    newInput.placeholder ="Nouvelle étape";
    newInput.maxLength = "80";
    newInput.name = "stepName";



    // Creation input Hour
    let newInputHour = document.createElement("input");
    newInputHour.type = "number";
    newInputHour.placeholder = 0;
    newInputHour.name = "stepHour";
    newInputHour.className = "inputTime";
    newInputHour.oninput = function(){onlimitNumberLength(this, 3,999)};

    // Creation input Minutes
    let newInputMinutes = document.createElement("input");
    newInputMinutes.type = "number";
    newInputMinutes.placeholder = 0;
    newInputMinutes.name = "stepMinutes";
    newInputMinutes.className = "inputTime";
    newInputMinutes.oninput = function(){onlimitNumberLength(this, 2,59)};


    // Creation input checkbox
    let newCheckbox = document.createElement("input");
    newCheckbox.type =  "checkbox";
    newCheckbox.id = "checkboxNoteStep" + currentNbreEditorStep;
    newCheckbox.name = "stepCheckbox";


    // fonction pour modifier l'input (barré ou non) en fonction de la checkbox
    newCheckbox.onchange = function (){
        onChangeStepStatus(currentInputStepID,this.checked);
    }
   


    // Creation du bouton de suppression de l'etape (image)
    let newImg = document.createElement("img");
    newImg.className = "supprStepIcon";
    newImg.src = "./images/IconesDelete.png";
    newImg.onclick = function () {
        onDeleteStep(currentListID);
    }


    // Filtre si des valeur à inserer dans le cas d'une réédition de note
    if (isStepToSet === true) {
        newInput.value = inputValue.stepName;
        newCheckbox.checked = inputValue.stepChecked;
        newInputHour.value = inputValue.stepHour;
        newInputMinutes.value = inputValue.stepMinutes;
        // si c'est coché, change la classe pour barrer le texte
        if (inputValue.stepChecked === true) {newInput.className ="input-field-step-strike";}
        

    };

    // creation des "heures"
    newSymboleHour = document.createElement("p");
    newSymboleHour.innerHTML = " : ";
    newSymboleHour.className = "editorStep";



    // Insertion des nouveaux elements
    newLi.appendChild(newInput);
    newLi.appendChild(newInputHour);
    newLi.appendChild(newSymboleHour);
    newLi.appendChild(newInputMinutes);
    newLi.appendChild(newCheckbox);
    newLi.appendChild(newImg);
    ulNoteEditorStepRef.appendChild(newLi);

    // incremente le nbre de step
    currentNbreEditorStep++;

}


function onChangeStepStatus(target,isStrike) {
    let inputTarget = document.getElementById(target);
    inputTarget.className = isStrike ? "input-field-step-strike" : "input-field-step" ;
}



// Suppression d'une étape
function onDeleteStep(target) {
    let deleteTarget = document.getElementById(target);
    deleteTarget.remove();

}


// Click sur le bouton de validation dans l'éditeur de note
function onClickBtnValidNoteEditor() {
    
    
    // Recheche des erreurs dans la note avant validation
    onCheckNoteError();
}








// Detection des erreurs avant formatage

function onCheckNoteError() {
    console.log("Detection des erreurs")

    // detection des champs vides obligatoires
    let isEmptyTitleField = onCheckEmptyField(inputNoteTitleRef.value);
    if (isEmptyTitleField === true) {
        alert(arrayNotify.emptyTitleField);
    }
    
    // detection des champs vide pour les étapes
    let isEmptyStepField = onCheckStepEmpty();
    if (isEmptyStepField === true) {
        alert(arrayNotify.emptyStepField);
    }



    // Detection de mauvaise date
    let isErrorDate = onCheckDateError(inputNoteDateStartRef.value,inputNoteDateEndRef.value);

    if (isErrorDate === true) {
        alert(arrayNotify.errorDate);
    }

        

    if (isEmptyTitleField === true || isErrorDate === true || isEmptyStepField === true) {
        console.log("au moins une erreur détéctée. Ne valide pas la création/modification de la note");
    }else{
        onFormatNote();
    }
}





// Formatage de la note
function onFormatNote(){
    console.log("Formatage de la nouvelle note");
    // ------ Les dates ------
    let tempDateCreated = onFormatDateToday();
    let tempDateToday = onFormatDateToday();
    let tempDateStart = inputNoteDateStartRef.value;
    let tempDateEnd = inputNoteDateEndRef.value;


    // date début et fin vide : les deux égales date du jour.
    if (tempDateStart === "" && tempDateEnd ==="") {
        tempDateStart = tempDateToday;
        tempDateEnd = tempDateToday;
        console.log("Aucune date de définit : set les deux à date du jour");
    }

    // date début remplit et fin vide : date fin égale date début
    if (tempDateStart !== "" && tempDateEnd ==="") {
        tempDateEnd = tempDateStart;
        console.log("Uniquement date de début remplit : date de fin = date début");
    }


    // date début vide et fin remplit : date début = date du jour
    if (tempDateStart === "" && tempDateEnd !=="") {
        tempDateStart = tempDateToday;
        console.log("Uniquement date de fin remplit :  date début = date du jour");
    }







    // ------ ETAPES ------
    let noteEditorStepArray = [];
    let secureEditorStepArray = [];

    // Récupère tous les id des liste dont l'id commence par : stepList
    let allListStepArray = document.querySelectorAll('[id^="' + "liNoteStep" + '"]');

    console.log("traitement des étapes. Longueur : " + allListStepArray.length);

    // boolean d'étapes à traiter

    let isStepExist = allListStepArray.length > 0;
    console.log("Valeur de isStepExist : " + isStepExist);

    if (isStepExist === true) {
        console.log("Etapes existe traitement");
        // Extraction de la liste d'id.
        let allListStepID = [];
        allListStepArray.forEach(listRef=>{
            allListStepID.push(listRef.id);

        });

        // mise en tableau des étapes
        let tempNoteEditorStepArray = [];

        // Pour chaques liste, extrait les enfants et stocke dans le tableau
        allListStepID.forEach(e=>{
            tempNoteEditorStepArray.push(onSearchChildStep(e));
        });

        // Premiere lettre en majuscule pour les étapes
        tempNoteEditorStepArray.forEach(i=> noteEditorStepArray.push({stepName:onSetFirstLetterUppercase(i.stepName),stepChecked:i.stepChecked,stepHour:i.stepHour,stepMinutes:i.stepMinutes}));


    }else{console.log("Aucune étape à traiter")};






    // ------ TAG --------
    // traitement champ TAG VIDE et majuscule
    let tempTag = inputNoteTagRef.value ==="" || inputNoteTagRef.value === undefined ? defaultTagValue : inputNoteTagRef.value;
    tempTag = onSetToUppercase(tempTag);



    

    //------ Titre ------
    let tempTitle = onSetToUppercase(inputNoteTitleRef.value);


    //  -------------   SECURITY  ----------

    let secureTag = securitySearchForbidenItem(tempTag);
    let secureDetail = securitySearchForbidenItem(textareaNoteDetailRef.value);
    let secureTitle = securitySearchForbidenItem(tempTitle);



    if (isStepExist === true) {
        noteEditorStepArray.forEach(i=> secureEditorStepArray.push({stepName:securitySearchForbidenItem(i.stepName),stepChecked:i.stepChecked,stepHour:i.stepHour,stepMinutes:i.stepMinutes}));
    }

    

    
    // Mise en format variable

    let noteToInsert = {
        tag : secureTag,
        title : secureTitle,
        dateCreated : tempDateCreated,
        dateLastModification : tempDateToday,
        dateStart : tempDateStart,
        dateEnd : tempDateEnd,
        status : selectorNoteStatusRef.value,
        stepArray : secureEditorStepArray,
        detail : secureDetail,
        priority : selectorNotePriorityRef.value,
    }


    // Sortie de fonction : Détection de note "terminer", de "création" ou de "modification".

    // DETECTION d'une note "TERMINER"
    if (selectorNoteStatusRef.value === statusArray[2]) {
        console.log("Note 'Terminer' detecté");
        onDetectNoteTerminer(noteToInsert,currentKeyNoteInView);

    }else if(boolEditNoteCreation === true) {
        // Filtre selon création ou modification des données
        console.log("mode création de note");
        console.log(noteToInsert);
        // Insertion des datas dans la base
        onInsertData(noteToInsert);

    }else{
        onInsertModification(noteToInsert);
        console.log("mode modification de note");
    }



}

// Fonction pour récupérer les valeurs des inputs d'un LI par son ID
function onSearchChildStep(idRef) {
    let liElement = document.getElementById(idRef);

    // Déclaration variables pour stocker les valeurs
    let stepNameValue, checkboxValue, stepHourValue, stepMinutesValue;

 
    // Sélectionne tous les inputs dans la liste
    let childInputs = liElement.querySelectorAll('input');
      
    // Récupérer les valeurs des inputs
    childInputs.forEach(input=> {
        switch(input.name) {
          case 'stepName':
            stepNameValue = input.value;
            break;
          case 'stepHour':
            stepHourValue = input.value;
            break;
          case 'stepMinutes':
            stepMinutesValue = input.value;
            break;
          default:
            // Traitez les autres champs au besoin
            break;
        }

        // Pour le cas particulier du checkbox
        if (input.type === 'checkbox') {
          checkboxValue = input.checked;
        }
    });


    

    return {stepName:stepNameValue,stepChecked:checkboxValue,stepHour:parseInt(stepHourValue),stepMinutes:parseInt(stepMinutesValue)};
  }





// Insertion d'un nouvelle note
function onInsertData(e) {
    let transaction = db.transaction(taskStoreName,"readwrite");
    let store = transaction.objectStore(taskStoreName);

    let insertRequest = store.add(e);

    insertRequest.onsuccess = function () {
        console.log(e.title + "a été ajouté à la base");
        // evenement de notification
        eventNotify(e.title,"créé !");


        // Clear l'editeur de note
        onClearNoteEditor();
    }

    insertRequest.onerror = function(){
        console.log("Error", insertRequest.error);
        alert(insertRequest.error);
    }

    transaction.oncomplete = function(){
        console.log("transaction insertData complete");

        onCheckTagExist(e.tag);

    }

}


// Insertion d'une modification de note
function onInsertModification(e) {
    console.log("fonction d'insertion de la donnée modifié");

    let transaction = db.transaction(taskStoreName,"readwrite");
    let store = transaction.objectStore(taskStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(currentKeyNoteInView));

    

    modifyRequest.onsuccess = function () {
        console.log("modifyRequest = success");

        let modifiedData = modifyRequest.result[0];

        modifiedData.tag = e.tag;
        modifiedData.dateLastModification = e.dateLastModification;
        modifiedData.dateStart = e.dateStart;
        modifiedData.dateEnd = e.dateEnd;
        modifiedData.detail = e.detail;
        modifiedData.priority = e.priority;
        modifiedData.status = e.status;
        modifiedData.stepArray = e.stepArray;
        modifiedData.title = e.title;

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            console.log("insertModifiedData = success");

        }

        insertModifiedData.onerror = function (){
            console.log("insertModifiedData = error",insertModifiedData.error);

            
        }


    }

    modifyRequest.onerror = function(){
        console.log("ModifyRequest = error");
    }

    transaction.oncomplete = function(){
        console.log("transaction complete");

        // Vérification si nouveau tag de completion
        onCheckTagExist(e.tag);

        // Affiche a nouveau la note qui a été modifié
        console.log("affiche à nouveau la note modifié");
        onSearchNotesToDisplay(currentKeyNoteInView);
        
        // reactive la div principale Cache la div edition
        // Gestion affichage
        onChangeDisplay(["divNoteEditor"],[],[],["divListBtnNote","divNoteView"]);


    }
}


// Annuler une édition de note
function onClickBtnAnnulNoteEditor() {

    // Si ça vient d'une modification réaffiche le visualiseur de note sinon non.
    if (boolEditNoteCreation === true) {
        // Gestion affichage 
        onChangeDisplay(["divNoteEditor"],[],[],["divListBtnNote"]);
    }else{
        // Gestion affichage 
        onChangeDisplay(["divNoteEditor"],["divNoteView"],[],["divListBtnNote","divNoteView"]);
    }
}




// ------------------------------------------ Afficher notes ---------------------------------









function onSearchNotesToDisplay(keyRef) {
    console.log("Affichage de la note avec la key :  " + keyRef);
    // set la variable qui stocke la key de la note en cours de visualisation

    currentKeyNoteInView = keyRef;

    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("lecture de la Base de Données");
    let transaction = db.transaction(taskStoreName);//readonly
    let objectStore = transaction.objectStore(taskStoreName);
    let request = objectStore.getAll(IDBKeyRange.only(keyRef));
    
    
    request.onsuccess = function (){
        console.log("Requete de recherche réussit");
        console.log(request.result);

        // Affiche la note voulue
        let tempResult = request.result;
        console.log(tempResult[0]);
        onDisplayNote(tempResult[0]);
        // Set le contenu de la note en cours de visualisation dans une variable
        currentNoteInView = tempResult[0];
    };

    request.onerror = function (){
        console.log("Erreur lors de la recherche");
    };

}


// Variabilisation pour l'affichage d'une note

let noteViewTagRef = document.getElementById("noteViewTag"),
    noteViewTitleRef = document.getElementById("noteViewTitle"),
    noteViewPriorityRef = document.getElementById("noteViewPriority"),
    hnoteViewStatusRef = document.getElementById("hnoteViewStatus"),
    divNoteViewDetailRef = document.getElementById("divNoteViewDetail"),
    noteViewDateInfoRef = document.getElementById("noteViewDateInfo"),
    pNoteViewDateCreatedRef = document.getElementById("pNoteViewDateCreated"),
    divNoteViewRef = document.getElementById("divNoteView"),
    ulNoteViewStepRef = document.getElementById("ulNoteViewStep");


function onDisplayNote(e) {

    // Vide les élements prédédents
    onClearNoteView();

    // Set les nouveaux élements
    noteViewTagRef.innerHTML = `[ <i> ${e.tag} </i> ]`;
    noteViewTitleRef.innerHTML = e.title;
    noteViewPriorityRef.innerHTML = e.priority;
    hnoteViewStatusRef.innerHTML = e.status;
    divNoteViewDetailRef.innerHTML = e.detail;

    // Les dates sont affiché en format francais
    let dateCreatedFR = onFormatDateToFr(e.dateCreated);
    let dateStartFR = onFormatDateToFr(e.dateStart);
    let dateEndFR = onFormatDateToFr(e.dateEnd);
    let dateLastModificationFR = onFormatDateToFr(e.dateLastModification);

    noteViewDateInfoRef.innerHTML = "<b>Début : </b>" + dateStartFR +"   - - -   <b>Fin : </b>" + dateEndFR;
    pNoteViewDateCreatedRef.innerHTML = "<b>Note créée le : </b>" + dateCreatedFR + " - - - <b>Modifié le : </b> " + dateLastModificationFR;






    // génération des étapes en visualisation

    // Resultat à atteindre
    // <li>
    //     <label id="labelNoteViewStep6">Etape 6</label>
    //     <input type="checkbox" name="" id="" checked="true" disabled></input>
    // </li>

  

    e.stepArray.forEach(i=>
            {
                // Creation des éléments
                let newLi = document.createElement("li");

                if (i.stepChecked === true) {
                    // Texte rayé
                    newLi.innerHTML = "<del>" + i.stepName + "</del>";
                }else{    
                    newLi.innerHTML = i.stepName;
                }
                
                // Insertion 
                ulNoteViewStepRef.appendChild(newLi);
            }
    )




    // Rend la visionneuse de note visible
    onChangeDisplay([],["divNoteView"],[],["divNoteView"]);

}


// Clear le visualiseur de note
function onClearNoteView() {
    noteViewTagRef.innerHTML = "";
    noteViewTitleRef.innerHTML = "";
    noteViewPriorityRef.innerHTML = "";
    hnoteViewStatusRef.innerHTML = "";
    divNoteViewDetailRef.innerHTML = "";
    ulNoteViewStepRef.innerHTML = "";
    noteViewDateInfoRef.innerHTML = "";
    pNoteViewDateCreatedRef.innerHTML = "";
}




// --------------------------------------------- SUPPRESSION D'UNE NOTE --------------------------------

// popup de confirmation
function onClickBtnDeleteNote() {


    // Gestion affichage
    onChangeDisplay([],["divPopupDelete"],["divNoteView","divListBtnNote"],[]);

}

function onValidSuppression(){
    // supprime la note active les pages et cache le popup
    onDeleteNote(currentKeyNoteInView);

    // Gestion affichage
    onChangeDisplay(["divNoteView","divPopupDelete"],[],[],["divListBtnNote"]);

}

function onCancelSuppression() {
 
    // Gestion affichage
    onChangeDisplay(["divPopupDelete"],[],[],["divNoteView","divListBtnNote"]);
}



function onDeleteNote(keyTarget) {
    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("Suppression de la note avec la key : " + keyTarget);
    let transaction = db.transaction(taskStoreName,"readwrite");//transaction en écriture
    let objectStore = transaction.objectStore(taskStoreName);
    let request = objectStore.delete(IDBKeyRange.only(keyTarget));
    
    
    request.onsuccess = function (){
        console.log("Requete de suppression réussit");
        
        onUpdatePage(true);
    };

    request.onerror = function (){
        console.log("Erreur lors de la requete de suppression");
                
    };

    // Clear le visualiseur de note
    onClearNoteView();

    // Cache la visionneuse de note
    divNoteViewRef.style.display = "none";
}




// ------------------------------ TERMINER UNE NOTE -  -------------------------------


function onDetectNoteTerminer(dataToSave,keyToDelete) {

    // Proposition heure
    let pStepTotalTimeInfoRef = document.getElementById("pStepTotalTimeInfo");
        pStepTotalTimeInfoRef.innerHTML = "";

    // Calcul la durée total des étapes pour proposition d'heure et l'affiche pour info
    if (dataToSave.stepArray.length > 0){
        let totalStepMinutes = onCalculTotalStepDuration(dataToSave.stepArray);
        
        pStepTotalTimeInfoRef.innerHTML = ("La durée totale des étapes est de :" + totalStepMinutes.heures + " heures et " + totalStepMinutes.minutes + " minutes");
    }
    




    // Gestion affichage
    onChangeDisplay([],["divPopupTerminer"],["divNoteEditor"],[]);


    // insert la fonction pour la sauvegarde du dashboard et la suppression dans le bouton

    btnValidTerminerRef = document.getElementById("btnValidTerminer");
    btnValidTerminerRef.onclick = function (){

        onTermineNote(dataToSave,keyToDelete);

        
    }

}



// Annulation du popup "Terminer"
function onCancelPopupTerminer() {
    // Gestion affichage
    onChangeDisplay(["divPopupTerminer"],[],[],["divNoteEditor"]);
}




function onTermineNote(data,key) {

    // Sauvegarde des infos dans le store dashboard

    console.log("Confirmation de note terminer")
    // Recupere la durée de la tache


    // let taskDuration =  onConvertDurationToMinutes("taskDurationHours","TaskDurationMinutes");


    let taskDuration = onConvertDurationToMinutes(document.getElementById("taskDurationHours").value,document.getElementById("TaskDurationMinutes").value);

    
    // Recupere la date du jour
    let dateDuJour = onFormatDateToday();

    // set les éléments qui seront sauvegardés dans un objet.
    let dataToSave = {
        tag : data.tag,
        title : data.title,
        dateStart : data.dateStart,
        dateEnd : data.dateEnd < dateDuJour ? data.dateEnd : dateDuJour,
        duration : taskDuration,

    }
    console.log(dataToSave);


    // sauvegarde dans le store dashboard
    onInsertDataDashboard(dataToSave,key);


    // Gestion affichage
    onChangeDisplay(["divPopupTerminer","divNoteEditor"],[],[],["divListBtnNote"]);

}



// fonction de convertion des heures/minutes en total minutes
function  onConvertDurationToMinutes(inputHourValue,inputMinuteValue) {
    // Récupérer les valeurs heure/minutes des tâches
    const taskDurationHours = parseInt(inputHourValue) || 0;
    const TaskDurationMinutes = parseInt(inputMinuteValue) || 0;

    // Convertir en Minutes
    let totalDurationMinutes;
    totalDurationMinutes = taskDurationHours * 60 + TaskDurationMinutes;

    return totalDurationMinutes;
       
}




// Fonction d'addition des minutes
function onCalculTotalStepDuration(stepDuration) {
    let totalMinutes = 0;

    stepDuration.forEach(e=>{
        let tempMinutes = onConvertDurationToMinutes(e.stepHour,e.stepMinutes);
        totalMinutes += tempMinutes;
    });

    // converti le total des minutes en format heures
    let fullStepHour = onConvertMinutesToHour(totalMinutes);
    return fullStepHour;
}


// Fonction de convertion d'un nombre de minutes en heures completes
function onConvertMinutesToHour(totalMinutes) {
    var heures = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    return { heures: heures, minutes: minutes };
}






// Insertion des data dans le store dashboard

function onInsertDataDashboard(data,keyToDelete) {
    let transaction = db.transaction(dashBoardStoreName,"readwrite");
    let store = transaction.objectStore(dashBoardStoreName);

    let insertRequest = store.add(data);

    insertRequest.onsuccess = function () {
        console.log(data.title + "a été ajouté à la base");
        // evenement de notification
        eventNotify(data.title,"terminé !");


        // // Clear l'editeur de note
        // onClearNoteEditor();
    }

    insertRequest.onerror = function(){
        console.log("Error", insertRequest.error);
        alert(insertRequest.error);
    }

    transaction.oncomplete = function(){
        console.log("transaction insertData complete");

        console.log("Lancement de la suppression de la note");
        onDeleteNote(keyToDelete);

    }

}