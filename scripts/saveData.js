
// Sauvegarde de la base de donnée
function exportData() {
        console.log("Demande d'export data");
        var transaction = db.transaction([taskStoreName], 'readonly');
        var store = transaction.objectStore(taskStoreName);

        var exportRequest = store.getAll();

        exportRequest.onsuccess = function() {
            var data = exportRequest.result;
            downloadJSON(data, 'exported_data.json');
        };

        exportRequest.onerror = function(error) {
            console.log('Erreur lors de l\'export des données : ', error);
        };
};


function downloadJSON(data, filename) {
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });

    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}



//  ----------------------------------------------- import data - ------------------------------------------

function importData(jsonFile) {
    var dbRequest = indexedDB.open('MonStoreDB');

    dbRequest.onerror = function(event) {
        console.log('Erreur lors de l\'ouverture de la base de données : ', event.target.errorCode);
    };

    dbRequest.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(['monStore'], 'readwrite');
        var store = transaction.objectStore('monStore');

        // Charger le fichier JSON
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                // Insérer les données dans IndexedDB
                data.forEach(item => {
                    var addRequest = store.add(item);

                    addRequest.onsuccess = function() {
                        console.log('Données importées avec succès.');
                    };

                    addRequest.onerror = function(error) {
                        console.log('Erreur lors de l\'import des données : ', error);
                    };
                });
            })
            .catch(error => console.log('Erreur lors du chargement du fichier JSON : ', error));
    };
}

// Utilisation de la fonction d'importation
// importData('chemin/vers/votre/fichier.json');
