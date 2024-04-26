import "./styles/index.css";

import {
  openPopup,
  closePopup,
  overlayClickHandler,
  closePopupOnEsc,
} from "./components/modal.js";
import { createCard, deleteCard } from "./components/card.js";
import { clearValidation, enableValidation } from "./components/validation.js";

//МОДАЛЬНЫЕ ОКНА
// Выбираем элементы на которых будут срабатываться клики
const formEditProfile = document.querySelector(".form_edit-profile");
const editProfileButton = document.querySelector(".profile__edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const openCardImage = document.querySelectorAll(".card__image");

// Кнопка закрытия
const buttonsClosePopup = document.querySelectorAll(".popup__close");

// Выделяем три разных Popup
const popupEditProfile = document.querySelector(".popup_type_edit");
const addCardPopup = document.querySelector(".popup_type_new-card");
const currentCardPopup = document.querySelector(".popup_type_image");

addNewCardButton.addEventListener("click", function () {
  // В качестве аргумента нужный Popup
  openPopup(addCardPopup);
});

// Механизм Открытие popup карточек
function openPopupCard(popup, imageUrl, captionText) {
  const popupImage = popup.querySelector(".popup__image");
  const popupCaption = popup.querySelector(".popup__caption");

  // Устанавливаем src изображения и текст подписи
  popupImage.src = imageUrl;
  popupImage.alt = captionText;
  popupCaption.textContent = captionText;

  openPopup(popup);
}

function openCardModal(imageUrl, captionText) {
  openPopupCard(currentCardPopup, imageUrl, captionText);
}

// Реализуем функцию закрытия любого popup
buttonsClosePopup.forEach(function (closeButton) {
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

// Редактирование Ииени и информации о себе

// Находим форму Popup в DOM

const nameInput = document.querySelector(".popup__input_type_name");
const descriptionInput = document.querySelector(
  ".popup__input_type_description"
);

// Функция установки значений полей формы редактирования профиля
function setProfileFormValues(name, description) {
  // Устанавливаем значения полей формы
  nameInput.value = name;
  descriptionInput.value = description;
}

// Обработчик открытия формы редактирования профиля
editProfileButton.addEventListener("click", function () {
  // Получаем значения имени и описания из профиля
  const profileName = document.querySelector(".profile__title").textContent;
  const profileDescription = document.querySelector(
    ".profile__description"
  ).textContent;

  // Устанавливаем значения полей формы
  setProfileFormValues(profileName, profileDescription);

  // Открываем модальное окно редактирования профиля
  openPopup(popupEditProfile);

  // Очищаем ошибки валидации для формы профиля и делаем кнопку неактивной
  clearValidation(formEditProfile, validationSettings);
});

function submitFormEditProfile(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

  // Получаем значения полей имени и описания
  const nameInputValue = nameInput.value;
  const descriptionInputValue = descriptionInput.value; // Исправленное имя переменной

  // Находим элементы, куда нужно вставить значения
  const nameInputDestination = document.querySelector(".profile__title");
  const descriptionInputDestination = document.querySelector(
    ".profile__description"
  );

  // Вставляем новые значения
  nameInputDestination.textContent = nameInputValue;
  descriptionInputDestination.textContent = descriptionInputValue;

  // Закрываем модальное окно
  closePopup(popupEditProfile);
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formEditProfile.addEventListener("submit", submitFormEditProfile);

// добавление новой карточки
addCardPopup.addEventListener("submit", addNewCard);

// ДОБАВЛЕНИЕ НОВЫХ КАРТОЧЕК

document.addEventListener("DOMContentLoaded", function () {
  // Ваш скрипт здесь
});

export function addNewCard(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы
  const placesList = document.querySelector(".places__list");

  // Находим поля добавления карточек
  const newCardName = document.querySelector(
    ".popup__input_type_card-name"
  ).value;
  const newCardUrl = document.querySelector(".popup__input_type_url").value;

  // Создаем данные для новой карточки
  const newCardData = {
    name: newCardName,
    link: newCardUrl,
  };

  // Создаем новую карточку с использованием функции createCard
  const newCardElement = createCard(newCardData, deleteCard);

  // Вставляем новую карточку в начало контейнера
  placesList.prepend(newCardElement);

  // Закрываем диалоговое окно
  const addCardPopup = document.querySelector(".popup_type_new-card");
  closePopup(addCardPopup);
}

//Валидация ФОРМ

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Включаем валидацию форм
document.addEventListener("DOMContentLoaded", function () {
  enableValidation(validationSettings);
});

// API

const config = {
  baseUrl: `https://nomoreparties.co/v1/wff-cohort-11`,
  headers: {
    authorization: "51705837-ea35-4c95-a31a-eba25806c2aa",
    "Content-Type": "application/json",
  },
};

document.addEventListener("DOMContentLoaded", function () {
  // Создаем промисы для запросов к серверу
  const userPromise = fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    return response.json();
  });

  const cardsPromise = fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
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

const formElement = document.querySelector(".popup__form");
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
  fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
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

// ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ.
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

    fetch(`${config.baseUrl}/cards`, {
      method: "POST",
      headers: config.headers,
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
        // Устанавливаем новые значения в поля
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
  const deleteCardUrl = `https://nomoreparties.co/v1/wff-cohort-11/cards/${cardId}`;

  return fetch(deleteCardUrl, {
    method: "DELETE",
    headers: config.headers,
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
  const likeUrl = `https://nomoreparties.co/v1/wff-cohort-11/cards/likes/${cardId}`;

  return fetch(likeUrl, {
    method: "PUT",
    headers: config.headers,
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
  const likeUrl = `https://nomoreparties.co/v1/wff-cohort-11/cards/likes/${cardId}`;

  return fetch(likeUrl, {
    method: "DELETE",
    headers: config.headers,
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
  const avatarUpdateUrl = `https://nomoreparties.co/v1/wff-cohort-11/users/me/avatar`; // URL для обновления аватара

  // Отправка PATCH-запроса
  fetch(avatarUpdateUrl, {
    method: "PATCH", // Метод запроса
    headers: config.headers,
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
