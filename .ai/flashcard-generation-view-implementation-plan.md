# Plan implementacji widoku generowania fiszek

## 1. Przegląd
Widok generowania fiszek umożliwia użytkownikom tworzenie zestawów fiszek edukacyjnych poprzez wklejenie tekstu i wykorzystanie modelu AI do automatycznego generowania propozycji pytań i odpowiedzi. Użytkownik może przeglądać wygenerowane propozycje fiszek, akceptować je, edytować lub odrzucać, a następnie zapisać wybrane fiszki do swojej kolekcji. Widok ten jest głównym punktem wejścia do aplikacji i stanowi kluczową funkcjonalność produktu.

## 2. Routing widoku
Widok generowania fiszek będzie dostępny pod ścieżką główną aplikacji `/generate`.

## 3. Struktura komponentów
```
FlashcardGenerationView
├── TextInputForm
│   ├── TextArea
│   ├── CharacterCounter
│   └── GenerateButton
├── GenerationStatus
│   ├── LoadingIndicator
│   └── ErrorMessage
├── FlashcardProposalsList
│   ├── FlashcardProposalItem
│   │   ├── FlashcardContent
│   │   ├── ActionButtons
│   │   └── EditForm
│   └── EmptyState
├── ActionButtons
│   ├── SaveAcceptedButton
│   └── SaveAllButton
└── ToastNotifications
```

## 4. Szczegóły komponentów

### FlashcardGenerationView
- **Opis komponentu**: Główny komponent widoku, który zarządza stanem i koordynuje interakcje między komponentami potomnymi.
- **Główne elementy**: Kontener z układem flexbox/grid, który organizuje komponenty potomne.
- **Obsługiwane interakcje**: Zarządzanie stanem generowania, obsługa zapisywania fiszek.
- **Obsługiwana walidacja**: Brak bezpośredniej walidacji, deleguje do komponentów potomnych.
- **Typy**: Wykorzystuje `GenerationResultDTO`, `FlashcardProposalDTO`, `CreateFlashcardCommand`.
- **Props**: Brak, jest to komponent główny.

### TextInputForm
- **Opis komponentu**: Formularz zawierający pole tekstowe do wprowadzenia treści oraz przycisk do generowania fiszek.
- **Główne elementy**: TextArea, CharacterCounter, GenerateButton.
- **Obsługiwane interakcje**: Wprowadzanie tekstu, walidacja długości, wysyłanie żądania generowania.
- **Obsługiwana walidacja**: Walidacja długości tekstu (1000-10000 znaków).
- **Typy**: Wykorzystuje `GenerateFlashcardsCommand`.
- **Props**: 
  - `onGenerate`: (text: string) => Promise<void> - funkcja wywoływana po kliknięciu przycisku generowania.
  - `isGenerating`: boolean - stan generowania, wpływający na stan przycisku.

### TextArea
- **Opis komponentu**: Pole tekstowe do wprowadzenia treści, z którym będzie generowana fiszka.
- **Główne elementy**: Textarea z etykietą i komunikatem o błędzie.
- **Obsługiwane interakcje**: Wprowadzanie tekstu, walidacja długości.
- **Obsługiwana walidacja**: Walidacja długości tekstu (1000-10000 znaków).
- **Typy**: Brak specyficznych typów.
- **Props**:
  - `value`: string - wartość pola tekstowego.
  - `onChange`: (value: string) => void - funkcja wywoływana przy zmianie wartości.
  - `error`: string | null - komunikat błędu.
  - `isValid`: boolean - stan walidacji.

### CharacterCounter
- **Opis komponentu**: Wyświetla licznik znaków dla pola tekstowego.
- **Główne elementy**: Tekst z licznikiem.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych typów.
- **Props**:
  - `count`: number - aktualna liczba znaków.
  - `min`: number - minimalna wymagana liczba znaków (1000).
  - `max`: number - maksymalna dozwolona liczba znaków (10000).

### GenerateButton
- **Opis komponentu**: Przycisk do uruchomienia procesu generowania fiszek.
- **Główne elementy**: Przycisk z ikoną i tekstem.
- **Obsługiwane interakcje**: Kliknięcie, stan ładowania.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych typów.
- **Props**:
  - `onClick`: () => void - funkcja wywoływana po kliknięciu.
  - `isLoading`: boolean - stan ładowania.
  - `isDisabled`: boolean - stan wyłączony.

### GenerationStatus
- **Opis komponentu**: Wyświetla status procesu generowania fiszek.
- **Główne elementy**: LoadingIndicator, ErrorMessage.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych typów.
- **Props**:
  - `isLoading`: boolean - stan ładowania.
  - `error`: string | null - komunikat błędu.

