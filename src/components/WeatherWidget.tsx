'use client'

import { useEffect, useState } from 'react'

interface WeatherData {
  temperature: number
  weatherCode: number
  isDay: boolean
}

const weatherDescriptions: Record<number, string> = {
  0: 'Bezchmurnie',
  1: 'Prawie bezchmurnie',
  2: 'Częściowe zachmurzenie',
  3: 'Pochmurno',
  45: 'Mgła',
  48: 'Szadź',
  51: 'Lekka mżawka',
  53: 'Mżawka',
  55: 'Gęsta mżawka',
  61: 'Lekki deszcz',
  63: 'Deszcz',
  65: 'Silny deszcz',
  71: 'Lekki śnieg',
  73: 'Śnieg',
  75: 'Silny śnieg',
  80: 'Przelotny deszcz',
  81: 'Przelotny deszcz',
  82: 'Silny przelotny deszcz',
  85: 'Przelotny śnieg',
  86: 'Silny przelotny śnieg',
  95: 'Burza',
  96: 'Burza z gradem',
  99: 'Silna burza z gradem',
}

const weatherIcons: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌧️',
  53: '🌧️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '🌨️',
  80: '🌦️',
  81: '🌦️',
  82: '🌦️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Osielsko coordinates: 53.16, 17.94
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=53.16&longitude=17.94&current=temperature_2m,weather_code,is_day&timezone=Europe%2FWarsaw'
        )
        const data = await response.json()

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
        })
      } catch (error) {
        console.error('Error fetching weather:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-600 text-white rounded-xl p-4 animate-pulse">
        <div className="h-16 bg-blue-500 rounded"></div>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  const icon = weatherIcons[weather.weatherCode] || '🌡️'
  const description = weatherDescriptions[weather.weatherCode] || 'Brak danych'

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide opacity-80">Osielsko</div>
          <div className="text-3xl font-bold">{weather.temperature}°C</div>
          <div className="text-sm opacity-90">{description}</div>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
    </div>
  )
}
