import { zodResolver } from '@hookform/resolvers/zod'
import { ActionIcon, Group, TextInput, UnstyledButton } from '@mantine/core'
import { IconPlus, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateList } from '../hooks/use-create-list'
import { listNameSchema, type ListNameFormValues } from '../schemas/list-name.schema'
import classes from './create-list-inline-form.module.css'

interface CreateListInlineFormProps {
  boardId: string
}

export function CreateListInlineForm({ boardId }: CreateListInlineFormProps) {
  const [creating, setCreating] = useState(false)
  const createListMutation = useCreateList(boardId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ListNameFormValues>({ resolver: zodResolver(listNameSchema) })

  const close = () => {
    reset()
    setCreating(false)
  }

  const onSubmit = (values: ListNameFormValues) => {
    createListMutation.mutate(values.name, {
      onSuccess: () => reset(),
    })
  }

  if (!creating) {
    return (
      <UnstyledButton onClick={() => setCreating(true)} className={classes.ghost}>
        <IconPlus size={16} />
        <span>Agregar lista</span>
      </UnstyledButton>
    )
  }

  return (
    <div className={classes.form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Group gap="xs" align="flex-start" wrap="nowrap">
          <TextInput
            autoFocus
            size="sm"
            placeholder="Nombre de la lista"
            error={errors.name?.message}
            style={{ flex: 1 }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') close()
            }}
            {...register('name')}
          />
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={close}
            aria-label="Cancelar"
          >
            <IconX size={16} />
          </ActionIcon>
        </Group>
        <Group gap="xs" mt="xs">
          <ActionIcon
            type="submit"
            variant="filled"
            loading={createListMutation.isPending}
            aria-label="Agregar lista"
          >
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      </form>
    </div>
  )
}
