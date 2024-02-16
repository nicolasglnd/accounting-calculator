console.time("loadPage");

//languages text
const languageData = {
	english: {
		title: "Accounting Calculator",
		lang: "en",
		controls: {
			mode: "Normal Mode",
			keyMapping: "Key Mapping",
			language: "Language",
			darkMode: "Dark Mode",
			decimalsTitle: "Decimals Allowed",
			decimalsDefault: "Default",
			showHistory: "Show History"
		},
		footer: {
			creation: "Created By"
		},
		keyMapPopup: {
			title: "Change the Key Mapping",
			submitButton: "Submit New Keymap Configuration",
			restartButton: "Restart Keymap Configuration",
			form: {
				signKey: "Change Sign Key (+/-):",
				percentKey: "Percent Key:",
				squareRootKey: "Square Root Key:",
				formatKey: "Format (1'000) Key:",
				gtKey: "GT Key:",
				deleteKey: "Delete or Backspace Key:",
				cKey: "C Key:",
				acKey: "AC Key:",
				mcKey: "MC Key:",
				mrKey: "MR Key:",
				mMinusKey: "M- Key:",
				mplusKey: "M+ Key:",
				timesKey: "X Key:",
				divideKey: "/ Key:",
				plusKey: "+ Key:",
				minusKey: "- Key:",
				equalKey: "= Key:",
				doubleZeroKey: "00 Key:",
				dotKey: ". Key:",
				tripleZeroKey: "000 Key:"
			}
		},
		formatButton: "Format (1'000)",
		history: {
			historyTitle: "History",
			selectAll: "Select All",
			equation: "Equation",
			result: "Result"
		},
		notification: {
			copyFail: "0 items were copied to the clipboard, error: ",
			deleteFail: "0 items have been removed."
		}
	},
	spanish: {
		title: "Calculadora de Contaduria",
		lang: "es",
		controls: {
			mode: "Modo Normal",
			keyMapping: "Mapeo de Teclas",
			language: "Lenguaje",
			darkMode: "Modo Oscuro",
			decimalsTitle: "Decimales Permitidos",
			decimalsDefault: "Por Defecto",
			showHistory: "Mostrar Historial"
		},
		footer: {
			creation: "Creado Por"
		},
		keyMapPopup: {
			title: "Cambiar el Mapeo de Teclas",
			submitButton: "Ingresar Nueva Configuración del Mapeo de Teclas",
			restartButton: "Reiniciar Configuración del Mapeo de Teclas",
			form: {
				signKey: "Tecla Cambiar Signo (+/-):",
				percentKey: "Tecla Porcentaje:",
				squareRootKey: "Tecla Raiz Cuadrada:",
				formatKey: "Tecla Formato (1'000):",
				gtKey: "Tecla GT:",
				deleteKey: "Tecla Borrar o Retroceso:",
				cKey: "Tecla C:",
				acKey: "Tecla AC:",
				mcKey: "Tecla MC:",
				mrKey: "Tecla MR:",
				mMinusKey: "Tecla M- :",
				mplusKey: "Tecla M+ :",
				timesKey: "Tecla X :",
				divideKey: "Tecla / :",
				plusKey: "Tecla + :",
				minusKey: "Tecla - :",
				equalKey: "Tecla = :",
				doubleZeroKey: "Tecla 00:",
				dotKey: "Tecla . :",
				tripleZeroKey: "Tecla 000:"
			}
		},
		formatButton: "Formato (1'000)",
		history: {
			historyTitle: "Historial",
			selectAll: "Seleccionar todo",
			equation: "Ecuación",
			result: "Resultado"
		},
		notification: {
			copyFail: "0 elementos han sido copiados al portapapeles, error: ",
			deleteFail: "0 elementos han sido eliminados."
		}
	}
};

//control options
const btnMode = document.querySelector("#long-short-method");
const decimalOptions = document.querySelectorAll(".decimal-option");
const decimalsPickerContainer = document.querySelector("#container-decimals-dropdown");
const decimalDropdownTitle = decimalsPickerContainer.querySelector(".dropdown").firstElementChild.firstChild;
const languageContainer = document.querySelector("#language-container");
const languageOptions = document.querySelectorAll(".language-option");
const btnHistory = document.querySelector("#history-toggle");
const btnDarkMode = document.querySelector("#dark-mode-toggle");
const controlsCheck = document.querySelector("#controls-check");
const controlsContainer = document.querySelector("#controls");

//popup
const openChangeKeymap = document.querySelectorAll("[data-open-target]");
const closeChangeKeymap = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("change-keymap-overlay");
const inputsNewKeymapping = document.querySelectorAll(".inputs-new-key");
const submitNewKeymapping = document.getElementById("submit-new-keymapping");
const btnRestartKeymapping = document.querySelector("#restart-keymapping");
const formContainer = document.querySelector("#change-keymap-form-container");

//buttons
const equationPlaceholder = document.querySelector("#equation-placeholder");
const input = document.querySelector("#input");
//first-row
const btnPlusMinus = document.querySelector("#btn-plus-minus");
const btnPercent = document.querySelector("#btn-percent");
const btnSqrt = document.querySelector("#btn-sqrt");
const btnFormat = document.querySelector("#btn-format-thousands");
//first-column
const btnGt = document.querySelector("#btn-gt");
const btnDelete = document.querySelector("#btn-delete");
const btnClear = document.querySelector("#btn-c");
const btnAllClear = document.querySelector("#btn-ac");
//values and symbols
const btnValues = document.querySelectorAll(".btn-values");
const btnSymbols = document.querySelectorAll(".btn-symbols");
const btnEqual = document.querySelector("#equal");
//last-column
const lastContainer = document.querySelector("#last-container");
const btnMc = document.querySelector("#btn-mc");
const btnMr = document.querySelector("#btn-mr");
const btnMMinus = document.querySelector("#btn-m-minus");
const btnMPlus = document.querySelector("#btn-m-plus");
//history content
const historyValuesContainer = document.querySelector("#history-values");
const historyContainer = document.querySelector("#history");
const historyCheckAll = document.querySelector("#history-check-all");
const copyHistoryBtns = document.querySelectorAll("[data-format]");
const deleteHistory = document.querySelector("#delete-history");

