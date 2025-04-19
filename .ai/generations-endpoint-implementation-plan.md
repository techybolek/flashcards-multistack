# API Endpoint Implementation Plan: Generate Flashcards

## 1. Przegląd punktu końcowego
Endpoint służy do generowania propozycji fiszek przy użyciu AI. Po otrzymaniu długiego tekstu, API waliduje długość tekstu, przesyła go do zewnętrznego modelu AI (np. Openrouter), przetwarza odpowiedzi i zwraca propozycje fiszek wraz ze statystykami generacji. Endpoint rejestruje także błędy związane z procesem generacji w tabeli `generation_error_logs`.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** /api/generations
- **Nagłówki:** Authorization: Bearer {token}
- **Request Body:** 
  - Wymagane pole: 
    - `text`: ciąg znaków o długości między 1000 a 10000 znaków.

## 3. Wykorzystywane typy
- `GenerateFlashcardsCommand` – model polecenia użyty do przyjmowania tekstu wejściowego.
- `GenerationResultDTO` – DTO zawierający:
  - `generation_id`: identyfikator generacji,
  - `flashcardProposals`: lista obiektów typu `FlashcardProposalDTO` (zawsze z `source` ustawionym na `ai-full`),
  - `stats`: obiekt typu `GenerationStatsDTO` zawierający liczbę wygenerowanych propozycji i czas generacji.

## 4. Szczegóły odpowiedzi
- **Kod sukcesu:** 201 Created
- **Struktura odpowiedzi:** 
  ```json
  {
    "generation_id": 1,
    "flashcardProposals": [
      {
        "front": "Przykładowa fiszka",
        "back": "Przykładowa odpowiedź",
        "source": "ai-full"
      }
    ],
    "stats": {
      "generated_count": 1,
      "generation_duration": "PT2S"
    }
  }
  ```
- **Kody błędów:**
  - 400 Bad Request – dla nieprawidłowych danych wejściowych,
  - 401 Unauthorized – dla brakującej lub nieważnej autoryzacji,
  - 500 Internal Server Error – dla błędów po stronie serwera (np. w modelu AI).

## 5. Przepływ danych
1. Klient wysyła żądanie z długim tekstem do endpointu.
2. Middleware serwera weryfikuje token JWT z nagłówka.
3. Żądanie jest walidowane przy użyciu zod schema (sprawdzana długość tekstu).
4. Wyodrębniony tekst jest przekazywany do serwisu generacji, który wysyła zapytanie do modelu AI za pomocą Openrouter.
5. Odpowiedź AI zawiera propozycje fiszek, które są następnie opakowywane w DTO.
6. Dane dotyczące generacji (w tym statystyki) są zapisywane w tabeli `generations`.
7. W przypadku błędu, szczegóły są rejestrowane w tabeli `generation_error_logs`.
8. Ostatecznie, API zwraca sformatowany rezultat wraz z kodem 201.

## 6. Względy bezpieczeństwa
- Walidacja tokena JWT zapewniająca autoryzację użytkownika.
- Stosowanie polityk RLS w bazie danych, aby umożliwić dostęp tylko do zasobów należących do zalogowanego użytkownika.
- Walidacja długości tekstu aby zapobiec nadużyciom.
- Ograniczenie liczby żądań (rate limiting) w celu ochrony przed atakami DDoS.
- Bezpieczne zarządzanie błędami bez ujawniania szczegółów implementacyjnych klientowi.

## 7. Obsługa błędów
- **400 Bad Request:** Błędny format lub długość tekstu.
- **401 Unauthorized:** Brak lub nieważny token autoryzacyjny.
- **500 Internal Server Error:** Problemy z modelem AI lub inne nieprzewidziane błędy.
- Rejestrowanie szczegółowych błędów w tabeli `generation_error_logs` dla dalszej analizy.

## 8. Rozważania dotyczące wydajności
- Wykorzystanie asynchronicznych procesów do komunikacji z modelem AI.
- Optymalizacja zapytań do bazy danych dzięki indeksom na kolumnach (np. `user_id`).
- Implementacja rate limiting aby zabezpieczyć endpoint przed nadmierną liczbą żądań.

## 9. Etapy wdrożenia
1. Utworzenie endpointu w katalogu `/src/pages/api/generations` z metodą POST.
2. Walidacja tokena JWT z użyciem istniejącego middleware.
3. Utworzenie i implementacja zod schema dla `GenerateFlashcardsCommand`.
4. Integracja z serwisem AI, który komunikuje się z Openrouter.
5. Implementacja logiki zapisu w tabeli `generations` oraz rejestracji błędów w `generation_error_logs`.
6. Przetestowanie endpointu, w tym scenariuszy walidacyjnych, autoryzacyjnych i błędów AI.
7. Stworzenie dokumentacji API oraz aktualizacja schematów danych.
8. Code review, testy jednostkowe i end-to-end. 