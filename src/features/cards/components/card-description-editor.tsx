import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Text, Textarea, UnstyledButton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Card } from '../types'
import { useUpdateCard } from '../hooks/use-update-card'
import {
  cardDescriptionSchema,
  type CardDescriptionFormValues,
} from '../schemas/card-description.schema'

interface CardDescriptionEditorProps {
  card: Card
}

export function CardDescriptionEditor({ card }: CardDescriptionEditorProps) {
  const [editing, setEditing] = useState(false)
  const updateMutation = useUpdateCard(card.listId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardDescriptionFormValues>({
    resolver: zodResolver(cardDescriptionSchema),
    defaultValues: { description: card.description ?? '' },
  })

  useEffect(() => {
    reset({ description: card.description ?? '' })
  }, [card.description, reset])

  const submit = handleSubmit((values) => {
    const nextDescription = values.description.trim()
    const current = card.description ?? ''
    if (nextDescription === current) {
      setEditing(false)
      return
    }
    updateMutation.mutate(
      { cardId: card.id, description: nextDescription.length > 0 ? nextDescription : null },
      { onSuccess: () => setEditing(false) },
    )
  })

  if (!editing) {
    return (
      <Stack gap={4}>
        <Text size="sm" fw={500}>
          Descripción
        </Text>
        <UnstyledButton
          onClick={() => setEditing(true)}
          aria-label="Editar descripción de la tarjeta"
          style={{ cursor: 'text', textAlign: 'left' }}
        >
          {card.description ? (
            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
              {card.description}
            </Text>
          ) : (
            <Text size="sm" c="dimmed">
              Agregar una descripción más detallada...
            </Text>
          )}
        </UnstyledButton>
      </Stack>
    )
  }

  const { onBlur: onFieldBlur, ...descriptionField } = register('description')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
      noValidate
    >
      <Stack gap={4}>
        <Text size="sm" fw={500}>
          Descripción
        </Text>
        <Textarea
          autoFocus
          autosize
          minRows={3}
          maxRows={12}
          /* Se guarda al salir del campo: sin esto, pasarse del límite
             descartaría la edición en silencio. */
          error={errors.description?.message}
          onBlur={(event) => {
            void onFieldBlur(event)
            void submit()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              reset({ description: card.description ?? '' })
              setEditing(false)
            }
          }}
          {...descriptionField}
        />
      </Stack>
    </form>
  )
}
