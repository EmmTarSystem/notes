//  ----------------------------------- SECURITE ----------------------------------------

// Le nom des cookies
let cookiesEnablePhoneNumberName = "Planing-PhoneNumber",
cookiesEnableIPAdressName = "Planing-IPAdress",
cookiesEnableEmailName = "Planing-Email",
cookiesEnableWebLinkName = "Planing-WebLink";




// La valeur des cookies
let isAdressIPDisplay = localStorage.getItem(cookiesEnableIPAdressName) === "true",
isPhoneNumberDisplay = localStorage.getItem(cookiesEnablePhoneNumberName) === "true",
isEmailDisplay = localStorage.getItem(cookiesEnableEmailName ) === "true",
isWebLinkDisplay = localStorage.getItem(cookiesEnableWebLinkName) === "true";


// Affichage des settings
// Referencement des parametres setting
let checkboxPhoneNumberRef = document.getElementById("checkboxPhoneNumber"),
checkboxEmailRef = document.getElementById("checkboxEmail"),
checkboxIPRef = document.getElementById("checkboxIP"),
checkboxWebLinkRef = document.getElementById("checkboxWebLink");


function onDisplaySetting() {
    // Set les checkbox selon les valeurs des cookies
    // PS  ne peut pas utiliser de boolean car session storage les stocke en string.
    checkboxPhoneNumberRef.checked = isPhoneNumberDisplay;
    checkboxEmailRef.checked = isEmailDisplay;
    checkboxIPRef.checked = isAdressIPDisplay;
    checkboxWebLinkRef.checked = isWebLinkDisplay;

    console.log(isPhoneNumberDisplay,isEmailDisplay,isAdressIPDisplay,isWebLinkDisplay);

}



// Fonction pour changer la valeur des parametres de sécurité
function onChangeSecuritySetting(settingTarget,checkboxRef) {
    


    if (settingTarget === "email") { 
        isEmailDisplay = checkboxRef.checked;
        localStorage.setItem(cookiesEnableEmailName,isEmailDisplay);
    };
    if (settingTarget === "linkWeb") {
        isWebLinkDisplay = checkboxRef.checked;
        localStorage.setItem(cookiesEnableWebLinkName,isWebLinkDisplay);
    };
    if (settingTarget === "phoneNumber") { 
        isPhoneNumberDisplay = checkboxRef.checked;
        localStorage.setItem(cookiesEnablePhoneNumberName,isPhoneNumberDisplay);
    };
    if (settingTarget === "IPAdress") {
        isAdressIPDisplay = checkboxRef.checked;
        localStorage.setItem(cookiesEnableIPAdressName,isAdressIPDisplay);
    };
}


