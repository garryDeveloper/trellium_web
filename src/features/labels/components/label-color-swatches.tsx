import { ColorSwatch, Group, Tooltip, UnstyledButton } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { LABEL_COLOR_NAMES, LABEL_COLOR_PALETTE } from '../types'

interface LabelColorSwatchesProps {
  value: string
  onChange: (color: string) => void
}

export function LabelColorSwatches({ value, onChange }: LabelColorSwatchesProps) {
  return (
    <Group gap={6}>
      {LABEL_COLOR_PALETTE.map((color) => (
        <Tooltip key={color} label={LABEL_COLOR_NAMES[color]}>
          <UnstyledButton
            aria-label={LABEL_COLOR_NAMES[color]}
            aria-pressed={value === color}
            onClick={() => onChange(color)}
          >
            <ColorSwatch color={color} size={22}>
              {value === color && <IconCheck size={12} color="#1F1F1E" />}
            </ColorSwatch>
          </UnstyledButton>
        </Tooltip>
      ))}
    </Group>
  )
}
