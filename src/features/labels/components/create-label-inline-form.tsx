import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LABEL_COLOR_PALETTE } from '../types'
import { LabelColorSwatches } from './label-color-swatches'
import {
  labelNameSchema,
  type LabelNameFormValues,
} from '../schemas/label-name.schema'

interface CreateLabelInlineFormProps {
  onCreate: (values: { name: string; color: string }) => void
  isPending: boolean
}

export function CreateLabelInlineForm({
  onCreate,
  isPending,
}: CreateLabelInlineFormProps) {
  const [color, setColor] = useState<string>(LABEL_COLOR_PALETTE[0])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LabelNameFormValues>({
    resolver: zodResolver(labelNameSchema),
  })

  const onSubmit = (values: LabelNameFormValues) => {
    onCreate({ name: values.name, color })
    reset()
    setColor(LABEL_COLOR_PALETTE[0])
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="xs">
        <TextInput
          size="xs"
          placeholder="Nombre de la nueva etiqueta"
          error={errors.name?.message}
          {...register('name')}
        />
        <LabelColorSwatches value={color} onChange={setColor} />
        <Group justify="flex-end">
          <Button
            type="submit"
            size="xs"
            leftSection={<IconPlus size={14} />}
            loading={isPending}
          >
            Crear etiqueta
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
