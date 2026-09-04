import { Button, Pill, Text } from '@mantine/core'
import { IconFilterOff } from '@tabler/icons-react'
import { LabelChip } from '@/features/labels/components/label-chip'
import type { Label } from '@/features/labels/types'
import { DUE_DATE_STATUS_LABEL } from '@/features/cards/utils/due-date'
import type { BoardMember } from '../types'
import { FILTER_NONE } from '../types'
import type { useBoardFilter } from '../hooks/use-board-filter'
import classes from './board-filter-summary.module.css'

interface BoardFilterSummaryProps {
  members: BoardMember[]
  labels: Label[]
  filter: ReturnType<typeof useBoardFilter>
  /** Tarjetas que sobreviven al filtro, en todo el tablero. */
  visibleCount: number
  /** Tarjetas activas del tablero sin filtrar. */
  totalCount: number
}

/**
 * Una vista filtrada siempre se anuncia: mientras haya filtro, esta barra dice
 * cuáles son, cuántas tarjetas quedaron fuera y cómo volver atrás. Ocultar
 * contenido sin decirlo haría creer que el tablero perdió tarjetas.
 */
export function BoardFilterSummary({
  members,
  labels,
  filter,
  visibleCount,
  totalCount,
}: BoardFilterSummaryProps) {
  const { filter: value, toggleMember, toggleLabel, toggleDue, setText, clear } =
    filter

  const hiddenCount = totalCount - visibleCount
  const memberName = (memberId: string) =>
    members.find((member) => member.userId === memberId)?.name ?? 'Miembro'
  const labelById = (labelId: string): Label | undefined =>
    labels.find((label) => label.id === labelId)

  return (
    <div className={classes.bar} role="status">
      <span className={classes.chips}>
        {value.memberIds.map((memberId) => (
          <Pill
            key={`member-${memberId}`}
            withRemoveButton
            onRemove={() => toggleMember(memberId)}
            removeButtonProps={{ 'aria-label': 'Quitar filtro de miembro' }}
          >
            {memberId === FILTER_NONE
              ? 'Sin miembro asignado'
              : memberName(memberId)}
          </Pill>
        ))}

        {value.labelIds.map((labelId) => {
          const label = labelById(labelId)
          return (
            <Pill
              key={`label-${labelId}`}
              withRemoveButton
              onRemove={() => toggleLabel(labelId)}
              removeButtonProps={{ 'aria-label': 'Quitar filtro de etiqueta' }}
            >
              {labelId === FILTER_NONE ? (
                'Sin etiqueta'
              ) : label ? (
                <LabelChip label={label} size="xs" />
              ) : (
                'Etiqueta'
              )}
            </Pill>
          )
        })}

        {value.due.map((due) => (
          <Pill
            key={`due-${due}`}
            withRemoveButton
            onRemove={() => toggleDue(due)}
            removeButtonProps={{ 'aria-label': 'Quitar filtro de vencimiento' }}
          >
            {DUE_DATE_STATUS_LABEL[due]}
          </Pill>
        ))}

        {value.text.trim() !== '' && (
          <Pill
            withRemoveButton
            onRemove={() => setText('')}
            removeButtonProps={{ 'aria-label': 'Quitar filtro de texto' }}
          >
            "{value.text}"
          </Pill>
        )}
      </span>

      {/* El estado vacío por filtro no se parece al del tablero vacío: no
          invita a crear la primera tarjeta, explica que hay un filtro puesto. */}
      <Text size="sm" c={visibleCount === 0 ? undefined : 'dimmed'} className={classes.count}>
        {visibleCount === 0
          ? `Ninguna de las ${totalCount} tarjetas coincide con el filtro`
          : `${hiddenCount} ${hiddenCount === 1 ? 'tarjeta oculta' : 'tarjetas ocultas'}`}
      </Text>

      <Button
        variant="subtle"
        color="gray"
        size="compact-sm"
        leftSection={<IconFilterOff size={14} />}
        onClick={clear}
      >
        Limpiar
      </Button>
    </div>
  )
}
