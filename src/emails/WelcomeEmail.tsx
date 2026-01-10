import { siteConfig } from '@/lib/config'

interface WelcomeEmailProps {
  email: string
}

export function WelcomeEmail({ email }: WelcomeEmailProps) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Witaj w ${siteConfig.brand}!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">${siteConfig.region}</h1>
      <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">${siteConfig.brand}</p>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 24px;">Witaj!</h2>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Dziękujemy za zapisanie się do newslettera <strong>${siteConfig.region}</strong>!
      </p>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Od teraz będziesz otrzymywać najważniejsze informacje z gminy prosto na swoją skrzynkę:
      </p>

      <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 24px; padding-left: 20px;">
        <li>Aktualności i wydarzenia lokalne</li>
        <li>Informacje z urzędu gminy</li>
        <li>Polecane firmy z okolicy</li>
        <li>Ogłoszenia mieszkańców</li>
      </ul>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
        Tymczasem zapraszamy na nasz portal:
      </p>

      <div style="text-align: center; margin: 0 0 32px;">
        <a href="${siteConfig.url}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Odwiedź ${siteConfig.brand}
        </a>
      </div>

      <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0;">
        Ten email został wysłany na adres ${email}. Jeśli nie zapisywałeś/aś się do newslettera, zignoruj tę wiadomość.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
        ${siteConfig.brand} &bull; Portal lokalny gminy ${siteConfig.region}
      </p>
    </div>

  </div>
</body>
</html>
  `.trim()
}

export function getWelcomeEmailSubject(): string {
  return `Witaj w ${siteConfig.brand}!`
}
