export function handleLikeButtonClick(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

// Функция создания карточки
export function createCard(
  data,
  deleteCallback,
  openCardModal,
  likeButtonClickCallback,
  removeLikeButtonClickCallback,
  userId
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
  likeCount.textContent = Array.isArray(data.likes) ? data.likes.length : 0; // Устанавливаем количество лайков провереряем на массив и если нет ставим ноль
  // Устанавливаем значения элементов
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Проверяем, является ли текущий пользователь владельцем карточки
  if (data.owner && data.owner._id !== userId) {
    // Если текущий пользователь не владелец, скрываем кнопку удаления
    deleteButton.style.display = "none";
  }

  deleteButton.addEventListener("click", function () {
    deleteCallback(data._id, cardElement);
  });

  // Добавляем обработчик клика на изображение
  cardImage.addEventListener("click", function () {
    openCardModal(data.link, data.name);
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
      removeLikeButtonClickCallback(cardId, likeButton);
    } else {
      // Если лайк не установлен, отправляем PUT-запрос для его установки
      likeButtonClickCallback(cardId, likeButton);
    }
  });

  return cardClone;
}

// Функция удаления карточек
export function deleteCard(cardElement) {
  cardElement.remove();
}
