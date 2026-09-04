import { ActionIcon, Divider, Group, Popover, Stack, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { CreateLabelInlineForm } from '@/features/labels/components/create-label-inline-form'
import { LabelChip } from '@/features/labels/components/label-chip'
import { LabelManageRow } from '@/features/labels/components/label-manage-row'
import type { Label } from '@/features/labels/types'
import { useCreateLabel } from '@/features/labels/hooks/use-create-label'
import { useUpdateLabel } from '@/features/labels/hooks/use-update-label'
import { useDeleteLabel } from '@/features/labels/hooks/use-delete-label'
import { useApplyLabel } from '../hooks/use-apply-label'
import { useRemoveLabel } from '../hooks/use-remove-label'
import type { Card } from '../types'

interface CardLabelsSectionProps {
  card: Card
  boardId: string
  boardLabels: Label[]
}

export function CardLabelsSection({
  card,
  boardId,
  boardLabels,
}: CardLabelsSectionProps) {
  const applyMutation = useApplyLabel(card.listId)
  const removeMutation = useRemoveLabel(card.listId)
  const createMutation = useCreateLabel(boardId)
  const updateMutation = useUpdateLabel(boardId)
  const deleteMutation = useDeleteLabel(boardId)

  const appliedIds = new Set(card.labels.map((label) => label.id))

  const toggle = (label: Label) => {
    if (appliedIds.has(label.id)) {
      removeMutation.mutate({ cardId: card.id, labelId: label.id })
    } else {
      applyMutation.mutate({ cardId: card.id, labelId: label.id })
    }
  }

  return (
    <Stack gap="xs">
      <Group gap={6}>
        {card.labels.map((label) => (
          <LabelChip
            key={label.id}
            label={label}
            isRemoving={
              removeMutation.isPending &&
              removeMutation.variables?.labelId === label.id
            }
            onRemove={() =>
              removeMutation.mutate({ cardId: card.id, labelId: label.id })
            }
          />
        ))}

        <Popover position="bottom-start" withinPortal shadow="md">
          <Popover.Target>
            <ActionIcon
              variant="default"
              size="sm"
              aria-label="Aplicar o crear etiquetas"
            >
              <IconPlus size={14} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown w={260}>
            <Stack gap="sm">
              <Text size="xs" fw={500} c="dimmed">
                Etiquetas del tablero
              </Text>

              {boardLabels.length === 0 && (
                <Text size="xs" c="dimmed">
                  Todavía no hay etiquetas en este tablero.
                </Text>
              )}

              <Stack gap={6}>
                {boardLabels.map((label) => (
                  <LabelManageRow
                    key={label.id}
                    label={label}
                    applied={appliedIds.has(label.id)}
                    onToggleApply={() => toggle(label)}
                    isToggling={
                      (applyMutation.isPending &&
                        applyMutation.variables?.labelId === label.id) ||
                      (removeMutation.isPending &&
                        removeMutation.variables?.labelId === label.id)
                    }
                    onRename={(name) =>
                      updateMutation.mutate({ labelId: label.id, name })
                    }
                    onRecolor={(color) =>
                      updateMutation.mutate({ labelId: label.id, color })
                    }
                    onDelete={() => deleteMutation.mutate(label.id)}
                    isDeleting={
                      deleteMutation.isPending &&
                      deleteMutation.variables === label.id
                    }
                  />
                ))}
              </Stack>

              <Divider />

              <CreateLabelInlineForm
                isPending={createMutation.isPending}
                onCreate={(values) =>
                  createMutation.mutate(
                    { boardId, name: values.name, color: values.color },
                    {
                      onSuccess: (label) =>
                        applyMutation.mutate({ cardId: card.id, labelId: label.id }),
                    },
                  )
                }
              />
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Group>
    </Stack>
  )
}
