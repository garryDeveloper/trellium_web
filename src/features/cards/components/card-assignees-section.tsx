import { ActionIcon, Avatar, Group, Select, Stack, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { useState } from 'react'
import type { BoardMember } from '@/features/boards/types'
import { useAssignMember } from '../hooks/use-assign-member'
import { useUnassignMember } from '../hooks/use-unassign-member'
import type { Card } from '../types'

interface CardAssigneesSectionProps {
  card: Card
  boardMembers: BoardMember[]
}

export function CardAssigneesSection({
  card,
  boardMembers,
}: CardAssigneesSectionProps) {
  const assignMutation = useAssignMember(card.listId)
  const unassignMutation = useUnassignMember(card.listId)
  const [selectValue, setSelectValue] = useState<string | null>(null)

  const assignedIds = new Set(card.assignees.map((assignee) => assignee.id))
  const availableMembers = boardMembers.filter(
    (member) => !assignedIds.has(member.userId),
  )

  return (
    <Stack gap="xs">
      {card.assignees.length > 0 && (
        <Stack gap={6}>
          {card.assignees.map((assignee) => (
            <Group key={assignee.id} justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                <Avatar name={assignee.name} color="initials" radius="xl" size="sm" />
                <Text size="sm" truncate>
                  {assignee.name}
                </Text>
              </Group>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                aria-label={`Desasignar a ${assignee.name}`}
                loading={
                  unassignMutation.isPending &&
                  unassignMutation.variables?.userId === assignee.id
                }
                onClick={() =>
                  unassignMutation.mutate({ cardId: card.id, userId: assignee.id })
                }
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}

      {availableMembers.length > 0 && (
        <Select
          placeholder="Asignar un miembro..."
          size="sm"
          searchable
          value={selectValue}
          data={availableMembers.map((member) => ({
            value: member.userId,
            label: member.name,
          }))}
          onChange={(userId) => {
            if (!userId) return
            assignMutation.mutate(
              { cardId: card.id, userId },
              { onSuccess: () => setSelectValue(null) },
            )
          }}
        />
      )}
    </Stack>
  )
}
