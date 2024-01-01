//  ----------------------------------- SECURITE ----------------------------------------

// Le nom des cookies
let cookiesEnablePhoneNumberName = "Planing-PhoneNumber",
cookiesEnableIPAdressName = "Planing-IPAdress",
cookiesEnableEmailName = "Planing-Email",
cookiesEnableWebLinkName = "Planing-WebLink";

// La valeur des cookies
let isAdressIPEnabled =localStorage.getItem(cookiesEnableIPAdressName),
isPhoneNumberEnabled = localStorage.getItem(cookiesEnablePhoneNumberName),
isEmailEnabled = localStorage.getItem(cookiesEnableEmailName ),
isWebLinkEnabled = localStorage.getItem(cookiesEnableWebLinkName);


// Affichage des settings
// Referencement des parametres setting
let checkboxPhoneNumberRef = document.getElementById("checkboxPhoneNumber"),
checkboxEmailRef = document.getElementById("checkboxEmail"),
checkboxIPRef = document.getElementById("checkboxIP"),
checkboxWebLinkRef = document.getElementById("checkboxWebLink");


function onDisplaySetting() {
    // Set les checkbox selon les valeurs des cookies
    checkboxPhoneNumberRef.checked = isPhoneNumberEnabled;
    checkboxEmailRef.checked = isEmailEnabled;
    checkboxIPRef.checked = isAdressIPEnabled;
    checkboxWebLinkRef.checked = isWebLinkEnabled;

}



// Fonction pour changer la valeur des parametres de sécurité
function onChangeSecuritySetting(settingTarget,checkboxRef) {
    


    if (settingTarget === "email") { 
        isEmailEnabled = checkboxRef.checked;
        localStorage.setItem(cookiesEnableEmailName,isEmailEnabled);
    };
    if (settingTarget === "linkWeb") {
        isWebLinkEnabled = checkboxRef.checked;
        localStorage.setItem(cookiesEnableWebLinkName,isWebLinkEnabled);
    };
    if (settingTarget === "phoneNumber") { 
        isPhoneNumberEnabled = checkboxRef.checked;
        localStorage.setItem(cookiesEnablePhoneNumberName,isPhoneNumberEnabled);
    };
    if (settingTarget === "IPAdress") {
        isAdressIPEnabled = checkboxRef.checked;
        localStorage.setItem(cookiesEnableIPAdressName,isAdressIPEnabled);
    };
}


