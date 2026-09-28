import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Button, Card, Form, Input, Typography, message } from 'antd';

import styles from './AuthForm.module.scss';
import { useLoginMutation } from '@/redux/api/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import type { CredentialsLogIn, IErrorResponse } from '@/types';

const getErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'Не удалось выполнить вход. Попробуйте ещё раз.';
  }

  if ('status' in error) {
    const queryError = error as FetchBaseQueryError;

    if (queryError.status === 401) {
      return 'Неверный email или пароль.';
    }

    if (queryError.status === 'FETCH_ERROR') {
      return 'Сервер недоступен. Проверьте подключение к интернету.';
    }

    if (queryError.data && typeof queryError.data === 'object') {
      const response = queryError.data as IErrorResponse;

      if (Array.isArray(response.message)) {
        return response.message.join('. ');
      }

      if (response.message) {
        return response.message;
      }
    }
  }

  return 'Не удалось выполнить вход. Попробуйте ещё раз.';
};

export const AuthForm = () => {
  const [form] = Form.useForm<CredentialsLogIn>();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

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

  return (
    <Card
      className={styles.card}
      title="Вход в аккаунт"
    >
      {contextHolder}

      <Typography.Paragraph type="secondary">
        Введите email и пароль, указанные при регистрации.
      </Typography.Paragraph>

      <Form<CredentialsLogIn>
        form={form}
        layout="vertical"
        name="auth"
        requiredMark="optional"
        autoComplete="on"
        onFinish={handleSubmit}
      >
        <Form.Item<CredentialsLogIn>
          label="Email"
          name="email"
          extra="Например: user@example.com"
          validateTrigger={['onBlur', 'onSubmit']}
          rules={[
            {
              required: true,
              message: 'Введите email.',
            },
            {
              type: 'email',
              message: 'Введите корректный email.',
            },
          ]}
        >
          <Input
            type="email"
            placeholder="user@example.com"
            autoComplete="email"
            allowClear
          />
        </Form.Item>

        <Form.Item<CredentialsLogIn>
          label="Пароль"
          name="password"
          extra="Минимум 8 символов."
          validateTrigger={['onBlur', 'onSubmit']}
          rules={[
            {
              required: true,
              message: 'Введите пароль.',
            },
            {
              min: 8,
              message: 'Пароль должен содержать минимум 8 символов.',
            },
            {
              max: 128,
              message: 'Пароль не должен превышать 128 символов.',
            },
          ]}
        >
          <Input.Password
            placeholder="Введите пароль"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item noStyle>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
            block
          >
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
