import "./styles/index.css";

import { initialCards } from "./components/cards.js";
import {
  openPopup,
  openPopupCard,
  closePopup,
  overlayClickHandler,
  closePopupOnEsc,
} from "./components/modal.js";
import { createCard, deleteCard, addNewCard } from "./components/card.js";

// Выводим все карточки из массива на страницу
const placesList = document.querySelector(".places__list");

// Проходимся по массиву карточек и создаем их
initialCards.forEach(function (cardData) {
  const cardElement = createCard(cardData, deleteCard);
  placesList.appendChild(cardElement);
});

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

//Отдельный механизм для карточек с перебором так как много их
openCardImage.forEach(function (image) {
  image.addEventListener("click", function () {
    const imageUrl = image.src;
    const captionText = image.alt;
    openPopupCard(currentCardPopup, imageUrl, captionText);
  });
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

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formElement.addEventListener("submit", submitFormEditProfile);

// добавление новой карточки
addCardPopup.addEventListener("submit", addNewCard);

window.addEventListener("keydown", function (event) {
  closePopupOnEsc(event); // Вызываем функцию обработки нажатия клавиши ESC для закрытия модальных окон
});
