'use client'

import { useEffect, useState } from 'react'

interface WeatherData {
  temperature: number
  weatherCode: number
  isDay: boolean
}

interface ForecastDay {
  date: string
  tempMax: number
  tempMin: number
  weatherCode: number
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

// Polish name days (simplified - most popular names for each day)
const nameDays: Record<string, string> = {
  '01-01': 'Mieczysława, Mieszka',
  '01-02': 'Izydora, Bazylego',
  '01-03': 'Genowefy, Danuty',
  '01-04': 'Anieli, Eugeniusza',
  '01-05': 'Hanny, Szymona',
  '01-06': 'Kacpra, Baltazara',
  '01-07': 'Juliana, Lucjana',
  '01-08': 'Seweryna, Mścisława',
  '01-09': 'Marceliny, Juliana',
  '01-10': 'Danuty, Wilhelma',
  '01-11': 'Honoraty, Matyldy',
  '01-12': 'Grety, Arkadiusza',
  '01-13': 'Bogumiły, Weroniki',
  '01-14': 'Felicji, Hilarego',
  '01-15': 'Pawła, Arnolda',
  '01-16': 'Marcelego, Włodzimierza',
  '01-17': 'Antoniego, Jana',
  '01-18': 'Piotra, Małgorzaty',
  '01-19': 'Henryka, Mariusza',
  '01-20': 'Fabiana, Sebastiana',
  '01-21': 'Agnieszki, Jarosława',
  '01-22': 'Wincentego, Anastazego',
  '01-23': 'Ildefonsa, Rajmunda',
  '01-24': 'Felicji, Tymoteusza',
  '01-25': 'Pawła, Miłosza',
  '01-26': 'Pauliny, Tytusa',
  '01-27': 'Anieli, Przybysława',
  '01-28': 'Walerego, Tomasza',
  '01-29': 'Zdzisława, Franciszka',
  '01-30': 'Macieja, Martyny',
  '01-31': 'Marceli, Jana',
  '02-01': 'Brygidy, Ignacego',
  '02-02': 'Marii, Miłosława',
  '02-03': 'Błażeja, Oskara',
  '02-04': 'Andrzeja, Weroniki',
  '02-05': 'Agaty, Adelajdy',
  '02-06': 'Doroty, Bogdana',
  '02-07': 'Ryszarda, Romana',
  '02-08': 'Sebastiana, Ireny',
  '02-09': 'Apolonii, Eryki',
  '02-10': 'Elwiry, Jacka',
  '02-11': 'Lucjana, Grzegorza',
  '02-12': 'Eulalii, Radosława',
  '02-13': 'Grzegorza, Katarzyny',
  '02-14': 'Walentego, Cyryla',
  '02-15': 'Jowity, Faustyna',
  '02-16': 'Danuty, Julianny',
  '02-17': 'Aleksego, Łukasza',
  '02-18': 'Szymona, Konstancji',
  '02-19': 'Arnolda, Konrada',
  '02-20': 'Leona, Ludomira',
  '02-21': 'Eleonory, Fortunata',
  '02-22': 'Marty, Małgorzaty',
  '02-23': 'Romany, Damiana',
  '02-24': 'Macieja, Bogusza',
  '02-25': 'Wiktora, Cezarego',
  '02-26': 'Mirosława, Aleksandra',
  '02-27': 'Gabriela, Anastazji',
  '02-28': 'Romana, Ludomira',
  '02-29': 'Romana, Lecha',
  '03-01': 'Antoniny, Albina',
  '03-02': 'Heleny, Halszki',
  '03-03': 'Maryny, Kunegundy',
  '03-04': 'Łucji, Kazimierza',
  '03-05': 'Adriana, Fryderyka',
  '03-06': 'Róży, Kolety',
  '03-07': 'Tomasza, Felicyty',
  '03-08': 'Beaty, Jana',
  '03-09': 'Franciszki, Katarzyny',
  '03-10': 'Cypriana, Aleksandra',
  '03-11': 'Benedykta, Konstantego',
  '03-12': 'Grzegorza, Justyny',
  '03-13': 'Bożeny, Krystyny',
  '03-14': 'Matyldy, Leona',
  '03-15': 'Longina, Klemensa',
  '03-16': 'Izabeli, Hilarego',
  '03-17': 'Patryka, Zbigniewa',
  '03-18': 'Cyryla, Edwarda',
  '03-19': 'Józefa, Bogdana',
  '03-20': 'Klaudii, Eufemii',
  '03-21': 'Benedykta, Lubomira',
  '03-22': 'Katarzyny, Bogusława',
  '03-23': 'Pelagii, Feliksa',
  '03-24': 'Marka, Gabriela',
  '03-25': 'Marioli, Wieńczysława',
  '03-26': 'Larysy, Teodora',
  '03-27': 'Lidii, Ernesta',
  '03-28': 'Aniela, Sykstusa',
  '03-29': 'Wiktoryny, Helmuta',
  '03-30': 'Anieli, Amadusza',
  '03-31': 'Beniamina, Kornelii',
  '04-01': 'Grażyny, Ireny',
  '04-02': 'Władysława, Franciszka',
  '04-03': 'Ryszarda, Pankracego',
  '04-04': 'Benedykta, Izydora',
  '04-05': 'Ireny, Wincentego',
  '04-06': 'Celestyna, Wilhelma',
  '04-07': 'Rufina, Donata',
  '04-08': 'Cezaryny, Julii',
  '04-09': 'Mai, Wadima',
  '04-10': 'Michała, Makarego',
  '04-11': 'Leona, Filipa',
  '04-12': 'Juliusza, Zenona',
  '04-13': 'Przemysława, Hermenegildy',
  '04-14': 'Bereniki, Waleriana',
  '04-15': 'Anastazji, Bazylego',
  '04-16': 'Bernadety, Julii',
  '04-17': 'Roberta, Rudolfa',
  '04-18': 'Bogusławy, Apoloniusza',
  '04-19': 'Adolfa, Tymona',
  '04-20': 'Czesława, Agnieszki',
  '04-21': 'Anzelma, Bartosza',
  '04-22': 'Kai, Łukasza',
  '04-23': 'Jerzego, Wojciecha',
  '04-24': 'Horacego, Grzegorza',
  '04-25': 'Marka, Jarosława',
  '04-26': 'Marzeny, Klaudiusza',
  '04-27': 'Zyty, Teofila',
  '04-28': 'Piotra, Walerii',
  '04-29': 'Rity, Bogusława',
  '04-30': 'Mariana, Katarzyny',
  '05-01': 'Józefa, Jeremiasza',
  '05-02': 'Zygmunta, Atanazego',
  '05-03': 'Marii, Antoniny',
  '05-04': 'Moniki, Floriana',
  '05-05': 'Ireny, Waldemara',
  '05-06': 'Judyty, Filipa',
  '05-07': 'Gizeli, Benedykta',
  '05-08': 'Stanisława, Wiktora',
  '05-09': 'Grzegorza, Bożydara',
  '05-10': 'Antoniny, Izydora',
  '05-11': 'Igi, Miry',
  '05-12': 'Pankracego, Dominika',
  '05-13': 'Glorii, Serwacego',
  '05-14': 'Bonifacego, Macieja',
  '05-15': 'Zofii, Izydora',
  '05-16': 'Andrzeja, Jędrzeja',
  '05-17': 'Paschalisa, Sławomira',
  '05-18': 'Eryka, Feliksa',
  '05-19': 'Iwa, Piotra',
  '05-20': 'Bazylego, Bernardyna',
  '05-21': 'Wiktora, Tymoteusza',
  '05-22': 'Heleny, Wiesławy',
  '05-23': 'Iwony, Dezyderiusza',
  '05-24': 'Joanny, Zuzanny',
  '05-25': 'Grzegorza, Urbana',
  '05-26': 'Filipa, Pauliny',
  '05-27': 'Augustyna, Juliana',
  '05-28': 'Jaromira, Wilhelma',
  '05-29': 'Magdaleny, Bogusławy',
  '05-30': 'Ferdynanda, Felicji',
  '05-31': 'Anieli, Petroneli',
  '06-01': 'Justyna, Konrada',
  '06-02': 'Marianny, Marcelina',
  '06-03': 'Leszka, Tamary',
  '06-04': 'Franciszka, Karola',
  '06-05': 'Bonifacego, Waltera',
  '06-06': 'Norberta, Pauliny',
  '06-07': 'Jarosława, Roberta',
  '06-08': 'Medarda, Seweryna',
  '06-09': 'Pelagii, Felicjana',
  '06-10': 'Bogumiła, Małgorzaty',
  '06-11': 'Barnaby, Feliksa',
  '06-12': 'Janiny, Onufrego',
  '06-13': 'Antoniego, Lucjana',
  '06-14': 'Bazylego, Elizy',
  '06-15': 'Wita, Jolanty',
  '06-16': 'Aliny, Benona',
  '06-17': 'Alberta, Marcjana',
  '06-18': 'Elżbiety, Marka',
  '06-19': 'Gerwazego, Protazego',
  '06-20': 'Bogny, Florentyny',
  '06-21': 'Alicji, Alojzego',
  '06-22': 'Pauliny, Tomasza',
  '06-23': 'Wandy, Zenona',
  '06-24': 'Jana, Danuty',
  '06-25': 'Łucji, Wilhelma',
  '06-26': 'Jana, Pawła',
  '06-27': 'Maryli, Władysława',
  '06-28': 'Ireneusza, Leona',
  '06-29': 'Piotra, Pawła',
  '06-30': 'Emilii, Lucyny',
  '07-01': 'Haliny, Mariana',
  '07-02': 'Jagody, Urbana',
  '07-03': 'Jacka, Tomasza',
  '07-04': 'Malwiny, Odona',
  '07-05': 'Antoniego, Filomeny',
  '07-06': 'Gotarda, Łucji',
  '07-07': 'Cyryla, Metodego',
  '07-08': 'Arnolda, Edgara',
  '07-09': 'Lukrecji, Weroniki',
  '07-10': 'Olgi, Witalisa',
  '07-11': 'Benedykta, Olgi',
  '07-12': 'Jana, Brunona',
  '07-13': 'Henryka, Małgorzaty',
  '07-14': 'Kamila, Bonawentury',
  '07-15': 'Henryka, Włodzimierza',
  '07-16': 'Marii, Eustachego',
  '07-17': 'Anety, Bogdana',
  '07-18': 'Kamila, Szymona',
  '07-19': 'Wincentego, Wodzisława',
  '07-20': 'Czesława, Fryderyka',
  '07-21': 'Daniela, Wawrzyńca',
  '07-22': 'Marii, Magdaleny',
  '07-23': 'Bogny, Apolinarego',
  '07-24': 'Kingi, Krystyny',
  '07-25': 'Jakuba, Krzysztofa',
  '07-26': 'Anny, Mirosławy',
  '07-27': 'Lilii, Natalii',
  '07-28': 'Aidy, Wiktora',
  '07-29': 'Marty, Olafa',
  '07-30': 'Julity, Piotra',
  '07-31': 'Ignacego, Lubomira',
  '08-01': 'Nadziei, Justyny',
  '08-02': 'Gustawa, Kariny',
  '08-03': 'Lidii, Augusta',
  '08-04': 'Dominika, Protazego',
  '08-05': 'Marii, Oswalda',
  '08-06': 'Jakuba, Sławy',
  '08-07': 'Kajetana, Doroty',
  '08-08': 'Cypriana, Dominika',
  '08-09': 'Romana, Ryszarda',
  '08-10': 'Borysa, Wawrzyńca',
  '08-11': 'Klary, Zuzanny',
  '08-12': 'Lecha, Innocentego',
  '08-13': 'Diany, Hipolita',
  '08-14': 'Alfreda, Maksymiliana',
  '08-15': 'Marii, Napoleona',
  '08-16': 'Rocha, Stefana',
  '08-17': 'Jacka, Anity',
  '08-18': 'Heleny, Ilony',
  '08-19': 'Bolesława, Juliana',
  '08-20': 'Bernarda, Samuela',
  '08-21': 'Joanny, Kazimiery',
  '08-22': 'Cezarego, Marii',
  '08-23': 'Apolinarego, Róży',
  '08-24': 'Jerzego, Bartłomieja',
  '08-25': 'Ludwika, Luizy',
  '08-26': 'Marii, Zefiryna',
  '08-27': 'Cezarego, Moniki',
  '08-28': 'Augustyna, Patrycji',
  '08-29': 'Beaty, Sabiny',
  '08-30': 'Róży, Szczęsnego',
  '08-31': 'Ramony, Rajmunda',
  '09-01': 'Idziego, Bronisławy',
  '09-02': 'Juliana, Stefana',
  '09-03': 'Izabeli, Szymona',
  '09-04': 'Róży, Rozalii',
  '09-05': 'Doroty, Wawrzyńca',
  '09-06': 'Beaty, Eugeniusza',
  '09-07': 'Melchiora, Reginy',
  '09-08': 'Marii, Adrianny',
  '09-09': 'Piotra, Sergiusza',
  '09-10': 'Łukasza, Aldony',
  '09-11': 'Dagny, Jacka',
  '09-12': 'Gwidona, Radzimira',
  '09-13': 'Eugenii, Aureliusza',
  '09-14': 'Roksany, Bernarda',
  '09-15': 'Albina, Nikodema',
  '09-16': 'Edyty, Korneliusza',
  '09-17': 'Franciszka, Lamberty',
  '09-18': 'Irmy, Józefa',
  '09-19': 'Januarego, Konstancji',
  '09-20': 'Filipiny, Faustyny',
  '09-21': 'Jonasza, Mateusza',
  '09-22': 'Tomasza, Maurycego',
  '09-23': 'Bogusława, Tekli',
  '09-24': 'Gerarda, Teodora',
  '09-25': 'Aurelii, Władysława',
  '09-26': 'Justyny, Cypriana',
  '09-27': 'Wincentego, Mirabeli',
  '09-28': 'Wacława, Tymona',
  '09-29': 'Michała, Rafała',
  '09-30': 'Honoriusza, Wery',
  '10-01': 'Danuty, Teresy',
  '10-02': 'Dionizego, Teofila',
  '10-03': 'Teresy, Heliodora',
  '10-04': 'Franciszka, Rozalii',
  '10-05': 'Igora, Apolinarego',
  '10-06': 'Artura, Brunona',
  '10-07': 'Marii, Marka',
  '10-08': 'Pelagii, Brygidy',
  '10-09': 'Arnolda, Dionizego',
  '10-10': 'Franciszka, Danieli',
  '10-11': 'Aldony, Emila',
  '10-12': 'Eustachego, Maksymiliana',
  '10-13': 'Edwarda, Geralda',
  '10-14': 'Kaliksta, Liwii',
  '10-15': 'Teresy, Jadwigi',
  '10-16': 'Gawła, Florentyny',
  '10-17': 'Małgorzaty, Wiktora',
  '10-18': 'Łukasza, Juliana',
  '10-19': 'Piotra, Pawła',
  '10-20': 'Ireny, Kleopatry',
  '10-21': 'Urszuli, Hilarii',
  '10-22': 'Filipa, Salomei',
  '10-23': 'Marleny, Seweryna',
  '10-24': 'Rafała, Marcina',
  '10-25': 'Darii, Wilhelminy',
  '10-26': 'Lucjana, Ewarysta',
  '10-27': 'Iwony, Sabiny',
  '10-28': 'Szymona, Tadeusza',
  '10-29': 'Euzebii, Wioletty',
  '10-30': 'Zenobii, Przemysława',
  '10-31': 'Urbana, Saturnina',
  '11-01': 'Wszystkich Świętych',
  '11-02': 'Dzień Zaduszny',
  '11-03': 'Sylwii, Marcina',
  '11-04': 'Karola, Olgierda',
  '11-05': 'Sławomira, Elżbiety',
  '11-06': 'Feliksa, Leonarda',
  '11-07': 'Antoniego, Żytomira',
  '11-08': 'Seweryna, Hadriana',
  '11-09': 'Teodora, Ursyna',
  '11-10': 'Leny, Ludomira',
  '11-11': 'Marcina, Bartłomieja',
  '11-12': 'Renaty, Witolda',
  '11-13': 'Stanisława, Arkadii',
  '11-14': 'Rogera, Serafina',
  '11-15': 'Alberta, Leopolda',
  '11-16': 'Gertrudy, Edmunda',
  '11-17': 'Salomei, Grzegorza',
  '11-18': 'Romana, Klaudyny',
  '11-19': 'Elżbiety, Seweryny',
  '11-20': 'Rafała, Edmunda',
  '11-21': 'Janusza, Konrada',
  '11-22': 'Cecylii, Marka',
  '11-23': 'Adeli, Klemensa',
  '11-24': 'Emmy, Flory',
  '11-25': 'Katarzyny, Erazma',
  '11-26': 'Delfiny, Konrada',
  '11-27': 'Waleriana, Wirgiliusza',
  '11-28': 'Lesława, Zdzisława',
  '11-29': 'Błażeja, Saturnina',
  '11-30': 'Andrzeja, Maury',
  '12-01': 'Natalii, Eligiusza',
  '12-02': 'Balbiny, Bibianny',
  '12-03': 'Franciszka, Ksawerego',
  '12-04': 'Barbary, Krystiana',
  '12-05': 'Sabiny, Kryspiny',
  '12-06': 'Mikołaja, Jaremy',
  '12-07': 'Marcina, Ambrożego',
  '12-08': 'Marii, Wirginiusza',
  '12-09': 'Wiesława, Leokadii',
  '12-10': 'Julii, Daniela',
  '12-11': 'Damazego, Waldemara',
  '12-12': 'Dagmary, Aleksandra',
  '12-13': 'Łucji, Otylia',
  '12-14': 'Alfreda, Izydora',
  '12-15': 'Niny, Celiny',
  '12-16': 'Albiny, Zdzisławy',
  '12-17': 'Łazarza, Olimpii',
  '12-18': 'Gracjana, Bogusława',
  '12-19': 'Gabrieli, Dariusza',
  '12-20': 'Bogumiły, Dominika',
  '12-21': 'Tomasza, Tomisława',
  '12-22': 'Zenona, Honoraty',
  '12-23': 'Wiktorii, Sławomiry',
  '12-24': 'Adama, Ewy',
  '12-25': 'Anastazji, Eugenii',
  '12-26': 'Szczepana, Dionizego',
  '12-27': 'Jana, Żanety',
  '12-28': 'Teofili, Godzisława',
  '12-29': 'Tomasza, Dawida',
  '12-30': 'Dawida, Rainera',
  '12-31': 'Sylwestra, Melanii',
}

function getTodayKey(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function formatForecastDay(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pl-PL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Osielsko coordinates: 53.16, 17.94
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=53.16&longitude=17.94&current=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FWarsaw&forecast_days=5'
        )
        const data = await response.json()

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
        })

        // Parse forecast data
        const forecastData: ForecastDay[] = data.daily.time.slice(1, 4).map((date: string, i: number) => ({
          date,
          tempMax: Math.round(data.daily.temperature_2m_max[i + 1]),
          tempMin: Math.round(data.daily.temperature_2m_min[i + 1]),
          weatherCode: data.daily.weather_code[i + 1],
        }))
        setForecast(forecastData)
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

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPopup(false)
    }
    if (showPopup) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showPopup])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 h-full animate-pulse">
        <div className="h-full bg-blue-400/30 rounded"></div>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  const icon = weatherIcons[weather.weatherCode] || '🌡️'
  const description = weatherDescriptions[weather.weatherCode] || 'Brak danych'
  const todayNames = nameDays[getTodayKey()] || ''
  const todayDate = formatDate(new Date())

  return (
    <>
      {/* Main Widget - Clickable */}
      <button
        onClick={() => setShowPopup(true)}
        className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all cursor-pointer text-left"
      >
        {/* Top: Weather */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-2xl font-bold leading-none">{weather.temperature}°</div>
            <div className="text-xs opacity-80 mt-0.5">{description}</div>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-2"></div>

        {/* Bottom: Date & Name Day */}
        <div>
          <div className="text-xs font-medium capitalize">{todayDate}</div>
          {todayNames && (
            <div className="text-xs opacity-80 mt-0.5 truncate">
              🎂 {todayNames}
            </div>
          )}
        </div>

        {/* Click hint */}
        <div className="text-[10px] opacity-60 mt-1 text-center">
          Kliknij po prognozę →
        </div>
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm opacity-80">Osielsko</div>
                  <div className="text-4xl font-bold">{weather.temperature}°C</div>
                  <div className="text-sm opacity-90">{description}</div>
                </div>
                <div className="text-6xl">{icon}</div>
              </div>
              <div className="text-sm opacity-80 capitalize">{todayDate}</div>
              {todayNames && (
                <div className="text-sm opacity-80 mt-1">
                  🎂 Imieniny: {todayNames}
                </div>
              )}
            </div>

            {/* 3-day Forecast */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Prognoza na kolejne dni</h3>
              <div className="space-y-3">
                {forecast.map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{weatherIcons[day.weatherCode] || '🌡️'}</span>
                      <span className="text-sm text-gray-600 capitalize">{formatForecastDay(day.date)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">{day.tempMax}°</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-gray-500">{day.tempMin}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
