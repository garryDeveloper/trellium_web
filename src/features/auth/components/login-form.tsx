import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { getApiErrorMessage } from '@/shared/api/error'
import { useLogin } from '../hooks/use-login'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })
  const loginMutation = useLogin()

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="md">
        {loginMutation.isError && (
          <Alert
            color="danger"
            variant="light"
            icon={<IconAlertCircle size={18} />}
          >
            {getApiErrorMessage(loginMutation.error)}
          </Alert>
        )}

        <TextInput
          label="Email"
          placeholder="vos@ejemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Contraseña"
          placeholder="Tu contraseña"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" loading={loginMutation.isPending} fullWidth>
          Iniciar sesión
        </Button>
      </Stack>
    </form>
  )
}