//regex
const VALUES = /[0-9]|\./;
const NUMBERSREGEX = /^-?\d*\.{0,1}\d+$/;
const NOLEADINGZEROSREGEX = /[1-9]+[0-9]*|[-/*+=.]|0\.[0]*/g;
const OPERATORSREGEX = /\/\+|\/\-|\*\+|\*\-|[-/\+\*]/g;
const ONLYDOUBLEREGEX = /\*-|\/\-/g;				//catches only /-, *-
const NORMALOPERATORSREGEX = /[-/\+\*]/;
const DIVANDMULTREGEX = /[/\*]/; 
const PLUSANDMINUSREGEX= /[-\+]/;
const DOUBLEPLUSMINUSREGEX = /\-\-|\-\+|\+\+|\+\-/;
const DECIMALSREGEX = /[2-6]/;

//various variables
let dotPressed = false;
let lastDigitIndex = input.textContent.length - 1;
let symbolsPressed = 0;
let toAppendLastDigit;
let grandTotal = "";
let mTotal = "";
let isResult = false;
let isPercent = false;
let afterPercentMode = false;
let percentFirstValue = 0;
let stopChangeLanguage = false;
let decimalsAllowed;
let historyChecks;

//helper functions

function updateDisplay(inputText = null, equationPlaceholderText = null) {
	if (btnFormat.checked) {
		inputText = inputText ? formatValue(inputText.toString()): null;
		equationPlaceholderText = equationPlaceholderText ? formatValue(equationPlaceholderText.toString()) : null;
	}
	else {
		inputText = inputText ? deFormatValue(inputText.toString()) : null;
		equationPlaceholderText = equationPlaceholderText ? deFormatValue(equationPlaceholderText.toString()) : null;
	}


	if (inputText) input.textContent = inputText;
	if (equationPlaceholderText) equationPlaceholder.textContent = equationPlaceholderText;
}

function appendInput(inputText) {
	let newInput = input.textContent += inputText.toString();

	if (btnFormat.checked) {
		input.textContent = formatValue(newInput);
	}
	else {
		input.textContent = newInput;
	}
}

//next two functions say value, is better to always
//give strings representing the value as arguments 
//If argument is Number -> formatValue(value.toString()).

function formatValue(value) {
	let cleanedValue = value.toString().includes("'") ? deFormatValue(value) : value.toString();
	let formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, "'");

	return formattedValue;
}

function deFormatValue(value) {
	return value.toString().replaceAll("'", "");
}

//function that takes care of adding the decimals appending them to the value in input.textContent or just 1 number
function appendDecimals(number) {
	let result = typeof number !== "number" ? parseFloat(number) : number;
	if (DECIMALSREGEX.test(decimalsAllowed)) result = result.toFixed(decimalsAllowed);

	return result;
}



//UI controls
//btnMode logic

if (localStorage.getItem("normalMode") !== null) {
	btnMode.checked = JSON.parse(localStorage.getItem("normalMode"));
}

btnMode.addEventListener('click', () => {
	localStorage.setItem("normalMode", btnMode.checked.toString());
});


//if english is selected onload stopChangeLanguage will take care of exit the function and not change the language
if (languageOptions[0].firstElementChild.firstElementChild.checked) stopChangeLanguage = true;

//it will only be used when loading the page
const _localLanguage = localStorage.getItem("language");

languageOptions.forEach(language => {
	const radioInput = language.firstElementChild.firstElementChild;		

	if (_localLanguage !== null && radioInput.value === _localLanguage) radioInput.checked = true;

	if (radioInput.checked) changeLanguage(language, radioInput, stopChangeLanguage);
	
	language.addEventListener('click', () => {
		if (radioInput.checked) changeLanguage(language, radioInput);
	});
});

