import { zodResolver } from '@hookform/resolvers/zod'
import { ActionIcon, Group, Textarea, UnstyledButton } from '@mantine/core'
import { IconPlus, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateCard } from '../hooks/use-create-card'
import {
  cardTitleSchema,
  type CardTitleFormValues,
} from '../schemas/card-title.schema'
import classes from './create-card-inline-form.module.css'

interface CreateCardInlineFormProps {
  listId: string
}

export function CreateCardInlineForm({ listId }: CreateCardInlineFormProps) {
  const [creating, setCreating] = useState(false)
  const createCardMutation = useCreateCard(listId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardTitleFormValues>({ resolver: zodResolver(cardTitleSchema) })

  const close = () => {
    reset()
    setCreating(false)
  }

  const onSubmit = (values: CardTitleFormValues) => {
    createCardMutation.mutate(values.title, {
      onSuccess: () => reset(),
    })
  }

  if (!creating) {
    return (
      <UnstyledButton onClick={() => setCreating(true)} className={classes.trigger}>
        <IconPlus size={16} />
        <span>Agregar tarjeta</span>
      </UnstyledButton>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Textarea
        autoFocus
        size="sm"
        placeholder="Título de la tarjeta"
        autosize
        minRows={1}
        maxRows={4}
        error={errors.title?.message}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            close()
          }
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            void handleSubmit(onSubmit)()
          }
        }}
        {...register('title')}
      />
      <Group gap="xs" mt="xs">
        <ActionIcon
          type="submit"
          variant="filled"
          loading={createCardMutation.isPending}
          aria-label="Agregar tarjeta"
        >
          <IconPlus size={16} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={close}
          aria-label="Cancelar"
        >
          <IconX size={16} />
        </ActionIcon>
      </Group>
    </form>
  )
}
