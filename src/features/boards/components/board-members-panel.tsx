import { Center, Divider, Drawer, Loader, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { Board } from '../types'
import { useBoardMembers } from '../hooks/use-board-members'
import { useRemoveMember } from '../hooks/use-remove-member'
import { useBoardInvitations } from '../hooks/use-board-invitations'
import { useCancelInvitation } from '../hooks/use-cancel-invitation'
import { InviteMemberForm } from './invite-member-form'
import { BoardMemberRow } from './board-member-row'
import { BoardInvitationRow } from './board-invitation-row'

interface BoardMembersPanelProps {
  board: Board
  opened: boolean
  onClose: () => void
}

export function BoardMembersPanel({
  board,
  opened,
  onClose,
}: BoardMembersPanelProps) {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const user = useAuthStore((state) => state.user)
  const isOwner = user?.id === board.ownerId

  const membersQuery = useBoardMembers(opened ? board.id : undefined)
  const removeMemberMutation = useRemoveMember(board.id)
  const invitationsQuery = useBoardInvitations(opened ? board.id : undefined)
  const cancelInvitationMutation = useCancelInvitation(board.id)

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title="Miembros del tablero"
      size={isMobile ? '100%' : 'md'}
    >
      <Stack gap="xl">
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Invitar por email
          </Text>
          <InviteMemberForm boardId={board.id} />
        </Stack>

        {(invitationsQuery.isLoading ||
          (invitationsQuery.data && invitationsQuery.data.length > 0)) && (
          <>
            <Divider />
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Invitaciones pendientes
              </Text>

              {invitationsQuery.isLoading && (
                <Center py="md">
                  <Loader size="sm" />
                </Center>
              )}

              {invitationsQuery.data?.map((invitation) => (
                <BoardInvitationRow
                  key={invitation.id}
                  invitation={invitation}
                  isCancelling={
                    cancelInvitationMutation.isPending &&
                    cancelInvitationMutation.variables === invitation.id
                  }
                  onCancel={() => cancelInvitationMutation.mutate(invitation.id)}
                />
              ))}
            </Stack>
          </>
        )}

        <Divider />

        <Stack gap="sm">
          <Text size="sm" fw={500}>
            Miembros actuales
          </Text>

          {membersQuery.isLoading && (
            <Center py="md">
              <Loader size="sm" />
            </Center>
          )}

          {membersQuery.data?.map((member) => (
            <BoardMemberRow
              key={member.userId}
              member={member}
              canRemove={isOwner && member.role !== 'owner'}
              isRemoving={
                removeMemberMutation.isPending &&
                removeMemberMutation.variables === member.userId
              }
              onRemove={() => removeMemberMutation.mutate(member.userId)}
            />
          ))}
        </Stack>
      </Stack>
    </Drawer>
  )
}
