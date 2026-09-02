export function normalizeTitle(value: string) {
  // Unifica acentos, espacios y mayúsculas antes de buscar o comparar títulos.
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('es')
}
