




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
        console.log("Valeur TAG COMPLETION :")
        console.log(allTagCompletion);
    }






    transaction.oncomplete = function (){
        let arrayResult = requestTask.result;
        
        

        // Filtre se mise à jour du selecteur de tag
        if (isUpdateTagListRequired) {
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
function onSetListNotes(divNotesTarget,noteArray,indexToStart,thIDRef,textToDisplay) {
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
            

            // Set la class de la divbouton selon l'urgence
            if (e.priority === priorityArray[0]) { div.className ="divBtnListNote divBtnListNotePriority0" };
            if (e.priority === priorityArray[1]) { div.className ="divBtnListNote divBtnListNotePriority1" };
            if (e.priority === priorityArray[2]) { div.className ="divBtnListNote divBtnListNotePriority2" };

            // Creation du tag dans la div
            let tag = document.createElement("p");
            tag.innerHTML = `[ ${e.tag} ]`;
            tag.className = "listNoteTAG";
            

            // Creation du texte dans la div
            let title = document.createElement("p");
            title.innerHTML = e.title;
            title.className = "listNoteTitle";

            // insertion des éléments créés dans la div
            div.appendChild(tag);
            div.appendChild(title);


            CurrentDivNotesRef.appendChild(div);

            nbreIteration++
            // Met fin a la generation si atteind le nbre d'iteration max d'affichage
            if ( nbreIteration === maxBtnNoteToDisplay) {
                break;
            }
            
        }
        console.log("Je compte le nombre d'itération " + nbreIteration);
        
        // Set le nombre de tâche
        currentThRef.innerHTML = `${textToDisplay} ( ${noteArray.length} )   <i>${indexToStart + 1} - ${indexToStart + nbreIteration}</i>`;     

    }else{
        console.log("Aucune note pour " + divNotesTarget);
        CurrentDivNotesRef.innerHTML = "Aucune note";
        // Set le nombre de tâche à zero
        currentThRef.innerHTML = `${textToDisplay} ( 0 )   <i> 0 - 0 </i>`;
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
    


function onDisplayNoteEditor(boolModeCreation){

    // Desactive la page principale
    onDisableMainPage(true);
    divNoteEditorRef.style.display = "inline-block";

    // cache la visionneuse de note si visible

    // Cache la visionneuse de note si visible (et donc déjà référencé)
    if (divNoteViewRef !== undefined) {
        divNoteViewRef.style.display = "none";
    }
    


    // clear l'editeur de note
    onClearNoteEditor();

    // Set le mode d'ouverture de l'editeur de note
    boolEditNoteCreation = boolModeCreation;

    if (boolEditNoteCreation) {
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

    e.stepArray.forEach((i)=>onAddStep(true,i));

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
        console.log("valeur de isNewStepValid : " + isErrorStepDetected);
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
    
    if (!isStepToSet) {
       if (onCheckStepEmpty()){
            console.log("Champ vide détécté : ne crée pas de step supplémentaire");
            return
       }
    }



    //création de l'ID 
    let currentListID = "liNoteStepRef" + currentNbreEditorStep;
    let currentInputStepID = "inputNoteStep" + currentNbreEditorStep;

    // creation de la liste
    let newLi = document.createElement("li");
    newLi.id = currentListID;

    // Creation input texte
    let newInput = document.createElement("input");
    newInput.type = "text";
    newInput.className ="input-field";
    newInput.id = currentInputStepID;
    newInput.placeholder ="Nouvelle étape";
    newInput.maxLength = "80";
    newInput.name = "inputStepTAG";

    // Creation input checkbox
    let newCheckbox = document.createElement("input");
    newCheckbox.type =  "checkbox";
    newCheckbox.id = "checkboxNoteStep" + currentNbreEditorStep;
    newCheckbox.name = "checkboxStepTAG";
    // fonction pour modifier l'input (barré ou non) en fonction de la checkbox
    newCheckbox.onchange = function (){
        console.log(this.checked);
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
    if (isStepToSet) {
        newInput.value = inputValue.stepName;
        newCheckbox.checked = inputValue.stepChecked;
        // si c'est coché, change la classe pour barrer le texte
        if (inputValue.stepChecked) {newInput.className ="input-field-strike";}
        

    };

    // Insertion des nouveaux elements
    newLi.appendChild(newInput);
    newLi.appendChild(newCheckbox);
    newLi.appendChild(newImg);
    ulNoteEditorStepRef.appendChild(newLi);

    // incremente le nbre de step
    currentNbreEditorStep++;

}


function onChangeStepStatus(target,isStrike) {
    let inputTarget = document.getElementById(target);
    inputTarget.className = isStrike ? "input-field-strike" : "input-field" ;
}



// Suppression d'une étape
function onDeleteStep(target) {
    let deleteTarget = document.getElementById(target);
    deleteTarget.remove();
    currentNbreEditorStep--;
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
    console.log("valeur de isEmptyTitleField = " + isEmptyTitleField);
    if (isEmptyTitleField) {
        alert(arrayNotify.emptyTitleField);
    }
    
    // detection des champs vide pour les étapes
    let isEmptyStepField = onCheckStepEmpty();
    console.log("valeur de isEmptyStepField = " + isEmptyStepField);
    if (isEmptyStepField) {
        alert(arrayNotify.emptyStepField);
    }



    // Detection de mauvaise date
    let isErrorDate = onCheckDateError(inputNoteDateStartRef.value,inputNoteDateEndRef.value);

    if (isErrorDate) {
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


    // date début et fin vide = les deux égales date du jour.
    console.log("detection des dates pour test")

    console.log(inputNoteDateStartRef.value);
    if (tempDateStart === "" && tempDateEnd ==="") {
        tempDateStart = tempDateToday;
        tempDateEnd = tempDateToday;
    }

    // date début remplit et fin vide = date fin égale date début
    if (tempDateStart !== "" && tempDateEnd ==="") {
        tempDateEnd = tempDateStart;
    }


    // date début vide et fin remplit = date début = date du jour
    if (tempDateStart === "" && tempDateEnd !=="") {
        tempDateStart = tempDateToday;
    }






    // ------ ETAPES ------
    // Recupere les ID des inputs pour les étapes (tagé "inputStepTAG")
    let allInputStepArray = document.getElementsByName("inputStepTAG");
    let allInputStepID =[];
    allInputStepArray.forEach(e=>{
        allInputStepID.push(e.id)
    })

    // Recupere les ID des checkbox
    let allCheckBoxStepArray = document.getElementsByName("checkboxStepTAG");
    let allCheckBoxStepID=[];
    allCheckBoxStepArray.forEach(e=>{
        allCheckBoxStepID.push(e.id);
    })


    // mise en tableau des étapes
    let tempNoteEditorStepArray = [];

    for (let i = 0; i < allInputStepID.length; i++) {
        let inputNoteStepRef = document.getElementById(allInputStepID[i]);
        let checkboxNoteStepRef = document.getElementById(allCheckBoxStepID[i]);
        tempNoteEditorStepArray.push({stepName:inputNoteStepRef.value,stepChecked:checkboxNoteStepRef.checked});
    }

    // Premiere lettre en majuscule pour les étapes
    let noteEditorStepArray = [];
    tempNoteEditorStepArray.forEach(i=> noteEditorStepArray.push({stepName:onSetFirstLetterUppercase(i.stepName),stepChecked:i.stepChecked}));


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

    let secureEditorStepArray = [];
    noteEditorStepArray.forEach(i=> secureEditorStepArray.push({stepName:securitySearchForbidenItem(i.stepName),stepChecked:i.stepChecked}));

    
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

    }else if(boolEditNoteCreation) {
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
        
        // reactive la div principale
        onDisableMainPage(false);
        // Cacle la div edition
        divNoteEditorRef.style.display = "none";
    }
}





// Annuler une édition de note
function onClickBtnAnnulNoteEditor() {

    // reactive la div principale
    onDisableMainPage(false);
    // Cacle la div edition
    divNoteEditorRef.style.display = "none";
    divNoteViewRef.style.display = "block";



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
let boolNoteViewItemsAlreadySet = false,//pour ne permettre le référencement qu'une seule fois
    noteViewTagRef,
    noteViewTitleRef,
    noteViewPriorityRef,
    hnoteViewStatusRef,
    pNoteViewDetailRef,
    noteViewDateInfoRef,
    pNoteViewDateCreatedRef,
    ulNoteViewStepRef,
    divNoteViewRef;


function onDisplayNote(e) {
    // Variabilisation unique des éléments

    

    if (boolNoteViewItemsAlreadySet === false) {
        noteViewTagRef = document.getElementById("noteViewTag");
        noteViewTitleRef = document.getElementById("noteViewTitle");
        noteViewPriorityRef = document.getElementById("noteViewPriority");
        hnoteViewStatusRef = document.getElementById("hnoteViewStatus");
        pNoteViewDetailRef = document.getElementById("pNoteViewDetail");
        noteViewDateInfoRef = document.getElementById("noteViewDateInfo");
        pNoteViewDateCreatedRef = document.getElementById("pNoteViewDateCreated");
        divNoteViewRef = document.getElementById("divNoteView");
        ulNoteViewStepRef = document.getElementById("ulNoteViewStep");

        // les items ne sont référencés qu'une seule fois
        boolNoteViewItemsAlreadySet = true;
    }

    

    // Vide les élements prédédents
    onClearNoteView();

    // Set les nouveaux élements
    noteViewTagRef.innerHTML = `[ <i> ${e.tag} </i> ]`;
    noteViewTitleRef.innerHTML = e.title;
    noteViewPriorityRef.innerHTML = e.priority;
    hnoteViewStatusRef.innerHTML = e.status;
    pNoteViewDetailRef.innerHTML = e.detail;

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

                let newLabel = document.createElement("label");
                if (i.stepChecked) {
                    // Texte rayé
                    newLabel.innerHTML = "<del>" + i.stepName + "</del>";
                }else{
                    
                    newLabel.innerHTML = i.stepName;
                }
                
               


                // Insertion 

                newLi.appendChild(newLabel);


                ulNoteViewStepRef.appendChild(newLi);


            
            }
    )




    // Rend la visionneuse de note visible
    divNoteViewRef.style.display = "block";

}


// Clear le visualiseur de note
function onClearNoteView() {
    noteViewTagRef.innerHTML = "";
    noteViewTitleRef.innerHTML = "";
    noteViewPriorityRef.innerHTML = "";
    hnoteViewStatusRef.innerHTML = "";
    pNoteViewDetailRef.innerHTML = "";
    ulNoteViewStepRef.innerHTML = "";
    noteViewDateInfoRef.innerHTML = "";
    pNoteViewDateCreatedRef.innerHTML = "";
}




// --------------------------------------------- SUPPRESSION D'UNE NOTE --------------------------------

// popup de confirmation
function onClickBtnDeleteNote() {
    // Desactive les éléments et rends visible le popup de confirmation
    onDisableMainPage(true);

    divPopupDeleteRef.style.display = "block";
}

function onValidSuppression(){
    // supprime la note active les pages et cache le popup
    onDeleteNote(currentKeyNoteInView);
    onDisableMainPage(false);

    divPopupDeleteRef.style.display = "none";
}

function onCancelSuppression() {
    // active les pages et cache le popup
    onDisableMainPage(false);
    divPopupDeleteRef.style.display = "none";
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
    // Desactive les éléments et rends visible le popup de confirmation
    onDisableMainPage(true);
    divNoteEditorRef.style.opacity = 0.1;
    divNoteEditorRef.style.pointerEvents = "none";


    // Affiche le popup
    divPopupTerminerRef.style.display = "block";

    // insert la fonction pour la sauvegarde du dashboard et la suppression dans le bouton

    btnValidTerminerRef = document.getElementById("btnValidTerminer");
    btnValidTerminerRef.onclick = function (){

        onTermineNote(dataToSave,keyToDelete);

        
    }

}




function onRemovePopupTerminer() {
    // Desactive les éléments et rends visible le popup de confirmation
    onDisableMainPage(false);
    divNoteEditorRef.style.opacity = 1;
    divNoteEditorRef.style.pointerEvents = "all";


    // Affiche le popup
    divPopupTerminerRef.style.display = "none";
}




function onTermineNote(data,key) {
    // Sauvegarde des infos dans le store dashboard

    console.log("Confirmation de note terminer")
    // Recupere la durée de la tache
    let taskDuration = onReceiveTaskDuration();

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


    // Réaffiche la page et masque la div editeur
    onRemovePopupTerminer();
    divNoteEditorRef.style.display = "none";

}




function onReceiveTaskDuration() {
    // Récupérer les valeurs saisies par l'utilisateur
    const taskDurationHours = parseInt(document.getElementById("taskDurationHours").value) || 0;
    const TaskDurationMinutes = parseInt(document.getElementById("TaskDurationMinutes").value) || 0;

    // Convertir en TaskDurationMinutes
    let totalTaskDurationMinutes;

    totalTaskDurationMinutes = taskDurationHours * 60 + TaskDurationMinutes;

    return totalTaskDurationMinutes;

    
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