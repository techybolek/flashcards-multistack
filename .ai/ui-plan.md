# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI

10x-cards to aplikacja webowa umożliwiająca szybkie tworzenie i zarządzanie zestawami fiszek edukacyjnych z wykorzystaniem modeli LLM. Architektura UI została zaprojektowana z myślą o prostocie, efektywności i intuicyjności, skupiając się na głównym przypadku użycia - generowaniu fiszek z tekstu. W MVP pomijamy logowanie i rejestrację, aby uprościć doświadczenie użytkownika i skupić się na kluczowych funkcjonalnościach.

Aplikacja składa się z dwóch głównych widoków: widoku generowania fiszek (strona główna) oraz widoku "Moje fiszki". Interfejs wykorzystuje komponenty Shadcn/ui i Tailwind CSS, zapewniając spójny wygląd, responsywność i dostępność. Zarządzanie stanem aplikacji opiera się na lokalnym przechowywaniu listy propozycji fiszek oraz ich statusów, z natychmiastową aktualizacją UI po każdej akcji użytkownika.

## 2. Lista widoków

### Widok generowania fiszek (strona główna)
- **Ścieżka widoku**: `/`
- **Główny cel**: Umożliwienie użytkownikowi generowania propozycji fiszek na podstawie wklejonego tekstu
- **Kluczowe informacje do wyświetlenia**:
  - Pole tekstowe do wprowadzenia treści (1000-10000 znaków)
  - Licznik znaków
  - Lista wygenerowanych propozycji fiszek
  - Status każdej fiszki (zaakceptowana, edytowana, usunięta)
- **Kluczowe komponenty widoku**:
  - Formularz generowania z polem tekstowym i przyciskiem "Generate"
  - Lista propozycji fiszek z opcjami akcji dla każdej fiszki
  - Przyciski "Save Accepted" i "Save All" pod listą
  - Komunikaty o błędach i sukcesie
- **UX, dostępność i względy bezpieczeństwa**:
  - Walidacja inline dla pola tekstowego (1000-10000 znaków)
  - Wyświetlanie krytycznych błędów inline, mniej istotnych jako toast
  - Możliwość cofnięcia usunięcia fiszki przez toast
  - Przycisk "Save Accepted" aktywny tylko, gdy są zaakceptowane fiszki
  - Responsywny układ dostosowujący się do różnych rozmiarów ekranu
  - Wsparcie dla czytników ekranu poprzez odpowiednie etykiety ARIA

### Widok "Moje fiszki"
- **Ścieżka widoku**: `/my-flashcards`
- **Główny cel**: Wyświetlanie i zarządzanie zapisanymi fiszkami
- **Kluczowe informacje do wyświetlenia**:
  - Lista zapisanych fiszek (zarówno ręcznie utworzonych, jak i wygenerowanych przez AI)
  - Informacje o każdej fiszce (przód, tył, źródło, data utworzenia)
  - Status każdej fiszki
- **Kluczowe komponenty widoku**:
  - Lista fiszek z opcjami edycji i usuwania
  - Przycisk dodania nowej fiszki
  - Formularz tworzenia/edycji fiszki
  - Potwierdzenie usunięcia fiszki
- **UX, dostępność i względy bezpieczeństwa**:
  - Paginacja dla dużych list fiszek
  - Filtrowanie po źródle (manual, ai-full, ai-edited)
  - Walidacja inline dla pól edycji (front: max 200, back: max 500 znaków)
  - Potwierdzenie przed trwałym usunięciem fiszki
  - Responsywny układ dostosowujący się do różnych rozmiarów ekranu
  - Wsparcie dla czytników ekranu poprzez odpowiednie etykiety ARIA

## 3. Mapa podróży użytkownika

### Główny przypadek użycia: Generowanie i zapisywanie fiszek

1. Użytkownik wchodzi na stronę główną (widok generowania fiszek)
2. Użytkownik wkleja tekst do pola tekstowego (1000-10000 znaków)
3. Użytkownik kliknia przycisk "Generate"
4. Aplikacja wywołuje endpoint generations API
5. Aplikacja wyświetla listę wygenerowanych propozycji fiszek
6. Użytkownik przegląda propozycje i:
   - Zatwierdza wybrane fiszki
   - Edytuje wybrane fiszki (inline)
   - Usuwa niepotrzebne fiszki (z możliwością cofnięcia przez toast)
