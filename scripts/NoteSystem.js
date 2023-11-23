




let notesEnCoursArray= [],//les notes en cours
    notesAFaireArray =[],//les notes à faire
    currentKeyNoteInView,//la key de la note en cours de visualisation
    currentNoteInView,//le contenu de la note en cours de visualisation
    boolEditNoteCreation,//mode d'ouverture de l'editeur de note en mode création ou modification
    noteEnCoursIndexToStart,//pour l'affichage des notes avec les boutons next et previous
    noteAFaireIndexToStart,//pour l'affichage des notes avec les boutons next et previous
    maxBtnNoteToDisplay = 6,//nbre de bouton maximum qui sont affiché dans la liste
    btnNoteEnCoursPreviousRef = document.getElementById("btnNoteEnCoursPrevious"),//les boutons de navigation des notes
    btnNoteEnCoursNextRef = document.getElementById("btnNoteEnCoursNext"),//les boutons de navigation des notes
    btnNoteAFairePreviousRef = document.getElementById("btnNoteAFairePrevious"),//les boutons de navigation des notes
    btnNoteAFaireNextRef = document.getElementById("btnNoteAFaireNext");//les boutons de navigation des notes













// --------------------------              UPDATE  PAGE                ------------------------------------------------



function onUpdatePage() {
    console.log("update Page");
    // Clear la page
    // Reset les array
    notesEnCoursArray = [];
    notesAFaireArray = [];
    noteEnCoursIndexToStart = 0;
    noteAFaireIndexToStart = 0;
    



    // recupere les éléments dans la base et les stock dans une grosse variable temporaire
    
    let transaction = db.transaction(objectStoreName);//readonly
    let objectStore = transaction.objectStore(objectStoreName);
    let indexStore = objectStore.index("title");
    let request = indexStore.getAll();

   request.onsuccess = function (){
        console.log("Les éléments ont été récupéré dans la base");
        console.log("stockage dans le tableau temporaire");

        
        let arrayResult = request.result;
        

        // fonction de trie
        onSortItem(arrayResult)
        // Referme l'accès base
        
    }
    request.error = function (){
        console.log("Erreur de requete sur la base");
    }
}



// Trie et stock dans les variables avec uniquement key/titre/priorité/tag
function onSortItem(arrayResult) {
    

    //Filtre sur les notes en cours
    console.log("Trie des éléments 'En cours'");
    let tempNoteEnCoursArray = arrayResult.filter((item) =>{
        return item.status === "En cours";
    })

    // Ne recupère que les valeurs nécessaires
    tempNoteEnCoursArray.forEach(e=>{
        notesEnCoursArray.push({key:e.key,title:e.title,priority:e.priority,tag:e.tag})
    })



    //Filtre sur les notes A FAIRE
    console.log("Trie des éléments 'A faire'");
    let tempNoteAFaireArray = arrayResult.filter((item) =>{
        return item.status === "A faire";
    })

    // Ne recupère que les valeurs nécessaires
    tempNoteAFaireArray.forEach(e=>{
       notesAFaireArray.push({key:e.key,title:e.title,priority:e.priority,tag:e.tag})
    })


    
    // Creation des liste de notes par catégories
    onSetListNotes("divBtnNotesEnCours",notesEnCoursArray,noteEnCoursIndexToStart,"thTxtEnCours","En cours");
    onSetListNotes("divBtnNotesAFaire",notesAFaireArray,noteAFaireIndexToStart,"thTxtAFaire","A Faire");
}



