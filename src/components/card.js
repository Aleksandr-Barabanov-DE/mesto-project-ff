
export function handleLikeButtonClick(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}



// Функция создания карточки 
export function createCard(data, deleteCallback, imageClickCallback, openPopupCardCallback) {
  // Клонируем шаблон карточки
  const cardTemplate = document.querySelector('#card-template');
  const cardClone = cardTemplate.content.cloneNode(true);

  // Находим элементы в карточке
  const cardElement = cardClone.querySelector('.places__item');
  const cardImage = cardClone.querySelector('.card__image');
  const cardTitle = cardClone.querySelector('.card__title');
  const deleteButton = cardClone.querySelector('.card__delete-button');
  const likeButton = cardClone.querySelector('.card__like-button'); // Находим кнопку "лайк"

  // Устанавливаем значения элементов
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Добавляем обработчик клика на иконку удаления
  deleteButton.addEventListener('click', function () {
      deleteCallback(cardElement);
  });

  // Добавляем обработчик клика на изображение
  cardImage.addEventListener('click', function () {
      imageClickCallback(data.link, data.name);
  });

  // Добавляем обработчик клика на кнопку "лайк"
  likeButton.addEventListener('click', function () {
    handleLikeButtonClick(likeButton);
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
  const newCardName = document.querySelector('.popup__input_type_card-name').value;
  const newCardUrl = document.querySelector('.popup__input_type_url').value;

  const cardTemplate = document.querySelector('#card-template');
  const cardClone = cardTemplate.content.cloneNode(true);

  // Находим элементы в карточке
  const cardElement = cardClone.querySelector('.places__item');
  const cardImage = cardClone.querySelector('.card__image');
  const cardTitle = cardClone.querySelector('.card__title');
  const deleteButton = cardClone.querySelector('.card__delete-button');
  const likeButton = cardClone.querySelector('.card__like-button'); // Находим кнопку "лайк"

  // Устанавливаем значения элементов
  cardImage.src = newCardUrl;
  cardImage.alt = newCardName;
  cardTitle.textContent = newCardName;

  // Добавляем обработчик клика на кнопку удаления
  deleteButton.addEventListener('click', function() {
      deleteCard(cardElement);
  });

  // Добавляем обработчик клика на кнопку "лайк"
  likeButton.addEventListener('click', function () {
    handleLikeButtonClick(likeButton);
  });

  // Находим контейнер для карточек
  const placesList = document.querySelector('.places__list');

  // Вставляем новую карточку в начало контейнера
  placesList.prepend(cardClone);

  // Очищаем содержимое формы
  document.querySelector('.popup__form').reset();

  // Закрываем диалоговое окно
  closePopup(addCardPopup);
}