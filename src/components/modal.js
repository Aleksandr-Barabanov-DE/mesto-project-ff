// Механизм открытия Popup редактора и добавления карточки
export function openPopup(popup) {
  popup.classList.add("popup_is-animated", "popup_is-opened");
  // Добавляем обработчик события keydown для всего документа при открытии попапа
  document.addEventListener("keydown", closePopupOnEsc);
}

// Механизм Открытие popup карточек
export function openPopupCard(popup, imageUrl, captionText) {
  const popupImage = popup.querySelector(".popup__image");
  const popupCaption = popup.querySelector(".popup__caption");

  // Устанавливаем src изображения и текст подписи
  popupImage.src = imageUrl;
  popupImage.alt = captionText;
  popupCaption.textContent = captionText;

  openPopup(popup);
}

//Механизм закрытия
export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
  // Удаляем обработчик события keydown для всего документа при закрытии попапа
  document.removeEventListener("keydown", closePopupOnEsc);
}

// Обработчик клика на оверлей
export function overlayClickHandler(event) {
  if (event.target.classList.contains("popup_is-opened")) {
    closePopup(event.target);
  }
}

// Функция Зарытия Модальных окон при нажатии клавиши ESC
export function closePopupOnEsc(event) {
  if (event.key === "Escape") {
    const openedPopups = document.querySelector(".popup_is-opened");
    openedPopups.forEach(function (popup) {
      closePopup(popup);
    });
  }
}