// Crée les boutons des notes selon la catégorie
function onSetListNotes(divNotesTarget,noteArray,indexToStart,thIDRef,textToDisplay) {
    // set le nombre de tache 
    let currentThRef = document.getElementById(thIDRef);
    currentThRef.innerHTML = textToDisplay + " ( " + noteArray.length + " )";

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
            if (e.priority === "Routine") { div.className ="divBtnListNote divBtnListNoteRoutine" };
            if (e.priority === "Urgent") { div.className ="divBtnListNote divBtnListNoteUrgent" };
            if (e.priority === "Flash") { div.className ="divBtnListNote divBtnListNoteFlash" };

            // Creation du tag dans la div
            let tag = document.createElement("p");
            tag.innerHTML = "[ " + e.tag + " ]";
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

    }else{
        console.log("Aucune note pour " + divNotesTarget);
        CurrentDivNotesRef.innerHTML = "Aucune note";
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
    if (noteAFaireIndexToStart + maxBtnNoteToDisplay >= notesAFaireArray.length) {
        btnNoteAFaireNextRef.disabled = "disabled";
    }else{
        btnNoteAFaireNextRef.disabled = "";
    }

    // Bouton note A faire "précédent"
    btnNoteAFairePreviousRef.disabled = noteAFaireIndexToStart === 0 ? "disabled": "";

    // Bouton note A faire "suivant"
    if (noteEnCoursIndexToStart + maxBtnNoteToDisplay >= notesEnCoursArray.length) {
        btnNoteEnCoursNextRef.disabled = "disabled";
    }else{
        btnNoteEnCoursNextRef.disabled = "";
    }

    // Bouton note A faire "précédent"
    btnNoteEnCoursPreviousRef.disabled = noteEnCoursIndexToStart === 0 ? "disabled": "";
    
}

// Navigation dans les boutons de notes
// Notes en cours
function onClickNavNoteEnCoursPrevious() {
    noteEnCoursIndexToStart -= maxBtnNoteToDisplay;
    onSetListNotes("divBtnNotesEnCours",notesEnCoursArray,noteEnCoursIndexToStart,"thTxtEnCours","En cours");
}

function onClickNavNoteEnCoursNext() {
    noteEnCoursIndexToStart += maxBtnNoteToDisplay;
    onSetListNotes("divBtnNotesEnCours",notesEnCoursArray,noteEnCoursIndexToStart,"thTxtEnCours","En cours");
}

// Notes à faire
function onClickNavNoteAFairePrevious() {
    noteAFaireIndexToStart -= maxBtnNoteToDisplay;
    onSetListNotes("divBtnNotesAFaire",notesAFaireArray,noteAFaireIndexToStart,"thTxtAFaire","A Faire");
}

function onClickNavNoteAFaireNext() {
    noteAFaireIndexToStart += maxBtnNoteToDisplay;
    onSetListNotes("divBtnNotesAFaire",notesAFaireArray,noteAFaireIndexToStart,"thTxtAFaire","A Faire");
}






// ----------------------------       EDITION de Notes           -----------------------------------------








// Variabilisation des items

let divNoteEditorRef = document.getElementById("divNoteEditor"),
    divPopupDeleteRef = document.getElementById("divPopupDelete"),
    inputNoteTagRef = document.getElementById("inputNoteTag"),
    inputNoteTitleRef = document.getElementById("inputNoteTitle"),
    selectorNoteStatusRef = document.getElementById("selectorNoteStatus"),
    inputNoteDateStartRef = document.getElementById("inputNoteDateStart"),
    inputNoteStep1Ref = document.getElementById("inputNoteStep1"),
    inputNoteStep2Ref = document.getElementById("inputNoteStep2"),
    inputNoteStep3Ref = document.getElementById("inputNoteStep3"),
    inputNoteStep4Ref = document.getElementById("inputNoteStep4"),
    inputNoteStep5Ref = document.getElementById("inputNoteStep5"),
    inputNoteStep6Ref = document.getElementById("inputNoteStep6"),
    textareaNoteDetailRef = document.getElementById("textareaNoteDetail"),
    inputNoteDateEndRef = document.getElementById("inputNoteDateEnd"),
    selectorNotePriorityRef = document.getElementById("selectorNotePriority"),
    checkboxNoteStep1Ref = document.getElementById("checkboxNoteStep1"),
    checkboxNoteStep2Ref = document.getElementById("checkboxNoteStep2"),
    checkboxNoteStep3Ref = document.getElementById("checkboxNoteStep3"),
    checkboxNoteStep4Ref = document.getElementById("checkboxNoteStep4"),
    checkboxNoteStep5Ref = document.getElementById("checkboxNoteStep5"),
    checkboxNoteStep6Ref = document.getElementById("checkboxNoteStep6"),
    legendNoteEditorRef = document.getElementById("legendNoteEditor");





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