7. Użytkownik kliknia przycisk "Save Accepted" lub "Save All"
8. Aplikacja wywołuje endpoint bulk create API
9. Aplikacja odświeża listę propozycji fiszek
10. Użytkownik może kontynuować generowanie lub przejść do widoku "Moje fiszki"

### Przypadek użycia: Ręczne tworzenie fiszek

1. Użytkownik przechodzi do widoku "Moje fiszki"
2. Użytkownik kliknia przycisk "Dodaj nową fiszkę"
3. Aplikacja wyświetla formularz tworzenia fiszki
4. Użytkownik wypełnia pola "Przód" i "Tył"
5. Użytkownik kliknia przycisk "Zapisz"
6. Aplikacja wywołuje endpoint create flashcard API
7. Nowa fiszka pojawia się na liście

### Przypadek użycia: Edycja i usuwanie fiszek

1. Użytkownik przechodzi do widoku "Moje fiszki"
2. Użytkownik znajduje fiszkę do edycji/usunięcia
3. Użytkownik kliknia ikonę edycji lub usuwania
4. W przypadku edycji:
   - Aplikacja przełącza fiszkę w tryb edycji
   - Użytkownik modyfikuje pola
   - Użytkownik zatwierdza zmiany
   - Aplikacja wywołuje endpoint update flashcard API
5. W przypadku usuwania:
   - Aplikacja wyświetla potwierdzenie usunięcia
   - Użytkownik potwierdza
   - Aplikacja wywołuje endpoint delete flashcard API
   - Fiszka zostaje usunięta z listy

## 4. Układ i struktura nawigacji

Nawigacja w aplikacji 10x-cards jest minimalistyczna i intuicyjna, skupiając się na dwóch głównych widokach:

1. **Strona główna (widok generowania fiszek)** - dostępna pod ścieżką `/`
2. **Moje fiszki** - dostępna pod ścieżką `/my-flashcards`

Nawigacja między widokami odbywa się poprzez pasek nawigacyjny (navbar) umieszczony na górze strony, zawierający:
- Logo/nazwę aplikacji (po lewej stronie)
- Linki do głównych widoków (po prawej stronie)

Pasek nawigacyjny jest zawsze widoczny, zapewniając łatwy dostęp do obu głównych funkcjonalności aplikacji. W przyszłości, gdy zostanie dodana autentykacja, pasek nawigacyjny zostanie rozszerzony o opcje logowania/rejestracji oraz menu użytkownika.

## 5. Kluczowe komponenty

### TextArea z licznikiem znaków
- Komponent do wprowadzania tekstu z wbudowanym licznikiem znaków
- Walidacja inline (1000-10000 znaków)
- Wyświetlanie błędów walidacji pod komponentem
- Responsywny design

### Lista propozycji fiszek
- Komponent wyświetlający listę wygenerowanych propozycji fiszek
- Każda fiszka zawiera:
  - Pole "Przód" i "Tył"
  - Status (zaakceptowana, edytowana, usunięta)
  - Ikony akcji (Zatwierdź, Edytuj, Usuń)
- Edycja inline z natychmiastową walidacją
- Możliwość cofnięcia usunięcia przez toast

### Przyciski akcji
- Przycisk "Generate" do generowania fiszek
- Przyciski "Save Accepted" i "Save All" do zapisywania fiszek
- Przycisk "Dodaj nową fiszkę" w widoku "Moje fiszki"
- Przyciski edycji i usuwania dla każdej fiszki

### Komunikaty i powiadomienia
- Toast do wyświetlania komunikatów sukcesu i mniej istotnych błędów
- Komunikaty o błędach inline dla walidacji i krytycznych problemów
- Potwierdzenia dla operacji usuwania

### Formularz tworzenia/edycji fiszki
- Pola "Przód" i "Tył" z walidacją (max 200/500 znaków)
- Przyciski "Zapisz" i "Anuluj"
- Wyświetlanie błędów walidacji pod polami

### Pasek nawigacyjny
- Logo/nazwa aplikacji
- Linki do głównych widoków
- Responsywny design (menu hamburgerowe na małych ekranach) 