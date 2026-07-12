import { NextRequest, NextResponse } from 'next/server'
import {
  commerceApprovedKnowledge,
  commerceBusinessProfile,
  formatPrice,
} from '@/lib/commerce-data'
import { readProducts } from '@/src/product-store'
import { getRuntimeSettings } from '@/src/settings-store'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const runtime = await getRuntimeSettings()
    const groqApiKey = runtime.groqApiKey
    if (!groqApiKey) {
      return NextResponse.json({ error: 'AI service is not configured' }, { status: 500 })
    }

    const approvedKnowledge = commerceApprovedKnowledge
      .map((entry, index) => `${index + 1}. ${entry.topic}: ${entry.content}`)
      .join('\n')
    const products = await readProducts()
    const catalog = products
      .map((product, index) => {
        const status = product.available ? `available, ${product.stock} in stock` : 'not available'
        const imageStatus = product.image?.data ? 'Product picture uploaded.' : 'No product picture uploaded.'
        return `${index + 1}. ${product.name}: ${product.subtitle}. Category: ${product.category}. Price: ${formatPrice(product.price)}. Status: ${status}. ${imageStatus}`
      })
      .join('\n')

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: runtime.groqModel,
        messages: [
          {
            role: 'system',
            content: `You are a helpful WhatsApp commerce dashboard assistant for ${runtime.businessName || commerceBusinessProfile.name}.

Business profile:
${commerceBusinessProfile.description}

Approved business knowledge:
${approvedKnowledge}

Approved product catalog:
${catalog}

Dashboard sections:
- Overview: /dashboard
- Product Catalog: /dashboard/products
- Orders: /dashboard/orders
- Customer Questions: /dashboard/questions
- Bot Settings: /dashboard/bot-settings
- WhatsApp Connection: /dashboard/session
- Approved Knowledge: /dashboard/knowledge

Rules:
- Answer only from approved business knowledge and the product catalog.
- Do not invent prices, availability, policies, addresses, links, or phone numbers.
- If the data is missing, say what is missing and where to add it in the dashboard.
- Keep answers direct and useful for a store owner managing WhatsApp sales.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('AI provider API error:', errorData)
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 500 })
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.'

    return NextResponse.json({ 
      message: assistantMessage,
      model: runtime.groqModel,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
