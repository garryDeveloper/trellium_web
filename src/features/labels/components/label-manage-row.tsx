import {
  ActionIcon,
  Checkbox,
  Group,
  Menu,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { IconDotsVertical, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { LabelColorSwatches } from './label-color-swatches'
import type { Label } from '../types'

interface LabelManageRowProps {
  label: Label
  applied: boolean
  onToggleApply: () => void
  isToggling: boolean
  onRename: (name: string) => void
  onRecolor: (color: string) => void
  onDelete: () => void
  isDeleting: boolean
}

export function LabelManageRow({
  label,
  applied,
  onToggleApply,
  isToggling,
  onRename,
  onRecolor,
  onDelete,
  isDeleting,
}: LabelManageRowProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(label.name)

  const startEditing = () => {
    setName(label.name)
    setEditing(true)
  }

  const submitRename = () => {
    const trimmed = name.trim()
    setEditing(false)
    if (trimmed.length > 0 && trimmed !== label.name) {
      onRename(trimmed)
    } else {
      setName(label.name)
    }
  }

  return (
    <Group gap="xs" wrap="nowrap" align="center">
      <Checkbox
        checked={applied}
        onChange={onToggleApply}
        disabled={isToggling}
        aria-label={`Aplicar etiqueta ${label.name}`}
      />

      <div
        aria-hidden
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          backgroundColor: label.color,
          flexShrink: 0,
        }}
      />

      {editing ? (
        <TextInput
          autoFocus
          size="xs"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          onBlur={submitRename}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submitRename()
            }
            if (event.key === 'Escape') {
              setName(label.name)
              setEditing(false)
            }
          }}
          style={{ flex: 1 }}
        />
      ) : (
        <UnstyledButton
          onClick={startEditing}
          aria-label={`Editar nombre de ${label.name}`}
          style={{ flex: 1, minWidth: 0, textAlign: 'left', cursor: 'text' }}
        >
          <Text size="sm" truncate>
            {label.name}
          </Text>
        </UnstyledButton>
      )}

      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label={`Más opciones de ${label.name}`}
          >
            <IconDotsVertical size={14} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Color</Menu.Label>
          <div style={{ padding: '4px 12px 8px' }}>
            <LabelColorSwatches value={label.color} onChange={onRecolor} />
          </div>
          <Menu.Divider />
          <Menu.Item
            color="danger"
            leftSection={<IconTrash size={14} />}
            onClick={onDelete}
            disabled={isDeleting}
          >
            Eliminar etiqueta
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
