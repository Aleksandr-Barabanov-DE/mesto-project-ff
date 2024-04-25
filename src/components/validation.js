// Функция, которая добавляет класс с ошибкой
const showInputError = (formElement, inputElement, errorMessage) => {
  // Находим элемент ошибки внутри самой функции
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  // Показываем подчеркивание красным, InputElement
  inputElement.classList.add("form__input_type_error");
  // Показываем сообщение об ошибке
  errorElement.textContent = errorMessage || inputElement.dataset.errorMessage; // Используем кастомное сообщение, если оно есть
  errorElement.classList.add("form__input-error_active");
};

// Функция, которая удаляет класс с ошибкой
const hideInputError = (formElement, inputElement) => {
  // Находим элемент ошибки
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  // Показываем подчеркивание красным
  inputElement.classList.remove("form__input_type_error");
  // Скрываем сообщение об ошибке
  errorElement.classList.remove("form__input-error_active");
  errorElement.textContent = "";
};

// Функция, которая проверяет валидность поля
// Функция isValid теперь принимает formElement и inputElement,
// а не берёт их из внешней области видимости
const isValid = (formElement, inputElement) => {
  // Добавляем кастомные соообщения
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    // showInputError теперь получает параметром форму, в которой
    // находится проверяемое поле, и само это поле
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    // hideInputError теперь получает параметром форму, в которой
    // находится проверяемое поле, и само это поле
    hideInputError(formElement, inputElement);
  }
};

// Состояние кнопки переключения
const toggleButtonState = (inputList, buttonElement) => {
  const hasInvalidInputs = inputList.some(
    (inputElement) => !inputElement.validity.valid
  );
  const hasEmptyRequiredInputs = inputList.some(
    (inputElement) => inputElement.required && inputElement.value.trim() === ""
  );

  if (hasInvalidInputs || hasEmptyRequiredInputs) {
    buttonElement.disabled = true;
    buttonElement.classList.add("popup__button_inactive");
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove("popup__button_inactive");
  }
};

const setEventListeners = (formElement) => {
  // Находим все поля внутри формы,
  // сделаем из них массив методом Array.from
  const inputList = Array.from(formElement.querySelectorAll(".popup__input"));
  const buttonElement = formElement.querySelector(".popup__button");
  // деактивируем кнопку
  toggleButtonState(inputList, buttonElement);
  // Обойдём все элементы полученной коллекции
  inputList.forEach((inputElement) => {
    // каждому полю добавим обработчик события input
    inputElement.addEventListener("input", function() => {
      // Внутри колбэка вызовем isValid,
      // передав ей форму и проверяемый элемент
      isValid(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
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
    hideInputError(formElement, inputElement);
  });

  // Находим кнопку отправки формы
  const submitButton = formElement.querySelector(
    validationConfig.submitButtonSelector
  );

  // Делаем кнопку неактивной
  submitButton.disabled = true;
  submitButton.classList.add(validationConfig.inactiveButtonClass);
};

export const enableValidation = () => {
  // Найдём все формы с указанным классом в DOM,
  // сделаем из них массив методом Array.from
  const formElementList = Array.from(document.querySelectorAll(".popup__form"));

  // Переберём полученную коллекцию
  formElementList.forEach((formElement) => {
    // Для каждой формы вызовем функцию setEventListeners,
    // передав ей элемент формы
    setEventListeners(formElement);
  });
};
