# Пошаговая реализация авторизации

Цель: при запуске приложения восстановить сохранённую сессию, показать защищённое приложение авторизованному пользователю и страницу входа — неавторизованному.

Планируемая схема:

```text
Запуск приложения
       ↓
POST /auth/refresh
       ↓
┌──────┴────────┐
│               │
успешно         401 / ошибка
│               │
setCredentials  logout
│               │
WelcomePage     LoginPage
```

Рекомендуемые страницы:

```text
/login  → LoginPage с компонентом AuthForm
/       → защищённая WelcomePage
```

`AuthForm` отвечает только за поля, валидацию и отправку формы. `LoginPage` отвечает за размещение и оформление всей страницы. `WelcomePage` — первая защищённая страница; позднее её можно заменить на Dashboard.

## Шаг 1. Добавить статус проверки авторизации

Одного `isLoggedIn: boolean` недостаточно. При запуске приложения мы ещё не знаем, есть ли действующая сессия.

Добавить в `src/types/index.ts`:

```ts
export type AuthStatus =
  | 'checking'
  | 'authenticated'
  | 'unauthenticated';

export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  status: AuthStatus;
}
```

`isLoggedIn` после этого можно удалить. Его заменяет проверка:

```ts
status === 'authenticated'
```

Значения статуса:

- `checking` — приложение проверяет сохранённую сессию;
- `authenticated` — пользователь авторизован;
- `unauthenticated` — пользователь не авторизован.

## Шаг 2. Обновить authSlice

Файл: `src/redux/slices/authSlice.ts`.

```ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { AuthResponse, AuthState } from '@/types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'checking',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setCredentials(
      state,
      action: PayloadAction<AuthResponse>
    ) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.status = 'authenticated';
    },

    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
```

При первом запуске используется `checking`. После успешного refresh устанавливается `authenticated`, после ответа `401` — `unauthenticated`.

## Шаг 3. Типизировать auth endpoints

Файл: `src/redux/api/authApi.ts`.

```ts
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from './baseQuery';
import type {
  AuthResponse,
  CredentialsLogIn,
} from '@/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth'],

  endpoints: builder => ({
    login: builder.mutation<
      AuthResponse,
      CredentialsLogIn
    >({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
```

Предполагаемый ответ `/auth/login` и `/auth/refresh`:

```json
{
  "accessToken": "...",
  "user": {
    "id": 1,
    "name": "Andrii",
    "lastname": "Hutnyk",
    "email": "example@email.com",
    "verify": true,
    "role": {}
  }
}
```

Если `/auth/refresh` возвращает только `accessToken`, после него понадобится отдельный запрос `/users/me`. Удобнее, если refresh сразу возвращает токен и профиль пользователя.

## Шаг 4. Создать AuthInitializer

Создать файл:

```text
src/components/AuthInitializer/AuthInitializer.tsx
```

```tsx
import {
  PropsWithChildren,
  useEffect,
  useRef,
} from 'react';
import { Spin } from 'antd';

import { useRefreshMutation } from '@/redux/api/authApi';
import {
  useAppDispatch,
  useAppSelector,
} from '@/redux/hooks';
import {
  logout,
  setCredentials,
} from '@/redux/slices/authSlice';

export const AuthInitializer = ({
  children,
}: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(
    state => state.auth.status
  );

  const [refresh] = useRefreshMutation();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const initializeAuth = async () => {
      try {
        const credentials = await refresh().unwrap();

        dispatch(setCredentials(credentials));
      } catch {
        dispatch(logout());
      }
    };

    void initializeAuth();
  }, [dispatch, refresh]);

  if (status === 'checking') {
    return <Spin fullscreen />;
  }

  return children;
};
```

`useRef` предотвращает повторный refresh-запрос из-за повторного запуска effect в development-режиме с `React.StrictMode`.

Ошибка refresh не должна показывать toast: отсутствие сессии при первом посещении — нормальная ситуация.

## Шаг 5. Подключить AuthInitializer

В `src/index.tsx` компонент должен находиться внутри Redux Provider:

```tsx
<Provider store={store}>
  <AuthInitializer>
    <BrowserRouter>
      <React.Suspense fallback={<Spin fullscreen />}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </React.Suspense>
    </BrowserRouter>
  </AuthInitializer>
</Provider>
```

