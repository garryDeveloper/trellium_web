import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Modal, NumberInput, Select, Stack } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import type { List } from '@/features/lists/types'
import { useMoveCard } from '../hooks/use-move-card'
import type { Card } from '../types'

const moveCardSchema = z.object({
  listId: z.string().min(1, 'Elegí una lista'),
  position: z.number().int().min(1),
})

type MoveCardFormValues = z.infer<typeof moveCardSchema>

interface MoveCardModalProps {
  card: Card
  lists: List[]
  cardsByList: Record<string, Card[]>
  opened: boolean
  onClose: () => void
}

export function MoveCardModal({
  card,
  lists,
  cardsByList,
  opened,
  onClose,
}: MoveCardModalProps) {
  const moveMutation = useMoveCard()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MoveCardFormValues>({
    resolver: zodResolver(moveCardSchema),
    defaultValues: { listId: card.listId, position: card.position },
  })

  useEffect(() => {
    if (opened) {
      reset({ listId: card.listId, position: card.position })
    }
  }, [opened, card.listId, card.position, reset])

  const selectedListId = watch('listId')
  const destinationCount = cardsByList[selectedListId]?.length ?? 0
  const maxPosition =
    selectedListId === card.listId ? destinationCount : destinationCount + 1

  const onSubmit = (values: MoveCardFormValues) => {
    moveMutation.mutate(
      {
        cardId: card.id,
        fromListId: card.listId,
        listId: values.listId,
        position: values.position,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Mover tarjeta" centered>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="md">
          <Controller
            name="listId"
            control={control}
            render={({ field }) => (
              <Select
                label="Lista"
                data={lists.map((list) => ({ value: list.id, label: list.name }))}
                error={errors.listId?.message}
                allowDeselect={false}
                value={field.value}
                onChange={(value) => field.onChange(value ?? card.listId)}
              />
            )}
          />

          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Posición"
                min={1}
                max={Math.max(maxPosition, 1)}
                error={errors.position?.message}
                value={field.value}
                onChange={(value) => field.onChange(Number(value) || 1)}
              />
            )}
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={moveMutation.isPending}>
              Mover
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
