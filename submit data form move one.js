const form_registrationMoveOne = document.forms.registrationMoveOne, //форма регистрации шаг первый
	field_emailUser = form_registrationMoveOne.elements.email_user,
	field_passwordUser = form_registrationMoveOne.elements.password_user,
	field_pepeatPassword = form_registrationMoveOne.elements.repeatPassword,
	elem_descriptionMoveOne = form_registrationMoveOne.nextElementSibling,
	button_registrationMoveOne = document.getElementById('but-registration-move-one'),
	elem_crossMoveOne = document.querySelector('.wrapper-cross-move-one');

// Submit data in server
function submitDataRegistrationMoveOne(form) {
	// заполним FormData данными из формы
	let formData = new FormData(form);	
	// send data to server
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "../php/registration user move one.php", true);
	xhr.send(formData);

	xhr.onload = function() {

		if (xhr.status == 200) {
			elem_descriptionMoveOne.innerHTML = `<p>${xhr.response}</p>`;

			if ( xhr.response.includes('Ваш профиль удачно создан') ) {
				button_registrationMoveOne.disabled = true; //отключаю кнопку отправить
				clearFieldsRegistration(form); //очищаю поля формы
			}
		}
	}			
}

//Checking the entered characters in the "email" field
field_emailUser.onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	elem_descriptionMoveOne.innerHTML = "<p>Укажите правильный Email, так как на указанный адрес будет выслано письмо для подтверждения почты.</p>";
}

field_emailUser.onpaste = () => {
	return false;
}

//Checking the entered characters in the "password" field
field_passwordUser.onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	elem_descriptionMoveOne.innerHTML = "<p>Пароль должен содержать от 8 до 24 символа, иметь не мение 2 букв вверхнем регистре и 2 цифр.</p>";
}

field_passwordUser.onpaste = () => {
	return false;
}

//Checking the entered characters in the "repeatPassword" field
field_pepeatPassword.onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	elem_descriptionMoveOne.innerHTML = "<p>Пароли должны совпадать.</p>";
}

field_pepeatPassword.onpaste = () => {
	return false;
}

// Close modal window registration move one
elem_crossMoveOne.addEventListener('click', () => {
	closeWindowRegistration(form_registrationMoveOne, elem_descriptionMoveOne);
});

// Check and submit data in server form registration move one
button_registrationMoveOne.addEventListener('click', () => {
	event.preventDefault();
	removeElementsError();
	checkFieldsForm(form_registrationMoveOne);
});