import { zodResolver } from '@hookform/resolvers/zod'
import { Text, TextInput, UnstyledButton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { List } from '../types'
import { useRenameList } from '../hooks/use-rename-list'
import {
  listNameSchema,
  type ListNameFormValues,
} from '../schemas/list-name.schema'

interface ListNameInlineEditProps {
  list: List
}

export function ListNameInlineEdit({ list }: ListNameInlineEditProps) {
  const [editing, setEditing] = useState(false)
  const renameMutation = useRenameList(list.boardId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ListNameFormValues>({
    resolver: zodResolver(listNameSchema),
    defaultValues: { name: list.name },
  })

  useEffect(() => {
    reset({ name: list.name })
  }, [list.name, reset])

  if (!editing) {
    return (
      <UnstyledButton
        onClick={() => setEditing(true)}
        aria-label="Editar nombre de la lista"
        style={{ cursor: 'text', minWidth: 0 }}
      >
        <Text fw={600} size="lg" truncate>
          {list.name}
        </Text>
      </UnstyledButton>
    )
  }

  const { onBlur: onFieldBlur, ...nameField } = register('name')

  const submit = handleSubmit((values) => {
    if (values.name === list.name) {
      setEditing(false)
      return
    }
    renameMutation.mutate(
      { listId: list.id, name: values.name },
      { onSuccess: () => setEditing(false) },
    )
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
      noValidate
      style={{ minWidth: 0, flex: 1 }}
    >
      <TextInput
        autoFocus
        size="sm"
        error={errors.name?.message}
        onBlur={(event) => {
          void onFieldBlur(event)
          void submit()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            reset({ name: list.name })
            setEditing(false)
          }
        }}
        {...nameField}
      />
    </form>
  )
}
