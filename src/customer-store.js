import { readConversationThreads } from './message-store.js'
import { readProducts } from './product-store.js'

const orderKeywords = [
  'buy',
  'order',
  'deliver',
  'delivery',
  'price',
  'how much',
  'available',
  'stock',
  'want',
  'need',
  'send',
  'purchase',
]

export async function listCustomerSummaries() {
  const threads = await readConversationThreads()
  return threads.map((thread) => {
    const messages = thread.messages || []
    const inbound = messages.filter((message) => message.direction === 'inbound')
    const outbound = messages.filter((message) => message.direction === 'assistant')
    const lastMessage = messages[messages.length - 1]
    const lastInbound = [...messages].reverse().find((message) => message.direction === 'inbound')

    return {
      id: thread.id,
      chatId: thread.chatId,
      customerName: thread.customerName || thread.chatId,
      firstSeenAt: thread.createdAt,
      lastSeenAt: thread.updatedAt,
      lastMessage: lastInbound?.text || lastMessage?.text || '',
      inboundCount: inbound.length,
      outboundCount: outbound.length,
      messageCount: messages.length,
      status: outbound.length > 0 ? 'Replied' : 'Needs attention',
    }
  })
}

export async function listOrderIntents() {
  const [threads, products] = await Promise.all([readConversationThreads(), readProducts()])
  const productKeywords = products.flatMap((product) =>
    [product.name, product.subtitle, product.category]
      .filter(Boolean)
      .flatMap((value) =>
        String(value)
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((word) => word.length >= 4),
      ),
  )
  const keywords = [...new Set([...orderKeywords, ...productKeywords])]

  return threads
    .flatMap((thread) => {
      const messages = thread.messages || []
      return messages
        .filter((message) => message.direction === 'inbound')
        .filter((message) => {
          const text = String(message.text || '').toLowerCase()
          return keywords.some((keyword) => text.includes(keyword))
        })
        .map((message) => {
          const laterAssistant = messages.find(
            (candidate) =>
              candidate.direction === 'assistant' &&
              new Date(candidate.timestamp).getTime() >= new Date(message.timestamp).getTime(),
          )

          return {
            id: `${thread.id}-${message.id}`,
            chatId: thread.chatId,
            customerName: thread.customerName || thread.chatId,
            request: message.text,
            createdAt: message.timestamp || thread.updatedAt,
            status: laterAssistant ? 'AI replied' : 'Needs follow-up',
            replyPreview: laterAssistant?.text || '',
          }
        })
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 100)
}