// Bouton d'insertion d'éléments dans détail
function onInsertReturnLine(){
    // recupère le texte actuel
    // ajoute le BR
    // Insert le nouveau texte
    let tempDetailEditor = textareaNoteDetailRef.value;
    tempDetailEditor += "<br />"
    textareaNoteDetailRef.value = tempDetailEditor;

}










// Remplit l'éditeur de note lorsqu'il est ouvert en mode "Modification"
function onSetNoteEditor(e) {
    console.log("set l'editeur pour modification");
    inputNoteTagRef.value = e.tag;
    inputNoteTitleRef.value = e.title;
    selectorNoteStatusRef.value = e.status;
    inputNoteDateStartRef.value = e.dateStartUS;
    inputNoteStep1Ref.value = e.step1;
    inputNoteStep2Ref.value = e.step2;
    inputNoteStep3Ref.value = e.step3;
    inputNoteStep4Ref.value = e.step4;
    inputNoteStep5Ref.value = e.step5;
    inputNoteStep6Ref.value = e.step6;
    textareaNoteDetailRef.value = e.detail;
    inputNoteDateEndRef.value = e.dateEndUS;
    selectorNotePriorityRef.value = e.priority;
    checkboxNoteStep1Ref.checked = e.step1Checked;
    checkboxNoteStep2Ref.checked = e.step2Checked;
    checkboxNoteStep3Ref.checked = e.step3Checked;
    checkboxNoteStep4Ref.checked = e.step4Checked;
    checkboxNoteStep5Ref.checked = e.step5Checked;
    checkboxNoteStep6Ref.checked = e.step6Checked;


}




// Vide l'editeur de note
function onClearNoteEditor() {
    console.log("Clear l'editeur de note");
    inputNoteTagRef.value = "";
    inputNoteTitleRef.value = "";
    textareaNoteDetailRef.value = "";
    inputNoteStep1Ref.value = "";
    inputNoteStep2Ref.value = "";
    inputNoteStep3Ref.value = "";
    inputNoteStep4Ref.value = "";
    inputNoteStep5Ref.value = "";
    inputNoteStep6Ref.value = "";
    inputNoteDateStartRef.value = "";
    inputNoteDateEndRef.value = "";
    selectorNoteStatusRef.value = "A faire";
    selectorNotePriorityRef.value = "Routine";
    checkboxNoteStep1Ref.checked = false;
    checkboxNoteStep2Ref.checked = false;
    checkboxNoteStep3Ref.checked = false;
    checkboxNoteStep4Ref.checked = false;
    checkboxNoteStep5Ref.checked = false;
    checkboxNoteStep6Ref.checked = false;
};







// Click sur le bouton de validation dans l'éditeur de note
function onClickBtnValidNoteEditor() {
    


    // Lance le formatage de la note
    onFormatNote();
}