function changeLanguage(language, radioInput, stop = false) {
	if (language.classList.contains("active-li") && radioInput.checked) return null;		//this denies the function running twice

	setActiveLi(language, radioInput, languageContainer);

	if (stop) {		//this denies changing language if is already english onload and only adding the class above
		stopChangeLanguage = false;
		return null;
	}

	//changing language:
	let languageSelected = radioInput.dataset.language;
	localStorage.setItem("language", languageSelected);
	let indexForm = 0;

	//page title (the one displays in the browser window:
	document.title = languageData[languageSelected].title;
	//page lang	
	document.documentElement.lang = languageData[languageSelected].lang;

	//title:
	document.querySelector("h1").textContent = languageData[languageSelected].title;

	//controls:
	//first-toggle
	document.querySelectorAll(".toggle")[0].firstChild.textContent = languageData[languageSelected].controls.mode;
	//decimals section
	decimalsPickerContainer.firstChild.textContent = languageData[languageSelected].controls.decimalsTitle;
	decimalOptions[0].firstElementChild.firstChild.textContent = languageData[languageSelected].controls.decimalsDefault;
	if (decimalOptions[0].firstElementChild.firstElementChild.checked) {
		decimalDropdownTitle.textContent = decimalOptions[0].firstElementChild.firstChild.textContent;
	}
	//keymap button
	openChangeKeymap[0].textContent = languageData[languageSelected].controls.keyMapping;
	//language section
	document.querySelector("#language-container").firstElementChild.firstChild.textContent = languageData[languageSelected].controls.language;
	//history second toggle
	document.querySelectorAll(".toggle")[1].firstChild.textContent = languageData[languageSelected].controls.showHistory;
	//dark mode third toggle
	document.querySelectorAll(".toggle")[2].firstChild.textContent = languageData[languageSelected].controls.darkMode;

	//format
	document.querySelectorAll(".toggle")[3].firstChild.textContent = languageData[languageSelected].formatButton;

	//history
	document.querySelectorAll("h2")[1].textContent = languageData[languageSelected].history.historyTitle;
	historyCheckAll.nextSibling.textContent = languageData[languageSelected].history.selectAll;
	
	//keymapping popup
	document.querySelectorAll("h2")[0].textContent = languageData[languageSelected].keyMapPopup.title;
	submitNewKeymapping.textContent = languageData[languageSelected].keyMapPopup.submitButton;
	btnRestartKeymapping.textContent = languageData[languageSelected].keyMapPopup.restartButton;

	//form
	for (let formLabel in languageData[languageSelected].keyMapPopup.form) {
		formContainer.children[indexForm].firstChild.textContent = languageData[languageSelected].keyMapPopup.form[formLabel]
		indexForm++;
	}

	//footer
	document.querySelector("#info-creation").textContent = languageData[languageSelected].footer.creation;

	console.log("Language Selected");
}


//decimals-dropdown

//it will only be used when loading the page
const _localDecimals = localStorage.getItem("decimals");

decimalOptions.forEach(decimalOption => {
	const radioInput = decimalOption.firstElementChild.firstElementChild;		

	if (_localDecimals !== null && radioInput.value === _localDecimals) radioInput.checked = true;

	if (radioInput.checked) changeDecimalsAllowed(decimalOption, radioInput);
	
	decimalOption.addEventListener('click', () => {
		if (radioInput.checked) changeDecimalsAllowed(decimalOption, radioInput);
	});
});

function changeDecimalsAllowed(option, radio) {
	if (option.classList.contains("active-li") && radio.checked) return null;		//this denies the function running twice

	setActiveLi(option, radio, decimalsPickerContainer);

	//changes the title of the dropdown to be the same as the one selected
	decimalDropdownTitle.textContent = option.firstElementChild.firstChild.textContent;
	
	decimalsAllowed = radio.value;
	console.log("Decimals Selected");

	localStorage.setItem("decimals", decimalsAllowed.toString());
}


function setActiveLi(option, radio, container) {
	container.querySelector(".active-li")?.classList.remove("active-li");
	option.classList.add("active-li");
}

// history toggle btnHistory


if (localStorage.getItem("history") !== null) {
	btnHistory.checked = JSON.parse(localStorage.getItem("history"));
}

if (btnHistory.checked) toggleHistory();

btnHistory.addEventListener('click', toggleHistory);

function toggleHistory() {
	historyContainer.classList.toggle("active-history");
	localStorage.setItem("history", btnHistory.checked.toString());
}

//dark-mode btnDarkMode

if (localStorage.getItem("darkMode") !== null) {
	btnDarkMode.checked = JSON.parse(localStorage.getItem("darkMode"));
}

if (btnDarkMode.checked) toggleDarkMode();

btnDarkMode.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
	document.body.classList.toggle("dark-mode");
	localStorage.setItem("darkMode", btnDarkMode.checked.toString());
}


//menu-lines and header

if (controlsCheck.checked) controlsCheck.checked = false;

controlsCheck.addEventListener('click', () => {
	if (controlsCheck.checked && !controlsContainer.classList.contains("active")) {
		controlsContainer.classList.add("active");
	}
	else if (!controlsCheck.checked && controlsContainer.classList.contains("active")) {
		controlsContainer.classList.remove("active");
	}
});


//keymapping popup
openChangeKeymap.forEach(btn => {
    btn.addEventListener('click', () => {
        const openPopup = document.querySelector(btn.dataset.openTarget);
        openChangePopup(openPopup);
    })
});

closeChangeKeymap.forEach(btn => {
    btn.addEventListener('click', () => {
        const closePopup = btn.closest('.changing-keymap');          //looks for the closest parent class
        closeChangePopup(closePopup);
    })
});

overlay.addEventListener('click', () => {
    const addingTasks = document.querySelectorAll(".changing-keymap.active");
    addingTasks.forEach(task => {
        closeChangePopup(task)
    })
});

function openChangePopup(openingPopup) {
    if (openingPopup == null) return;
        openingPopup.classList.add("active");             //will add a new class to the html element
        overlay.classList.add("active");
}

function closeChangePopup(closingPopup) {
    if (closingPopup == null) return;
        closingPopup.classList.remove("active");             //will remove class from the html element
        overlay.classList.remove("active");
}


//keymap
const _defaultKeymap = {
	keyChangeSign: 'z',
	keyPercent: '%',
	keySquareRoot: 'r',
	keyFormat: 'f',
	keyGT: 'g',
	keyDelete: 'Backspace',
	keyC: 'c',
	keyAC: 'a',
	keyMC: 'x',
	keyMR: 's',
	keyMMinus: 'q',
	keyMPlus: 'e',
	keyMulti: '*',
	keyDivide: '/',
	keyPlus: '+',
	keySubtraction: '-',
	keyEqual: 'Enter',
	keyDoubleZero: 'v',
	keyDecimal: '.',
	keyTripleZero: 'b',
};
let keymap = _defaultKeymap;