### FlashcardProposalsList
- **Opis komponentu**: Lista wygenerowanych propozycji fiszek.
- **Główne elementy**: Lista FlashcardProposalItem, EmptyState.
- **Obsługiwane interakcje**: Brak bezpośrednich interakcji, deleguje do komponentów potomnych.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Wykorzystuje `FlashcardProposalDTO[]`.
- **Props**:
  - `proposals`: FlashcardProposalDTO[] - lista propozycji fiszek.
  - `onAccept`: (index: number) => void - funkcja wywoływana przy akceptacji fiszki.
  - `onEdit`: (index: number, front: string, back: string) => void - funkcja wywoływana przy edycji fiszki.
  - `onReject`: (index: number) => void - funkcja wywoływana przy odrzuceniu fiszki.

### FlashcardProposalItem
- **Opis komponentu**: Pojedynczy element listy propozycji fiszek.
- **Główne elementy**: FlashcardContent, ActionButtons, EditForm.
- **Obsługiwane interakcje**: Akceptacja, edycja, odrzucenie fiszki.
- **Obsługiwana walidacja**: Walidacja pól podczas edycji.
- **Typy**: Wykorzystuje `FlashcardProposalDTO`.
- **Props**:
  - `proposal`: FlashcardProposalDTO - propozycja fiszki.
  - `index`: number - indeks propozycji w liście.
  - `status`: 'pending' | 'accepted' | 'edited' | 'rejected' - status propozycji.
  - `onAccept`: (index: number) => void - funkcja wywoływana przy akceptacji.
  - `onEdit`: (index: number, front: string, back: string) => void - funkcja wywoływana przy edycji.
  - `onReject`: (index: number) => void - funkcja wywoływana przy odrzuceniu.

### FlashcardContent
- **Opis komponentu**: Wyświetla zawartość fiszki (przód i tył).
- **Główne elementy**: Karty z przodem i tyłem fiszki.
- **Obsługiwane interakcje**: Przełączanie widoczności przodu/tyłu.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Wykorzystuje `FlashcardProposalDTO`.
- **Props**:
  - `front`: string - przód fiszki.
  - `back`: string - tył fiszki.

### ActionButtons
- **Opis komponentu**: Przyciski akcji dla fiszki.
- **Główne elementy**: Przyciski akceptacji, edycji, odrzucenia.
- **Obsługiwane interakcje**: Kliknięcie przycisków.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych typów.
- **Props**:
  - `status`: 'pending' | 'accepted' | 'edited' | 'rejected' - status fiszki.
  - `onAccept`: () => void - funkcja wywoływana przy akceptacji.
  - `onEdit`: () => void - funkcja wywoływana przy edycji.
  - `onReject`: () => void - funkcja wywoływana przy odrzuceniu.

### EditForm
- **Opis komponentu**: Formularz edycji fiszki.
- **Główne elementy**: Pola tekstowe dla przodu i tyłu fiszki, przyciski zapisu i anulowania.
- **Obsługiwane interakcje**: Edycja pól, zapisanie zmian, anulowanie edycji.
- **Obsługiwana walidacja**: Walidacja długości pól (przód: max 200 znaków, tył: max 500 znaków).
- **Typy**: Brak specyficznych typów.
- **Props**:
  - `front`: string - przód fiszki.
  - `back`: string - tył fiszki.
  - `onSave`: (front: string, back: string) => void - funkcja wywoływana przy zapisie.
  - `onCancel`: () => void - funkcja wywoływana przy anulowaniu.

### ActionButtons (główny)
- **Opis komponentu**: Przyciski akcji dla całej listy fiszek.
- **Główne elementy**: Przyciski "Zapisz zaakceptowane" i "Zapisz wszystkie".
- **Obsługiwane interakcje**: Kliknięcie przycisków.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych typów.
- **Props**:
  - `hasAccepted`: boolean - czy są zaakceptowane fiszki.
  - `hasProposals`: boolean - czy są propozycje fiszek.
  - `onSaveAccepted`: () => void - funkcja wywoływana przy zapisie zaakceptowanych.
  - `onSaveAll`: () => void - funkcja wywoływana przy zapisie wszystkich.

### ToastNotifications
- **Opis komponentu**: Komunikaty toast dla użytkownika.
- **Główne elementy**: Komunikaty o sukcesie, błędzie, informacji.
- **Obsługiwane interakcje**: Automatyczne zamykanie, ręczne zamykanie.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych typów.
- **Props**:
  - `notifications`: Notification[] - lista powiadomień.
  - `onDismiss`: (id: string) => void - funkcja wywoływana przy zamknięciu powiadomienia.

## 5. Typy

