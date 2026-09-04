import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, TextInput } from '@mantine/core'
import { IconPlus, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  checklistNameSchema,
  type ChecklistNameFormValues,
} from '../schemas/checklist-name.schema'

interface CreateChecklistInlineFormProps {
  isPending: boolean
  onCreate: (name: string) => void
}

export function CreateChecklistInlineForm({
  isPending,
  onCreate,
}: CreateChecklistInlineFormProps) {
  const [creating, setCreating] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChecklistNameFormValues>({
    resolver: zodResolver(checklistNameSchema),
  })

  const close = () => {
    reset()
    setCreating(false)
  }

  const onSubmit = (values: ChecklistNameFormValues) => {
    onCreate(values.name)
    reset()
  }

  if (!creating) {
    return (
      <Button
        variant="default"
        size="xs"
        leftSection={<IconPlus size={14} />}
        onClick={() => setCreating(true)}
      >
        Agregar checklist
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
          placeholder="Nombre de la checklist"
          error={errors.name?.message}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              close()
            }
          }}
          {...register('name')}
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
