import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, TextInput } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { getApiErrorMessage } from '@/shared/api/error'
import { useInviteMember } from '../hooks/use-invite-member'
import {
  inviteMemberSchema,
  type InviteMemberFormValues,
} from '../schemas/invite-member.schema'

interface InviteMemberFormProps {
  boardId: string
}

export function InviteMemberForm({ boardId }: InviteMemberFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
  })
  const inviteMemberMutation = useInviteMember()

  const onSubmit = (values: InviteMemberFormValues) => {
    inviteMemberMutation.mutate(
      { boardId, email: values.email },
      { onSuccess: () => reset() },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Group align="flex-start" gap="xs" wrap="nowrap">
        <TextInput
          placeholder="email@ejemplo.com"
          style={{ flex: 1 }}
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" loading={inviteMemberMutation.isPending}>
          Invitar
        </Button>
      </Group>
      {inviteMemberMutation.isError && (
        <Alert
          mt="xs"
          color="danger"
          variant="light"
          icon={<IconAlertCircle size={18} />}
        >
          {getApiErrorMessage(inviteMemberMutation.error)}
        </Alert>
      )}
    </form>
  )
}
