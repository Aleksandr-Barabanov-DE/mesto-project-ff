import "./styles/index.css";

import {
  openPopup,
  closePopup,
  overlayClickHandler,
  closePopupOnEsc,
} from "./components/modal.js";
import { createCard, deleteCard } from "./components/card.js";
import { clearValidation, enableValidation } from "./components/validation.js";
import {
  getUserInfo,
  updateUserInfo,
  getCards,
  addNewCardApi,
  updateAvatarApi,
  deleteCardFromServer,
} from "./components/api.js";

import { likeCard } from "./components/api.js";
import { removeLikeFromCard } from "./components/api.js";

// Переменные для карточек
let cardToDeleteId = null;
let cardToDeleteElement = null;

//МОДАЛЬНЫЕ ОКНА
// Выбираем элементы на которых будут срабатываться клики
const formEditProfile = document.querySelector(".form_edit-profile");
const buttonOpenPopupProfile = document.querySelector(".profile__edit-button");
const buttonAddNewCard = document.querySelector(".profile__add-button");

// Кнопка закрытия
const buttonsClosePopup = document.querySelectorAll(".popup__close");

// Выделяем три разных Popup
const popupEditProfile = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");
const currentCardPopup = document.querySelector(".popup_type_image");

// Находим контейнер для карточек на странице
const placesList = document.querySelector(".places__list");

const profileImage = document.querySelector(".profile__image");

buttonAddNewCard.addEventListener("click", function () {
  // В качестве аргумента нужный Popup
  openPopup(popupAddCard);
});

// Глобальные переменные для элементов модального окна
const popupImage = currentCardPopup.querySelector(".popup__image");
const popupCaption = currentCardPopup.querySelector(".popup__caption");

// Функция открытия модального окна с картинкой
function openPopupCard(popup, imageUrl, captionText) {
  // Устанавливаем src изображения и текст подписи
  popupImage.src = imageUrl;
  popupImage.alt = captionText;
  popupCaption.textContent = captionText;

  openPopup(popup);
}

