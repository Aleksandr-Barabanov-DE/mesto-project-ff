// Функция, которая добавляет класс с ошибкой
const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  validationConfig
) => {
  // Находим элемент ошибки внутри самой функции
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  // Показываем подчеркивание красным, InputElement
  inputElement.classList.add(validationConfig.inputErrorClass);
  // Показываем сообщение об ошибке
  errorElement.textContent = errorMessage || inputElement.dataset.errorMessage; // Используем кастомное сообщение, если оно есть
  errorElement.classList.add(validationConfig.errorClass);
};

// Функция, которая удаляет класс с ошибкой
const hideInputError = (formElement, inputElement, validationConfig) => {
  // Находим элемент ошибки
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  // Показываем подчеркивание красным
  inputElement.classList.remove(validationConfig.inputErrorClass);
  // Скрываем сообщение об ошибке
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = "";
};

// Функция, которая проверяет валидность поля
const isValid = (formElement, inputElement, validationConfig) => {
  // Добавляем кастомные сообщения
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    // showInputError теперь получает параметром форму, в которой
    // находится проверяемое поле, и само это поле
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      validationConfig
    );
  } else {
    // hideInputError теперь получает параметром форму, в которой
    // находится проверяемое поле, и само это поле
    hideInputError(formElement, inputElement, validationConfig);
  }
};

// Состояние кнопки переключения
const toggleButtonState = (inputList, buttonElement, validationConfig) => {
  const hasInvalidInputs = inputList.some(
    (inputElement) => !inputElement.validity.valid
  );
  const hasEmptyRequiredInputs = inputList.some(
    (inputElement) => inputElement.required && inputElement.value.trim() === ""
  );

  if (hasInvalidInputs || hasEmptyRequiredInputs) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

const setEventListeners = (formElement, validationConfig) => {
  // Находим все поля внутри формы,
  // сделаем из них массив методом Array.from
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );
  // деактивируем кнопку
  toggleButtonState(inputList, buttonElement, validationConfig);
  // Обойдём все элементы полученной коллекции
  inputList.forEach((inputElement) => {
    // каждому полю добавим обработчик события input
    inputElement.addEventListener("input", function () {
      // Внутри колбэка вызовем isValid,
      // передав ей форму и проверяемый элемент
      isValid(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    });
  });
};

// Функция для очистки ошибок валидации для всех модальных окон
export const clearValidation = (formElement, validationConfig) => {
  // Находим все поля ввода в форме
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );

  // Очищаем ошибки валидации для каждого поля ввода
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
  });

  // Находим кнопку отправки формы
  const submitButton = formElement.querySelector(
    validationConfig.submitButtonSelector
  );

  // Делаем кнопку неактивной
  submitButton.disabled = true;
  submitButton.classList.add(validationConfig.inactiveButtonClass);
};

export const enableValidation = (validationConfig) => {
  // Найдём все формы с указанным классом в DOM,
  // сделаем из них массив методом Array.from
  const formElementList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );

  // Переберём полученную коллекцию
  formElementList.forEach((formElement) => {
    // Для каждой формы вызовем функцию setEventListeners,
    // передав ей элемент формы
    setEventListeners(formElement, validationConfig);
  });
};
