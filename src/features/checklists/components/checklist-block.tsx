import {
  ActionIcon,
  Checkbox,
  Group,
  Progress,
  Stack,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import { AddChecklistItemInlineForm } from './add-checklist-item-inline-form'
import { DeleteChecklistConfirmModal } from './delete-checklist-confirm-modal'
import { useAddChecklistItem } from '../hooks/use-add-checklist-item'
import { useToggleChecklistItem } from '../hooks/use-toggle-checklist-item'
import { useDeleteChecklistItem } from '../hooks/use-delete-checklist-item'
import { useDeleteChecklist } from '../hooks/use-delete-checklist'
import type { Checklist } from '../types'
import classes from './checklist-block.module.css'

interface ChecklistBlockProps {
  checklist: Checklist
  cardId: string
  listId: string
}

export function ChecklistBlock({
  checklist,
  cardId,
  listId,
}: ChecklistBlockProps) {
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false)
  const addItemMutation = useAddChecklistItem(cardId, listId)
  const toggleMutation = useToggleChecklistItem(cardId, listId)
  const deleteItemMutation = useDeleteChecklistItem(cardId, listId)
  const deleteChecklistMutation = useDeleteChecklist(cardId, listId)

  const total = checklist.items.length
  const completed = checklist.items.filter((item) => item.completed).length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <Stack gap="xs">
      <div className={classes.header}>
        <Text size="sm" fw={500}>
          {checklist.name}
        </Text>
        {total > 0 && (
          <Text size="xs" c="dimmed">
            {completed}/{total}
          </Text>
        )}
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          className={classes.headerActions}
          aria-label={`Eliminar checklist ${checklist.name}`}
          onClick={openConfirm}
        >
          <IconTrash size={14} />
        </ActionIcon>
      </div>

      {total > 0 && (
        <Progress
          value={percent}
          size="sm"
          color={percent === 100 ? 'success' : 'primary'}
          aria-label={`Progreso de ${checklist.name}: ${completed} de ${total}`}
        />
      )}

      {total === 0 ? (
        <Text size="xs" c="dimmed">
          Esta checklist todavía no tiene ítems.
        </Text>
      ) : (
        <Stack gap={2}>
          {checklist.items.map((item) => (
            <div key={item.id} className={classes.item}>
              <Checkbox
                size="xs"
                checked={item.completed}
                label={item.text}
                classNames={{
                  body: classes.itemLabel,
                  label: item.completed ? classes.itemDone : undefined,
                }}
                onChange={(event) =>
                  toggleMutation.mutate({
                    itemId: item.id,
                    completed: event.currentTarget.checked,
                  })
                }
              />
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                className={classes.itemRemove}
                aria-label={`Eliminar ítem ${item.text}`}
                loading={
                  deleteItemMutation.isPending &&
                  deleteItemMutation.variables === item.id
                }
                onClick={() => deleteItemMutation.mutate(item.id)}
              >
                <IconTrash size={14} />
              </ActionIcon>
            </div>
          ))}
        </Stack>
      )}

      <Group>
        <AddChecklistItemInlineForm
          checklistName={checklist.name}
          isPending={
            addItemMutation.isPending &&
            addItemMutation.variables?.checklistId === checklist.id
          }
          onAdd={(text) =>
            addItemMutation.mutate({ checklistId: checklist.id, text })
          }
        />
      </Group>

      <DeleteChecklistConfirmModal
        checklist={checklist}
        opened={confirmOpened}
        onClose={closeConfirm}
        onConfirm={() =>
          deleteChecklistMutation.mutate(checklist.id, {
            onSuccess: closeConfirm,
          })
        }
        isPending={deleteChecklistMutation.isPending}
      />
    </Stack>
  )
}
