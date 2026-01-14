import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend, emailFrom, adminEmail } from '@/lib/resend'
import { PromotionNotificationEmail, getPromotionNotificationSubject } from '@/emails/PromotionNotificationEmail'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { company_id, title, description, image_url, valid_until, contact_email, contact_phone } = body

    // Validation
    if (!company_id || !title || !valid_until || !contact_email) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych pól' },
        { status: 400 }
      )
    }

    // Title length validation
    if (title.length > 100) {
      return NextResponse.json(
        { error: 'Tytuł może mieć maksymalnie 100 znaków' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contact_email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email' },
        { status: 400 }
      )
    }

    // Date validation - must be in the future
    const validUntilDate = new Date(valid_until)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (validUntilDate < today) {
      return NextResponse.json(
        { error: 'Data ważności musi być w przyszłości' },
        { status: 400 }
      )
    }

    // Check if company exists
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id, name, slug')
      .eq('id', company_id)
      .single()

    const company = companyData as { id: string; name: string; slug: string } | null

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Firma nie istnieje' },
        { status: 404 }
      )
    }

    // Create promotion
    const { error: insertError } = await supabase.from('promotions').insert({
      company_id,
      title,
      description: description || null,
      image_url: image_url || null,
      valid_until,
      contact_email,
      contact_phone: contact_phone || null,
      status: 'pending',
    } as never)

    if (insertError) {
      console.error('Error creating promotion:', insertError)
      return NextResponse.json(
        { error: 'Wystąpił błąd podczas zapisywania promocji' },
        { status: 500 }
      )
    }

    // Send notification email to admin
    if (resend) {
      try {
        const formattedDate = new Date(valid_until).toLocaleDateString('pl-PL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        await resend.emails.send({
          from: emailFrom,
          to: adminEmail,
          subject: getPromotionNotificationSubject(title),
          html: PromotionNotificationEmail({
            promotionTitle: title,
            companyName: company.name,
            description: description,
            validUntil: formattedDate,
            contactEmail: contact_email,
            contactPhone: contact_phone,
          }),
        })
      } catch (emailError) {
        console.error('Error sending promotion notification email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Dziękujemy! Twoja promocja zostanie sprawdzona i opublikowana w ciągu 24h.',
    })
  } catch (error) {
    console.error('Promotions API error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

// GET endpoint for fetching companies (for autocomplete)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    if (!search || search.length < 2) {
      return NextResponse.json({ companies: [] })
    }

    const { data, error } = await supabase
      .from('companies')
      .select('id, name, slug')
      .ilike('name', `%${search}%`)
      .limit(10)

    if (error) {
      console.error('Error fetching companies:', error)
      return NextResponse.json(
        { error: 'Wystąpił błąd podczas wyszukiwania firm' },
        { status: 500 }
      )
    }

    return NextResponse.json({ companies: data || [] })
  } catch (error) {
    console.error('Companies search API error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
