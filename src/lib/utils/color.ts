export const FOLDER_COLORS: string[] = [
  '#007AFF',
  '#FF3B30',
  '#FF9500',
  '#FFCC00',
  '#34C759',
  '#5AC8FA',
  '#AF52DE',
  '#FF2D55',
  '#8E8E93',
  '#5856D6',
  '#00C7BE',
  '#FF6482',
]

export function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '')

  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getFolderColorClass(colorHex: string): string {
  return `color: ${colorHex}; background-color: ${hexToRgba(colorHex, 0.1)};`
}
