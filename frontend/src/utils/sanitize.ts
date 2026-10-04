const BLOCK_TAGS = /<\/(div|p|li|h[1-6])>|<br\s*\/?>/gi

// Превращает HTML из визуального редактора в обычный текст.
// DOMParser не выполняет скрипты и не загружает ресурсы.
export function htmlToText(html: string): string {
    const withBreaks = html.replace(BLOCK_TAGS, '\n')
    const doc = new DOMParser().parseFromString(withBreaks, 'text/html')

    return (doc.body.textContent ?? '').trim()
}
