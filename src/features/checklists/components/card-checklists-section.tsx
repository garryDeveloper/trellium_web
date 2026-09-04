import { Loader, Stack, Text } from '@mantine/core'
import { ChecklistBlock } from './checklist-block'
import { CreateChecklistInlineForm } from './create-checklist-inline-form'
import { useCardChecklists } from '../hooks/use-card-checklists'
import { useCreateChecklist } from '../hooks/use-create-checklist'

interface CardChecklistsSectionProps {
  cardId: string
  listId: string
}

export function CardChecklistsSection({
  cardId,
  listId,
}: CardChecklistsSectionProps) {
  const checklistsQuery = useCardChecklists(cardId)
  const createMutation = useCreateChecklist(cardId)
  const checklists = checklistsQuery.data ?? []

  return (
    <Stack gap="md">
      <Text size="sm" fw={500}>
        Checklists
      </Text>

      {checklistsQuery.isLoading && <Loader size="xs" />}

      {!checklistsQuery.isLoading && checklists.length === 0 && (
        <Text size="sm" c="dimmed">
          Dividí esta tarjeta en sub-tareas verificables.
        </Text>
      )}

      {checklists.map((checklist) => (
        <ChecklistBlock
          key={checklist.id}
          checklist={checklist}
          cardId={cardId}
          listId={listId}
        />
      ))}

      <CreateChecklistInlineForm
        isPending={createMutation.isPending}
        onCreate={(name) => createMutation.mutate({ cardId, name })}
      />
    </Stack>
  )
}