if (localStorage.getItem("keymap") !== null) {
	keymap = JSON.parse(localStorage.getItem("keymap"));
	messageKeymapReplaced();
}

populateKeymapPopup();
submitNewKeymapping.addEventListener('click', () => {
	Object.keys(keymap).forEach((key, index) => {
		if (keymap[key] !== formContainer.children[index].firstElementChild.value) {
			let temp = keymap[key];
			keymap[key] = formContainer.children[index].firstElementChild.value;
			console.log(`keymap: ${temp} > ${keymap[key]}`);

		}
	});
	localStorage.setItem("keymap", JSON.stringify(keymap));
	messageKeymapReplaced();

});

btnRestartKeymapping.addEventListener('click', restartKeymap);



function messageKeymapReplaced() {
	console.log("keymap has been replaced with the user's config");
}

function restartKeymap() {
	localStorage.removeItem("keymap");
	keymap = _defaultKeymap;
	populateKeymapPopup();
	console.log("User's keymap config has been removed");
}

function populateKeymapPopup() {
	Object.values(keymap).forEach((key, index) => {
		formContainer.children[index].firstElementChild.value = key;
	});
}


document.addEventListener('keydown', (event) => {
	//if overlay is on, the keydown event wont happen.
	if (overlay.classList.contains("active")) return null;

	let key = event.key.length > 1 ? event.key : event.key.toLowerCase(); 

	event.preventDefault();

	if (/[0-9]/.test(key)) {
		for (let i = 0; i < btnValues.length - 3; i++) {
			if (key === btnValues[i].textContent) {
				btnValues[i].click();
				break;
			}
		}
		return null;
	}

	//the switch could be replaced with Object.value ... 
	//However, using it would take 1ms more than using the switch case method

	switch (key) {
		case keymap.keyMulti:
			btnSymbols[0].click();
			break;
		case keymap.keyDivide:
			btnSymbols[1].click();
			break;
		case keymap.keyPlus:
			btnSymbols[2].click();
			break;
		case keymap.keySubtraction:
			btnSymbols[3].click();
			break;
		case keymap.keyChangeSign:
			btnPlusMinus.click();
			break;
		case keymap.keyPercent:
			btnPercent.click();
			break;
		case keymap.keySquareRoot:
			btnSqrt.click();
			break;
		case keymap.keyFormat:
			btnFormat.click();
			break;
		case keymap.keyGT:
			btnGt.click();
			break;
		case keymap.keyDelete:
			btnDelete.click();
			break;
		case keymap.keyC:
			btnClear.click();
			break;
		case keymap.keyAC:
			btnAllClear.click();
			break;
		case keymap.keyMC:
			btnMc.click();
			break;
		case keymap.keyMR:
			btnMr.click();
			break;
		case keymap.keyMMinus:
			btnMMinus.click();
			break;
		case keymap.keyMPlus:
			btnMPlus.click();
			break;
		case keymap.keyEqual:
			btnEqual.click();
			break;
		case keymap.keyDoubleZero:
			btnValues[10].click();
			break;
		case keymap.keyDecimal:
			btnValues[11].click();
			break;
		case keymap.keyTripleZero:
			btnValues[12].click();
			break;
	}
});

//options logic

//first-row logic
btnPlusMinus.addEventListener('click', () => {
	if (input.textContent === "" || input.textContent === "-") return null;

	let inputStateCopy = deFormatValue(input.textContent);
	const numbersSplitted = inputStateCopy.split(NORMALOPERATORSREGEX);
	if ( numbersSplitted.length === 1 || (numbersSplitted.length === 2 && numbersSplitted[0] === "")) {		
		inputStateCopy = parseFloat(inputStateCopy) * (-1);
		updateDisplay(inputStateCopy);
	}
});


btnPercent.addEventListener('click', () => {
	let inputStateCopy = deFormatValue(input.textContent);

	const operatorsFound = inputStateCopy.match(OPERATORSREGEX);
    const numbersSplitted = inputStateCopy.split(OPERATORSREGEX);
	try {
		operatorsFound[operatorsFound.length - 1];
	}
	catch (e) {
		console.log("operatorsFound is null. Therefore, nothing will happen. Error: " + e);
		return null;
	}

	const lastOperatorFound = operatorsFound[operatorsFound.length - 1];

	if (input.textContent === "" || (numbersSplitted.length < 2 || numbersSplitted.length > 3)) return null; 

	if (numbersSplitted.length === 2 && numbersSplitted.indexOf("") !== -1) return null
	if (numbersSplitted.length === 3 && (numbersSplitted[2] === "")) return null
	if (numbersSplitted.length === 3 && (numbersSplitted[0] !== "")) return null

	numbersSplitted[numbersSplitted.length - 1]  = numbersSplitted[numbersSplitted.length - 1] / 100; 
	// - & + implementation:
	if (PLUSANDMINUSREGEX.test(lastOperatorFound)) {
		let multi = inputStateCopy[0] === "-" ? -1 : 1;
		for (let i = 0; i < numbersSplitted.length; i++) {
			if (numbersSplitted[i]) multi *= numbersSplitted[i];
		}
		numbersSplitted[numbersSplitted.length - 1]  = multi;
	}

	let fixed = numbersSplitted.map((element, index) => {
		let result = element;
		operatorsFound[index] !== undefined ? result += operatorsFound[index] : result;
		return result;
	}).join("");

	const changeOperation = {
		"--": "+",
		"-+": "-",
		"+-": "-",
		"++": "+"
	};
	if (DOUBLEPLUSMINUSREGEX.test(fixed) && !ONLYDOUBLEREGEX.test(lastOperatorFound)) {
		const valuesSplitted = fixed.split(DOUBLEPLUSMINUSREGEX);
		const doubleFound = fixed.match(DOUBLEPLUSMINUSREGEX).join("");
		let operatorToReplace = changeOperation[doubleFound];

		let result = valuesSplitted.map((element, index) => index === 0 ? element + operatorToReplace : element).join("");
		fixed = result;	
	}

	//fixed is always a string
	updateDisplay(fixed);
	
	isPercent = true;
	if (DIVANDMULTREGEX.test(lastOperatorFound)) {
		afterPercentMode = true;
		percentFirstValue = inputStateCopy[0] === "-" ? numbersSplitted[numbersSplitted.length -2] * -1 : numbersSplitted[numbersSplitted.length -2];
	}


	btnEqual.click();
});

