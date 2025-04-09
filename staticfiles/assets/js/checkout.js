// Скрипт для окна сверху с ошибками
let messagesContainer = document.querySelector('.messages-container'); // Находим контейнер для сообщений об ошибках
let messagesList = document.querySelector('.messages'); // Находим список сообщений об ошибках

// Если список сообщений существует и в нем есть дочерние элементы
if (messagesList) {
  if (messagesList.children.length > 0) { // Проверяем, есть ли у списка дочерние элементы
    messagesContainer.classList.add('show'); // Добавляем класс для отображения контейнера сообщений
    setTimeout(function() {
      messagesContainer.classList.add('hide'); // Через 2 секунды добавляем класс для скрытия контейнера сообщений
      messagesContainer.classList.remove('show'); // Удаляем класс для отображения контейнера сообщений
    }, 2000); // Задержка 2 секунды перед скрытием сообщений
  }
}

// Скрипт для всплывающего окна с оплатой
const paymentMethodSelect = document.getElementById('id_payment_method'); // Находим выпадающий список выбора метода оплаты
const onlinePaymentInfo = document.getElementById('online-payment-info'); // Находим блок информации об онлайн-оплате
const overlay = document.getElementById('overlay'); // Находим оверлей для всплывающего окна
const closeBtn = document.getElementById('close-btn'); // Находим кнопку закрытия всплывающего окна

// Добавляем слушателя событий на изменение значения в выпадающем списке метода оплаты
paymentMethodSelect.addEventListener('change', (event) => {
  // Если выбран метод оплаты "card_online"
  if (event.target.value === 'card_online') {
    onlinePaymentInfo.style.display = 'block'; // Показываем блок информации об онлайн-оплате
    overlay.style.display = 'block'; // Показываем оверлей
  } else {
    onlinePaymentInfo.style.display = 'none'; // Скрываем блок информации об онлайн-оплате
    overlay.style.display = 'none'; // Скрываем оверлей
  }
});

// Добавляем слушателя событий на клик по кнопке закрытия всплывающего окна
closeBtn.addEventListener('click', () => {
  onlinePaymentInfo.style.display = 'none'; // Скрываем блок информации об онлайн-оплате
  overlay.style.display = 'none'; // Скрываем оверлей
});
