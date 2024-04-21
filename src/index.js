import "./styles/index.css";

import {
  openPopup,
  openPopupCard,
  closePopup,
  overlayClickHandler,
  closePopupOnEsc,
} from "./components/modal.js";
import { createCard, deleteCard, addNewCard } from "./components/card.js";
import { enableValidation, clearValidation } from "./components/validation.js";

//МОДАЛЬНЫЕ ОКНА
// Выбираем элементы на которых будет срабатывать клик
const editProfileButton = document.querySelector(".profile__edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const openCardImage = document.querySelectorAll(".card__image");

// Кнопка закрытия
const closePopupButton = document.querySelectorAll(".popup__close");

// Выделяем три разных Popup
const popupEditProfile = document.querySelector(".popup_type_edit");
const addCardPopup = document.querySelector(".popup_type_new-card");
const currentCardPopup = document.querySelector(".popup_type_image");

// Запуск механизмов открытия
editProfileButton.addEventListener("click", function () {
  // В качестве аргумента нужный Popup
  openPopup(popupEditProfile);
});

addNewCardButton.addEventListener("click", function () {
  // В качестве аргумента нужный Popup
  openPopup(addCardPopup);
});

// Реализуем функцию закрытия любого popup
closePopupButton.forEach(function (closeButton) {
  closeButton.addEventListener("click", function () {
    // Находим попап, который нужно закрыть, используя ближайший родительский элемент с классом `.popup`
    const popup = closeButton.closest(".popup");
    closePopup(popup);
  });
});

// Добавляем обработчик клика на оверлей каждому попапу
const popups = document.querySelectorAll(".popup");
popups.forEach(function (popup) {
  popup.addEventListener("click", overlayClickHandler);
});

// Удаляем обработчик клика на оверлей, чтобы он не срабатывал при клике на контент попапа
const popupContents = document.querySelectorAll(".popup__content");
popupContents.forEach(function (content) {
  content.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});

// Функция для открытия модального окна с изображением и названием карточки
export function openCardModal(imageUrl, captionText) {
  openPopupCard(currentCardPopup, imageUrl, captionText);
}

// Редактирование Ииени и информации о себе

// Находим форму Popup в DOM
const formElement = document.querySelector(".popup__form");
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

// Устанавливаем дефолтные показатели
function setDefaultValues() {
  // Находим элементы, куда должны быть вставлены значения полей
  const nameInputDefault = document.querySelector(".profile__title");
  const jobInputDefault = document.querySelector(".profile__description");

  // Устанавливаем значения placeholder
  nameInput.placeholder = nameInputDefault.textContent;
  jobInput.placeholder = jobInputDefault.textContent;
}

// Вызываем функцию
setDefaultValues();

// Обработчик «отправки» формы

function submitFormEditProfile(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

  // значение полей jobInput и nameInput из свойства value это строчки которые в форме попап мы заполняем новые
  const nameInputValue = nameInput.value;
  const jobInputValue = jobInput.value;

  // элементы, куда должны быть вставлены значения полей
  const nameInputDestination = document.querySelector(".profile__title");
  const jobInputDestination = document.querySelector(".profile__description");

  // новые значения
  nameInputDestination.textContent = nameInputValue;
  jobInputDestination.textContent = jobInputValue;

  // Закрываем модальное окно
  closePopup(popupEditProfile);
}

const formEditProfile = document.querySelector(".form_edit_profile");
// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formEditProfile.addEventListener("submit", submitFormEditProfile);

// добавление новой карточки
addCardPopup.addEventListener("submit", addNewCard);

window.addEventListener("keydown", function (event) {
  closePopupOnEsc(event); // Вызываем функцию обработки нажатия клавиши ESC для закрытия модальных окон
});

// Валидиация

// включение валидации вызовом enableValidation
// все настройки передаются при вызове

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

// вызов clearValidation при открытии формы профиля
clearValidation(formElement);

//API
//Сохраняем наши данные
const token = "51705837-ea35-4c95-a31a-eba25806c2aa";
const cohortId = "wff-cohort-11";
const userUrl = `https://nomoreparties.co/v1/${cohortId}/users/me`;
const cardsUrl = `https://nomoreparties.co/v1/${cohortId}/cards`;

document.addEventListener("DOMContentLoaded", function () {
  // Создаем промисы для запросов к серверу
  const userPromise = fetch(userUrl, {
    headers: {
      authorization: token,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    return response.json();
  });

  const cardsPromise = fetch(cardsUrl, {
    headers: {
      authorization: token,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    return response.json();
  });

  // Объединяем запросы в Promise.all()
  Promise.all([userPromise, cardsPromise])
    .then(([userData, cardsData]) => {
      // Используем полученные данные для заполнения элементов на странице
      const userNameElement = document.querySelector(".profile__title");
      const userAboutElement = document.querySelector(".profile__description");
      const userAvatarElement = document.querySelector(".profile__image");

      userNameElement.textContent = userData.name;
      userAboutElement.textContent = userData.about;
      userAvatarElement.style.backgroundImage = `url(${userData.avatar})`;

      // Выводим карточки из массива на страницу
      const placesList = document.querySelector(".places__list");
      cardsData.forEach((cardData) => {
        const cardElement = createCard(
          cardData,
          deleteCard, // Передаем функцию удаления карточки
          null,
          userData._id
        );
        placesList.appendChild(cardElement);
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

// РЕДАКТИРОВАНИЯ ПРОФИЛЯ
// Определяем URL для отправки PATCH-запроса
const profileUpdateUrl = `https://nomoreparties.co/v1/${cohortId}/users/me`;

// Находим поля ввода имени и описания
const newNameInput = document.querySelector(".popup__input_type_name");
const newDescriptionInput = document.querySelector(
  ".popup__input_type_description"
);

// Добавляем обработчик события отправки формы
formElement.addEventListener("submit", function (event) {
  event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

  // Получаем значения нового имени и описания из полей ввода
  const newName = newNameInput.value;
  const newDescription = newDescriptionInput.value;

  // Отправляем PATCH-запрос на сервер
  fetch(profileUpdateUrl, {
    method: "PATCH",
    headers: {
      authorization: token, // Токен авторизации
      "Content-Type": "application/json", // Указываем тип контента
    },
    body: JSON.stringify({
      name: newName,
      about: newDescription,
    }), // Преобразуем объект в строку JSON
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json(); // Преобразуем ответ сервера в JSON
    })
    .then((data) => {
      // Обрабатываем успешный ответ сервера
      console.log("Данные профиля успешно обновлены:", data);
      // Устанавливаем новые значения в поля профиля
      newNameInput.value = data.name;
      newDescriptionInput.value = data.about;
    })
    .catch((error) => {
      // Обрабатываем ошибки
      console.error("Ошибка при обновлении данных профиля:", error);
    });
});

// ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ. Переменная cardsUrl уже существует
const formElementNewCard = document.querySelector(
  ".popup_type_new-card .popup__form"
);

formElementNewCard.addEventListener("submit", function (event) {
  event.preventDefault();
  // Проверяем, что форма является формой добавления новой карточки
  if (event.target === formElementNewCard) {
    const newCardInput = document.querySelector("#popup__input_type_card-name");
    const newCardUrlData = document.querySelector("#popup__input_type_url");

    // Получаем значения новой карточки из полей ввода
    const newCard = newCardInput.value;
    const newURL = newCardUrlData.value;

    fetch(cardsUrl, {
      method: "POST",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newCard,
        link: newURL,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        return response.json(); // Преобразуем ответ сервера в JSON
      })
      .then((data) => {
        // Обрабатываем успешный ответ сервера
        console.log("Карточка успешно добавлена:", data);
        // Устанавливаем новые значения в поля профиля
        newCardInput.value = data.name;
        newCardUrlData.value = data.link;
        // Очищаем поля ввода
        newCardInput.value = "";
        newCardUrlData.value = "";
      })
      .catch((error) => {
        // Обрабатываем ошибки
        console.error("Ошибка при добавлении карточки:", error);
      });
  }
});

// Функция удаления карточки с сервера
export function deleteCardFromServer(cardId) {
  const deleteCardUrl = `https://nomoreparties.co/v1/${cohortId}/cards/${cardId}`;

  return fetch(deleteCardUrl, {
    method: "DELETE",
    headers: {
      authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Ошибка при удалении карточки:", error);
    });
}

// Функция для отправки PUT-запроса на сервер для лайка карточки
export function likeCard(cardId) {
  const likeUrl = `https://nomoreparties.co/v1/${cohortId}/cards/likes/${cardId}`;

  return fetch(likeUrl, {
    method: "PUT",
    headers: {
      authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Ошибка при лайкинге карточки:", error);
    });
}

// Функция для отправки DELETE-запроса на сервер для удаления лайка с карточки
export function removeLikeFromCard(cardId) {
  const likeUrl = `https://nomoreparties.co/v1/${cohortId}/cards/likes/${cardId}`;

  return fetch(likeUrl, {
    method: "DELETE",
    headers: {
      authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Ошибка при удалении лайка с карточки:", error);
    });
}

// Редактирование аватара.

// Находим нужные элементы
const profileImageContainer = document.querySelector(
  ".profile__image-container"
);
const avatarPopup = document.querySelector(".popup_type_avatar");
const closeButton = avatarPopup.querySelector(".popup__close");

// Функция для открытия Popup
function openAvatarPopup() {
  avatarPopup.classList.add("popup_is-opened");
}

// Функция для закрытия Popup
function closeAvatarPopup() {
  avatarPopup.classList.remove("popup_is-opened");
}

// Добавляем слушатель события клика на элемент профиля
profileImageContainer.addEventListener("click", openAvatarPopup);

// Добавляем слушатель события клика на кнопку закрытия Popup
closeButton.addEventListener("click", closeAvatarPopup);

// Находим кнопку сохранить аватар
const changeProfileImange = document.querySelector(
  ".profile_save_new_image_button"
);

function updateAvatar(newAvatarUrl) {
  const avatarUpdateUrl = `https://nomoreparties.co/v1/${cohortId}/users/me/avatar`; // URL для обновления аватара

  // Отправка PATCH-запроса
  fetch(avatarUpdateUrl, {
    method: "PATCH", // Метод запроса
    headers: {
      "Content-Type": "application/json", // Тип контента
      authorization: token, // Токен авторизации
    },
    body: JSON.stringify({ avatar: newAvatarUrl }), // Преобразование данных в формат JSON
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json(); // Преобразование ответа в формат JSON
    })
    .then((data) => {
      console.log("Аватар успешно обновлен:", data);
      // Обновляем отображение аватара на странице
      const profileImage = document.querySelector(".profile__image");
      profileImage.style.backgroundImage = `url(${newAvatarUrl})`;
      // Очищаем поле ввода
      avatarInput.value = "";
      // Закрываем попап
      closeAvatarPopup();
    })
    .catch((error) => {
      console.error("Ошибка при обновлении аватара:", error);
    });
}

// Находим поле ввода ссылки на новый аватар
const avatarInput = document.querySelector(".popup__input_type_avatar_url");

// Добавляем обработчик события клика на кнопку "Сохранить" для смены аватара
changeProfileImange.addEventListener("click", function () {
  const newAvatarUrl = avatarInput.value.trim(); // Получаем значение ссылки на новый аватар и удаляем лишние пробелы

  if (newAvatarUrl) {
    updateAvatar(newAvatarUrl); // Вызываем функцию обновления аватара
  } else {
    console.error("Поле ссылки на аватар не может быть пустым");
  }
});

// Улучшенный UX
document.addEventListener("DOMContentLoaded", function () {
  const saveButtons = document.querySelectorAll(".save_button");

  function setLoadingState(button) {
    button.textContent = "Сохранение...";
  }

  function resetButtonState(button, originalText) {
    setTimeout(() => {
      button.textContent = originalText;
    }, 300); // Включаем resetButtonState через 0.3 секунды
  }

  saveButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const originalText = button.textContent;
      setLoadingState(button);

      // Используем замыкание для передачи originalText внутри setTimeout
      resetButtonState(button, originalText);
    });
  });
});
