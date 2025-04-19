# API Endpoint Implementation Plan: List Flashcards

## 1. Przegląd punktu końcowego
Endpoint służy do pobierania spaginowanej listy fiszek użytkownika. Umożliwia filtrowanie wyników według źródła (manual, ai-full, ai-edited) oraz kontrolę nad paginacją poprzez parametry page i limit. Endpoint wymaga autoryzacji poprzez token JWT.

## 2. Szczegóły żądania
- Metoda HTTP: GET
- URL: `/api/flashcards`
- Nagłówki:
  - Authorization: Bearer {token}
- Parametry URL:
  - `page`: Numer strony (domyślnie: 1)
  - `limit`: Liczba elementów na stronę (domyślnie: 20)
  - `source`: Filtr według źródła ('ai-full', 'ai-edited', 'manual')
- Request Body: Brak

## 3. Wykorzystywane typy
- `ListFlashcardsResponseDTO` (w `src/types.ts`): reprezentuje odpowiedź z listą fiszek i informacjami o paginacji
  - `data`: Array of `FlashcardDTO`
  - `pagination`: `PaginationDTO`
- `FlashcardDTO` (w `src/types.ts`): reprezentuje pojedynczą fiszkę
  - `id`: number
  - `front`: string
  - `back`: string
  - `source`: 'manual' | 'ai-full' | 'ai-edited'
  - `created_at`: string
  - `updated_at`: string
  - `generation_id?`: number | null
- `PaginationDTO` (w `src/types.ts`): reprezentuje informacje o paginacji
  - `total`: number
  - `page`: number
  - `limit`: number
  - `pages`: number

## 4. Szczegóły odpowiedzi
- Sukces:
  - Kod 200 OK
  - Response Body: 
  ```json
  {
    "data": [
      {
        "id": 1,
        "front": "What is the capital of France?",
        "back": "Paris",
        "source": "manual",
        "created_at": "2023-06-01T12:00:00Z",
        "updated_at": "2023-06-01T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
  ```
- Błędy:
  - 401 Unauthorized: Brak lub nieprawidłowy token
  - 400 Bad Request: Nieprawidłowe parametry zapytania
  - 500 Internal Server Error: Problem z bazą danych lub serwisem

## 5. Przepływ danych
1. Użytkownik wysyła żądanie GET do `/api/flashcards` z opcjonalnymi parametrami.
2. Middleware sprawdza token JWT i autoryzację.
3. Walidacja parametrów zapytania odbywa się przy użyciu biblioteki zod.
4. Usługa w `src/lib/services/flashcard.service.ts`:
   - Pobiera dane użytkownika z tokenu JWT
   - Wykonuje zapytanie do bazy danych Supabase z uwzględnieniem RLS
   - Stosuje filtrowanie według parametru source (jeśli podany)
   - Implementuje paginację wyników
5. Endpoint zwraca odpowiedź z danymi fiszek i informacjami o paginacji.

## 6. Względy bezpieczeństwa
- Autoryzacja: Wymagany token JWT w nagłówku `Authorization`.
- Walidacja: Parametry zapytania są walidowane przy użyciu zod.
- Ochrona danych: Użycie RLS w PostgreSQL gwarantuje, że użytkownik uzyska dostęp tylko do swoich danych.
- Parametryzowane zapytania: Zapytania do bazy danych używają parametrów, aby zapobiec atakom SQL injection.

## 7. Obsługa błędów
- 401 Unauthorized: Jeśli token JWT jest nieważny lub nieobecny.
- 400 Bad Request: Jeśli parametry zapytania nie spełniają wymagań (np. ujemna wartość page lub limit).
- 500 Internal Server Error: Problemy wewnętrzne, takie jak błąd komunikacji z bazą danych.
- Szczegółowe komunikaty błędów są zwracane w odpowiedzi JSON.

## 8. Rozważania dotyczące wydajności
- Indeksy: Wykorzystanie indeksów na kolumnach `user_id` i `source` w tabeli `flashcards`.
- Paginacja: Implementacja efektywnej paginacji po stronie serwera.
- Cachowanie: Rozważenie implementacji mechanizmu cachowania dla często używanych zapytań.
- Optymalizacja zapytań: Używanie odpowiednich kolumn w zapytaniu SELECT, aby uniknąć pobierania niepotrzebnych danych.

## 9. Etapy wdrożenia
1. Utworzenie nowego endpointu GET w katalogu `./src/pages/api/flashcards.ts`.
2. Implementacja walidacji parametrów zapytania za pomocą biblioteki zod.
3. Implementacja middleware sprawdzającego token JWT.
4. Utworzenie serwisu `src/lib/services/flashcard.service.ts`:
   - Implementacja metody `listFlashcards` z obsługą paginacji i filtrowania
   - Integracja z Supabase do pobierania danych
5. Implementacja logiki paginacji i filtrowania w serwisie.
6. Testowanie endpointu za pomocą narzędzi takich jak Postman lub Insomnia.
7. Dokumentacja endpointu oraz integracja z front-end, wykorzystując ClientRouter i View Transitions API zgodnie z wytycznymi Astro. 