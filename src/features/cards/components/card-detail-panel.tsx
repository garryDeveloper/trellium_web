import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Divider,
  Drawer,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconArchive, IconRestore, IconX } from '@tabler/icons-react'
import { useBoardMembers } from '@/features/boards/hooks/use-board-members'
import { useBoardLabels } from '@/features/labels/hooks/use-board-labels'
import { CardChecklistsSection } from '@/features/checklists/components/card-checklists-section'
import { CardActivitySection } from '@/features/activity/components/card-activity-section'
import { CardAttachmentsSection } from '@/features/attachments/components/card-attachments-section'
import { CardTitleInlineEdit } from './card-title-inline-edit'
import { CardDescriptionEditor } from './card-description-editor'
import { CardAssigneesSection } from './card-assignees-section'
import { CardLabelsSection } from './card-labels-section'
import { CardDueDateEditor } from './card-due-date-editor'
import { CardPropertyRow } from './card-property-row'
import { useArchiveCard } from '../hooks/use-archive-card'
import { useUnarchiveCard } from '../hooks/use-unarchive-card'
import type { Card } from '../types'
import classes from './card-detail-panel.module.css'

interface CardDetailPanelProps {
  card: Card | undefined
  boardId: string
  isLoading: boolean
  opened: boolean
  onClose: () => void
}

export function CardDetailPanel({
  card,
  boardId,
  isLoading,
  opened,
  onClose,
}: CardDetailPanelProps) {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const membersQuery = useBoardMembers(opened ? boardId : undefined)
  const labelsQuery = useBoardLabels(opened ? boardId : undefined)
  const archiveMutation = useArchiveCard(card?.listId ?? '')
  const unarchiveMutation = useUnarchiveCard(card?.listId ?? '')

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={isMobile ? '100%' : 720}
      padding={0}
      withCloseButton={false}
      classNames={{ body: classes.body }}
      aria-label="Detalle de tarjeta"
    >
      <div className={classes.header}>
        <div className={classes.headerMain}>
          {card && <CardTitleInlineEdit card={card} />}
          {card?.status === 'archived' && (
            <Badge color="gray" variant="light" size="sm" flex="0 0 auto">
              Archivada
            </Badge>
          )}
        </div>
        <ActionIcon
          variant="subtle"
          color="gray"
          className={classes.headerClose}
          onClick={onClose}
          aria-label="Cerrar detalle de tarjeta"
        >
          <IconX size={18} />
        </ActionIcon>
      </div>

      <div className={classes.scroll}>
        {isLoading && (
          <Center py="xl">
            <Loader />
          </Center>
        )}

        {!isLoading && !card && (
          <Text c="dimmed" size="md">
            No encontramos esta tarjeta. Puede que haya sido eliminada.
          </Text>
        )}

        {card && (
          <Stack gap="xl">
            <div className={classes.properties}>
              <CardPropertyRow label="Responsables">
                <CardAssigneesSection
                  card={card}
                  boardMembers={membersQuery.data ?? []}
                />
              </CardPropertyRow>

              <CardPropertyRow label="Etiquetas">
                <CardLabelsSection
                  card={card}
                  boardId={boardId}
                  boardLabels={labelsQuery.data ?? []}
                />
              </CardPropertyRow>

              <CardPropertyRow label="Vencimiento">
                <CardDueDateEditor card={card} />
              </CardPropertyRow>
            </div>

            <Divider />

            <div className={classes.reading}>
              <CardDescriptionEditor card={card} />
            </div>

            <Divider />

            <div className={classes.reading}>
              <CardChecklistsSection cardId={card.id} listId={card.listId} />
            </div>

            <Divider />

            <div className={classes.reading}>
              <CardAttachmentsSection cardId={card.id} boardId={boardId} />
            </div>

            <Divider />

            <div className={classes.reading}>
              <CardActivitySection cardId={card.id} boardId={boardId} />
            </div>

            <Divider />

            <Group>
              {card.status === 'active' ? (
                <Button
                  variant="default"
                  leftSection={<IconArchive size={16} />}
                  loading={archiveMutation.isPending}
                  onClick={() =>
                    archiveMutation.mutate(card.id, { onSuccess: onClose })
                  }
                >
                  Archivar tarjeta
                </Button>
              ) : (
                <Button
                  variant="default"
                  leftSection={<IconRestore size={16} />}
                  loading={unarchiveMutation.isPending}
                  onClick={() => unarchiveMutation.mutate(card.id)}
                >
                  Restaurar tarjeta
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </div>
    </Drawer>
  )
}
