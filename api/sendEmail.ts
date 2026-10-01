// @ts-nocheck: el checker aislado de Vercel no ve tipos node y resuelve mal el cliente SES.
// Runtime verificado con email real en sandbox. El tipado estricto vive en src/.
// Vercel Function: recibe request del frontend, llama a AWS SES con credenciales seguras
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, subject, body } = req.body

  const toUser = process.env.AWS_SES_TO_EMAIL?.trim()
  const from = process.env.AWS_SES_SENDER?.trim()

  if (!toUser || !from) {
    return res.status(400).json({ error: 'Environment variables error' })
  }

  if (!to || !subject || !body) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: to, subject, body' })
  }

  try {
    const command = new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [toUser, to] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } },
      },
    })

    await sesClient.send(command)
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('SES sendEmail', error)
    // Solo cruzan códigos blancos, nunca texto de AWS (puede traer ARNs o IDs)
    const code = (error as { Code?: string })?.Code
    if (code === 'MessageRejected') {
      return res.status(400).json({ error: 'unverified-recipient' })
    }
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