export function openCardModal(imageUrl, captionText) {
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
  const userPromise = getUserInfo();
  const cardsPromise = getCards();

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
      cardsData.forEach((cardData) => {
        const cardElement = createCard(
          cardData,
          openDeleteConfirmation, // Передаем функцию удаления карточки
          openCardModal, // Передаем функцию открытия модального окна с картинкой
          handleLikeButtonClick, // Передаем функцию для установки лайка
          handleRemoveLikeButtonClick, // Передаем функцию для снятия лайка
          userData._id
        );
        placesList.appendChild(cardElement);
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

// Функция для обработки клика по кнопке "лайк" на карточке
function handleLikeButtonClick(cardId, likeButton) {
  // Здесь должна быть логика для отправки запроса на сервер для установки лайка
  // Например:
  likeCard(cardId)
    .then((updatedData) => {
      // Обновляем количество лайков на карточке
      const likeCount =
        likeButton.parentElement.querySelector(".card__like-count");
      likeCount.textContent = updatedData.likes.length;
      // Устанавливаем класс активности кнопки "лайк"
      likeButton.classList.add("card__like-button_is-active");
    })
    .catch((error) => {
      console.error("Ошибка при установке лайка на карточке:", error);
    });
}

// Функция для обработки клика по кнопке "снять лайк" на карточке
function handleRemoveLikeButtonClick(cardId, likeButton) {
  // Здесь должна быть логика для отправки запроса на сервер для снятия лайка
  // Например:
  removeLikeFromCard(cardId)
    .then((updatedData) => {
      // Обновляем количество лайков на карточке
      const likeCount =
        likeButton.parentElement.querySelector(".card__like-count");
      likeCount.textContent = updatedData.likes.length;
      // Убираем класс активности кнопки "лайк"
      likeButton.classList.remove("card__like-button_is-active");
    })
    .catch((error) => {
      console.error("Ошибка при снятии лайка с карточки:", error);
    });
}

// Изменение текста кнопок
function setLoadingState(button) {
  console.log("Кнопка изменена на 'Сохранение...'");
  button.textContent = "Сохранение..."; // Изменяем текст кнопки на "Сохранение..."
}

function resetButtonState(button, originalText) {
  console.log("Кнопка изменена на исходный текст");
  button.textContent = originalText; // Возвращаем текст кнопки к изначальному состоянию
}

// РЕДАКТИРОВАНИЕ ПРОФИЛЯ
// Находим форму Popup в DOM
const formElement = document.querySelector(".popup__form");
const newNameInput = formElement.querySelector(".popup__input_type_name");
const newDescriptionInput = formElement.querySelector(
  ".popup__input_type_description"
);
const profileSaveButton = document.querySelector(".profile__edit-button");
const profileNameElement = document.querySelector(".profile__title");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);

// Функция установки значений полей формы редактирования профиля
function setProfileFormValues(name, description) {
  // Устанавливаем значения полей формы
  newNameInput.value = name;
  newDescriptionInput.value = description;
}

// Функция открытия формы редактирования профиля
function openEditProfileForm() {
  // Получаем значения имени и описания из профиля
  const profileDescription = profileDescriptionElement.textContent;

  // Устанавливаем значения полей формы
  setProfileFormValues(profileNameElement.textContent, profileDescription);

  // Открываем модальное окно редактирования профиля
  openPopup(popupEditProfile);

  // Очищаем ошибки валидации для формы профиля и делаем кнопку неактивной
  clearValidation(formEditProfile, validationSettings);
}

// Обработчик открытия формы редактирования профиля
buttonOpenPopupProfile.addEventListener("click", openEditProfileForm);

// Обработчик отправки формы редактирования профиля
formElement.addEventListener("submit", function (event) {
  event.preventDefault(); // Предотвращаем стандартное поведение отправки формы
  setLoadingState(profileSaveButton); // Устанавливаем текст кнопки на "Сохранение..."

  // Получаем значения нового имени и описания из полей ввода
  const newName = newNameInput.value;
  const newDescription = newDescriptionInput.value;

  // Отправляем PATCH-запрос на сервер
  updateUserInfo(newName, newDescription)
    .then((data) => {
      // Обрабатываем успешный ответ сервера
      console.log("Данные профиля успешно обновлены:", data);
      // Обновляем данные профиля на странице
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
    })
    .catch((error) => {
      // Обрабатываем ошибки
      console.error("Ошибка при обновлении данных профиля:", error);
    })
    .finally(() => {
      // Возвращаем исходный текст кнопки
      resetButtonState(profileSaveButton, "Сохранить");
      // Закрываем модальное окно редактирования профиля
      closePopup(popupEditProfile);
    });
});

// ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ.
const formElementNewCard = document.querySelector(
  ".popup_type_new-card .popup__form"
);
const newCardInput = document.querySelector("#popup__input_type_card-name");
const newCardUrlData = document.querySelector("#popup__input_type_url");
const saveNewPlaceButton = document.querySelector(".new_place_save-button");

// Добавляем обработчик отправки формы для добавления новой карточки
formElementNewCard.addEventListener("submit", function (event) {
  event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

  // Проверяем, что форма является формой добавления новой карточки
  if (event.target === formElementNewCard) {
    setLoadingState(saveNewPlaceButton); // Устанавливаем текст кнопки на "Сохранение..."

    // Получаем значения новой карточки из полей ввода
    const newCard = newCardInput.value.trim(); // Удаляем лишние пробелы с помощью trim()
    const newURL = newCardUrlData.value.trim(); // Удаляем лишние пробелы с помощью trim()

    // Проверяем, что значения не пустые
    if (newCard && newURL) {
      // Добавляем новую карточку через API запрос
      addNewCardApi(newCard, newURL)
        .then((data) => {
          // Обрабатываем успешный ответ сервера
          console.log("Карточка успешно добавлена:", data);

          // Создаем новый элемент карточки
          const newCardElement = createCard(data);

          // Добавляем новую карточку в контейнер
          placesList.prepend(newCardElement);

          // Очищаем поля ввода
          newCardInput.value = "";
          newCardUrlData.value = "";

          // Закрываем модальное окно добавления новой карточки
          closePopup(popupAddCard); // Вместо document.querySelector(".popup_type_new-card")
        })
        .catch((error) => {
          // Обрабатываем ошибки
          console.error("Ошибка при добавлении карточки:", error);
        })
        .finally(() => {
          // Возвращаем исходный текст кнопки
          resetButtonState(saveNewPlaceButton, "Сохранить");
        });
    } else {
      console.error("Поля для новой карточки не могут быть пустыми");
      resetButtonState(saveNewPlaceButton, "Сохранить"); // Возвращаем исходный текст кнопки
    }
  }
});

// УДАЛЕНИЕ КАРТОЧЕК!!!

// Функция открытия модального окна подтверждения удаления карточки
export function openDeleteConfirmation(cardId, cardElement) {
  cardToDeleteId = cardId;
  cardToDeleteElement = cardElement;
  const confirmPopup = document.querySelector(".popup_type_confirm");
  openPopup(confirmPopup);
}

// Обработчик клика на кнопку "Да" в модальном окне подтверждения
document
  .querySelector(".popup_type_confirm .popup__button")
  .addEventListener("click", handleConfirmButtonClick);

function handleConfirmButtonClick() {
  if (cardToDeleteId && cardToDeleteElement) {
    deleteCardFromServer(cardToDeleteId)
      .then(() => {
        deleteCard(cardToDeleteElement);
        closePopup(document.querySelector(".popup_type_confirm"));
        // Сброс переменных после удаления карточки
        cardToDeleteId = null;
        cardToDeleteElement = null;
      })
      .catch((error) => {
        console.error("Ошибка при удалении карточки:", error);
      });
  }
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
  openPopup(avatarPopup);
}

// Функция для закрытия Popup
function closeAvatarPopup() {
  closePopup(avatarPopup);
}

// Добавляем слушатель события клика на элемент профиля
profileImageContainer.addEventListener("click", openAvatarPopup);

// Добавляем слушатель события клика на кнопку закрытия Popup
closeButton.addEventListener("click", closeAvatarPopup);

// Находим форму для изменения аватара
const avatarForm = document.querySelector(".popup_type_avatar .popup__form");

// Находим кнопку сохранить аватар внутри формы
const saveAvatarButton = avatarForm.querySelector(
  ".profile_save_new_image_button"
);

// Функция обработки события отправки формы для смены аватара
function handleAvatarFormSubmit(event) {
  event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

  // Получаем значение ссылки на новый аватар из поля ввода
  const newAvatarUrl = avatarInput.value.trim();

  if (newAvatarUrl) {
    setLoadingState(saveAvatarButton); // Устанавливаем текст кнопки на "Сохранение..."
    updateAvatar(newAvatarUrl); // Вызываем функцию обновления аватара
  } else {
    console.error("Поле ссылки на аватар не может быть пустым");
  }
}

// Добавляем обработчик события отправки формы для смены аватара
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Находим поле ввода ссылки на новый аватар
const avatarInput = document.querySelector(".popup__input_type_avatar_url");
saveAvatarButton.addEventListener("click", handleAvatarFormSubmit);

// Функция для обновления аватара
function updateAvatar(newAvatarUrl) {
  // Отправка PATCH-запроса
  updateAvatarApi(newAvatarUrl)
    .then((data) => {
      console.log("Аватар успешно обновлен:", data);
      // Обновляем отображение аватара на странице
      const profileImage = document.querySelector(".profile__image");
      profileImage.style.backgroundImage = `url(${newAvatarUrl})`;
      // Очищаем поле ввода
      avatarInput.value = "";
      resetButtonState(saveAvatarButton, "Сохранить");
      // Закрываем попап
      closeAvatarPopup();
    })
    .catch((error) => {
      console.error("Ошибка при обновлении аватара:", error);
      // Возвращаем исходный текст кнопки в случае ошибки
      resetButtonState(saveAvatarButton, "Сохранить");
    });
}
