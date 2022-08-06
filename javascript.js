const elem_wrapperCard = document.querySelector('.wrapper-card'),//элемент куда будем вставлять карточки товара
	word_registration = document.querySelector('.registration-user'),
	windowRegistration = document.querySelector('.window_registration');

const obj = {
		nameError: {
			one: 'Проверте правильность ввода E-mail и пароля',
			two: 'Введенный E-mail не валидный.<br>Пожалуйста! Введите другой E-mail.',
			three: 'Длина пароля должна быть от 8 до 24 символов',
			four: 'Пароль должен содержать не мение 2 числовых и 2 буквенных символов в верхнем регистре',
			five: 'Пароли не совпадают',
			six: 'Имя должно начинаться с большой буквы',
			seven: 'Фамилия должна начинаться с большой буквы',
			eight: 'Неверный формат ввода!'
		},
		checkError() {

			for (let key in this) {

				if (key == 'checkError' || key == 'nameError') {
					continue;
				} else if (this[key].empty || !this[key].valid) {
					return true;
				}
			}
			
			return false;
		}
	};

window.onload = () => {

	if (sessionStorage.getItem('user') != null) {
		document.getElementById('user-name').innerHTML = sessionStorage.getItem('user');
	}

	async function getCards() {
		// отправляем запрос на сервер
		let response = await fetch('../php/loading cards.php');

			if (response.ok) { //проверяем статус ответа сервера
				let arrayCards = await response.json(); //получаем тело ответа (декодируем JSON-строку в массив)
				console.log(arrayCards);

				for (let i = 0; i < arrayCards.length; i++) {
					elem_wrapperCard.insertAdjacentHTML('afterbegin', 
						`<div class="card">
							<img src="${arrayCards[i].url}" width="230" height="230">
							<p class="name">${arrayCards[i].titelProduct}</p>
							<p class="code">Код товара:<span class="code-number">${arrayCards[i].codeProduct}</span></p>
							<p class="price">Цена: ${arrayCards[i].price} гр</p>
						</div>`);
				}

			} else {
				alert(`Ошибка HTTP: ${response.status}`); //выводим ошибку
			}
	}

	getCards();//функция отправки запроса на сервер и получения карточек товара
}

function checkNumberSymbol(valueFieldPassword) {
	let stringSymbol = 0;
	let numberSymbol = 0;

	for (let i = 0; i < valueFieldPassword.length; i++) {
		let codeSymbolUTF = valueFieldPassword.codePointAt(i);

		if (codeSymbolUTF > 64 && codeSymbolUTF < 91) {
			stringSymbol++;
		}

		if (codeSymbolUTF > 47 && codeSymbolUTF < 58) {
			numberSymbol++;
		}
	}

	return (stringSymbol >= 2 && numberSymbol >= 2)? 0: 1;
}

function showModalWindow(answer) {
	let modalContent = modalWindow.querySelector('.modal-content');
	modalContent.innerHTML = `<p>${answer}</p>
							<button id='but-modal'>ok</button>`;
	modalWindow.style.display = 'flex';

	document.getElementById('but-modal').onclick = () => {

		while (modalContent.firstChild) {
			modalContent.removeChild(modalContent.firstChild);
		}

		modalWindow.style.display = 'none';
	}
}

function clearFieldsRegistration(form) {
	form.reset();
}

function closeWindowRegistration(form, description) {
	windowRegistration.classList.remove('show');
	clearFieldsRegistration(form);
	removeElementsError();
	description.innerHTML = '';

	if ( form.matches('[name="registrationMoveOne"]') ) {
		button_registrationMoveOne.disabled = false;
	}
}

function removeElementsError() {

	for ( let elem of document.querySelectorAll('.error') ) {
		elem.remove();
	}
}

function removeElementError(elem) {

	if ( elem.nextElementSibling && elem.nextElementSibling.matches('.error')) {
		elem.nextElementSibling.remove();
	}
}

