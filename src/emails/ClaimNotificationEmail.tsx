import { siteConfig } from '@/lib/config'

interface ClaimNotificationEmailProps {
  companyName: string
  claimantName: string
  claimantEmail: string
  claimantPhone?: string
  message?: string
}

export function ClaimNotificationEmail({
  companyName,
  claimantName,
  claimantEmail,
  claimantPhone,
  message,
}: ClaimNotificationEmailProps) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nowe zgłoszenie przejęcia wizytówki</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background-color: #f59e0b; padding: 24px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Nowe zgłoszenie przejęcia wizytówki</h1>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Ktoś zgłosił chęć przejęcia wizytówki firmy w katalogu ${siteConfig.brand}.
      </p>

      <!-- Company info -->
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
        <h3 style="color: #1f2937; margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Firma</h3>
        <p style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0;">${companyName}</p>
      </div>

      <!-- Claimant info -->
      <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
        <h3 style="color: #1f2937; margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Dane zgłaszającego</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #6b7280; font-size: 14px; padding: 4px 0; width: 100px;">Imię:</td>
            <td style="color: #1f2937; font-size: 16px; padding: 4px 0; font-weight: 500;">${claimantName}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; font-size: 14px; padding: 4px 0;">Email:</td>
            <td style="color: #1f2937; font-size: 16px; padding: 4px 0;">
              <a href="mailto:${claimantEmail}" style="color: #2563eb; text-decoration: none;">${claimantEmail}</a>
            </td>
          </tr>
          ${claimantPhone ? `
          <tr>
            <td style="color: #6b7280; font-size: 14px; padding: 4px 0;">Telefon:</td>
            <td style="color: #1f2937; font-size: 16px; padding: 4px 0;">
              <a href="tel:${claimantPhone}" style="color: #2563eb; text-decoration: none;">${claimantPhone}</a>
            </td>
          </tr>
          ` : ''}
        </table>
      </div>

      ${message ? `
      <!-- Message -->
      <div style="border-left: 4px solid #2563eb; padding: 16px 20px; background-color: #f9fafb; margin: 0 0 24px;">
        <h3 style="color: #1f2937; margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Wiadomość</h3>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-line;">${message}</p>
      </div>
      ` : ''}

      <!-- CTA -->
      <div style="text-align: center; margin: 32px 0 0;">
        <a href="${siteConfig.url}/admin/firmy" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Przejdź do panelu admina
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
        ${siteConfig.brand} &bull; Automatyczne powiadomienie
      </p>
    </div>

  </div>
</body>
</html>
  `.trim()
}

export function getClaimNotificationSubject(companyName: string): string {
  return `Nowe zgłoszenie przejęcia: ${companyName}`
}
