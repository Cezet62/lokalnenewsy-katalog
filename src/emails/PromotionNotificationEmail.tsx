import { siteConfig } from '@/lib/config'

interface PromotionNotificationEmailProps {
  promotionTitle: string
  companyName: string
  description?: string
  validUntil: string
  contactEmail: string
  contactPhone?: string
}

export function PromotionNotificationEmail({
  promotionTitle,
  companyName,
  description,
  validUntil,
  contactEmail,
  contactPhone,
}: PromotionNotificationEmailProps) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nowa promocja do moderacji</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background-color: #10b981; padding: 24px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Nowa promocja do moderacji</h1>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Ktoś dodał nową promocję w ${siteConfig.brand}. Sprawdź i zatwierdź lub odrzuć.
      </p>

      <!-- Promotion info -->
      <div style="background-color: #ecfdf5; border-radius: 8px; padding: 20px; margin: 0 0 24px; border-left: 4px solid #10b981;">
        <h3 style="color: #1f2937; margin: 0 0 8px; font-size: 18px; font-weight: 600;">${promotionTitle}</h3>
        <p style="color: #6b7280; margin: 0; font-size: 14px;">dla firmy: <strong>${companyName}</strong></p>
      </div>

      ${description ? `
      <!-- Description -->
      <div style="margin: 0 0 24px;">
        <h4 style="color: #1f2937; margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Opis promocji</h4>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-line;">${description}</p>
      </div>
      ` : ''}

      <!-- Details -->
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #6b7280; font-size: 14px; padding: 4px 0; width: 120px;">Ważna do:</td>
            <td style="color: #1f2937; font-size: 16px; padding: 4px 0; font-weight: 500;">${validUntil}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; font-size: 14px; padding: 4px 0;">Email:</td>
            <td style="color: #1f2937; font-size: 16px; padding: 4px 0;">
              <a href="mailto:${contactEmail}" style="color: #2563eb; text-decoration: none;">${contactEmail}</a>
            </td>
          </tr>
          ${contactPhone ? `
          <tr>
            <td style="color: #6b7280; font-size: 14px; padding: 4px 0;">Telefon:</td>
            <td style="color: #1f2937; font-size: 16px; padding: 4px 0;">
              <a href="tel:${contactPhone}" style="color: #2563eb; text-decoration: none;">${contactPhone}</a>
            </td>
          </tr>
          ` : ''}
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 32px 0 0;">
        <a href="${siteConfig.url}/admin/promocje" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Przejdź do moderacji
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

export function getPromotionNotificationSubject(title: string): string {
  return `Nowa promocja do moderacji: ${title}`
}
