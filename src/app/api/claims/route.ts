import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { company_id, name, email, phone, message } = body

    // Validation
    if (!company_id || !name || !email) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych pól' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email' },
        { status: 400 }
      )
    }

    // Check if company exists
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, is_claimed')
      .eq('id', company_id)
      .single<{ id: string; is_claimed: boolean }>()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Firma nie istnieje' },
        { status: 404 }
      )
    }

    if (company.is_claimed) {
      return NextResponse.json(
        { error: 'Ta wizytówka została już przejęta' },
        { status: 400 }
      )
    }

    // Check for existing pending claim
    const { data: existingClaim } = await supabase
      .from('claims')
      .select('id')
      .eq('company_id', company_id)
      .eq('status', 'pending')
      .single()

    if (existingClaim) {
      return NextResponse.json(
        { error: 'Zgłoszenie dla tej firmy jest już w trakcie weryfikacji' },
        { status: 400 }
      )
    }

    // Create claim
    const { error: insertError } = await supabase.from('claims').insert({
      company_id,
      name,
      email,
      phone: phone || null,
      message: message || null,
      status: 'pending',
    })

    if (insertError) {
      console.error('Error creating claim:', insertError)
      return NextResponse.json(
        { error: 'Wystąpił błąd podczas zapisywania zgłoszenia' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Claim API error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
