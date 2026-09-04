import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, TextInput } from '@mantine/core'
import { IconPlus, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  checklistItemTextSchema,
  type ChecklistItemTextFormValues,
} from '../schemas/checklist-item-text.schema'

interface AddChecklistItemInlineFormProps {
  checklistName: string
  isPending: boolean
  onAdd: (text: string) => void
}

export function AddChecklistItemInlineForm({
  checklistName,
  isPending,
  onAdd,
}: AddChecklistItemInlineFormProps) {
  const [adding, setAdding] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChecklistItemTextFormValues>({
    resolver: zodResolver(checklistItemTextSchema),
  })

  const close = () => {
    reset()
    setAdding(false)
  }

  /**
   * Los ítems se agregan de a uno (T7.1), así que el form no se cierra al
   * enviar: queda listo para el siguiente.
   */
  const onSubmit = (values: ChecklistItemTextFormValues) => {
    onAdd(values.text)
    reset()
  }

  if (!adding) {
    return (
      <Button
        variant="subtle"
        color="gray"
        size="xs"
        leftSection={<IconPlus size={14} />}
        onClick={() => setAdding(true)}
      >
        Agregar ítem
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Group gap="xs" align="flex-start">
        <TextInput
          autoFocus
          size="xs"
          flex={1}
          placeholder={`Nuevo ítem de "${checklistName}"`}
          error={errors.text?.message}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              close()
            }
          }}
          {...register('text')}
        />
        <Button type="submit" size="xs" loading={isPending}>
          Agregar
        </Button>
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          onClick={close}
          aria-label="Cancelar"
        >
          <IconX size={14} />
        </Button>
      </Group>
    </form>
  )
}
