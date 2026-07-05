const AVERAGE_READING_SPEED_WPM = 238

export function estimateReadTime(text: string): number {
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
  const minutes = wordCount / AVERAGE_READING_SPEED_WPM
  return Math.max(1, Math.ceil(minutes))
}
