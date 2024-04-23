export function handleLikeButtonClick(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

// Функция создания карточки
export function createCard(data, deleteCallback, openCardModalCallback) {
  // Клонируем шаблон карточки
  const cardTemplate = document.querySelector("#card-template");
  const cardClone = cardTemplate.content.cloneNode(true);

  // Находим элементы в карточке
  const cardElement = cardClone.querySelector(".places__item");
  const cardImage = cardClone.querySelector(".card__image");
  const cardTitle = cardClone.querySelector(".card__title");
  const deleteButton = cardClone.querySelector(".card__delete-button");
  const likeButton = cardClone.querySelector(".card__like-button"); // Находим кнопку "лайк"

  // Устанавливаем значения элементов
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Добавляем обработчик клика на иконку удаления
  deleteButton.addEventListener("click", function () {
    deleteCallback(cardElement);
  });

  // Добавляем обработчик клика на изображение
  cardImage.addEventListener("click", function () {
    openCardModalCallback(data.link, data.name);
  });

  // Добавляем обработчик клика на кнопку "лайк"
  likeButton.addEventListener("click", function () {
    handleLikeButtonClick(likeButton);
  });

  return cardClone;
}

// Функция удаления карточек
export function deleteCard(cardElement) {
  cardElement.remove();
}
