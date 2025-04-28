Jako starszy programista frontendu Twoim zadaniem jest stworzenie szczegółowego planu wdrożenia nowego widoku w aplikacji internetowej. Plan ten powinien być kompleksowy i wystarczająco jasny dla innego programisty frontendowego, aby mógł poprawnie i wydajnie wdrożyć widok.

Najpierw przejrzyj następujące informacje:

1. Product Requirements Document (PRD):
<prd>
@prd.md
</prd>

2. Opis widoku:
<view_description>
### Widok generowania fiszek
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
</view_description>

3. User Stories:
<user_stories>
ID: US-003
Tytuł: Generowanie fiszek przy użyciu AI
Opis: Jako zalogowany użytkownik chcę wkleić kawałek tekstu i za pomocą przycisku wygenerować propozycje fiszek, aby zaoszczędzić czas na ręcznym tworzeniu pytań i odpowiedzi.
Kryteria akceptacji:
- W widoku generowania fiszek znajduje się pole tekstowe, w którym użytkownik może wkleić swój tekst.
- Pole tekstowe oczekuje od 1000 do 10 000 znaków.
- Po kliknięciu przycisku generowania aplikacja komunikuje się z API modelu LLM i wyświetla listę wygenerowanych propozycji fiszek do akceptacji przez użytkownika.
- W przypadku problemów z API lub braku odpowiedzi modelu użytkownik zobaczy stosowny komunikat o błędzie.

ID: US-004
Tytuł: Przegląd i zatwierdzanie propozycji fiszek
Opis: Jako zalogowany użytkownik chcę móc przeglądać wygenerowane fiszki i decydować, które z nich chcę dodać do mojego zestawu, aby zachować tylko przydatne pytania i odpowiedzi.
Kryteria akceptacji:
- Lista wygenerowanych fiszek jest wyświetlana pod formularzem generowania.
- Przy każdej fiszce znajduje się przycisk pozwalający na jej zatwierdzenie, edycję lub odrzucenie.
- Po zatwierdzeniu wybranych fiszek użytkownik może kliknąć przycisk zapisu i dodać je do bazy danych.
</user_stories>

