interface BrandMarkProps {
  size?: number
}

/**
 * Marca de Trellium: tres columnas kanban de carga descendente dentro de un
 * contenedor redondeado. Trazo plano en `currentColor`, sin degradados.
 */
export function BrandMark({ size = 20 }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1.25"
        y="1.25"
        width="17.5"
        height="17.5"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="5" y="5.25" width="2.5" height="9.5" rx="1.25" fill="currentColor" />
      <rect x="8.75" y="5.25" width="2.5" height="6.5" rx="1.25" fill="currentColor" />
      <rect x="12.5" y="5.25" width="2.5" height="3.5" rx="1.25" fill="currentColor" />
    </svg>
  )
}