// //Function check field form
function checkFieldsForm(form) {
	let allFieldsForm = form.querySelectorAll('input');

	for (let field of allFieldsForm) {
		obj[field.name] = {};

		if (!field.value) {
			obj[field.name].empty = true;

			if ( !field.closest('#authorization') ) {
				createElemError(field, 'Введите пожалуйста данные');
			}

		} else {
			obj[field.name].empty = false;
			let answer = checkValidData(field); //Check validation of entered data

			if ( !Boolean(answer) ) {
			 	obj[field.name].valid = true;
			} else if ( field.closest('#authorization') ) {
			 	showModalWindow(answer);
			} else {
				createElemError(field, answer);
			}
		}
	}

	if ( !obj.checkError() ) {
		if ( form.matches('[name="registrationMoveOne"]') ) {
			submitDataRegistrationMoveOne(form);

		} else if ( form.matches('[name="registrationMoveTwo"]') ) {
			submitDataRegistrationMoveTwo(form);

		} else {
			submitDataAuthorization(form);
		}
	}
}

function checkSymbol(elem) {
	let fun;

	if (elem.name == "email_user" || elem.name == "email") {
		fun = (codeSymbolUTF) => {

			if ( (codeSymbolUTF > 63 && codeSymbolUTF < 91) || (codeSymbolUTF > 96 && codeSymbolUTF < 123) || 
				(codeSymbolUTF > 47 && codeSymbolUTF < 58) || codeSymbolUTF == 45 || codeSymbolUTF == 46) {
				return 1;
			} else if (codeSymbolUTF == 32 || codeSymbolUTF == 44) {
				elem.closest('#authorization')? 
					showModalWindow('Введен недопустимый символ!'): 
					createElemError(elem, 'Введен недопустимый символ!');
				elem.blur();
				return 0;
			} else {
				elem.closest('#authorization')? 
					showModalWindow('Поменяйте раскладку клавиатуры!'): 
					createElemError(elem, 'Поменяйте раскладку клавиатуры!');
				elem.blur();
				return 0;
			}
		}

	} else if (elem.name == 'password_user' || elem.name == 'repeatPassword' || elem.name == 'password') {
		fun = (codeSymbolUTF) => {

			if ( (codeSymbolUTF > 63 && codeSymbolUTF < 91) || (codeSymbolUTF > 96 && codeSymbolUTF < 123) ||
				(codeSymbolUTF > 47 && codeSymbolUTF < 58) ) {
				return 1;
			} else if (codeSymbolUTF == 32 || codeSymbolUTF == 44) {
				elem.closest('#authorization')? 
					showModalWindow('Введен недопустимый символ!'): 
					createElemError(elem, 'Введен недопустимый символ!');
				elem.blur();
				return 0;
			} else {
				elem.closest('#authorization')?
					showModalWindow('Поменяйте раскладку клавиатуры!'):
					createElemError(elem, 'Поменяйте раскладку клавиатуры!');
				elem.blur();
				return 0;
			}
		}

	} else if (elem.name == 'name' || elem.name == 'surname') {
		fun = (codeSymbolUTF) => {
			return ( (codeSymbolUTF > 64 && codeSymbolUTF < 91) || (codeSymbolUTF > 96 && codeSymbolUTF < 123) || 
				(codeSymbolUTF > 1039 && codeSymbolUTF < 1104) )? 1: 0;
		}
	}

	elem.onkeydown = function(event) {
		let codeSymbolUTF = event.key.codePointAt(0);

		if ( fun(codeSymbolUTF) ) {
			return true;
		} else {
			return false;
		}
	}
}

function createElemError(field, textError) {
	let divError = document.createElement('div');
	divError.innerHTML = textError;
	divError.className = 'error';
	field.after(divError);
}

function checkStatus(elem) {

	if ( elem.hasAttribute('data-status') ) {
		openWindowWarning(elem);
	} else {
		addGoods(elem);
	}

}

