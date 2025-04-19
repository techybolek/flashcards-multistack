# Dokument wymagań produktu (PRD) - Fiszki AI

## 1. Przegląd produktu
Przegląd produktu obejmuje stworzenie systemu do automatycznego generowania oraz ręcznego tworzenia fiszek edukacyjnych. System umożliwia szybkie tworzenie fiszek z wykorzystaniem AI, a także manualne wprowadzanie danych przez użytkownika. Produkt integruje prosty system zarządzania kontami oraz implementację algorytmu powtórek opartego na rozwiązaniach open-source.

## 2. Problem użytkownika
Manualne tworzenie wysokiej jakości fiszek edukacyjnych jest czasochłonne i często prowadzi do obniżenia efektywności nauki. Użytkownicy brakuje narzędzia, które umożliwia szybkie tworzenie i recenzowanie fiszek, co utrudnia korzystanie z metody spaced repetition.

## 3. Wymagania funkcjonalne
- Generowanie fiszek przez AI na podstawie wprowadzonego tekstu (1000–10 000 znaków).
- Recenzja wygenerowanych fiszek poprzez akceptację, edycję lub odrzucenie – zmiany są zapisywane zbiorczo do bazy danych.
- Ręczne tworzenie fiszek z dwoma polami: przód (do 200 znaków) i tył (do 500 znaków).
- Walidacja danych na poziomie frontendu, backendu oraz bazy danych.
- Prosty system kont użytkowników, umożliwiający rejestrację, edycję oraz usuwanie kont (z potwierdzeniem usunięcia).
- Integracja z algorytmem powtórek opartym na bibliotece open-source.

## 4. Granice produktu
- Nie wdrażamy zaawansowanych algorytmów powtórek takich jak SuperMemo czy Anki.
- Brak wsparcia dla importu wielu formatów (PDF, DOCX itd.); system obsługuje wyłącznie kopiuj-wklej.
- Brak funkcjonalności współdzielenia zestawów fiszek między użytkownikami.
- Produkt skierowany wyłącznie na platformę web, mobilne aplikacje nie są przewidziane na MVP.
- Edycja fiszek ograniczona jest do pól "przód" i "tył", bez możliwości dodawania nowych pól.

## 5. Historyjki użytkowników
- US-001:
  - Tytuł: Generowanie fiszek przez AI
  - Opis: Użytkownik wprowadza tekst (1000-10 000 znaków) do systemu, który automatycznie generuje propozycje fiszek.
  - Kryteria akceptacji:
    - Pole wejściowe waliduje poprawność ilości znaków.
    - System generuje propozycje fiszek zgodnie z wprowadzonym tekstem.
    - Użytkownik ma możliwość przeglądania wygenerowanych fiszek.
- US-002:
  - Tytuł: Ręczne tworzenie fiszki
  - Opis: Użytkownik tworzy fiszkę, wpisując informacje do pól "przód" i "tył" z zachowaniem limitów znaków.
  - Kryteria akceptacji:
    - Formularz umożliwia wprowadzanie tekstu do obu pól z odpowiednimi limitami (przód do 200 znaków, tył do 500 znaków).
    - Zatwierdzona fiszka jest zapisywana w systemie.
- US-003:
  - Tytuł: Recenzja generowanych fiszek
  - Opis: Użytkownik przegląda listę fiszek wygenerowanych przez AI i podejmuje decyzje o ich akceptacji, edycji lub odrzuceniu.
  - Kryteria akceptacji:
    - System prezentuje propozycje fiszek z opcjami "zaakceptuj", "edytuj" i "odrzuć".
    - Akceptacja, edycja lub odrzucenie powoduje odpowiednią akcję (zapis, modyfikacja lub ignorowanie) w bazie danych.
- US-004:
  - Tytuł: Zarządzanie kontem użytkownika
  - Opis: Użytkownik ma możliwość rejestracji, logowania, edycji danych oraz usuwania swojego konta z potwierdzeniem akcji.
  - Kryteria akceptacji:
    - System umożliwia utworzenie konta i logowanie.
    - Edycja danych użytkownika działa zgodnie z zasadami walidacji.
    - Proces usuwania konta wymaga potwierdzenia.
- US-005:
  - Tytuł: Edycja istniejących fiszek
  - Opis: Użytkownik może edytować wcześniej zapisane fiszki, zmieniając zawartość pól "przód" i "tył".
  - Kryteria akceptacji:
    - Formularz edycji zachowuje limity znaków dla pól.
    - Zmiany są zapisywane w systemie po zatwierdzeniu.
- US-006:
  - Tytuł: Bezpieczny dostęp do aplikacji
  - Opis: Użytkownik musi przejść przez proces uwierzytelnienia przed uzyskaniem dostępu do systemu, zapewniając bezpieczeństwo danych.
  - Kryteria akceptacji:
    - Proces logowania wymaga bezpiecznej weryfikacji tożsamości.
    - Dostęp do funkcjonalności systemu jest zabezpieczony przed nieautoryzowanym dostępem.

## 6. Metryki sukcesu
- Co najmniej 75% fiszek generowanych przez AI jest akceptowanych przez użytkowników.
- Co najmniej 75% fiszek wprowadzanych do systemu pochodzi z generowania przez AI.
- System generuje fiszki w szybkim tempie, zapewniając niskie opóźnienia.