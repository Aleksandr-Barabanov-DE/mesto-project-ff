// Механизм открытия Popup редактора и добавления карточки
export function openPopup(popup) {
  setTimeout(() => {
      popup.classList.add('popup_is-animated');
  }, 10); // Добавляем небольшую задержку перед добавлением класса popup_is-animated
  // Добавляем небольшую задержку перед добавлением класса popup_is-opened
  // чтобы анимация успела загрузиться
  setTimeout(() => {
      popup.classList.add('popup_is-opened');
  }, 100); 
}

// Механизм Открытие popup карточек 
export function openPopupCard(popup, imageUrl, captionText) {
  const popupImage = popup.querySelector('.popup__image');
  const popupCaption = popup.querySelector('.popup__caption');

  // Устанавливаем src изображения и текст подписи
  popupImage.src = imageUrl;
  popupImage.alt = captionText;
  popupCaption.textContent = captionText;

  setTimeout(() => {
    popup.classList.add('popup_is-animated');
}, 10); // Добавляем небольшую задержку перед добавлением класса popup_is-animated
// Добавляем небольшую задержку перед добавлением класса popup_is-opened
// чтобы анимация успела загрузиться
setTimeout(() => {
    popup.classList.add('popup_is-opened');
}, 100); 
}

//Механизм закрытия 
export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
}

// Обработчик клика на оверлей
export function overlayClickHandler(event) {
  if (event.target.classList.contains('popup_is-opened')) {
      closePopup(event.target);
  }
}

// Функция Зарытия Модальных окон при нажатии клавиши ESC
export function closePopupOnEsc(event) {
  if (event.key === 'Escape') {
      const openedPopups = document.querySelectorAll('.popup_is-opened');
      openedPopups.forEach(function(popup) {
          closePopup(popup);
      });
  }
}