# Demo Primărie - portal cetățean și dashboard operațional

Aplicație demo în română pentru primării, construită cu Next.js și Tailwind CSS.

Include:
- formular de depunere cereri și sesizări
- tracking status după număr de înregistrare
- dashboard cu KPI și grafice
- hartă vizuală a problemelor raportate
- persistență locală în browser pentru demo

## Cerințe

- Node.js 20.9+ 
- npm 10+

## Rulare locală

```bash
npm install
npm run dev
```

Aplicația pornește implicit la `http://localhost:3000`.

## Build producție

```bash
npm install
npm run build
npm run start
```

## Deploy pe Vercel

1. Creezi un repository nou în GitHub.
2. Uploadezi toate fișierele din acest pachet.
3. În Vercel alegi **Add New Project** și imporți repository-ul.
4. Vercel detectează automat Next.js și rulează build-ul.
5. Nu sunt necesare variabile de mediu pentru acest demo.

## Deploy cu Docker

```bash
docker build -t primarie-demo .
docker run -p 3000:3000 primarie-demo
```

## Structură

- `app/` - layout, pagina principală și endpoint de health check
- `components/` - componente UI și demo
- `lib/` - date mock, utilitare și logica de persistență locală
- `public/` - asset-uri publice

## Observații

- Aceasta este o aplicație demo, fără autentificare reală și fără backend persistent.
- Datele noi introduse sunt salvate în `localStorage` pentru sesiunea/browserul curent.
- Pentru producție reală, următorii pași recomandați sunt: bază de date, autentificare, upload foto, geolocație reală, audit log și roluri pentru operatori.