btnSqrt.addEventListener('click', () => {
	if (input.textContent === "") return null;

	let inputStateCopy = deFormatValue(input.textContent);
	if (inputStateCopy.split(OPERATORSREGEX).length === 1) {
		let tempPlaceholder = "√" + inputStateCopy;
		let rootedValue = Math.sqrt(parseFloat(inputStateCopy));
		let tempInput = appendDecimals(rootedValue);
		updateDisplay(tempInput.toString(), tempPlaceholder);
	}
});


if (localStorage.getItem("format") !== null) {
	btnFormat.checked = JSON.parse(localStorage.getItem("format"));
}

btnFormat.addEventListener('click', () => {
	updateDisplay(input.textContent, equationPlaceholder.textContent);
	localStorage.setItem("format", btnFormat.checked.toString());
});


//first-column logic
btnGt.addEventListener('click', () => {
	if (grandTotal !== "") {
		//if is 2-6 will add the decimals asked
		let tempInput = appendDecimals(grandTotal);
		updateDisplay(tempInput, "GT");
	}
});

btnDelete.addEventListener('click', () => {
	//here it wont be deformatted, it can be possible, but is not needed.
	
	lastDigitIndex = input.textContent.length - 1;
	if (input.textContent[lastDigitIndex] === ".") dotPressed = false;
	if (NORMALOPERATORSREGEX.test(input.textContent[lastDigitIndex])) {
		dotPressed = true;
		symbolsPressed--;
	}

	
	if (input.textContent.length !== 1) {
		updateDisplay(input.textContent.slice(0, lastDigitIndex));
	}
	else {
		input.textContent = "";
	}
});

function clearDisplayAndVariables() {
	[input.textContent, equationPlaceholder.textContent] = "";
	dotPressed = false;
	symbolsPressed = 0;
	isPercent = false;
	isResult = false;
	percentFirstValue = 0;
	afterPercentMode = false;
}
btnClear.addEventListener('click', () => clearDisplayAndVariables());

btnAllClear.addEventListener('click', () => {
	clearDisplayAndVariables();
	//gt and m logic
	grandTotal = "";
	mTotal = "";
});


//values and symbols logic
btnValues.forEach(btn => {
	btn.addEventListener('click', () => {
		putInput(btn.textContent);
	});
});
//add value for * and not X
btnSymbols.forEach(btn => {
	btn.addEventListener('click', () => {
		putInput(btn.name);
	});
});

function putInput(btnValue) {
	const monitoredValue = monitorInput(btnValue);
	lastDigitIndex = input.textContent.length - 1;


	if (typeof monitoredValue === "object" && monitoredValue) {
		if (symbolsPressed > 1 && btnMode.checked && !NORMALOPERATORSREGEX.test(input.textContent[lastDigitIndex])&& NORMALOPERATORSREGEX.test(btnValue)) {
			toAppendLastDigit = btnValue;
			btnEqual.click();
		}
		else {
			updateDisplay(monitoredValue.newInput.toString());
		}
	}
	else if (monitoredValue) {
		if (symbolsPressed > 1 && btnMode.checked && !NORMALOPERATORSREGEX.test(input.textContent[lastDigitIndex]) && NORMALOPERATORSREGEX.test(btnValue)) {
			toAppendLastDigit = btnValue;
			btnEqual.click();
		}
		else {
			appendInput(monitoredValue.toString());
		}
	}
}

function monitorInput(value) {
	lastDigitIndex = input.textContent.length - 1;

	if (VALUES.test(value) &&  symbolsPressed < 1 && isResult ) {
		isResult = false;
		clearDisplayAndVariables();
	}
		
	if (NORMALOPERATORSREGEX.test(value) && 
		input.textContent !== "" &&
		input.textContent !== "-" &&
		!NORMALOPERATORSREGEX.test(input.textContent[lastDigitIndex])) {
 			symbolsPressed++;
		}
		

	if (input.textContent === "") {
		if (/\D/.test(value) && value === '-') {
   			return value;
		}
		else if (value === "000" || value === "00") {
			return null;
		}
		else if (/\d/.test(value)) {
			return value;
		}
		else if (value === ".") {
			dotPressed = true;
			return "0" + value;
		}
		else return null;
	}	

	if (value === "." && dotPressed === false) {
		dotPressed = true;
		return value;
	}
	else if (value === "." && dotPressed === true) return null

	//if 0000... gets typed:
	if (input.textContent === "0" && eval(value) === 0) return null;

	if (NORMALOPERATORSREGEX.test(value) && 
	NORMALOPERATORSREGEX.test(input.textContent[lastDigitIndex])) {
		const checkedOperators = checkOperators(input.textContent, value);
		if (checkedOperators !== null) {
			dotPressed = false;
			return { newInput: checkedOperators, replaced: true };
		}
		else return null;
	}
	else if (NORMALOPERATORSREGEX.test(value)) {
		dotPressed = false;
		return { newInput: handleZeros(input.textContent, value), replaced: true };		
	}

	return value;

}

