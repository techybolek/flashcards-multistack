# API Endpoint Implementation Plan: Generate Flashcards

## 1. Przegląd punktu końcowego
Endpoint służy do generowania propozycji flashcard'ów przy użyciu technologii AI. Użytkownik przesyła tekst o długości między 1000 a 10000 znaków, a system generuje zestaw propozycji flashcard'ów, zapisuje wynik generacji w bazie danych i zwraca statystyki generacji wraz z propozycjami. 

## 2. Szczegóły żądania
- Metoda HTTP: POST
- URL: /api/generations
- Nagłówki:
  - Authorization: Bearer {token}
- Parametry URL: Brak
- Request Body:
  - Struktura: { "text": "..." }
  - Walidacja:
    - Pole "text" jest wymagane
    - Długość tekstu musi być między 1000 a 10000 znaków

## 3. Wykorzystywane typy
- `GenerateFlashcardsCommand` (w `src/types.ts`): reprezentuje dane wejściowe z polem "text".
- `GenerationResultDTO` (w `src/types.ts`): reprezentuje wynik generacji ze zidentyfikowanymi polami:
  - generation_id: number
  - flashcardProposals: Array of `FlashcardProposalDTO` (każdy z polami: front, back, source – zawsze 'ai-full')
  - stats: `GenerationStatsDTO` (z polami: generated_count, generation_duration)

## 4. Szczegóły odpowiedzi
- Sukces:
  - Kod 201 Created
  - Response Body: 
  ```json
  {
    "generation_id": number,
    "flashcardProposals": [
      { "front": "...", "back": "...", "source": "ai-full" },
      ...
    ],
    "stats": { "generated_count": number, "generation_duration": "..." }
  }
  ```
- Błędy:
  - 400 Bad Request: Nieprawidłowy format lub długość tekstu
  - 401 Unauthorized: Brak lub nieprawidłowy token
  - 500 Internal Server Error: Problem z komunikacją z zewnętrzną usługą AI lub zapisem do bazy

## 5. Przepływ danych
1. Użytkownik wysyła żądanie POST do `/api/generations` z polem "text".
2. Middleware sprawdza token JWT i autoryzację.
3. Walidacja danych wejściowych odbywa się przy użyciu biblioteki zod.
4. Usługa w `src/lib/services`:
   - Wywołuje zewnętrzną usługę AI (np. Openrouter.ai) w celu generacji propozycji flashcard'ów.
   - Rejestruje wynik generacji w tabeli `generations` w bazie danych.
5. W przypadku błędu, loguje szczegóły w tabeli `generation_error_logs`.
6. Endpoint zwraca odpowiedź z danymi generacji.

## 6. Względy bezpieczeństwa
- Autoryzacja: Wymagany token JWT w nagłówku `Authorization`.
- Walidacja: Dane wejściowe są walidowane przy użyciu zod, aby zapewnić, że pole "text" mieści się w wymaganym przedziale.
- Ochrona danych: Użycie RLS w PostgreSQL gwarantuje, że użytkownik uzyska dostęp tylko do swoich danych.
- Logowanie błędów: Błędy generacji są logowane w dedykowanej tabeli `generation_error_logs`.

## 7. Obsługa błędów
- 400 Bad Request: Jeśli dane wejściowe nie spełniają wymagań (np. zbyt krótki lub zbyt długi tekst).
- 401 Unauthorized: Jeśli token JWT jest nieważny lub nieobecny.
- 500 Internal Server Error: Problemy wewnętrzne, takie jak błąd komunikacji z usługą AI lub problem zapisu do bazy.
- Opcjonalnie: Mechanizm retry lub fallback dla krytycznych operacji.

## 8. Rozważania dotyczące wydajności
- Asynchroniczne przetwarzanie: Rozważenie użycia mechanizmów kolejkowania lub workerów w przypadku długotrwałych operacji AI.
- Optymalizacja bazy danych: Indeksy na kolumnach używanych w RLS oraz w operacjach zapisu.
- Monitorowanie: Rejestrowanie czasu odpowiedzi i obciążenia endpointu.

## 9. Etapy wdrożenia
1. Utworzenie nowego endpointu POST w katalogu `./src/pages/api/` (np. `generations.ts`).
2. Implementacja walidacji wejścia za pomocą biblioteki zod zgodnie z wymaganiami `GenerateFlashcardsCommand`.
3. Implementacja middleware sprawdzającego token JWT.
4. Implementacja logiki w serwisie w `src/lib/services`:
   - Integracja z usługą AI do generacji flashcard'ów.
   - Zapis wyniku generacji do tabeli `generations`.
5. Logowanie błędów: Implementacja funkcjonalności zapisu błędów w tabeli `generation_error_logs` w razie niepowodzenia generacji.
6. Testowanie endpointu za pomocą narzędzi takich jak Postman lub Insomnia.
7. Dokumentacja endpointu oraz integracja z front-end, wykorzystując ClientRouter i View Transitions API zgodnie z wytycznymi Astro.
8. Wdrożenie na środowisku testowym, przegląd kodu oraz refaktoryzacja na podstawie feedbacku. 