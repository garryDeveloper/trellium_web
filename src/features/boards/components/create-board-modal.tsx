import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { getApiErrorMessage } from '@/shared/api/error'
import { useCreateBoard } from '../hooks/use-create-board'
import {
  boardNameSchema,
  type BoardNameFormValues,
} from '../schemas/board-name.schema'

interface CreateBoardModalProps {
  opened: boolean
  onClose: () => void
}

export function CreateBoardModal({ opened, onClose }: CreateBoardModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoardNameFormValues>({
    resolver: zodResolver(boardNameSchema),
  })
  const createBoardMutation = useCreateBoard()

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (values: BoardNameFormValues) => {
    createBoardMutation.mutate(
      { name: values.name },
      { onSuccess: handleClose },
    )
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Nuevo tablero" centered>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="md">
          {createBoardMutation.isError && (
            <Alert
              color="danger"
              variant="light"
              icon={<IconAlertCircle size={18} />}
            >
              {getApiErrorMessage(createBoardMutation.error)}
            </Alert>
          )}

          <TextInput
            label="Nombre del tablero"
            placeholder="p. ej. Proyecto Alfa"
            data-autofocus
            error={errors.name?.message}
            {...register('name')}
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={createBoardMutation.isPending}>
              Crear tablero
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
