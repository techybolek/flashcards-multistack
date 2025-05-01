# Specyfikacja modułu uwierzytelniania w aplikacji 10x-cards

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### Strony i Layouty
- W folderze `/src/pages` utworzymy dedykowane strony: `register.astro`, `login.astro` oraz `recover.astro` dla rejestracji, logowania i odzyskiwania hasła.
- Wprowadzimy dedykowany layout autoryzacji (np. `AuthLayout.astro`) dla stron logowania i rejestracji, który oddzieli wygląd stron autoryzowanych od non-auth.
- Strony wymagające autoryzacji wykorzystają middleware w `/src/middleware/index.ts`, by sprawdzać sesję użytkownika oraz przekierowywać nieautoryzowanych do strony logowania.

### Komponenty Client-side
- Kluczowe formularze (np. `LoginForm`, `RegisterForm`, `PasswordRecoveryForm`) utworzone w React i umieszczone w `/src/components`.
- Formularze będą zawierać obsługę walidacji pól (np. poprawność formatu email, minimalna długość hasła) oraz wyświetlanie błędów walidacyjnych.
- Komponenty będą odpowiadać za interakcję z użytkownikiem, wysyłkę żądań do API oraz obsługę odpowiedzi (sukces, błędy, komunikaty serwera).

### Walidacja i Obsługa Błędów
- Walidacja po stronie klienta przy użyciu standardowych mechanizmów (np. React Hooks) oraz ewentualnie bibliotek wspomagających walidację.
- Po stronie serwera zastosowana zostanie walidacja przy użyciu schematów (np. przy użyciu Zod), co umożliwi dokładną weryfikację danych wejściowych.
- Standardowe komunikaty błędów obejmą między innymi: niepoprawny format email, zbyt krótkie hasło, problem z komunikacją z API, czy błąd przy rejestracji/logowaniu.

## 2. LOGIKA BACKENDOWA

### Struktura Endpointów API
- Utworzymy zestaw endpointów API w `/src/pages/api/auth/`:
  - `register.ts` – obsługa rejestracji użytkowników.
  - `login.ts` – obsługa logowania.
  - `recover.ts` – obsługa procesu odzyskiwania hasła.
  - Opcjonalnie `logout.ts` – wylogowywanie użytkowników.
- Każdy endpoint będzie implementował kontrakty danych zgodne z typami zdefiniowanymi w `/src/types.ts`.

### Mechanizm Walidacji Danych Wejściowych
- Wykorzystanie schematów walidacyjnych (np. Zod) do sprawdzania poprawności danych przed przetwarzaniem.
- Implementacja bloków try-catch w celu przechwytywania i logowania wyjątków, a także zwracania poprawnych statusów HTTP oraz komunikatów błędów.

### Integracja z Renderowaniem Server-Side
- Aktualizacja renderowania stron zgodnie z ustawieniami w `astro.config.mjs`, co zapewni spójność i bezpieczeństwo danych przy stronie SSR.
- Middleware w `/src/middleware/index.ts` będzie dbać o sprawdzanie autoryzacji użytkownika przy żądaniach do stron zabezpieczonych.

## 3. SYSTEM AUTENTYKACJI

### Wykorzystanie Supabase Auth
- Integracja z Supabase Auth zostanie wykorzystana jako główny mechanizm uwierzytelniania.
- Supabase SDK będzie wykorzystywane zarówno w endpointach API, jak i w komponentach client-side (React) do rejestracji, logowania, wylogowywania oraz odzyskiwania hasła.
- System będzie zarządzał sesjami użytkowników oraz tokenami autoryzacyjnymi, zapewniając bezpieczny dostęp do chronionych zasobów.

### Kanały Komunikacji i Kontrakty
- Dokładnie zdefiniowane kontrakty danych dla operacji rejestracji (email, password) oraz logowania, co gwarantuje spójność między klientem a serwerem.
- Po udanej operacji uwierzytelniania, mechanizmy callbacków/hooków (np. kontekst React) aktualizują stan sesji użytkownika w aplikacji.

### Obsługa Wyjątków i Bezpieczeństwo
- Standardowe procedury obsługi wyjątków zapewnią logowanie błędów oraz przekazywanie czytelnych komunikatów użytkownikowi.
- Endpointy API będą zabezpieczone przed nadużyciami, np. poprzez logiczne blokady po kilku nieudanych próbach logowania i monitorowanie podejrzanych zachowań.
- Implementacja dodatkowych środków zapobiegających atakom typu brute force oraz integracja z mechanizmami monitorowania i alertowania.

## Podsumowanie

- Architektura modułu uwierzytelniania obejmuje zmiany w warstwie interfejsu użytkownika, logikę backendową oraz integrację z Supabase Auth.
- Kluczowe komponenty: dedykowane strony i layouty Astro, formularze React, API endpoints w `/src/pages/api/auth/` oraz middleware odpowiadający za weryfikację sesji i autoryzację.
- Specyfikacja gwarantuje zgodność z istniejącą aplikacją, umożliwiając bezpieczną, skalowalną i łatwą w utrzymaniu implementację funkcjonalności rejestracji, logowania i odzyskiwania hasła. 