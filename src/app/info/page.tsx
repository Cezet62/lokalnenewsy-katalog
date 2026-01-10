import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Informacje praktyczne | lokalnenewsy.pl',
  description: 'Ważne telefony, numery alarmowe, harmonogram wywozu śmieci i rozkłady jazdy dla gminy Osielsko.',
}

const emergencyNumbers = [
  { name: 'Numer alarmowy', number: '112', description: 'Ogólny numer alarmowy' },
  { name: 'Pogotowie ratunkowe', number: '999', description: 'W nagłych przypadkach zdrowotnych' },
  { name: 'Straż pożarna', number: '998', description: 'Pożary, wypadki, zagrożenia' },
  { name: 'Policja', number: '997', description: 'Przestępstwa, zagrożenia bezpieczeństwa' },
  { name: 'Pogotowie gazowe', number: '992', description: 'Awarie i ulatnianie gazu' },
  { name: 'Pogotowie energetyczne', number: '991', description: 'Awarie prądu' },
  { name: 'Pogotowie wodno-kanalizacyjne', number: '994', description: 'Awarie wody i kanalizacji' },
]

const importantContacts = [
  {
    category: 'Urząd Gminy',
    contacts: [
      { name: 'Urząd Gminy Osielsko', phone: '52 324 18 00', address: 'ul. Szosa Gdańska 55A, 86-031 Osielsko', hours: 'Pn-Pt 7:30-15:30' },
      { name: 'Wójt Gminy', phone: '52 324 18 01', address: null, hours: null },
      { name: 'USC (Urząd Stanu Cywilnego)', phone: '52 324 18 14', address: null, hours: null },
    ]
  },
  {
    category: 'Służby i instytucje',
    contacts: [
      { name: 'Komisariat Policji Osielsko', phone: '47 751 52 00', address: 'ul. Centralna 6, Osielsko', hours: 'Całodobowo' },
      { name: 'OSP Osielsko', phone: '52 381 33 98', address: 'ul. Szosa Gdańska 57, Osielsko', hours: null },
      { name: 'Ośrodek Zdrowia Osielsko', phone: '52 381 31 94', address: 'ul. Centralna 3, Osielsko', hours: 'Pn-Pt 8:00-18:00' },
      { name: 'Ośrodek Zdrowia Niemcz', phone: '52 381 42 53', address: 'ul. Bydgoska 16, Niemcz', hours: 'Pn-Pt 8:00-18:00' },
    ]
  },
  {
    category: 'Szkoły i przedszkola',
    contacts: [
      { name: 'Szkoła Podstawowa w Osielsku', phone: '52 381 30 43', address: 'ul. Szkolna 2, Osielsko', hours: null },
      { name: 'Szkoła Podstawowa w Niemczu', phone: '52 381 40 29', address: 'ul. Bydgoska 2, Niemcz', hours: null },
      { name: 'Przedszkole w Osielsku', phone: '52 381 34 65', address: 'ul. Centralna 7, Osielsko', hours: null },
      { name: 'Przedszkole w Niemczu', phone: '52 381 43 87', address: 'ul. Matejki 5, Niemcz', hours: null },
    ]
  },
  {
    category: 'Apteki',
    contacts: [
      { name: 'Apteka Zdrowie (Osielsko)', phone: '52 381 31 11', address: 'ul. Szosa Gdańska 53, Osielsko', hours: 'Pn-Pt 8:00-20:00, Sb 8:00-14:00' },
      { name: 'Apteka Pod Lwem (Niemcz)', phone: '52 381 44 22', address: 'ul. Bydgoska 20, Niemcz', hours: 'Pn-Pt 8:00-19:00, Sb 9:00-13:00' },
    ]
  },
]

const garbageSchedule = [
  { type: 'Odpady zmieszane', color: 'bg-gray-600', schedule: 'Co 2 tygodnie (czwartek)' },
  { type: 'Plastik i metal', color: 'bg-yellow-500', schedule: 'Co 2 tygodnie (czwartek)' },
  { type: 'Papier', color: 'bg-blue-500', schedule: 'Raz w miesiącu (pierwszy czwartek)' },
  { type: 'Szkło', color: 'bg-green-500', schedule: 'Raz w miesiącu (drugi czwartek)' },
  { type: 'Bio', color: 'bg-brown-600 !bg-amber-700', schedule: 'Co 2 tygodnie (sezon: co tydzień)' },
]

