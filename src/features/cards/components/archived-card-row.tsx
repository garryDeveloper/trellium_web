import { ActionIcon, Group, Stack, Text, Tooltip } from '@mantine/core'
import { IconRestore, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useUnarchiveCard } from '../hooks/use-unarchive-card'
import { useDeleteCard } from '../hooks/use-delete-card'
import { DeleteCardConfirmModal } from './delete-card-confirm-modal'
import type { ArchivedCardWithListName } from '../hooks/use-board-archived-cards'

interface ArchivedCardRowProps {
  card: ArchivedCardWithListName
}

export function ArchivedCardRow({ card }: ArchivedCardRowProps) {
  const unarchiveMutation = useUnarchiveCard(card.listId)
  const deleteMutation = useDeleteCard(card.listId)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <>
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={0} style={{ minWidth: 0 }}>
          <Text size="sm" fw={500} truncate>
            {card.title}
          </Text>
          <Text size="xs" c="dimmed" truncate>
            {card.listName}
          </Text>
        </Stack>
        <Group gap="xs" wrap="nowrap">
          <Tooltip label="Restaurar">
            <ActionIcon
              variant="subtle"
              color="primary"
              size="sm"
              loading={unarchiveMutation.isPending}
              onClick={() => unarchiveMutation.mutate(card.id)}
              aria-label={`Restaurar ${card.title}`}
            >
              <IconRestore size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Eliminar definitivamente">
            <ActionIcon
              variant="subtle"
              color="danger"
              size="sm"
              onClick={() => setConfirmingDelete(true)}
              aria-label={`Eliminar ${card.title} definitivamente`}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {confirmingDelete && (
        <DeleteCardConfirmModal
          card={card}
          opened={confirmingDelete}
          onClose={() => setConfirmingDelete(false)}
          onConfirm={() =>
            deleteMutation.mutate(card.id, {
              onSuccess: () => setConfirmingDelete(false),
            })
          }
          isPending={deleteMutation.isPending}
        />
      )}
    </>
  )
}