Структура:

```text
Provider
└── AuthInitializer
    ├── checking → Spin
    └── проверка завершена
        └── BrowserRouter
            └── App
```

## Шаг 6. Создать RequireAuth

Создать файл:

```text
src/components/RequireAuth/RequireAuth.tsx
```

```tsx
import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/redux/hooks';

export const RequireAuth = () => {
  const status = useAppSelector(
    state => state.auth.status
  );

  if (status !== 'authenticated') {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};
```

`RequireAuth` защищает приватные страницы. Неавторизованный пользователь перенаправляется на `/login`.

## Шаг 7. Создать GuestOnly

Создать файл:

```text
src/components/GuestOnly/GuestOnly.tsx
```

```tsx
import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/redux/hooks';

export const GuestOnly = () => {
  const status = useAppSelector(
    state => state.auth.status
  );

  if (status === 'authenticated') {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};
```

`GuestOnly` не позволяет авторизованному пользователю снова открыть форму входа.

После успешного входа `AuthForm` вызывает `setCredentials`, статус меняется, и `GuestOnly` автоматически перенаправляет пользователя на `/`.

## Шаг 8. Создать LoginPage

Структура:

```text
src/pages/LoginPage/
├── LoginPage.tsx
└── LoginPage.module.scss
```

`LoginPage.tsx`:

```tsx
import { AuthForm } from '@/components/AuthForm/AuthForm';

import styles from './LoginPage.module.scss';

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <AuthForm />
    </main>
  );
}
```

`LoginPage.module.scss`:

```scss
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background-color: var(--backgroundGray);
}
```

Разделение ответственности:

```text
LoginPage
├── отвечает за всю страницу
├── задаёт фон
├── центрирует содержимое
└── размещает AuthForm

AuthForm
├── поля
├── валидация
├── отправка login
└── показ ошибок
```

Не следует добавлять фон страницы и `min-height: 100vh` в `AuthForm`: в будущем форма может использоваться в модальном окне или другом layout.

## Шаг 9. Создать WelcomePage

Структура:

```text
src/pages/WelcomePage/
├── WelcomePage.tsx
└── WelcomePage.module.scss
```

Пример `WelcomePage.tsx`:

```tsx
import { Typography } from 'antd';

import { useAppSelector } from '@/redux/hooks';

export default function WelcomePage() {
  const user = useAppSelector(
    state => state.auth.user
  );

  return (
    <div className="container">
      <Typography.Title level={1}>
        Добро пожаловать, {user?.name}!
      </Typography.Title>

      <Typography.Paragraph>
        Вы успешно вошли в систему.
      </Typography.Paragraph>
    </div>
  );
}
```

Для шаблона `WelcomePage` подходит как демонстрационная защищённая страница. В реальном проекте её можно заменить на `DashboardPage`.

## Шаг 10. Настроить маршруты

Пример `src/components/App.tsx`:

```tsx
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { GuestOnly } from './GuestOnly/GuestOnly';
import { Layout } from './Layout';
import { RequireAuth } from './RequireAuth/RequireAuth';

const LoginPage = lazy(
  () => import('@/pages/LoginPage/LoginPage')
);

const WelcomePage = lazy(
  () => import('@/pages/WelcomePage/WelcomePage')
);

const ProductPage = lazy(
  () => import('@/pages/ProductPage/ProductPage')
);

export const App = () => {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<WelcomePage />}
          />

          <Route
            path="/product"
            element={<ProductPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};
```

Результирующая структура:

```text
/login
└── GuestOnly
    └── LoginPage
        └── AuthForm

/
└── RequireAuth
    └── Layout
        ├── Header
        └── WelcomePage
```

Если локализованные URL `/ru`, `/cz`, `/ua` обязательны, эту структуру нужно вложить под `/:locale?`. Проще сначала проверить авторизацию на обычных маршрутах, а затем добавить сохранение locale при redirect.

## Шаг 11. Проверить успешный вход в AuthForm

Логика `handleSubmit`:

