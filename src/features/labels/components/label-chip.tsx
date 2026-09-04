import { ActionIcon } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import type { Label } from '../types'
import classes from './label-chip.module.css'

interface LabelChipProps {
  label: Label
  /** `xs` para la vista de tablero, `sm` para el detalle de tarjeta. */
  size?: 'xs' | 'sm'
  onRemove?: () => void
  isRemoving?: boolean
}

/**
 * Especie "etiqueta" del sistema de badges: fondo pastel de la paleta del
 * tablero y texto oscuro. Única fuente de verdad del chip — antes estaba
 * duplicado entre la card del tablero y el panel de detalle.
 */
export function LabelChip({
  label,
  size = 'sm',
  onRemove,
  isRemoving,
}: LabelChipProps) {
  return (
    <span
      className={[classes.chip, size === 'xs' && classes.xs]
        .filter(Boolean)
        .join(' ')}
      style={{ backgroundColor: label.color }}
    >
      <span className={classes.name}>{label.name}</span>
      {onRemove && (
        <ActionIcon
          variant="transparent"
          size="xs"
          className={classes.remove}
          aria-label={`Quitar etiqueta ${label.name}`}
          loading={isRemoving}
          onClick={onRemove}
        >
          <IconX size={12} />
        </ActionIcon>
      )}
    </span>
  )
}
