# Webpack React TypeScript Template

Стартовый шаблон SPA на React 19 и TypeScript с Webpack 5. В проекте настроены локализованные маршруты, публичные и приватные страницы, Redux Toolkit Query для backend-запросов, Sass/CSS Modules, адаптивные миксины, локальные шрифты, SVG-спрайт и production-сборка. Axios не используется.

## Требования и запуск

- Node.js `22.12.0` или новее.
- npm (устанавливается вместе с Node.js).

```bash
npm install
npm start
```

Dev-сервер запускается по адресу `http://localhost:3000`, открывает браузер, поддерживает Hot Module Replacement и клиентские маршруты.

```bash
npm start          # dev-сервер с HMR
npm run dev        # development-сборка без dev-сервера
npm run typecheck  # проверка TypeScript без создания файлов
npm run build      # production-сборка в dist
```

После изменения конфигурации Webpack или лоадеров полностью перезапускайте `npm start`: HMR такие изменения может не подхватить.

## Что используется

- React 19, TypeScript 7 и Babel;
- Webpack 5 и webpack-dev-server;
- React Router 7;
- Redux Toolkit и Redux Toolkit Query;
- Sass и CSS Modules;
- i18next и react-i18next;
- React Helmet Async;
- Ant Design.

## Структура

```text
config/build/             Webpack, лоадеры и плагины
public/                   файлы без обработки Webpack
  icons/                  флаги переключателя языка
  locales/                JSON-переводы
src/
  assets/fonts/           локальные шрифты
  assets/images/          изображения и SVG-спрайт
  components/             Layout, Header, route guards и UI-компоненты
  pages/                  страницы
  redux/                  store, auth slice и RTK Query API slices
  hooks/                  общие хуки, включая useAuth
  styles/globals.scss     глобальные стили, переменные и container
  styles/mixins.scss      адаптивные SCSS-миксины
  config.ts               defaultLocale, apiUrl и appBasePath
  locales.ts              список локалей и функции для locale/base path
  i18n.ts                 локализация
  index.tsx               точка входа
  routes.ts               константы маршрутов
```

Для импортов из `src` настроен алиас `@`:

```tsx
import { Header } from '@/components/Header/Header';
import { routes } from '@/routes';
```

## Глобальные стили и CSS Modules

`src/styles/globals.scss` подключён один раз в `src/index.tsx`. В нём находятся `@font-face`, CSS-переменные, базовый reset, типографика и глобальный `.container`. Повторно импортировать этот файл в компонентах не нужно.

Стили компонента храните рядом с ним:

```scss
// Card.module.scss
.card {
  display: grid;
  gap: 16px;
}

.title {
  font-weight: 600;
}
```

```tsx
import styles from './Card.module.scss';

export const Card = () => (
  <article className={styles.card}>
    <h2 className={styles.title}>Заголовок</h2>
  </article>
);
```

CSS Modules генерирует уникальные классы. Используйте обычный camelCase: последовательности заглавных букв могут преобразовываться `css-loader`. Например, `.logoYP` экспортируется как `styles.logoYp`. Безопасный вариант — одинаковое имя `.logoYp` / `styles.logoYp`.

### Глобальный и локальный класс вместе

```tsx
<div className={`container ${styles.headerContent}`}>
  {/* content */}
</div>
```

Элемент получает свойства глобального контейнера и локальные свойства CSS Module.

## Контейнер

```tsx
<section>
  <div className="container">Содержимое секции</div>
</section>
```

`width: 100%` занимает доступную ширину, `max-width` ограничивает её на больших экранах, а `margin: 0 auto` центрирует контейнер. Внутренние отступы меняются адаптивно.

Красный `outline` в `.container` нужен только для отладки. Перед выпуском его следует удалить или закомментировать.

## Адаптивные миксины

| Миксин | Минимальная ширина |
| --- | ---: |
| `xs-up` | 361 px |
| `sm-up` | 421 px |
| `md-up` | 744 px |
| `lg-up` | 1025 px |
| `xl-up` | 1241 px |
| `xxl-up` | 1440 px |

Webpack автоматически добавляет `@use "styles/mixins" as *;` во все SCSS-файлы, поэтому импортировать миксины вручную не нужно:

```scss
.title {
  font-size: 24px;

  @include md-up {
    font-size: 32px;
  }

  @include xxl-up {
    font-size: 48px;
  }
}
```

## Шрифты

Montserrat подключён в `globals.scss`:

| Начертание | `font-weight` |
| --- | ---: |
| Regular | 400 |
| Medium | 500 |
| SemiBold | 600 |
| Bold | 700 |