```tsx
const handleSubmit = async (
  values: CredentialsLogIn
) => {
  try {
    const credentials = await login(values).unwrap();

    dispatch(setCredentials(credentials));
    form.setFieldValue('password', '');

    void messageApi.success(
      `Добро пожаловать, ${credentials.user.name}!`
    );
  } catch (error) {
    void messageApi.error(getErrorMessage(error));
  }
};
```

После `dispatch(setCredentials(credentials))`:

1. `auth.status` становится `authenticated`.
2. `auth.user` получает профиль.
3. `GuestOnly` перерисовывается.
4. `GuestOnly` возвращает `<Navigate to="/" />`.
5. Открывается защищённая `WelcomePage`.

Вручную вызывать `navigate('/')` в форме при такой архитектуре необязательно.

## Шаг 12. Реализовать выход

Backend должен удалить refresh cookie по запросу:

```http
POST /auth/logout
```

Пример обработчика в Header:

```tsx
const dispatch = useAppDispatch();
const [logoutRequest, { isLoading }] =
  useLogoutMutation();

const handleLogout = async () => {
  try {
    await logoutRequest().unwrap();
  } finally {
    dispatch(logout());
  }
};
```

Кнопка:

```tsx
<Button
  loading={isLoading}
  onClick={handleLogout}
>
  Выйти
</Button>
```

После выхода желательно очистить RTK Query cache:

```tsx
const handleLogout = async () => {
  try {
    await logoutRequest().unwrap();
  } finally {
    dispatch(logout());
    dispatch(authApi.util.resetApiState());
    dispatch(userApi.util.resetApiState());
  }
};
```

Это не позволит следующему пользователю увидеть кешированные данные предыдущего пользователя.

## Шаг 13. Хранение токенов

Не сохранять пароль:

```ts
localStorage.setItem('password', password); // запрещено
```

Рекомендуемая архитектура:

- refresh token хранится в `HttpOnly` cookie;
- access token хранится в Redux-памяти;
- профиль пользователя хранится в `authSlice`;
- пароль существует только внутри формы до отправки запроса.

При перезагрузке страницы:

1. Redux очищается.
2. `AuthInitializer` вызывает `/auth/refresh`.
3. Браузер автоматически отправляет refresh cookie благодаря `credentials: 'include'`.
4. Backend возвращает новый access token и пользователя.
5. `authSlice` восстанавливается через `setCredentials`.

Access token не обязательно сохранять в `localStorage`.

## Требования к CORS на NestJS backend

В `src/main.ts` backend должен разрешать точный frontend origin и credentials:

```ts
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://адрес-production-фронтенда.cz',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

Нельзя совмещать:

```ts
origin: '*',
credentials: true,
```

Frontend использует:

```ts
credentials: 'include'
```

Поэтому backend должен отвечать заголовками:

```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

## Итоговая структура

```text
src/
├── components/
│   ├── AuthForm/
│   │   ├── AuthForm.tsx
│   │   └── AuthForm.module.scss
│   ├── AuthInitializer/
│   │   └── AuthInitializer.tsx
│   ├── GuestOnly/
│   │   └── GuestOnly.tsx
│   └── RequireAuth/
│       └── RequireAuth.tsx
├── pages/
│   ├── LoginPage/
│   │   ├── LoginPage.tsx
│   │   └── LoginPage.module.scss
│   └── WelcomePage/
│       ├── WelcomePage.tsx
│       └── WelcomePage.module.scss
└── redux/
    ├── api/
    │   └── authApi.ts
    └── slices/
        └── authSlice.ts
```

## Финальная проверка

После реализации проверить сценарии:

- [ ] Без refresh cookie открывается `/login`.
- [ ] Во время начальной проверки показывается loader.
- [ ] Неверный пароль показывает toast и не авторизует пользователя.
- [ ] Успешный login сохраняет профиль и открывает `/`.
- [ ] Авторизованный пользователь не может открыть `/login`.
- [ ] Неавторизованный пользователь не может открыть защищённые страницы.
- [ ] После перезагрузки страницы сессия восстанавливается через refresh cookie.
- [ ] Logout очищает cookie, authSlice и RTK Query cache.
- [ ] После logout пользователь попадает на `/login`.
- [ ] `npm run typecheck` проходит успешно.
- [ ] `npm run build` проходит успешно.
