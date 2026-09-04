import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, Button, Group, Stack, Textarea } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/features/auth/store/auth.store'
import {
  commentBodySchema,
  type CommentBodyFormValues,
} from '../schemas/comment-body.schema'

interface CommentComposerProps {
  isPending: boolean
  onPublish: (body: string) => void
}

/**
 * Siempre visible al pie del hilo: comentar es la acción más frecuente del
 * detalle, y esconderla detrás de un "Agregar comentario" agrega un clic a cada
 * intervención.
 */
export function CommentComposer({
  isPending,
  onPublish,
}: CommentComposerProps) {
  const user = useAuthStore((state) => state.user)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentBodyFormValues>({
    resolver: zodResolver(commentBodySchema),
    defaultValues: { body: '' },
  })

  const onSubmit = (values: CommentBodyFormValues) => {
    onPublish(values.body)
    reset({ body: '' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Group gap="sm" align="flex-start" wrap="nowrap">
        {user && (
          <Avatar name={user.name} color="initials" radius="xl" size="sm" />
        )}
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Textarea
            size="sm"
            autosize
            minRows={2}
            maxRows={8}
            placeholder="Escribí un comentario..."
            error={errors.body?.message}
            aria-label="Nuevo comentario"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void handleSubmit(onSubmit)()
              }
            }}
            {...register('body')}
          />
          <Group justify="flex-end">
            <Button type="submit" size="xs" loading={isPending}>
              Comentar
            </Button>
          </Group>
        </Stack>
      </Group>
    </form>
  )
}
