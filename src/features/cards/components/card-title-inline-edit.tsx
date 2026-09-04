import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, Title, UnstyledButton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Card } from '../types'
import { useUpdateCard } from '../hooks/use-update-card'
import { cardTitleSchema, type CardTitleFormValues } from '../schemas/card-title.schema'
import classes from './card-title-inline-edit.module.css'

interface CardTitleInlineEditProps {
  card: Card
}

export function CardTitleInlineEdit({ card }: CardTitleInlineEditProps) {
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
      <UnstyledButton
        onClick={() => setEditing(true)}
        aria-label="Editar título de la tarjeta"
        className={classes.trigger}
      >
        {/* Vive en la barra fija del panel, así que un título largo se recorta
            en vez de empujar al botón de cerrar. El texto completo queda en el
            `title` nativo. */}
        <Title order={4} className={classes.title} title={card.title}>
          {card.title}
        </Title>
      </UnstyledButton>
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
      className={classes.form}
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
      noValidate
    >
      <TextInput
        autoFocus
        size="sm"
        error={errors.title?.message}
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