// Formatage de la note
function onFormatNote(){
    console.log("Formatage de la nouvelle note");
    // Les dates
     let tempDateStart = onFormatSelectedDate(inputNoteDateStartRef.value);
     let tempDateEnd = onFormatSelectedDate(inputNoteDateEndRef.value);
     let tempDateEndFR = onFormatSelectedDateFR(inputNoteDateEndRef.value);
     let tempDateEndUS = onFormatSelectedDateUS(inputNoteDateEndRef.value);

     let tempDateStartFR = onFormatSelectedDateFR(inputNoteDateStartRef.value);
     let tempDateStartUS = onFormatSelectedDateUS(inputNoteDateStartRef.value);
     let tempDateCreated = onFormatDateCreated();

    
    
    // Mise en format variable

    let noteToInsert = {
        tag : inputNoteTagRef.value,
        title :inputNoteTitleRef.value,
        dateStartFormated : tempDateStart,
        dateStartFR :tempDateStartFR,
        dateStartUS :tempDateStartUS,
        status : selectorNoteStatusRef.value,
        step1 : inputNoteStep1Ref.value,
        step1Checked : checkboxNoteStep1Ref.checked,
        step2 : inputNoteStep2Ref.value,
        step2Checked : checkboxNoteStep2Ref.checked,
        step3 : inputNoteStep3Ref.value,
        step3Checked : checkboxNoteStep3Ref.checked,
        step4 : inputNoteStep4Ref.value,
        step4Checked : checkboxNoteStep4Ref.checked,
        step5 : inputNoteStep5Ref.value,
        step5Checked : checkboxNoteStep5Ref.checked,
        step6 : inputNoteStep6Ref.value,
        step6Checked : checkboxNoteStep6Ref.checked,
        detail : textareaNoteDetailRef.value,
        dateEndFormated : tempDateEnd,
        dateEndFR : tempDateEndFR,
        dateEndUS : tempDateEndUS,
        dateCreated : tempDateCreated,
        priority : selectorNotePriorityRef.value
    }

    //Formatage en full majuscule titre/TAG
    noteToInsert.tag = onSetToUppercase(noteToInsert.tag);
    noteToInsert.title = onSetToUppercase(noteToInsert.title);

    // Premiere lettre en majuscule
    noteToInsert.step1 = onSetFirstLetterUppercase(noteToInsert.step1);
    noteToInsert.step2 = onSetFirstLetterUppercase(noteToInsert.step2);
    noteToInsert.step3 = onSetFirstLetterUppercase(noteToInsert.step3);
    noteToInsert.step4 = onSetFirstLetterUppercase(noteToInsert.step4);
    noteToInsert.step5 = onSetFirstLetterUppercase(noteToInsert.step5);
    noteToInsert.step6 = onSetFirstLetterUppercase(noteToInsert.step6);

    // traitement champ TAG VIDE
    if (noteToInsert.tag === "" || noteToInsert.tag === undefined) {
        console.log("tag vide remplacé par 'DIVERS'");
        noteToInsert.tag = "DIVERS";
    };




// Filtre selon création ou modification des données
    if (boolEditNoteCreation) {
        console.log("mode création de note");
        console.log(noteToInsert);
        // Insertion des datas dans la base
        onInsertData(noteToInsert);
        onUpdatePage();
    }else{
        onInsertModification(noteToInsert);
        console.log("mode modification de note");
    }
    

}




// Insertion d'un nouvelle note
function onInsertData(e) {
    let transaction = db.transaction(objectStoreName,"readwrite");
    let store = transaction.objectStore(objectStoreName);

    let insertRequest = store.add(e);

    insertRequest.onsuccess = function () {
        console.log(e.title + "a été ajouté à la base");

        // Clear l'editeur de note
        onClearNoteEditor();
    }

    insertRequest.onerror = function(){
        console.log("Error", insertRequest.error);
        alert(insertRequest.error);
    }

    transaction.oncomplete = function(){
        console.log("transaction complete");
    }

}