function checkOperators(inputState, currentValue) {
	let inputStateCopy = deFormatValue(inputState.toString());
    const lastDigitIndex = inputStateCopy.length - 1;
    const beforeLastDigitIndex = inputStateCopy.length - 2;

    const lastDigit = inputStateCopy[lastDigitIndex];
    const beforeLastDigit = inputStateCopy[beforeLastDigitIndex];
    

    if (NORMALOPERATORSREGEX.test(beforeLastDigit) && NORMALOPERATORSREGEX.test(lastDigit)) {
		let replacedInput = inputStateCopy.slice(0, beforeLastDigitIndex);
		replacedInput += currentValue;
        return replacedInput;
    }
    else if (currentValue === "-" && DIVANDMULTREGEX.test(lastDigit)) {
        return inputStateCopy + currentValue;
    }
    else if (/\d/.test(beforeLastDigit)) {
        const replacedInput = inputStateCopy.replace(/[-/+*]$/, currentValue);
		return replacedInput;
    }
    else return null;
}

function handleZeros(inputState, currentValue = null) {

    let inputStateCopy = deFormatValue(inputState.toString());

    //handles the inputState.match(operatorsRegex) == not a function
    if (inputStateCopy / 1) return inputStateCopy + currentValue;

    //handles -5+6 -> 0-5+6
    if (inputStateCopy[0] === '-') inputStateCopy = inputStateCopy.replace("-", "0-");

    const operatorsFound = inputStateCopy.match(OPERATORSREGEX);
    const numbersSplitted = inputStateCopy.split(OPERATORSREGEX);

    if (currentValue != null) {
        if (operatorsFound === null) return inputStateCopy + currentValue;
        let fixedOperation = getFixedOperation();
        return fixedOperation + currentValue;
    }
    else {
        return getFixedOperation();
    }


    function getFixedOperation() {
        const fixed = numbersSplitted.map((element, index) => {
			
			if (!parseFloat(element) && element !== "0") return null;

            let result = parseFloat(element);
            operatorsFound[index] !== undefined ? result += operatorsFound[index] : result;
            return result;
        }).join("");

        return fixed;
    }
}

//btnEqual logic it uses handlezeros() function as well

btnEqual.addEventListener('click', () => {
	//if is empty it wont do anything
	if (input.textContent === "") return null;

	isResult = true;
	let lastOperatorPercentMode = "";
	let confirmAfterPercentMode = false;
	lastDigitIndex = input.textContent.length - 1;
	const checkForDecimal = /\-/;
	//will only push those that are not "", first splitting by operators then filtering them.
    const numbersNotEmpty = input.textContent.split(OPERATORSREGEX).filter(number => number !== "");

	if (afterPercentMode && 
		!isPercent && 
		NORMALOPERATORSREGEX.test(input.textContent[lastDigitIndex]) 
		&& numbersNotEmpty.length === 1) {
			confirmAfterPercentMode = true; 
	}
	
	//changes grandTotal to be a number if is still a string
	if (grandTotal === "") grandTotal = 0;

	//it adds a 0 at the end if it ends with "."
	if (input.textContent[lastDigitIndex] === ".") appendInput("0");

	//it deletes the last digit if it is an operator
	if (NORMALOPERATORSREGEX.test(input.textContent[lastDigitIndex])) {
		let newInput = deFormatValue(input.textContent);
		if (confirmAfterPercentMode) {
			// gets 2 last digits, matches only operators and joins them into a string
			lastOperatorPercentMode = input.textContent.slice(lastDigitIndex - 1).match(OPERATORSREGEX).join();
		}
		else afterPercentMode = false;

		// while last one is still operator deletes it
		while (NORMALOPERATORSREGEX.test(newInput[newInput.length - 1])) {
			newInput = newInput.slice(0, newInput.length - 1);
		}

		updateDisplay(newInput.toString());
	} 

	if (confirmAfterPercentMode) {
		let newInput = deFormatValue(input.textContent);
		newInput = percentFirstValue + lastOperatorPercentMode + newInput;
		newInput = handleAfterPercentMode(newInput);
		updateDisplay(newInput.toString());
		afterPercentMode = false;
	}


	if (input.textContent.split(OPERATORSREGEX).length < 3) {
		if (input.textContent.split(OPERATORSREGEX)[0] === "" 
		|| input.textContent.split(OPERATORSREGEX).length === 1) {
			let tempInput = deFormatValue(input.textContent);
			tempInput = appendDecimals(tempInput);
			updateDisplay(tempInput, tempInput);

			grandTotal += parseFloat(tempInput);	//GT
			if (btnMode.checked) symbolsPressed = 0;

			addhistoryValue(equationPlaceholder.textContent, input.textContent);
			return null;
		}
	}
	
	//handleZeros already takes care of deformatting so this is good. and is always a string
	let operation = handleZeros(input.textContent);


	let evaluatedOperation = eval(operation);
	//handling decimals before adding the result  
	evaluatedOperation = appendDecimals(evaluatedOperation);

	updateDisplay(evaluatedOperation.toString(), operation.toString());

	isPercent === false ? grandTotal += parseFloat(evaluatedOperation) : isPercent = false;

	addhistoryValue(equationPlaceholder.textContent, input.textContent);

	// append last digit sign if needed
	if (btnMode.checked && symbolsPressed > 1) {
		appendInput(toAppendLastDigit);
		symbolsPressed = 1;
	}
	else {
		symbolsPressed = 0;
	}
});

