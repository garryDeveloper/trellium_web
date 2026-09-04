import { zodResolver } from '@hookform/resolvers/zod'
import { Title, TextInput, UnstyledButton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Board } from '../types'
import { useRenameBoard } from '../hooks/use-rename-board'
import {
  boardNameSchema,
  type BoardNameFormValues,
} from '../schemas/board-name.schema'

interface BoardNameInlineEditProps {
  board: Board
  editable: boolean
}

export function BoardNameInlineEdit({
  board,
  editable,
}: BoardNameInlineEditProps) {
  const [editing, setEditing] = useState(false)
  const renameMutation = useRenameBoard()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoardNameFormValues>({
    resolver: zodResolver(boardNameSchema),
    defaultValues: { name: board.name },
  })

  useEffect(() => {
    reset({ name: board.name })
  }, [board.name, reset])

  if (!editing) {
    return (
      <UnstyledButton
        onClick={() => editable && setEditing(true)}
        aria-label={editable ? 'Editar nombre del tablero' : undefined}
        style={{ cursor: editable ? 'text' : 'default' }}
      >
        <Title order={1} size="h3" lineClamp={1}>
          {board.name}
        </Title>
      </UnstyledButton>
    )
  }

  const { onBlur: onFieldBlur, ...nameField } = register('name')

  const submit = handleSubmit((values) => {
    if (values.name === board.name) {
      setEditing(false)
      return
    }
    renameMutation.mutate(
      { boardId: board.id, name: values.name },
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
    >
      <TextInput
        autoFocus
        size="md"
        w={320}
        error={errors.name?.message}
        onBlur={(event) => {
          void onFieldBlur(event)
          void submit()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            reset({ name: board.name })
            setEditing(false)
          }
        }}
        {...nameField}
      />
    </form>
  )
}