`font-family: 'Montserrat'` и вес `400` заданы для `body`, поэтому потомки наследуют их. В компонентах достаточно указать отличный вес:

```scss
.subtitle {
  font-weight: 500;
}

.heading {
  font-weight: 700;
}
```

Поля и кнопки используют `font: inherit`. Импорты шрифтов в TypeScript не нужны: Webpack обрабатывает `url(...)` из `@font-face`.

Чтобы добавить вес, положите файлы в `src/assets/fonts`, добавьте `@font-face` и укажите соответствующий `font-weight`.

## SVG-спрайт

Спрайт подключён в `src/index.tsx`:

```tsx
import '@/assets/images/svg_sprite.svg';
```

Этот импорт обязателен: `svg-sprite-loader` вставляет спрайт в DOM. Для `*_sprite.svg` имя файла добавляется к идентификатору символа. Символ `<symbol id="logo">` из `svg_sprite.svg` используется как `#svg_sprite_logo`:

```tsx
<svg
  className={styles.logoYp}
  viewBox="0 0 126 74"
  aria-hidden="true"
>
  <use href="#svg_sprite_logo" />
</svg>
```

Размер задаётся классом:

```scss
.logoYp {
  width: 50px;
  height: 28px;

  use {
    width: 100%;
    height: 100%;
  }
}
```

Обычные SVG, импортированные из `.tsx`, обрабатываются `@svgr/webpack` и используются как React-компоненты. SVG из CSS обрабатываются как ресурсы.

## Изображения и public

Изображения из `src/assets` импортируйте:

```tsx
import image from '@/assets/images/logo.png';

<img src={image} alt="Описание" />;
```

PNG, JPEG, GIF, WebP, AVIF и BMP меньше 8 КБ могут встраиваться как data URL; более крупные файлы попадают в сборку отдельно.

Файлы из `public` доступны напрямую. В production копируются `locales`, `icons` и `404.html`.

## Маршрутизация и Layout

Список путей находится в `src/routes.ts`, дерево маршрутов — в `src/components/App.tsx`. Все страницы открываются с locale-префиксом:

| Путь | Доступ | Назначение |
| --- | --- | --- |
| `/` | публичный redirect | перенаправляет на locale из URL/сохранённого выбора или `defaultLocale` |
| `/:locale/login` | публичный (`PublicRoute`) | форма входа; авторизованный пользователь перенаправляется на `/:locale/` |
| `/:locale/` | приватный (`PrivateRoute`) | приветственная страница |
| `/:locale/product` | приватный (`PrivateRoute`) | пример страницы продукта |

Поддерживаемые locale: `ru`, `cz`, `ua`. `Layout` проверяет locale, показывает общий `Header` и рендерит дочернюю страницу через `<Outlet />`. Неизвестный путь под допустимым locale перенаправляется на главную этого locale.

`AuthInitializer` запускает `POST /auth/refresh` при старте приложения. Пока Redux auth status равен `checking`, показывается fullscreen spinner; после ответа доступ к приватным/публичным маршрутам определяется `PrivateRoute` и `PublicRoute` через общий `useAuth`.

```tsx
import { lazy } from 'react';
import { Route } from 'react-router-dom';

import { PrivateRoute } from '@/components/PrivateRoute';

const AccountPage = lazy(() => import('@/pages/AccountPage/AccountPage'));

// Добавьте этот блок внутрь маршрута /:locale с Layout.
<Route element={<PrivateRoute />}>
  <Route path="account" element={<AccountPage />} />
</Route>;
```

Для внутренних переходов используйте `Link` или `navigate`, чтобы не перезагружать SPA и сохранить locale-префикс.

### Fixed Header

`position: fixed` исключает Header из потока, поэтому следующий контент начинается под ним. Компенсирующий `padding-top` лучше задавать для `<main>` в `Layout`, а не отдельно каждой странице. Значение должно соответствовать адаптивной высоте Header.

Если фиксация не нужна, удалите `position: fixed`. Вариант, сохраняющий место в потоке:

```scss
.headerWrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
}
```

## Локализация

Поддерживаются `ru`, `cz` и `ua`; список находится в `src/locales.ts`, а язык по умолчанию задаётся как `defaultLocale` в `src/config.ts`. Переводы находятся в `public/locales/ru.json`, `cz.json` и `ua.json`. Locale в URL имеет приоритет; выбор флага сохраняется в `localStorage` под ключом `app-locale` и используется при следующем заходе на `/`. При первом запуске без locale в URL и сохранённого выбора используется `defaultLocale`; язык системы автоматически не выбирается.