const busLines = [
  { line: '92', route: 'Bydgoszcz - Osielsko - Żołędowo', operator: 'ZDMiKP Bydgoszcz' },
  { line: '93', route: 'Bydgoszcz - Niemcz - Osielsko', operator: 'ZDMiKP Bydgoszcz' },
  { line: '94', route: 'Bydgoszcz - Jarużyn', operator: 'ZDMiKP Bydgoszcz' },
]

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Informacje praktyczne</h1>
          <p className="text-gray-600 mt-2">
            Ważne numery, kontakty i przydatne informacje dla mieszkańców gminy Osielsko
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Emergency Numbers */}
        <section className="bg-red-50 rounded-xl border border-red-200 p-6">
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Numery alarmowe
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {emergencyNumbers.map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-bold text-red-600">{item.number}</div>
                <div className="font-medium text-gray-900 mt-1">{item.name}</div>
                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Important Contacts */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Ważne kontakty
          </h2>

          <div className="space-y-8">
            {importantContacts.map((section) => (
              <div key={section.category}>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {section.contacts.map((contact) => (
                    <div
                      key={contact.name}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        {contact.address && (
                          <div className="text-sm text-gray-500 mt-0.5">{contact.address}</div>
                        )}
                        {contact.hours && (
                          <div className="text-sm text-gray-500">{contact.hours}</div>
                        )}
                      </div>
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, '')}`}
                        className="mt-2 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Garbage Schedule */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Harmonogram wywozu śmieci
          </h2>
          <p className="text-gray-600 mb-4">
            Orientacyjny harmonogram dla gminy Osielsko. Dokładne terminy sprawdź na{' '}
            <a
              href="https://osielsko.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              stronie Urzędu Gminy
            </a>
            .
          </p>

          <div className="space-y-3">
            {garbageSchedule.map((item) => (
              <div key={item.type} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-4 h-4 rounded-full ${item.color}`} />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{item.type}</span>
                </div>
                <div className="text-sm text-gray-600">{item.schedule}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Pamiętaj:</strong> Pojemniki wystawiaj do godz. 6:00 w dniu odbioru.
              PSZOK (Punkt Selektywnej Zbiórki) czynny w soboty 8:00-14:00.
            </p>
          </div>
        </section>

        {/* Bus Lines */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Komunikacja publiczna
          </h2>

          <div className="space-y-3">
            {busLines.map((bus) => (
              <div key={bus.line} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-purple-600 text-white font-bold text-lg w-12 h-12 rounded-lg flex items-center justify-center">
                  {bus.line}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{bus.route}</div>
                  <div className="text-sm text-gray-500">{bus.operator}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://zdmikp.bydgoszcz.pl/rozklady"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rozkłady jazdy ZDMiKP
            </a>
            <a
              href="https://jakdojade.pl/bydgoszcz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              jakdojade.pl
            </a>
          </div>
        </section>

        {/* Useful Links */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Przydatne linki
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Urząd Gminy Osielsko', url: 'https://osielsko.pl', desc: 'Oficjalna strona gminy' },
              { name: 'BIP Osielsko', url: 'https://bip.osielsko.pl', desc: 'Biuletyn Informacji Publicznej' },
              { name: 'ePUAP', url: 'https://epuap.gov.pl', desc: 'Sprawy urzędowe online' },
              { name: 'Obywatel.gov.pl', url: 'https://obywatel.gov.pl', desc: 'Usługi dla obywateli' },
              { name: 'CEIDG', url: 'https://ceidg.gov.pl', desc: 'Rejestr działalności gospodarczej' },
              { name: 'KRS Online', url: 'https://ekrs.ms.gov.pl', desc: 'Krajowy Rejestr Sądowy' },
            ].map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">{link.name}</div>
                  <div className="text-sm text-gray-500">{link.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-center text-sm text-gray-500">
          Informacje mogą ulec zmianie. W razie wątpliwości skontaktuj się bezpośrednio z daną instytucją.
        </p>
      </div>
    </div>
  )
}
