import { openPopup } from "./modal.js";
import { closePopup } from "./modal.js";
import { deleteCardFromServer } from "../index.js";
import { likeCard } from "../index.js";
import { removeLikeFromCard } from "../index.js";

export function handleLikeButtonClick(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

// Функция создания карточки
export function createCard(
  data,
  deleteCallback,
  imageClickCallback,
  userId,
  openPopupCardCallback
) {
  // Клонируем шаблон карточки
  const cardTemplate = document.querySelector("#card-template");
  const cardClone = cardTemplate.content.cloneNode(true);

  // Находим элементы в карточке
  const cardElement = cardClone.querySelector(".places__item");
  const cardImage = cardClone.querySelector(".card__image");
  const cardTitle = cardClone.querySelector(".card__title");
  const deleteButton = cardClone.querySelector(".card__delete-button");
  const likeButton = cardClone.querySelector(".card__like-button"); // Находим кнопку "лайк"

  const likeCount = cardClone.querySelector(".card__like-count"); // Находим элемент для отображения количества лайков
  likeCount.textContent = data.likes.length; // Устанавливаем количество лайков
  // Устанавливаем значения элементов
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Проверяем, является ли текущий пользователь владельцем карточки
  if (data.owner._id !== userId) {
    // Если текущий пользователь не владелец, скрываем кнопку удаления
    deleteButton.style.display = "none";
  }

  deleteButton.addEventListener("click", function () {
    // Получаем ID карточки
    const cardId = data._id;
    // Находим модальное окно подтверждения
    const confirmPopup = document.querySelector(".popup_type_confirm");
    // Открываем модальное окно подтверждения
    openPopup(confirmPopup);
    // Добавляем обработчик клика на кнопку "Да" в подтверждающем popup'е
    const confirmButton = confirmPopup.querySelector(".popup__button");
    confirmButton.addEventListener("click", function () {
      // Удаляем карточку, передавая ее ID
      deleteCardFromServer(cardId).then(() => {
        // Удаляем карточку из DOM
        deleteCard(cardElement);
        // Закрываем подтверждающий popup
        closePopup(confirmPopup);
      });
    });
  });

  // Добавляем обработчик клика на изображение
  cardImage.addEventListener("click", function () {
    imageClickCallback(data.link, data.name);
  });

  // Добавляем обработчик клика на кнопку "лайк"
  likeButton.addEventListener("click", function () {
    // Получаем ID карточки, для которой нажата кнопка "лайк"
    const cardId = data._id;
    // Проверяем, установлен ли уже лайк на карточке
    const isLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );

    // Отправляем запрос на сервер для установки или снятия лайка в зависимости от текущего состояния кнопки
    if (isLiked) {
      // Если лайк уже установлен, отправляем DELETE-запрос для его снятия
      removeLikeFromCard(cardId)
        .then((updatedData) => {
          // Обновляем количество лайков на карточке
          likeCount.textContent = updatedData.likes.length;
          // Убираем класс активности кнопки "лайк"
          handleLikeButtonClick(likeButton);
        })
        .catch((error) => {
          console.error("Ошибка при удалении лайка с карточки:", error);
        });
    } else {
      // Если лайк не установлен, отправляем PUT-запрос для его установки
      likeCard(cardId)
        .then((updatedData) => {
          // Обновляем количество лайков на карточке
          likeCount.textContent = updatedData.likes.length;
          // Устанавливаем класс активности кнопки "лайк"
          handleLikeButtonClick(likeButton);
        })
        .catch((error) => {
          console.error("Ошибка при лайкинге карточки:", error);
        });
    }
  });
  return cardClone;
}

// Функция удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove();
}

// ДОБАВЛЕНИЕ НОВЫХ КАРТОЧЕК
export function addNewCard(evt) {
  evt.preventDefault(); // Отменяем стандартное поведение формы

  // Находим поля добавления карточек
  const newCardName = document.querySelector(
    ".popup__input_type_card-name"
  ).value;
  const newCardUrl = document.querySelector(".popup__input_type_url").value;

  const cardTemplate = document.querySelector("#card-template");
  const cardClone = cardTemplate.content.cloneNode(true);

  // Находим элементы в карточке
  const cardElement = cardClone.querySelector(".places__item");
  const cardImage = cardClone.querySelector(".card__image");
  const cardTitle = cardClone.querySelector(".card__title");
  const deleteButton = cardClone.querySelector(".card__delete-button");
  const likeButton = cardClone.querySelector(".card__like-button"); // Находим кнопку "лайк"

  // Устанавливаем значения элементов
  cardImage.src = newCardUrl;
  cardImage.alt = newCardName;
  cardTitle.textContent = newCardName;

  // Добавляем обработчик клика на кнопку удаления
  deleteButton.addEventListener("click", function () {
    deleteCard(cardElement);
  });

  // Добавляем обработчик клика на кнопку "лайк"
  likeButton.addEventListener("click", function () {
    handleLikeButtonClick(likeButton);
  });

  // Находим контейнер для карточек
  const placesList = document.querySelector(".places__list");

  // Вставляем новую карточку в начало контейнера
  placesList.prepend(cardClone);

  // Очищаем содержимое формы
  document.querySelector(".popup__form").reset();

  // Закрываем диалоговое окно
  closePopup(addCardPopup);
}