function handleAfterPercentMode(newInputState) {

    let inputStateCopy = newInputState.slice();
    const operatorsFound = inputStateCopy.match(OPERATORSREGEX);
    const numbersSplitted = inputStateCopy.split(OPERATORSREGEX);
	const changeOperation = {
		"--": "+",
		"-+": "-",
		"+-": "-",
		"++": "+"
	};
    
	if (DOUBLEPLUSMINUSREGEX.test(inputStateCopy)) {
		const valuesSplitted = inputStateCopy.split(DOUBLEPLUSMINUSREGEX);
		const doubleFound = inputStateCopy.match(DOUBLEPLUSMINUSREGEX).join("");
		let operatorToReplace = changeOperation[doubleFound];

		let result = valuesSplitted.map((element, index) => index === 0 ? element + operatorToReplace : element).join("");
		return result;
	}
	else {
		return newInputState;
	}
}


//last column logic

btnMc.addEventListener('click', () => {
	if (mTotal !== "") {
		//if is 2-6 will add the decimals asked
		let tempMTotal = appendDecimals(mTotal);
		updateDisplay(tempMTotal, "MC");
	}
	mTotal = "";
});

btnMr.addEventListener('click', () => {
	if (mTotal !== "") {
		//if is 2-6 will add the decimals asked
		let tempMTotal = appendDecimals(mTotal);
		updateDisplay(tempMTotal, "MR");
	}
});

btnMMinus.addEventListener('click', () => {
	if (mTotal === "") mTotal = 0;

	let tempMTotal = deFormatValue(input.textContent);
	if (NUMBERSREGEX.test(tempMTotal)) {
		const newMValue = parseFloat(tempMTotal);
		mTotal -= newMValue;
	}
});

btnMPlus.addEventListener('click', () => {
	if (mTotal === "") mTotal = 0;

	let tempMTotal = deFormatValue(input.textContent);
	if (NUMBERSREGEX.test(tempMTotal)) {
		const newMValue = parseFloat(tempMTotal);
		mTotal += newMValue;
	}
});


//historyValuesContainer
//history

function addhistoryValue(calculation, result) {

	const operatorsFound = calculation.match(OPERATORSREGEX);
    const numbersSplitted = calculation.split(OPERATORSREGEX);

	const outputElement = document.createElement("label");
	const outputValue = document.createTextNode(result);
	outputElement.appendChild(outputValue);

	const values = document.createElement("div");
	values.classList.add("values-container");
	const newValue = document.createElement("div");
	newValue.classList.add("history-value");

	let organizedCalculation;

	if (operatorsFound) {
		organizedCalculation = organizeCalculation(numbersSplitted, operatorsFound);
	}
	else {
		organizedCalculation = numbersSplitted.slice();
	}

	//display newValue and its content
	for (let i = 0; i < organizedCalculation.length; i++) {
		
		const newRowElement = document.createElement("label");
		const newRowValue = document.createTextNode(organizedCalculation[i]);

		if (i === 0) {
			const newCheckbox = document.createElement("input");
			newCheckbox.setAttribute("type", "checkbox");
			newCheckbox.classList.add("history-value-check");
			newValue.appendChild(newCheckbox);
		}
		
		newRowElement.appendChild(newRowValue);
		values.appendChild(newRowElement);
	}

	values.appendChild(outputElement);
	newValue.appendChild(values);
	historyValuesContainer.append(newValue);

	//organize the calculations
	function organizeCalculation(values, operators) {
		const resultsOrganized = [];
		for (let i = values.length - 1; i >= 0; i--) {
			let element = values[i];
			operators[i - 1] !== undefined ? element += operators[i - 1] : element;

			let symbol = element.match(OPERATORSREGEX);
			let fixedElement;
			if (symbol) {
				fixedElement = " " + symbol + " " + element.match(/[^\+\-\*\/]+/g).join("");
			}
			else {
				fixedElement = element;
			}

			resultsOrganized.unshift(fixedElement);
		}
		return resultsOrganized;
	}
}

if (historyCheckAll.checked) historyCheckAll.checked = false;

historyCheckAll.addEventListener('click', () => {
	historyChecks = document.querySelectorAll(".history-value-check");

	let checkAll;
	historyCheckAll.checked ? checkAll = true : checkAll = false;

	historyChecks.forEach(checkbox => {
		checkbox.checked = checkAll;
	});
});

copyHistoryBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		if (historyCheckAll.checked) historyCheckAll.checked = false;
		copyHistory(btn.dataset.format);
	});
});

