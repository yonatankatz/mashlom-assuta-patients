// GENERAL UTILS - URL
// -------------------
function getUpdatedQueryParameter(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

function updateQueryParameter(key, value, url) {
    if (history.pushState) {
        var newurl = getUpdatedQueryParameter(key, value, url);
        window.history.pushState({path:newurl},'',newurl);
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// PAGE SPECIFIC FUNCTIONS
// -----------------------

// Function to load language JSON file
function loadLanguageJSON(language) {
    // Construct the path to the language JSON file
    var jsonFilePath = './languages/' + language + '.json';

    // Load the JSON file
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => updateContent(data))
        .catch(error => console.error('Error loading language file:', error));
}

// Function to update content based on language data
function updateContent(languageData) {
    // Get all elements with data-i18n attribute
    var elements = document.querySelectorAll('[data-i18n]');
    
    // Update the content of each element
    elements.forEach(function(element) {
        var key = element.getAttribute('data-i18n');
        if (languageData[key]) {
            element.textContent = languageData[key];
        }
    });
}

// Function to change language based on select box value
function changeLanguage(lang) {
    var selectedLanguage = lang ? lang : document.getElementById('language-select').value;
    updateQueryParameter("lang", selectedLanguage);    

    // Load language JSON file
    loadLanguageJSON(selectedLanguage);

    // Update logo based on language
    updateLogo(selectedLanguage);

    // Change CSS based on language
    if (selectedLanguage === 'he') {
        // If Hebrew is selected, load he.css
        loadCSS('./assets/css/he.css');
    } else {
        // Otherwise, revert to custom.css
        removeCSS('./assets/css/he.css');
    }
}

// Function to load CSS file dynamically
function loadCSS(filename) {
    var head = document.head;
    var link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = filename;
    link.id = 'hebrew-css'; // Add an id to identify the Hebrew CSS

    head.appendChild(link);
}

// Function to remove CSS file
function removeCSS(filename) {
    var styleSheet = document.getElementById('hebrew-css');
    if (styleSheet) {
        styleSheet.remove();
    }
}


// Function to update logo based on language
function updateLogo(language) {
    var logoElement = document.querySelector('.logo img');
    if (!logoElement) {
        console.error("Logo element not found.");
        return;
    }

    // Determine the filename of the new logo based on the selected language
    var newLogoFilename = language === 'he' ? 'assuta_logo_he.png' : 'assuta_logo_en.png';

    // Set the new logo source
    logoElement.src = './assets/images/' + newLogoFilename;
}

function init() {
    // Initial load - load default language and CSS
    var langParameter = getParameterByName("lang");
    var selectedLang = langParameter? langParameter : 'he';
    var langElement = document.getElementById("language-select");
    langElement.value = selectedLang;
    changeLanguage(selectedLang);
}

init();