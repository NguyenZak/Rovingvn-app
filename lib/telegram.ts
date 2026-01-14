
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function sendTelegramMessage(text: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('⚠️ Telegram credentials not found. Skipping notification.')
        return false
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML', // Allows bold, italic, etc.
            }),
        })

        const data = await response.json()

        if (!data.ok) {
            console.error('❌ Telegram API Error:', data)
            return false
        }

        return true
    } catch (error) {
        console.error('❌ Failed to send Telegram message:', error)
        return false
    }
}