//Function check validation of entered data
function checkValidData(field) {
	//Проверка валидности email
	if (field.name == 'email_user') {
		let valueFieldEmail = field.value;
		let numberCoincidences = 0;

		//Count number symbol @
		for (let i = 0; i < valueFieldEmail.length; i++) {

			if (valueFieldEmail[i] == "@") {
				numberCoincidences += 1;
			}
		}

		if (valueFieldEmail[0] == "@" || numberCoincidences != 1) {
			obj[field.name].valid = false;
			return field.closest('#authorization')? obj.nameError.one: obj.nameError.two;

		} else {
			let sliceString = valueFieldEmail.slice( valueFieldEmail.indexOf("@") );

			if (sliceString.indexOf(".") == -1 || sliceString.indexOf(".") < 2) {
				obj[field.name].valid = false;
				return field.closest('#authorization')? obj.nameError.one: obj.nameError.two;
			}
		}

	} else if (field.name == 'password_user') {
		//Проверка валидности password
		let valueFieldPassword = field.value;

		if (valueFieldPassword.length < 8 || valueFieldPassword.length > 24) {
			obj[field.name].valid = false;
			return field.closest('#authorization')? obj.nameError.one: obj.nameError.three;

		} else if ( checkNumberSymbol(valueFieldPassword) ) {
			obj[field.name].valid = false;
			return field.closest('#authorization')? obj.nameError.one: obj.nameError.four;
		}

	} else if (field.name == 'repeatPassword') {
		let valueFieldPassword = document.querySelector("input[name='password_user']").value;

		if (field.value !=  valueFieldPassword) {
			obj[field.name].valid = false;
			return obj.nameError.five;
		}

	} else if (field.name == 'name' || field.name == 'surname') {
		let codeSymbolUTF = field.value.codePointAt(0);

		if (codeSymbolUTF > 96 && codeSymbolUTF < 123) {
			return field.name == 'name'? obj.nameError.six: obj.nameError.seven;
		}

	} else if (field.name == 'phone') {
		let valueFieldPhone = field.value;

		if (valueFieldPhone.length != 17) {
			return obj.nameError.eight;
		}
	}
}

function openWindowWarning(elem) {
	var elem_modalWindow = document.getElementById('modalWindow');
	elem_modalWindow.style.display = 'block';

	elem_modalWindow.onclick = function(event) {

		if (event.target.className == 'yes') {
			elem.style.color = 'white';
			elem.removeAttribute('data-status');
			elem.closest('.column').querySelector('input.count').value = 1;
			var nameGoods = elem.closest('.column').querySelector('h4').innerHTML;

			for (var i = 0; i < arrBasket.length; i++){

				if (arrBasket[i].name == nameGoods) {
					arrBasket.splice(i,1);
					break;
    			}    		
    		}
		elem_modalWindow.style.display = 'none';
		basket();
		}

		if (event.target.className == 'no') {
			elem_modalWindow.style.display = 'none';
		}
	}
}

//Run menu, show or hide subitem menu
document.getElementById('menu-category').onclick = function(event) {
	let target = event.target;

	if ( target.closest('.but-wrapper') ) {
		let elem_classWrapper = target.closest('.wrapper');
		let elem_classSubitem = elem_classWrapper.nextElementSibling;
		let elem_classButWrapper = elem_classWrapper.querySelector('.but-wrapper');

		if ( elem_classSubitem.classList.contains("hide") ) {
			elem_classSubitem.classList.toggle("hide");
			elem_classButWrapper.style.transform = "rotate(180deg)";
		} else {
			elem_classSubitem.classList.toggle("hide");
			elem_classButWrapper.style.transform = "";
		}
	}	
}

elem_wrapperCard.onclick = (event) => {

	if ( event.target.closest('.card') ) {
		let card = event.target.closest('.card');
		let codeNumber = card.querySelector('.code-number').textContent;
		document.location.href = `../card goods.php?codeNumber=${codeNumber}`;
	}
}

// Open modal window registration move one
word_registration.addEventListener('click', () => {
	windowRegistration.classList.add('show');
});