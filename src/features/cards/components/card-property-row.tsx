import type { ReactNode } from 'react'
import classes from './card-property-row.module.css'

interface CardPropertyRowProps {
  label: string
  children: ReactNode
}

/**
 * Fila del bloque de propiedades del detalle de tarjeta. Separa los atributos
 * (responsables, etiquetas, vencimiento) del contenido (título, descripción),
 * que antes pesaban visualmente lo mismo.
 */
export function CardPropertyRow({ label, children }: CardPropertyRowProps) {
  return (
    <div className={classes.row}>
      <div className={classes.label}>{label}</div>
      <div className={classes.value}>{children}</div>
    </div>
  )
}