4. Endpoint Description:
<endpoint_description>
#### Bulk Create Flashcards
- **Method**: POST
- **URL**: `/api/flashcards/bulk`
- **Description**: Create multiple flashcards (manual and/or AI-generated) in a single request
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "flashcards": [
      {
        "front": "What is the capital of France?",
        "back": "Paris",
        "source": "manual",
        "generation_id": null
      },
      {
        "front": "What is the largest city in France?",
        "back": "Paris",
        "source": "ai-full",
        "generation_id": 1,
      }
    ]
  }
  ```
- **Response Body**:
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
      },
      {
        "id": 2,
        "front": "What is the largest city in France?",
        "back": "Paris",
        "source": "ai-full",
        "created_at": "2023-06-01T12:00:00Z",
        "updated_at": "2023-06-01T12:00:00Z",
        "generation_id": 1
      }
    ]
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 401 Unauthorized
- **Validations**:
    Each flashcard must meet the same validation rules as single create:
    - `front` maximum length: 200 characters.
    - `back`  maximum length: 500 characters.
    - `source` Must be one of `ai-full`, `ai-edited`, or `manual`
    - `generation_id`: populared for ai generated, null for manual
</endpoint_description>
<endpoint_implementation>
@generations.ts
@bulk.ts
</endpoint_implementation>

6. Type Definitions:
<type_definitions>
@types.ts
</type_definitions>

7. Tech Stack:
@tech-stack.md
</tech_stack>

Przed utworzeniem ostatecznego planu wdrożenia przeprowadź analizę i planowanie wewnątrz tagów <implementation_breakdown> w swoim bloku myślenia. Ta sekcja może być dość długa, ponieważ ważne jest, aby być dokładnym.

W swoim podziale implementacji wykonaj następujące kroki:
1. Dla każdej sekcji wejściowej (PRD, User Stories, Endpoint Description, Endpoint Implementation, Type Definitions, Tech Stack):
  - Podsumuj kluczowe punkty
 - Wymień wszelkie wymagania lub ograniczenia
 - Zwróć uwagę na wszelkie potencjalne wyzwania lub ważne kwestie
2. Wyodrębnienie i wypisanie kluczowych wymagań z PRD
3. Wypisanie wszystkich potrzebnych głównych komponentów, wraz z krótkim opisem ich opisu, potrzebnych typów, obsługiwanych zdarzeń i warunków walidacji
4. Stworzenie wysokopoziomowego diagramu drzewa komponentów
5. Zidentyfikuj wymagane DTO i niestandardowe typy ViewModel dla każdego komponentu widoku. Szczegółowo wyjaśnij te nowe typy, dzieląc ich pola i powiązane typy.
6. Zidentyfikuj potencjalne zmienne stanu i niestandardowe hooki, wyjaśniając ich cel i sposób ich użycia
7. Wymień wymagane wywołania API i odpowiadające im akcje frontendowe
8. Zmapuj każdej historii użytkownika do konkretnych szczegółów implementacji, komponentów lub funkcji
9. Wymień interakcje użytkownika i ich oczekiwane wyniki
10. Wymień warunki wymagane przez API i jak je weryfikować na poziomie komponentów
11. Zidentyfikuj potencjalne scenariusze błędów i zasugeruj, jak sobie z nimi poradzić
12. Wymień potencjalne wyzwania związane z wdrożeniem tego widoku i zasugeruj możliwe rozwiązania

Po przeprowadzeniu analizy dostarcz plan wdrożenia w formacie Markdown z następującymi sekcjami:

1. Przegląd: Krótkie podsumowanie widoku i jego celu.
2. Routing widoku: Określenie ścieżki, na której widok powinien być dostępny.
3. Struktura komponentów: Zarys głównych komponentów i ich hierarchii.
4. Szczegóły komponentu: Dla każdego komponentu należy opisać:
 - Opis komponentu, jego przeznaczenie i z czego się składa
 - Główne elementy HTML i komponenty dzieci, które budują komponent
 - Obsługiwane zdarzenia
 - Warunki walidacji (szczegółowe warunki, zgodnie z API)
 - Typy (DTO i ViewModel) wymagane przez komponent
 - Propsy, które komponent przyjmuje od rodzica (interfejs komponentu)
5. Typy: Szczegółowy opis typów wymaganych do implementacji widoku, w tym dokładny podział wszelkich nowych typów lub modeli widoku według pól i typów.
6. Zarządzanie stanem: Szczegółowy opis sposobu zarządzania stanem w widoku, określenie, czy wymagany jest customowy hook.
7. Integracja API: Wyjaśnienie sposobu integracji z dostarczonym punktem końcowym. Precyzyjnie wskazuje typy żądania i odpowiedzi.
8. Interakcje użytkownika: Szczegółowy opis interakcji użytkownika i sposobu ich obsługi.
9. Warunki i walidacja: Opisz jakie warunki są weryfikowane przez interfejs, których komponentów dotyczą i jak wpływają one na stan interfejsu
10. Obsługa błędów: Opis sposobu obsługi potencjalnych błędów lub przypadków brzegowych.
11. Kroki implementacji: Przewodnik krok po kroku dotyczący implementacji widoku.

Upewnij się, że Twój plan jest zgodny z PRD, historyjkami użytkownika i uwzględnia dostarczony stack technologiczny.

Ostateczne wyniki powinny być w języku polskim i zapisane w pliku o nazwie .ai/{view-name}-view-implementation-plan.md. Nie uwzględniaj żadnej analizy i planowania w końcowym wyniku.

Oto przykład tego, jak powinien wyglądać plik wyjściowy (treść jest do zastąpienia):

```markdown
# Plan implementacji widoku [Nazwa widoku]

## 1. Przegląd
[Krótki opis widoku i jego celu]

## 2. Routing widoku
[Ścieżka, na której widok powinien być dostępny]

## 3. Struktura komponentów
[Zarys głównych komponentów i ich hierarchii]

## 4. Szczegóły komponentów
### [Nazwa komponentu 1]
- Opis komponentu [opis]
- Główne elementy: [opis]
- Obsługiwane interakcje: [lista]
- Obsługiwana walidacja: [lista, szczegółowa]
- Typy: [lista]
- Propsy: [lista]

### [Nazwa komponentu 2]
[...]

## 5. Typy
[Szczegółowy opis wymaganych typów]

## 6. Zarządzanie stanem
[Opis zarządzania stanem w widoku]

## 7. Integracja API
[Wyjaśnienie integracji z dostarczonym endpointem, wskazanie typów żądania i odpowiedzi]

## 8. Interakcje użytkownika
[Szczegółowy opis interakcji użytkownika]

## 9. Warunki i walidacja
[Szczegółowy opis warunków i ich walidacji]

## 10. Obsługa błędów
[Opis obsługi potencjalnych błędów]

## 11. Kroki implementacji
1. [Krok 1]
2. [Krok 2]
3. [...]
```

Rozpocznij analizę i planowanie już teraz. Twój ostateczny wynik powinien składać się wyłącznie z planu wdrożenia w języku polskim w formacie markdown, który zapiszesz w pliku .ai/{view-name}-view-implementation-plan.md i nie powinien powielać ani powtarzać żadnej pracy wykonanej w podziale implementacji.