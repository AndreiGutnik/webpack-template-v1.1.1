# Webpack React TypeScript Template

Стартовый шаблон SPA на React 19 и TypeScript с собственной конфигурацией Webpack 5. В шаблоне уже настроены маршрутизация, локализация, SCSS/CSS Modules, адаптивные миксины, локальные шрифты, SVG-спрайт, алиасы импортов, Axios, заготовка Redux Toolkit и production-сборка.

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

- React 19, TypeScript и Babel;
- Webpack 5 и webpack-dev-server;
- React Router;
- Sass и CSS Modules;
- i18next и react-i18next;
- Axios;
- Redux Toolkit и redux-persist (как заготовка);
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
  components/             общие компоненты и Layout
  pages/                  страницы
  redux/                  store, хуки и Axios-клиент
  styles/globals.scss     глобальные стили, переменные и container
  styles/mixins.scss      адаптивные SCSS-миксины
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

Это аналог `styled(Container)`: элемент получает свойства глобального контейнера и локальные свойства компонента.

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

Маршруты объявляются в `src/components/App.tsx`. `src/components/Layout.tsx` содержит общие элементы и `<Outlet />` для текущей страницы.

```tsx
import { lazy } from 'react';

const AboutPage = lazy(() => import('@/pages/AboutPage/AboutPage'));

<Route path="about" element={<AboutPage />} />;
```

Для внутренних переходов используйте `Link` или `navigate`, чтобы не перезагружать SPA.

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

Поддерживаются `ru`, `cz` и `ua`. Переводы находятся в `public/locales/*.json`, язык добавляется в URL, сохраняется в `localStorage`, запасной язык — русский.

```tsx
import { useTranslation } from 'react-i18next';

export const Example = () => {
  const { t } = useTranslation();
  return <h1>{t('app.title')}</h1>;
};
```

Новый ключ добавляйте во все языковые файлы. Чтобы добавить язык:

1. Создайте JSON в `public/locales`.
2. Обновите `supportedLngs` и регулярные выражения в `src/i18n.ts`.
3. Обновите `languages` и тип `Language` в `LanguageSwitcher.tsx`.
4. Добавьте флаг в `public/icons`.

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

## API

Общий Axios-клиент экспортируется из `src/redux/http`:

```ts
import api from '@/redux/http';

const response = await api.get('/resource');
```

По умолчанию используются URL `https://ypsilonworkcrm.sunsetcore.cz`, таймаут 15 секунд, `withCredentials`, bearer-токен и одна повторная попытка после обновления токена при `401`.

```bash
API_URL=https://api.example.com npm start
API_URL=https://api.example.com npm run build
```

## Redux Toolkit

Store подготовлен в `src/redux/store.ts`, но `Provider` и `PersistGate` в `src/index.tsx` закомментированы. Если Redux нужен:

1. Добавьте reducer в `configureStore`.
2. Раскомментируйте `Provider`, `PersistGate`, `store` и `persistor`.
3. Используйте типизированные хуки из `src/redux/hooks.ts`.

Если Redux не нужен, удалите его файлы и зависимости.

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

Шаблон настроен для корня домена. При публикации в подкаталоге синхронно измените `BrowserRouter basename`, Webpack `output.publicPath` и пути публичных ресурсов. Сервер должен возвращать `index.html` для неизвестных SPA-маршрутов; для статического хостинга предусмотрен `public/404.html`.

## Чек-лист нового проекта

1. Измените `name`, `description` и `author` в `package.json`.
2. Замените favicon и содержимое `public/index.html`.
3. Настройте переменные и `.container` в `globals.scss`.
4. Удалите отладочный `outline` контейнера.
5. Замените логотип, переводы и языки.
6. Настройте API либо удалите Axios-клиент.
7. Подключите Redux либо удалите его заготовку.
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