```tsx
import { useTranslation } from 'react-i18next';

export const Example = () => {
  const { t } = useTranslation();
  return <h1>{t('app.title')}</h1>;
};
```

Новый ключ добавляйте во все языковые файлы. Чтобы добавить язык:

1. Создайте JSON в `public/locales`.
2. Добавьте код в `supportedLocales` в `src/locales.ts`.
3. Добавьте имя языка в `LanguageSwitcher/LanguageSwitcher.tsx` и флаг в `public/icons`.

## CSS-переменные

Цвета и общие значения объявлены в `:root` файла `globals.scss`:

```scss
.button {
  color: var(--colorWhite);
  background-color: var(--backgroundTeal);
  box-shadow: var(--boxShadow);
  transition: color 200ms var(--cubicBezier);
}
```

Меняйте палитру в переменных, а не во всех компонентах.

## Backend-запросы

Все запросы к backend выполняются через **Redux Toolkit Query** (`fetchBaseQuery`); Axios-клиента в проекте нет. `src/config.ts` — единственная точка настройки приложения: `defaultLocale` задаёт язык по умолчанию, `apiUrl` — базовый URL backend, `appBasePath` — путь публикации приложения. `apiUrl` используется общим `src/redux/api/baseQuery.ts`.

- `authApi.ts`: вход, обновление сессии и выход;
- `userApi.ts`: регистрация и проверка email;
- `baseQuery.ts`: отправляет cookies (`credentials: 'include'`) и bearer-токен из Redux auth state;
- `baseQueryWithReauth.ts`: `userApi` при `401` вызывает `/auth/refresh`, обновляет auth state и повторяет исходный запрос; при неудачном refresh выполняет logout. `authApi` использует обычный `baseQuery`, чтобы refresh-запрос не запускал повторный refresh.

Пример mutation hook:

```tsx
const handleSubmit = async (values: CredentialsLogIn) => {
  // login and dispatch are obtained from RTK Query and Redux hooks in the component.
  const credentials = await login(values).unwrap();
  dispatch(setCredentials(credentials));
};
```

Новые endpoints добавляйте в соответствующий API slice и используйте сгенерированные RTK Query hooks. Не создавайте отдельный Axios client или прямые `fetch`-запросы.

## Redux Toolkit

Redux store подключён через `<Provider>` в `src/index.tsx`. В нём зарегистрированы auth slice, `authApi` и `userApi`, их middleware включены. Для компонентов используйте типизированные hooks из `src/redux/hooks.ts`; состояние аутентификации читайте через `src/hooks/useAuth.ts`. Пакет `redux-persist` пока не подключён к store.

## Метаданные

Приложение обёрнуто в `HelmetProvider`:

```tsx
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>Название страницы</title>
  <meta name="description" content="Описание страницы" />
</Helmet>;
```

## Production и публикация

```bash
npm run typecheck
npm run build
```

Результат появляется в `dist`. Production-сборка минимизирует CSS/JavaScript, разделяет chunks, добавляет content hash и копирует публичные ресурсы.

По умолчанию шаблон работает в корне домена. Путь публикации задаётся только в `src/config.ts` через `appBasePath`; это значение Webpack использует для `BrowserRouter basename`, chunks, переводов, флагов, шрифтов и изображений. Для публикации в подкаталоге измените его, например, на `/shop/`, и выполните сборку. Сервер должен возвращать `index.html` для неизвестных SPA-маршрутов; для статического хостинга предусмотрен `public/404.html`.

## Чек-лист нового проекта

1. Измените `name`, `description` и `author` в `package.json`.
2. Замените favicon и содержимое `public/index.html`.
3. Настройте переменные и `.container` в `globals.scss`.
4. Удалите отладочный `outline` контейнера.
5. Замените логотип, переводы и языки.
6. Укажите API URL в `src/config.ts` и добавляйте endpoints в RTK Query API slices.
7. Оставьте Redux Toolkit store либо удалите store, slices и связанные зависимости.
8. Удалите неиспользуемые библиотеки и выполните `npm install`.
9. Запустите `npm run typecheck` и `npm run build`.

## Короткие правила

- Глобальные стили храните в `globals.scss`, стили компонентов — в `.module.scss`.
- Не импортируйте `globals.scss` в компонентах.
- Не повторяйте `font-family`, если используется глобальный Montserrat.
- Для нужного начертания используйте `font-weight: 500`, `600` или `700`.
- Ограничивайте ширину общим `.container`.
- Используйте существующие адаптивные миксины.
- После изменений Webpack перезапускайте dev-сервер.
- Перед production-сборкой запускайте `npm run typecheck`.
