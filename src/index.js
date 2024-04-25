import "./styles/index.css";

import { initialCards } from "./components/cards.js";
import {
  openPopup,
  closePopup,
  overlayClickHandler,
  closePopupOnEsc,
} from "./components/modal.js";
import { createCard, deleteCard } from "./components/card.js";
import { clearValidation, enableValidation } from "./components/validation.js";

// Выводим все карточки из массива на страницу
const placesList = document.querySelector(".places__list");

// Проходимся по массиву карточек и создаем их
initialCards.forEach(function (cardData) {
  const cardElement = createCard(cardData, deleteCard, openCardModal);
  placesList.appendChild(cardElement);
});

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
