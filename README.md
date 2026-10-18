# Kuro — Anime Keşif Platformu

React + TypeScript + Vite + Redux Toolkit / RTK Query + Tailwind CSS v4 ile hazırlanmış anime keşif arayüzü.

## Gereksinimler

- Node.js 20 veya üzeri önerilir
- Yerel Jikan REST API v4: `http://localhost:8080/v4`

## Kurulum

```bash
npm install
cp .env.example .env
npm run dev
```

Windows PowerShell'de `.env.example` dosyasını `.env` olarak kopyalamak için:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

## API yapılandırması

`.env` dosyası:

```env
VITE_JIKAN_API_BASE_URL=http://localhost:8080/v4
```

Bu URL'nin sonunda `/v4` bulunmalıdır. API endpointleri merkezi olarak `src/features/anime/animeApi.ts` içinde tanımlanmıştır.

Tarayıcı konsolunda CORS hatası görülürse, Vite proxy veya Jikan backend CORS yapılandırması ayrıca ayarlanmalıdır. Bu proje mevcut backend veya Docker servislerini değiştirmez.

## Sayfalar

- `/` Ana sayfa
- `/anime` Anime kataloğu ve arama
- `/anime/:id` Anime detayları, karakterler, bölümler ve öneriler
- `/top` Popüler / en yüksek puanlı listeler
- `/season` Güncel sezon
- `/schedule` Haftalık yayın programı

## Build

```bash
npm run build
```

## Notlar

- Veriler Jikan REST API'den alınır; API erişilemezse hata durumu gösterilir.
- Jikan rate limit uygulayabilir. Hata halinde istekleri tekrar tekrar göndermek yerine kullanıcı yeniden deneme düğmesini kullanabilir.
- API'nin döndürmediği bilgiler sahte olarak üretilmez.
