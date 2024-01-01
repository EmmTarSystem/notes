// Detection des données sensibles

function securitySearchForbidenItem(e) {
    let sanitizedText = e;

    // Expression régulière pour détecter un numéro de téléphone
    if (!isPhoneNumberEnabled) {
        let phoneNumberRegex = /(?:\+?\d{1,4}[\s.\-]?)?(?:\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}|\d{10})/g;

        // Utilisation de la méthode replace pour remplacer chaque chiffre par "X"
        sanitizedText = sanitizedText.replace(phoneNumberRegex, match => 'X'.repeat(match.length));
    };
    
 
    if (!isEmailEnabled) {
        // Expresson de detection des emails
        let emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        // Remplacement de l'adresse par "X"
        sanitizedText = sanitizedText.replace(emailRegex, match => 'X'.repeat(match.length));
    };
    

    if (!isWebLinkEnabled) {
        // Expresson de detection des liens web
        let urlRegex = /(https?:\/\/[^\s]+)/g;
        // Remplacement du lien par "X"
        sanitizedText = sanitizedText.replace(urlRegex, match => 'X'.repeat(match.length));
    };
    


    if (!isAdressIPEnabled) {
        // Expresson de detection des liens web adresses IP (IPv4 et IPv6)
        let ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g;
        // Remplacement des ip par "X"
        sanitizedText = sanitizedText.replace(ipRegex, match => 'X'.repeat(match.length));
    }
    

    return sanitizedText;
}