async function copyHistory(format) {
	const languages = document.querySelectorAll("[data-language]");
	const languageInput = Array.from(languages).filter(lang => lang.checked);
	const languageSelected = languageInput[0].dataset.language;
	let equation = languageData[languageSelected].history.equation;
	let result = languageData[languageSelected].history.result;

	historyValueContainers = document.querySelectorAll(".values-container");
	historyChecks = document.querySelectorAll(".history-value-check");
	const dataSelected = [];
	let itemsCopied = 0;

	for (let i = 0; i < historyChecks.length; i++) {
		if (historyChecks[i].checked) {
			const parentValue = historyChecks[i].parentElement;
			const valuesContainer = parentValue.children[1];
			const values = valuesContainer.children;
			const dataObtained = {};
			dataObtained[equation] = "";

			for (let j = 0; j < values.length; j++) {
				if (j !== values.length - 1) {
					dataObtained[equation] += values[j].textContent;
				}
				else {
					dataObtained[result] = values[j].textContent;
				}
			}
			dataSelected.push(dataObtained);
			historyChecks[i].checked = false;
			itemsCopied++;
		}
	}

	dataJSON = JSON.stringify(dataSelected);

	if (format === "json") {
		let styledJSON = styleJSON(dataJSON, [equation, result]);
		let response = await copyClipboard(styledJSON, itemsCopied);
		createNotification(response);
	}
	else if (format === "csv") {
		let csvData = jsonToCsv(dataJSON, [equation, result]);
		let response = await copyClipboard(csvData, itemsCopied);
		createNotification(response);
	}
}

async function copyClipboard(data, amount) {
	try {
		await navigator.clipboard.writeText(data);
		return getNotificationData("copySuccess", amount);
	}
	catch(e) {
		return getNotificationData("copyFail", null, e);
	}
}

function styleJSON(jsonData, attributes) {
	let styled = jsonData.slice(); 	//copy
	
	styled = styled.replaceAll(':', ': ');
	styled = styled.replace('[', '[\n');
	styled = styled.replaceAll('{', '	{\n');

	for (let i = 0; i < attributes.length; i++) {
		styled = styled.replaceAll('"' + attributes[i], '		"' + attributes[i]);
	}

	styled = styled.replaceAll('}', '\n	}');
	styled = styled.replaceAll(',', ',\n');
	styled = styled.replace(']', '\n]');

	return styled;
}

function jsonToCsv(jsonData, headers) {
	let csvData = "";
	const jsonArray = JSON.parse(jsonData);

	for (let i = 0; i < headers.length; i++) {
		csvData += i === headers.length - 1 ? `${headers[i]}\n`: headers[i] + ",";
	}

	for (let i = 0; i < jsonArray.length; i++) {
		const values = Object.values(jsonArray[i]);
		values.forEach((value, index) => {
			csvData += index === values.length - 1 ? `${value}\n` : value + ",";
		});
	}

	return csvData;
}

deleteHistory.addEventListener('click', () => {
	if (historyCheckAll.checked) historyCheckAll.checked = false;

	historyChecks = document.querySelectorAll(".history-value-check");
	let originalChecksLength = historyChecks.length;
	let valuesDeleted = 0;
	
	for (let i = historyChecks.length - 1; i >= 0; i--) {
		if (historyChecks[i].checked) {
			const parentValue = historyChecks[i].parentElement;
			parentValue.remove();
			valuesDeleted++;
		}
	}

	historyChecks = document.querySelectorAll(".history-value-check");

	if (originalChecksLength !== historyChecks.length) {
		let data = getNotificationData("deleteSuccess", valuesDeleted);
		createNotification(data);
	} 
	else {
		let data = getNotificationData("deleteFail");
		createNotification(data);
	}
});

//notification

function createNotification(data) {
	const notificationContainer = document.createElement("div");
	notificationContainer.classList.add("notification-container");

	const header = document.createElement("div");
	header.classList.add("notification-header");
	const closeBtn = document.createElement("button");
	const X = document.createTextNode("X");
	closeBtn.classList.add("close-button");
	closeBtn.classList.add("delete-notification");
	closeBtn.appendChild(X);
	header.appendChild(closeBtn);

	const paragraph = document.createElement("p");
	const notificationData = document.createTextNode(data);
	paragraph.appendChild(notificationData);

	notificationContainer.appendChild(header);
	notificationContainer.appendChild(paragraph);

	document.querySelector("body").appendChild(notificationContainer);

	//adding delay to remove it. 
	setTimeout(() => {
		try {
			notificationContainer.classList.add("fade-out");
		} catch(e) {
			console.error(e);
		}
	}, 5800);

	setTimeout(() => {
		try {
			notificationContainer.remove();
		} catch(e) {
			console.error(e);
		}
	}, 7200);

	//delete notification event
	closeBtn.addEventListener('click', () => {
		notificationContainer.remove();
	});
}

function getNotificationData(data, amount = null, error = null) {
	let lang;
	languageOptions.forEach(el => {
		const radio = el.firstElementChild.firstElementChild;
		if (radio.checked) lang = radio.dataset.language;
	});
	
	const langData = languageData[lang].notification;
	
	if (lang === "english") {
		switch (data) {
			case "copySuccess":
				if (amount > 1) return `The ${amount} elements have been copied to the clipboard`;
				return `${amount} element has been copied to the clipboard`;
			case "copyFail": 
				return langData[data] + error;
			case "deleteSuccess": 
				if (amount > 1) return `The ${amount} elements have been removed.`;
				return `${amount} element has been removed.`;
			case "deleteFail": 
				return langData[data];
			default:
				return "An error has occurred, try again.";
		}
	}
	else if (lang === "spanish") {
		switch (data) {
			case "copySuccess":
				if (amount > 1) return `Los ${amount} elementos han sido copiados al portapapeles`;
				return `${amount} elemento ha sido copiado al portapapeles`;
			case "copyFail": 
				return langData[data] + error;
			case "deleteSuccess": 
				if (amount > 1) return `Los ${amount} elementos han sido eliminados`;
				return `${amount} elemento ha sido eliminado`;
			case "deleteFail": 
				return langData[data];
			default:
				return "Ha ocurrido un error, vuelva a intentar.";
		}
	}
}

console.timeEnd("loadPage");

