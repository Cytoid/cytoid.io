import * as Sentry from '@sentry/vue'
import type { Router } from 'vue-router'

// https://github.com/nuxt-community/sentry-module/issues/530#issuecomment-1570407408
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  Sentry.init({
    enabled: config.public.sentry.enabled,
    app: nuxtApp.vueApp,
    autoSessionTracking: true,
    debug: config.public.ENV !== 'production',
    dsn: config.public.sentry.dsn,
    environment: config.public.sentry.environment,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(nuxtApp.$router as Router),
        tracePropagationTargets: ['localhost', config.public.sentry.tracePropagationTarget],
      }),
      new Sentry.Replay(),
    ],
    trackComponents: true,
    hooks: ['activate', 'create', 'destroy', 'mount', 'update'],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.2,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,

    beforeSend(event, hint) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({ eventId: event.event_id })
      }
      return event
    },
  })

  return {
    provide: {
      sentrySetContext: Sentry.setContext,
      sentrySetUser: Sentry.setUser,
      sentrySetTag: Sentry.setTag,
      sentryAddBreadcrumb: Sentry.addBreadcrumb,
      sentryCaptureException: Sentry.captureException,
    },
  }
})
