'use client';

import { chakra } from '@chakra-ui/react';

import { toaster } from '@/components/ui/toaster';
import { loginSchema } from '@/dtos/auth.dto';
import { useAuth } from '@/providers/auth.provider';

const LoginPage = () => {
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { success, data, error } = loginSchema.safeParse({ email, password });

    if (!success) {
      toaster.create({
        title: 'Error',
        description: error.message,
        type: 'error',
        closable: true,
        duration: 120_000,
      });
      return;
    }

    toaster.create({
      title: 'Success',
      description: 'Login successful',
      type: 'success',
    });

    await login(data);
  };

  return (
    <chakra.form onSubmit={handleSubmit}>
      <chakra.input name="email" placeholder="Email" />
      <chakra.input name="password" placeholder="Password" />
      <chakra.button type="submit">Login</chakra.button>
    </chakra.form>
  );
};

export default LoginPage;
