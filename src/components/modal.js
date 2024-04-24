// Механизм открытия Popup редактора и добавления карточки
export function openPopup(popup) {
  popup.classList.add("popup_is-animated", "popup_is-opened");
  // Добавляем обработчик события keydown для всего документа при открытии попапа
  document.addEventListener("keydown", closePopupOnEsc);
}

//Механизм закрытия
export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
  popup.classList.remove("popup_is-animated");
  document.removeEventListener("keydown", closePopupOnEsc);
}

// Обработчик клика на оверлей
export function overlayClickHandler(event) {
  if (event.target.classList.contains("popup_is-opened")) {
    closePopup(event.target);
  }
}

// Функция Закрытия модальных окон при нажатии клавиши ESC
export function closePopupOnEsc(event) {
  if (event.key === "Escape") {
    const popup = document.querySelector(".popup_is-opened");
    closePopup(popup);
  }
}
