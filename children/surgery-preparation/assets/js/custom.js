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
function changeLanguage() {
    var selectElement = document.getElementById('language-select');
    var selectedLanguage = selectElement.value;

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

// Initial load - load default language and CSS
loadLanguageJSON('en');

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