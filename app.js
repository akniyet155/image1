// app.js — рендерит категории/ботов из catalog.json и связывается с Telegram WebApp SDK
(async function(){
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    console.warn('Telegram WebApp SDK не найден. Откройте страницу в приложении Telegram.');
  } else {
    tg.ready();
    try { tg.expand(); } catch(e){}
  }

  // Элементы
  const categoryGrid = document.getElementById('categoryGrid');
  const botsGrid = document.getElementById('botsGrid');
  const mainPage = document.getElementById('mainPage');
  const botsPage = document.getElementById('botsPage');
  const botsPageTitle = document.getElementById('botsPageTitle');
  const createBtn = document.getElementById('createBtn');
  const createBtn2 = document.getElementById('createBtn2');

  // Загрузим каталог
  let catalog = { categories: [] };
  try {
    const res = await fetch('./catalog.json', {cache: 'no-store'});
    catalog = await res.json();
  } catch (e) {
    console.error('Не удалось загрузить catalog.json', e);
  }

  // Рендер категорий
  function renderCategories() {
    categoryGrid.innerHTML = '';
    catalog.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.dataset.category = cat.id;
      btn.innerHTML = `<span class="category-icon">📁</span><span class="category-title">${cat.title}</span>`;
      btn.addEventListener('click', () => openCategory(cat.id));
      categoryGrid.appendChild(btn);
    });
  }

  // Показать категорию
  function openCategory(catId) {
    const cat = catalog.categories.find(c => c.id === catId);
    if (!cat) {
      if (tg) tg.showAlert('Категория не найдена');
      return;
    }
    botsPageTitle.textContent = `🔍 ${cat.title}`;
    botsGrid.innerHTML = '';
    cat.items.forEach(item => {
      const a = document.createElement('a');
      a.className = 'bot-btn';
      a.href = item.url;
      a.target = '_blank';
      a.innerHTML = `<img class="bot-image" src="${item.image}" alt="${item.title}"><div class="bot-title">${item.title}</div>`;
      a.addEventListener('click', (e) => {
        // Отправляем данные боту через WebApp SDK, затем открываем ссылку
        const payload = { action: 'open_bot', category: catId, id: item.id, title: item.title, url: item.url, ts: Date.now() };
        try {
          if (tg && tg.sendData) tg.sendData(JSON.stringify(payload));
        } catch (err) { console.warn('sendData error', err); }
        // при открытии ссылки tg.openLink предпочтительнее (открывает внутри клиента)
        try { if (tg && tg.openLink) { e.preventDefault(); tg.openLink(item.url); } } catch (err){}
        // Также можно POSTить на сервер для аналитики (опционально)
        try { navigator.sendBeacon && navigator.sendBeacon('/track', JSON.stringify(payload)); } catch(e){}
      });
      botsGrid.appendChild(a);
    });

    // Показываем страницу ботов
    mainPage.style.display = 'none';
    botsPage.style.display = 'block';
    if (tg && tg.MainButton) {
      tg.MainButton.setText('Назад');
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        botsPage.style.display = 'none';
        mainPage.style.display = 'block';
        tg.MainButton.setText('Главная');
        try { tg.MainButton.hide(); } catch(e){}
      });
    }
  }

  // Кнопки создания
  createBtn && createBtn.addEventListener('click', () => { if (tg) tg.showAlert('Свяжитесь с нами для создания Mini App! 🚀'); else alert('Свяжитесь с нами для создания Mini App!'); });
  createBtn2 && createBtn2.addEventListener('click', () => { if (tg) tg.showAlert('Свяжитесь с нами для создания Mini App! 🚀'); else alert('Свяжитесь с нами для создания Mini App!'); });

  renderCategories();

  console.log('app.js инициализировано');
})();
