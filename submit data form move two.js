const form_registrationMoveTwo = document.forms.registrationMoveTwo,
	button_registrationMoveTwo = document.getElementById('but-registration-move-two'),
	elem_descriptionMoveTwo = form_registrationMoveTwo.nextElementSibling;

function submitDataRegistrationMoveTwo(form) {
	// заполним FormData данными из формы
	let formData = new FormData(form);	
	// send data to server
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "../php/registration user move two.php", true);

	xhr.onload = function() {

		if (xhr.status == 200) {
			form.nextElementSibling.innerHTML = `<p>${xhr.response}</p>`;

			if ( xhr.response.includes('Данные успешно добавлены') ) {
				clearFieldsRegistration(form); //очищаю поля формы
				button_registrationMoveTwo.textContent = 'Закрыть'; //меняю текст в кнопке
			}
		}
	}

	xhr.send(formData);
}

//Checking the entered characters in the "name" field
document.querySelector("input[name='name'].field-registration").onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	this.closest('form').nextElementSibling.innerHTML = "<p>Имя должно начинаться с большой буквы.</p>";
}

//Checking the entered characters in the "surname" field
document.querySelector("input[name='surname'].field-registration").onfocus = function() {
	removeElementError(this);
	checkSymbol(this);
	this.closest('form').nextElementSibling.innerHTML = "<p>Фамилия должна начинаться с большой буквы.</p>";
}

document.querySelector("input[name='phone'].field-registration").onfocus = function() {
	removeElementError(this);
	this.value = '+38(0';

	this.onkeydown = function(event) {
		let valueElem = document.querySelector("input[name='phone']").value;

		if (event.keyCode != 8) {

			if (valueElem.length == 3) {
				valueElem += "(";
				document.querySelector("input[name='phone']").value = valueElem;
			} else if (valueElem.length == 7) {
				valueElem += ")";
				document.querySelector("input[name='phone']").value = valueElem;
			} else if (valueElem.length == 11) {
				valueElem += "-";
				document.querySelector("input[name='phone']").value = valueElem;
			} else if (valueElem.length == 14) {
				valueElem += "-";
				document.querySelector("input[name='phone']").value = valueElem;
			}
		}

		if ( (event.keyCode > 95 && event.keyCode < 106) || event.keyCode == 8 || event.keyCode == 107) {
			return true;
		} else {
			return false;
		}
	}
}

// Check and submit data in server form registration move two
button_registrationMoveTwo.onclick = function() {
	event.preventDefault();

	if (this.textContent === 'Отправить') {
		removeElementsError();
		checkFieldsForm(form_registrationMoveTwo);
	} else {
		closeWindowRegistration(form_registrationMoveTwo, elem_descriptionMoveTwo);
	}
};