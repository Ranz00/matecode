import { describe, it, expect, vi, afterEach } from 'vitest'
import { sendEmail } from '../src/services/emailService'

const params = { to: 'yo@mail.com', subject: 'Resumen', body: 'Hola' }

describe('sendEmail', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('llama a la function propia, no a AWS directo', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    vi.stubGlobal('fetch', fetchMock)

    await sendEmail(params)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/sendEmail',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('lanza si la function responde error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(sendEmail(params)).rejects.toThrow('Failed to send email')
  })

  it('devuelve lo que responde la function', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    }))

    await expect(sendEmail(params)).resolves.toEqual({ success: true })
  })
})