// Insertion d'une modification de note
function onInsertModification(e) {
    console.log("fonction d'insertion de la donnée modifié");

    let transaction = db.transaction(objectStoreName,"readwrite");
    let store = transaction.objectStore(objectStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(currentKeyNoteInView));

    

    modifyRequest.onsuccess = function () {
        console.log("modifyRequest = success");

        let modifiedData = modifyRequest.result[0];

        modifiedData.tag = e.tag;
        modifiedData.dateCreated = e.dateCreated;
        modifiedData.dateEndFR = e.dateEndFR;
        modifiedData.dateEndFormated = e.dateEndFormated;
        modifiedData.dateEndUS = e.dateEndUS;
        modifiedData.dateStartFR = e.dateStartFR;
        modifiedData.dateStartFormated = e.dateStartFormated;
        modifiedData.dateStartUS = e.dateStartUS;
        modifiedData.detail = e.detail;
        modifiedData.priority = e.priority;
        modifiedData.status = e.status;
        modifiedData.step1 = e.step1;
        modifiedData.step2 = e.step2;
        modifiedData.step3 = e.step3;
        modifiedData.step4 = e.step4;
        modifiedData.step5 = e.step5;
        modifiedData.step6 = e.step6;
        modifiedData.step1Checked = e.step1Checked;
        modifiedData.step2Checked = e.step2Checked;
        modifiedData.step3Checked = e.step3Checked;
        modifiedData.step4Checked = e.step4Checked;
        modifiedData.step5Checked = e.step5Checked;
        modifiedData.step6Checked = e.step6Checked;
        modifiedData.title = e.title;


        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            console.log("insertModifiedData = success");

            // Actualisation de la page
            onUpdatePage();
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
    divNoteViewRef.style.display = "inline-block";

    // Filtre si création ou modification de note
    if (boolEditNoteCreation) {
        
    }else{

    }
}




// ------------------------------------------ Afficher notes ---------------------------------









function onSearchNotesToDisplay(keyRef) {
    console.log("Affichage de la note avec la key :  " + keyRef);
    // set la variable qui stocke la key de la note en cours de visualisation

    currentKeyNoteInView = keyRef;

    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("lecture de la Base de Données");
    let transaction = db.transaction(objectStoreName);//readonly
    let objectStore = transaction.objectStore(objectStoreName);
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
    labelNoteViewStep1Ref,
    labelNoteViewStep2Ref,
    labelNoteViewStep3Ref,
    labelNoteViewStep4Ref,
    labelNoteViewStep5Ref,
    labelNoteViewStep6Ref,
    imgNoteViewCheckStep1Ref,
    imgNoteViewCheckStep2Ref,
    imgNoteViewCheckStep3Ref,
    imgNoteViewCheckStep4Ref,
    imgNoteViewCheckStep5Ref,
    imgNoteViewCheckStep6Ref,
    noteViewDateInfoRef,
    pNoteViewDateCreatedRef,
    divNoteViewRef;


function onDisplayNote(e) {
    // Variabilisation unique des éléments

    

    if (boolNoteViewItemsAlreadySet === false) {
        noteViewTagRef = document.getElementById("noteViewTag");
        noteViewTitleRef = document.getElementById("noteViewTitle");
        noteViewPriorityRef = document.getElementById("noteViewPriority");
        hnoteViewStatusRef = document.getElementById("hnoteViewStatus");
        pNoteViewDetailRef = document.getElementById("pNoteViewDetail");
        imgNoteViewCheckStep1Ref = document.getElementById("imgNoteViewCheckStep1");
        imgNoteViewCheckStep2Ref = document.getElementById("imgNoteViewCheckStep2");
        imgNoteViewCheckStep3Ref = document.getElementById("imgNoteViewCheckStep3");
        imgNoteViewCheckStep4Ref = document.getElementById("imgNoteViewCheckStep4");
        imgNoteViewCheckStep5Ref = document.getElementById("imgNoteViewCheckStep5");
        imgNoteViewCheckStep6Ref = document.getElementById("imgNoteViewCheckStep6");
        labelNoteViewStep1Ref = document.getElementById("labelNoteViewStep1");
        labelNoteViewStep2Ref = document.getElementById("labelNoteViewStep2");
        labelNoteViewStep3Ref = document.getElementById("labelNoteViewStep3");
        labelNoteViewStep4Ref = document.getElementById("labelNoteViewStep4");
        labelNoteViewStep5Ref = document.getElementById("labelNoteViewStep5");
        labelNoteViewStep6Ref = document.getElementById("labelNoteViewStep6");
        noteViewDateInfoRef = document.getElementById("noteViewDateInfo");
        pNoteViewDateCreatedRef = document.getElementById("pNoteViewDateCreated");
        divNoteViewRef = document.getElementById("divNoteView");

        // les items ne sont référencés qu'une seule fois
        boolNoteViewItemsAlreadySet = true;
    }

    

    // Vide les élements prédédents
    onClearNoteView();



    // Set les nouveaux élements
    noteViewTagRef.innerHTML = "[ " + e.tag + " ]";
    noteViewTitleRef.innerHTML = e.title;
    noteViewPriorityRef.innerHTML = e.priority;
    hnoteViewStatusRef.innerHTML = e.status;
    pNoteViewDetailRef.innerHTML = e.detail;
    imgNoteViewCheckStep1Ref.src = e.step1Checked ? "./images/IconeChecked.png" : "./images/iconBlank.png";
    imgNoteViewCheckStep2Ref.src = e.step2Checked ? "./images/IconeChecked.png" : "./images/iconBlank.png";
    imgNoteViewCheckStep3Ref.src = e.step3Checked ? "./images/IconeChecked.png" : "./images/iconBlank.png";
    imgNoteViewCheckStep4Ref.src = e.step4Checked ? "./images/IconeChecked.png" : "./images/iconBlank.png";
    imgNoteViewCheckStep5Ref.src = e.step5Checked ? "./images/IconeChecked.png" : "./images/iconBlank.png";
    imgNoteViewCheckStep6Ref.src = e.step6Checked ? "./images/IconeChecked.png" : "./images/iconBlank.png";
    labelNoteViewStep1Ref.innerHTML = e.step1;
    labelNoteViewStep2Ref.innerHTML = e.step2;
    labelNoteViewStep3Ref.innerHTML = e.step3;
    labelNoteViewStep4Ref.innerHTML = e.step4;
    labelNoteViewStep5Ref.innerHTML = e.step5;
    labelNoteViewStep6Ref.innerHTML = e.step6;
    noteViewDateInfoRef.innerHTML = "<b>Début : </b>" + e.dateStartFR +"   - - -   <b>Fin : </b>" + e.dateEndFR;
    pNoteViewDateCreatedRef.innerHTML = "<b>Note créée le : </b>" + e.dateCreated;

    // Rend la visionneuse de note visible
    divNoteViewRef.style.display = "inline-block";

}


// Clear le visualiseur de note
function onClearNoteView() {
    noteViewTagRef.innerHTML = "";
    noteViewTitleRef.innerHTML = "";
    noteViewPriorityRef.innerHTML = "";
    hnoteViewStatusRef.innerHTML = "";
    pNoteViewDetailRef.innerHTML = "";
    imgNoteViewCheckStep1Ref.src = "./images/iconBlank.png";
    imgNoteViewCheckStep2Ref.src = "./images/iconBlank.png";
    imgNoteViewCheckStep3Ref.src = "./images/iconBlank.png";
    imgNoteViewCheckStep4Ref.src = "./images/iconBlank.png";
    imgNoteViewCheckStep5Ref.src = "./images/iconBlank.png";
    imgNoteViewCheckStep6Ref.src = "./images/iconBlank.png";
    labelNoteViewStep1Ref.innerHTML = "";
    labelNoteViewStep2Ref.innerHTML = "";
    labelNoteViewStep3Ref.innerHTML = "";
    labelNoteViewStep4Ref.innerHTML = "";
    labelNoteViewStep5Ref.innerHTML = "";
    labelNoteViewStep6Ref.innerHTML = "";
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
    onDeleteNote()
    onDisableMainPage(false);

    divPopupDeleteRef.style.display = "none";
}

function onCancelSuppression() {
    // active les pages et cache le popup
    onDisableMainPage(false);
    divPopupDeleteRef.style.display = "none";
}



function onDeleteNote() {
    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("Suppression de la note avec la key : " + currentKeyNoteInView);
    let transaction = db.transaction(objectStoreName,"readwrite");//transaction en écriture
    let objectStore = transaction.objectStore(objectStoreName);
    let request = objectStore.delete(IDBKeyRange.only(currentKeyNoteInView));
    
    
    request.onsuccess = function (){
        console.log("Requete de suppression réussit");
        
        onUpdatePage();
    };

    request.onerror = function (){
        console.log("Erreur lors de la requete de suppression");
        

        
    };

    // Clear le visualiseur de note
    onClearNoteView();

    // Cache la visionneuse de note
    divNoteViewRef.style.display = "none";
}



