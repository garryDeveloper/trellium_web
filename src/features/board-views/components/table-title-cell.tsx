import { zodResolver } from '@hookform/resolvers/zod'
import { ActionIcon, TextInput } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUpdateCard } from '@/features/cards/hooks/use-update-card'
import {
  cardTitleSchema,
  type CardTitleFormValues,
} from '@/features/cards/schemas/card-title.schema'
import type { Card } from '@/features/cards/types'
import classes from './board-table-view.module.css'

interface TableTitleCellProps {
  card: Card
}

/**
 * El título se edita en la fila (T12.1), pero el clic sobre el texto sigue
 * abriendo la tarjeta: en una tabla de muchas filas, entrar en modo edición
 * por accidente al querer abrir el detalle es peor que un lápiz de más. Por eso
 * la edición tiene su propio disparador, que aparece con el hover de la fila.
 */
export function TableTitleCell({ card }: TableTitleCellProps) {
  const [editing, setEditing] = useState(false)
  const updateMutation = useUpdateCard(card.listId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardTitleFormValues>({
    resolver: zodResolver(cardTitleSchema),
    defaultValues: { title: card.title },
  })

  useEffect(() => {
    reset({ title: card.title })
  }, [card.title, reset])

  if (!editing) {
    return (
      <div className={classes.titleCell}>
        <span className={classes.title} title={card.title}>
          {card.title}
        </span>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          className={classes.rowAction}
          aria-label={`Editar título de ${card.title}`}
          onClick={(event) => {
            event.stopPropagation()
            setEditing(true)
          }}
        >
          <IconPencil size={14} />
        </ActionIcon>
      </div>
    )
  }

  const { onBlur: onFieldBlur, ...titleField } = register('title')

  const submit = handleSubmit((values) => {
    if (values.title === card.title) {
      setEditing(false)
      return
    }
    updateMutation.mutate(
      { cardId: card.id, title: values.title },
      { onSuccess: () => setEditing(false) },
    )
  })

  return (
    <form
      onClick={(event) => event.stopPropagation()}
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
      noValidate
    >
      <TextInput
        autoFocus
        size="xs"
        error={errors.title?.message}
        aria-label={`Título de ${card.title}`}
        onBlur={(event) => {
          void onFieldBlur(event)
          void submit()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            reset({ title: card.title })
            setEditing(false)
          }
        }}
        {...titleField}
      />
    </form>
  )
}
