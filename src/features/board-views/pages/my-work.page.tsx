import {
  Center,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconChecklist, IconFilterOff } from '@tabler/icons-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/app/page-container'
import { CardDetailPanel } from '@/features/cards/components/card-detail-panel'
import { useListCards } from '@/features/cards/hooks/use-list-cards'
import { MyWorkCardRow } from '../components/my-work-card-row'
import { useMyCards, useRefreshMyCards } from '../hooks/use-my-cards'
import type { MyCardHit } from '../types'
import { groupByDueBucket } from '../utils/due-buckets'
import classes from './my-work.page.module.css'

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true })

function cardsWord(count: number): string {
  return count === 1 ? 'tarjeta' : 'tarjetas'
}

/**
 * "Mi trabajo" (T12.4): todo lo asignado al usuario, de todos sus tableros,
 * agrupado por urgencia.
 *
 * Es una pantalla transversal y no una vista del tablero, así que vive al lado
 * de "Mis tableros" en la navegación. El detalle de tarjeta es el mismo panel
 * de siempre y se abre acá encima: cerrarlo devuelve a la lista, en el mismo
 * lugar donde estaba.
 */
export function MyWorkPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading } = useMyCards()
  const refreshMyCards = useRefreshMyCards()

  const hits = useMemo(() => data ?? [], [data])
  const selectedCardId = searchParams.get('card')

  // Las opciones del filtro salen de las tarjetas, no de `GET /boards`: un
  // tablero donde no tengo nada asignado sólo ofrecería una lista vacía.
  const boardOptions = useMemo(() => {
    const names = new Map<string, string>()
    for (const hit of hits) names.set(hit.boardId, hit.boardName)
    return [...names]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => collator.compare(a.label, b.label))
  }, [hits])

  // Un `?board=` que ya no corresponde a ninguna tarjeta (la última se movió, o
  // la URL viene editada) se ignora en vez de vaciar la pantalla sin explicar.
  const boardParam = searchParams.get('board')
  const boardFilter =
    boardParam && boardOptions.some((option) => option.value === boardParam)
      ? boardParam
      : null

  const visibleHits = useMemo(
    () =>
      boardFilter ? hits.filter((hit) => hit.boardId === boardFilter) : hits,
    [hits, boardFilter],
  )
  const groups = useMemo(() => groupByDueBucket(visibleHits), [visibleHits])

  const selectedHit = hits.find((hit) => hit.card.id === selectedCardId)

  /*
    El panel edita: si mostrara la tarjeta tal como vino de `GET /me/cards`, un
    título recién guardado volvería al viejo. Pidiendo las tarjetas de SU lista
    —sólo mientras el panel está abierto— el detalle queda apoyado en el mismo
    cache que ya invalidan todas las mutaciones de tarjeta.
  */
  const listCardsQuery = useListCards(selectedHit?.listId)
  const selectedCard =
    listCardsQuery.data?.find((card) => card.id === selectedCardId) ??
    selectedHit?.card

  const openCard = (hit: MyCardHit) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('card', hit.card.id)
      return next
    })
  }

  const closeCard = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('card')
      return next
    })
    void refreshMyCards()
  }

  const setBoardFilter = (value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set('board', value)
      } else {
        next.delete('board')
      }
      return next
    }, { replace: true })
  }

  return (
    <PageContainer>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end" wrap="wrap">
          <div>
            <Title order={1} size="h2">
              Mi trabajo
            </Title>
            <Text c="dimmed" size="sm" mt={4}>
              {isLoading
                ? 'Buscando lo que tenés asignado…'
                : `${visibleHits.length} ${cardsWord(visibleHits.length)} asignadas${
                    boardFilter ? ' en este tablero' : ''
                  }`}
            </Text>
          </div>

          {boardOptions.length > 1 && (
            <Select
              data={boardOptions}
              value={boardFilter}
              onChange={setBoardFilter}
              placeholder="Todos los tableros"
              aria-label="Filtrar por tablero"
              clearable
              leftSection={<IconFilterOff size={16} />}
              w={240}
            />
          )}
        </Group>

        {isLoading && (
          <Center py={60}>
            <Loader />
          </Center>
        )}

        {!isLoading && hits.length === 0 && (
          <Center py={60}>
            <Stack align="center" gap="sm" maw={420}>
              <ThemeIcon size={48} radius="xl" variant="light" color="primary">
                <IconChecklist size={24} />
              </ThemeIcon>
              <Title order={2} size="h3" ta="center">
                No tenés tarjetas asignadas
              </Title>
              <Text c="dimmed" size="md" ta="center">
                Acá vas a ver todo lo que te asignen, de todos tus tableros,
                ordenado por lo que vence primero. Asignate una tarjeta desde su
                detalle y aparece sola.
              </Text>
            </Stack>
          </Center>
        )}

        {groups.map((group) => (
          <section key={group.bucket}>
            <div className={classes.groupHeader}>
              <h2 className={classes.groupName}>{group.label}</h2>
              <span className={classes.groupCount}>{group.hits.length}</span>
            </div>

            <Stack gap="xs">
              {group.hits.map((hit) => (
                <MyWorkCardRow
                  key={hit.card.id}
                  hit={hit}
                  onOpen={() => openCard(hit)}
                />
              ))}
            </Stack>
          </section>
        ))}
      </Stack>

      <CardDetailPanel
        card={selectedCard}
        boardId={selectedHit?.boardId ?? ''}
        isLoading={isLoading || listCardsQuery.isLoading}
        opened={!!selectedCardId}
        onClose={closeCard}
      />
    </PageContainer>
  )
}
