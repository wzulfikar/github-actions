import Sentry from '@sentry/node'

export async function reportServerError(
  error: unknown,
  params: Record<string, unknown>,
) {
  const { ctx, level, userId, ...rest } = params

  const payload = { ...rest } as Record<string, unknown>
  if (ctx) payload.extra = { context: ctx }
  if (level) payload.level = level
  if (userId) payload.user = { id: userId }

  Sentry.captureException(error, payload)
  await Sentry.flush().catch((e) => {
    console.error('[error] reportServerError: `Sentry.flush` failed. error:', e)
  })
}
