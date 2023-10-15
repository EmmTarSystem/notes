function onClickPrint() {
    // Récupère le contenu de la div
    let contentToPrint = document.getElementById('divNoteView').innerHTML;

    // Creation fenetre et insertion des éléments à imprimer
    let pageToPrint = window.open('', '', 'width=600,height=600');
    pageToPrint.document.open();
    pageToPrint.document.write('<html><head><title>Impression</title></head><body>');
    pageToPrint.document.write(contentToPrint);
    pageToPrint.document.write('</body></html>');
    pageToPrint.document.close();
    pageToPrint.print();
    pageToPrint.close();
}