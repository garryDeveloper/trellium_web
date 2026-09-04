/**
 * El formateo vive en `shared/utils/relative-time.ts` desde que notificaciones
 * necesitó lo mismo. Se mantienen estos nombres para no tocar los componentes.
 */
export {
  formatAbsoluteDate as formatCommentDate,
  formatRelativeDate as formatCommentDateRelative,
} from '@/shared/utils/relative-time'
