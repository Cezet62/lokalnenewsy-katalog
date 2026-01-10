import { Resend } from 'resend'
import { siteConfig } from './config'

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  console.warn('RESEND_API_KEY not found - emails will not be sent')
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null

// Email sender address (must be verified in Resend)
export const emailFrom = process.env.RESEND_FROM_EMAIL || `${siteConfig.brand} <noreply@lokalnenewsy.pl>`

// Admin email for notifications
export const adminEmail = process.env.ADMIN_EMAIL || siteConfig.email