### ViewModel dla widoku
```typescript
interface FlashcardGenerationViewModel {
  // Stan formularza
  text: string;
  isTextValid: boolean;
  textError: string | null;
  
  // Stan generowania
  isGenerating: boolean;
  generationError: string | null;
  
  // Propozycje fiszek
  proposals: FlashcardProposalDTO[];
  proposalStatuses: Record<number, 'pending' | 'accepted' | 'edited' | 'rejected'>;
  
  // Statystyki
  stats: GenerationStatsDTO | null;
  
  // Identyfikator generowania
  generationId: number | null;
}
```

### Typ dla powiadomień
```typescript
interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}
```

### Typ dla edytowanej fiszki
```typescript
interface EditedFlashcard {
  index: number;
  front: string;
  back: string;
}
```

## 6. Zarządzanie stanem
Stan widoku będzie zarządzany za pomocą React hooks. Główny komponent `FlashcardGenerationView` będzie przechowywał stan w następujących zmiennych:

```typescript
// Stan formularza
const [text, setText] = useState<string>('');
const [isTextValid, setIsTextValid] = useState<boolean>(false);
const [textError, setTextError] = useState<string | null>(null);

// Stan generowania
const [isGenerating, setIsGenerating] = useState<boolean>(false);
const [generationError, setGenerationError] = useState<string | null>(null);

// Propozycje fiszek
const [proposals, setProposals] = useState<FlashcardProposalDTO[]>([]);
const [proposalStatuses, setProposalStatuses] = useState<Record<number, 'pending' | 'accepted' | 'edited' | 'rejected'>>({});

// Statystyki
const [stats, setStats] = useState<GenerationStatsDTO | null>(null);

// Identyfikator generowania
const [generationId, setGenerationId] = useState<number | null>(null);

// Powiadomienia
const [notifications, setNotifications] = useState<Notification[]>([]);
```

Dodatkowo, zostanie utworzony custom hook `useFlashcardGeneration`, który będzie zawierał logikę związaną z generowaniem fiszek i zarządzaniem ich stanem:

```typescript
function useFlashcardGeneration() {
  // Implementacja logiki generowania i zarządzania fiszkami
  
  return {
    // Stan i metody
  };
}
```

## 7. Integracja API
Widok będzie komunikował się z dwoma endpointami API:

### 1. Generowanie fiszek
- **Endpoint**: `/api/generations`
- **Metoda**: POST
- **Request**: `GenerateFlashcardsCommand` (text: string)
- **Response**: `GenerationResultDTO` (generation_id: number, flashcardProposals: FlashcardProposalDTO[], stats: GenerationStatsDTO)

```typescript
async function generateFlashcards(text: string): Promise<GenerationResultDTO> {
  const response = await fetch('/api/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Wystąpił błąd podczas generowania fiszek');
  }
  
  return await response.json();
}
```

### 2. Zapisywanie fiszek
- **Endpoint**: `/api/flashcards/bulk`
- **Metoda**: POST
- **Request**: Tablica `CreateFlashcardCommand[]`
- **Response**: `{ data: null }`

```typescript
async function saveFlashcards(flashcards: CreateFlashcardCommand[]): Promise<void> {
  const response = await fetch('/api/flashcards/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flashcards),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Wystąpił błąd podczas zapisywania fiszek');
  }
}
```

## 8. Interakcje użytkownika

### Wprowadzanie tekstu
1. Użytkownik wkleja lub wpisuje tekst w pole tekstowe.
2. Aplikacja waliduje długość tekstu (1000-10000 znaków).
3. Aplikacja wyświetla licznik znaków i ewentualne błędy walidacji.
4. Przycisk "Generuj" jest aktywny tylko wtedy, gdy tekst jest poprawny.

### Generowanie fiszek
1. Użytkownik klika przycisk "Generuj".
2. Aplikacja wyświetla wskaźnik ładowania.
3. Aplikacja wysyła żądanie do API.
4. Po otrzymaniu odpowiedzi, aplikacja wyświetla listę wygenerowanych fiszek.
5. W przypadku błędu, aplikacja wyświetla komunikat o błędzie.

### Przeglądanie i zarządzanie fiszkami
1. Użytkownik przegląda wygenerowane fiszki, klikając na nie, aby zobaczyć przód i tył.
2. Użytkownik może zaakceptować fiszkę, klikając przycisk "Akceptuj".
3. Użytkownik może edytować fiszkę, klikając przycisk "Edytuj", wprowadzając zmiany i zapisując je.
4. Użytkownik może odrzucić fiszkę, klikając przycisk "Odrzuć".
5. Przycisk "Zapisz zaakceptowane" jest aktywny tylko wtedy, gdy są zaakceptowane fiszki.
6. Przycisk "Zapisz wszystkie" jest aktywny tylko wtedy, gdy są propozycje fiszek.

