/**
 * Etiqueta del modificador de atajos según la plataforma: `⌘` en Mac, `Ctrl` en
 * el resto. `navigator.platform` está deprecado, así que se mira el user agent,
 * que para esta decisión —puramente cosmética— alcanza y sobra: si falla, el
 * atajo sigue funcionando igual, sólo se muestra el nombre del otro modificador.
 */
export function getModifierKeyLabel(): string {
  if (typeof navigator === 'undefined') {
    return 'Ctrl'
  }
  return /mac|iphone|ipad|ipod/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'
}
