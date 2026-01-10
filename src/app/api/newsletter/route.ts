import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, source = 'website' } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Adres email jest wymagany' },
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

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, is_active, unsubscribed_at')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      const subscriber = existing as { id: string; is_active: boolean; unsubscribed_at: string | null }

      // If was unsubscribed, reactivate
      if (!subscriber.is_active || subscriber.unsubscribed_at) {
        const { error: updateError } = await supabase
          .from('subscribers')
          .update({
            is_active: true,
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
          } as never)
          .eq('id', subscriber.id)

        if (updateError) {
          console.error('Error reactivating subscriber:', updateError)
          return NextResponse.json(
            { error: 'Wystąpił błąd podczas zapisu' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Twoja subskrypcja została wznowiona!'
        })
      }

      // Already subscribed and active
      return NextResponse.json(
        { error: 'Ten adres email jest już zapisany do newslettera' },
        { status: 400 }
      )
    }

    // Create new subscriber
    const { error: insertError } = await supabase.from('subscribers').insert({
      email: email.toLowerCase(),
      source,
      is_active: true,
    } as never)

    if (insertError) {
      console.error('Error creating subscriber:', insertError)

      // Handle unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Ten adres email jest już zapisany do newslettera' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Wystąpił błąd podczas zapisu' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Dziękujemy za zapis do newslettera!'
    })
  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