### Zapisywanie fiszek
1. Użytkownik klika przycisk "Zapisz zaakceptowane" lub "Zapisz wszystkie".
2. Aplikacja przygotowuje dane do zapisania.
3. Aplikacja wysyła żądanie do API.
4. Po pomyślnym zapisaniu, aplikacja wyświetla komunikat o sukcesie.
5. W przypadku błędu, aplikacja wyświetla komunikat o błędzie.

## 9. Warunki i walidacja

### Walidacja tekstu
- **Komponent**: TextInputForm, TextArea
- **Warunki**:
  - Tekst musi mieć co najmniej 1000 znaków.
  - Tekst nie może przekraczać 10000 znaków.
- **Wpływ na interfejs**:
  - Przycisk "Generuj" jest nieaktywny, gdy tekst jest niepoprawny.
  - Wyświetlany jest komunikat o błędzie, gdy tekst jest za krótki lub za długi.
  - Licznik znaków zmienia kolor, gdy tekst jest poza zakresem.

### Walidacja fiszek
- **Komponent**: EditForm
- **Warunki**:
  - Przód fiszki nie może przekraczać 200 znaków.
  - Tył fiszki nie może przekraczać 500 znaków.
- **Wpływ na interfejs**:
  - Przycisk "Zapisz" w formularzu edycji jest nieaktywny, gdy dane są niepoprawne.
  - Wyświetlany jest komunikat o błędzie, gdy dane są niepoprawne.

### Warunki zapisywania
- **Komponent**: ActionButtons
- **Warunki**:
  - Przycisk "Zapisz zaakceptowane" jest aktywny tylko wtedy, gdy są zaakceptowane fiszki.
  - Przycisk "Zapisz wszystkie" jest aktywny tylko wtedy, gdy są propozycje fiszek.
- **Wpływ na interfejs**:
  - Przyciski są nieaktywne, gdy nie ma fiszek do zapisania.

## 10. Obsługa błędów

### Błędy generowania
- **Źródło**: API `/api/generations`
- **Obsługa**:
  - Wyświetlenie komunikatu o błędzie w komponencie GenerationStatus.
  - Zapisanie błędu w logach.
  - Możliwość ponowienia generowania.

### Błędy zapisywania
- **Źródło**: API `/api/flashcards/bulk`
- **Obsługa**:
  - Wyświetlenie komunikatu o błędzie w komponencie ToastNotifications.
  - Zapisanie błędu w logach.
  - Możliwość ponowienia zapisywania.

### Błędy walidacji
- **Źródło**: Walidacja formularza
- **Obsługa**:
  - Wyświetlenie komunikatu o błędzie inline.
  - Dezaktywacja przycisków, gdy dane są niepoprawne.

### Błędy sieciowe
- **Źródło**: Problemy z połączeniem
- **Obsługa**:
  - Wyświetlenie komunikatu o błędzie w komponencie ToastNotifications.
  - Możliwość ponowienia operacji.

## 11. Kroki implementacji

1. **Przygotowanie struktury projektu**:
   - Utworzenie komponentów zgodnie z hierarchią.
   - Definicja typów i interfejsów.

2. **Implementacja komponentów podstawowych**:
   - TextInputForm z walidacją.
   - CharacterCounter.
   - GenerateButton.
   - GenerationStatus.

3. **Implementacja logiki generowania**:
   - Utworzenie custom hook useFlashcardGeneration.
   - Implementacja funkcji komunikacji z API.
   - Obsługa stanu generowania.

4. **Implementacja komponentów listy fiszek**:
   - FlashcardProposalsList.
   - FlashcardProposalItem.
   - FlashcardContent.
   - ActionButtons dla fiszek.

5. **Implementacja formularza edycji**:
   - EditForm z walidacją.
   - Obsługa stanu edycji.

6. **Implementacja akcji zapisywania**:
   - ActionButtons główne.
   - Funkcja komunikacji z API.
   - Obsługa stanu zapisywania.

7. **Implementacja powiadomień**:
   - ToastNotifications.
   - Obsługa różnych typów powiadomień.

8. **Integracja komponentów**:
   - Połączenie wszystkich komponentów w głównym widoku.
   - Przekazywanie props i obsługa zdarzeń.

9. **Testowanie i debugowanie**:
   - Testowanie walidacji.
   - Testowanie komunikacji z API.
   - Testowanie obsługi błędów.

10. **Dostrajanie UI/UX**:
    - Responsywność.
    - Dostępność (ARIA).
    - Animacje i przejścia.

11. **Dokumentacja**:
    - Dokumentacja komponentów.
    - Dokumentacja typów.
    - Dokumentacja logiki biznesowej. 