describe('Проверяем конструктор бургеров', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });
  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit('/');
  });

  it('добавление ингредиента из списка в конструктор', () => {
    //проверка начального состояния
    cy.get('[data-cy=bun-top]').should('not.exist');
    cy.get('[data-cy=bun-bottom]').should('not.exist');
    cy.get('[data-cy=ingredient]').should('not.exist');
    //находим кнопку по id игредиента и тексту и кликаем
    cy.get(`[data-cy=643d69a5c3f7b9001cfa093c]`) //булка
      .contains('Добавить')
      .click();
    cy.get(`[data-cy=643d69a5c3f7b9001cfa0941]`) //ингредиент
      .contains('Добавить')
      .click();

    //проверяем, что всё добавлено
    cy.get('[data-cy=bun-top]')
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get('[data-cy=bun-bottom]')
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get('[data-cy=ingredient]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });
});

describe('Работа модальных окон', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get(`[data-cy=643d69a5c3f7b9001cfa0941]`).as('ingredient');
  });

  it('открытие модального окна ингредиента', () => {
    cy.get(`[data-cy=modal]`).should('not.exist');
    cy.get(`@ingredient`).click();
    cy.get(`[data-cy=modal]`).contains('Детали ингредиента').should('exist');
  });

  it('закрытие по клику на крестик', () => {
    cy.get(`[data-cy=modal]`).should('not.exist');
    cy.get(`@ingredient`).click();
    cy.get(`[data-cy=modal]`).should('exist');
    cy.get(`[data-cy=modal-close-btn]`).click();
    cy.get(`[data-cy=modal]`).should('not.exist');
  });

  it('закрытие по клику на оверлей', () => {
    cy.get(`[data-cy=modal]`).should('not.exist');
    cy.get(`@ingredient`).click();
    cy.get(`[data-cy=modal]`).should('exist');
    cy.get(`[data-cy=modal-overlay]`).click('topLeft', { force: true });
    cy.get(`[data-cy=modal]`).should('not.exist');
  });
});

describe('Создание заказа', function () {
  //используем моковые данные user, order
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );
    cy.setCookie('accessToken', 'Bearer mock-access-token');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    cy.visit('/');
    cy.wait('@getUser');
    cy.wait('@getIngredients');
  });

  it('Создание и отправка заказа', () => {
    //собирается бургер
    cy.get(`[data-cy=643d69a5c3f7b9001cfa093c]`) //булка
      .contains('Добавить')
      .click();
    cy.get(`[data-cy=643d69a5c3f7b9001cfa0941]`) //ингредиент
      .contains('Добавить')
      .click();
    //вызывается клик по кнопке «Оформить заказ»
    cy.get(`[data-cy=order-btn]`).click();
    cy.wait('@postOrder');
    //модальное окно открылось и номер заказа верный
    cy.get(`[data-cy=modal]`).should('exist');
    cy.get(`[data-cy=order-number]`).contains('79518');
    //закрывается модальное окно и проверяется успешность закрытия
    cy.get(`[data-cy=modal-close-btn]`).click();
    cy.get(`[data-cy=modal]`).should('not.exist');
    //проверяется, что конструктор пуст
    cy.get('[data-cy=bun-top]').should('not.exist');
    cy.get('[data-cy=bun-bottom]').should('not.exist');
    cy.get('[data-cy=ingredient]').should('not.exist');
  });
});
