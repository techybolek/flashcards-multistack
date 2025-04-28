<conversation_summary>
<decisions>
1. Logowanie i rejestracja są pomijane w MVP – użytkownik trafia od razu na stronę generowania fiszek.
2. Strona główna to widok generowania fiszek (generations page), gdzie użytkownik wprowadza tekst do generowania propozycji fiszek.
3. Po kliknięciu "Generate" wywoływany jest endpoint generations API, a odpowiedzią jest lista propozycji fiszek.
4. Fiszki wyświetlane są w formie listy, każda z opcjami: Zatwierdź, Usuń, Edytuj (ikony/akcje).
5. Edycja fiszki odbywa się inline na liście, z walidacją i błędami wyświetlanymi bezpośrednio pod polem.
6. Krytyczne błędy (np. walidacja, błąd generowania) są wyświetlane inline, mniej istotne i sukcesy – jako toast.
7. Dwa przyciski pod listą: "Save Accepted" (zapisuje tylko zaakceptowane fiszki) oraz "Save All" (zapisuje wszystkie propozycje).
8. Przycisk "Save Accepted" jest aktywny tylko, gdy są zaakceptowane fiszki.
9. Usuwanie propozycji fiszki z listy nie wymaga potwierdzenia, ale umożliwia cofnięcie (undo) przez toast.
</decisions>
<matched_recommendations>
1. Ustaw stronę główną jako widok generowania fiszek, bez ekranu logowania/rejestracji.
2. Pole tekstowe do generowania fiszek z licznikiem znaków i walidacją inline.
3. Po kliknięciu "Generate" wywołuj API generations i wyświetlaj listę propozycji fiszek poniżej.
4. Każda fiszka na liście z opcjami: Zatwierdź, Usuń, Edytuj (ikony/akcje).
5. Edycja fiszki inline na liście, z walidacją pól i błędami wyświetlanymi bezpośrednio pod edytowanym polem.
6. Błędy krytyczne wyświetlaj inline, komunikaty sukcesu i mniej istotne błędy jako toast.
7. Dwa przyciski pod listą: "Save Accepted" oraz "Save All".
8. Przycisk "Save Accepted" aktywny tylko, gdy są zaakceptowane fiszki.
9. Usuwanie propozycji fiszki bez potwierdzenia, z opcją cofnięcia (undo) przez toast.
10. Stosuj komponenty Shadcn/ui i Tailwind do budowy listy i przycisków, zapewniając spójność i dostępność.
11. Waliduj długość pól front (max 200) i back (max 500) inline podczas edycji.
</matched_recommendations>
<ui_architecture_planning_summary>
Główne wymagania dotyczące architektury UI obejmują uproszczony przepływ użytkownika, w którym logowanie i rejestracja są pominięte, a użytkownik trafia bezpośrednio na stronę generowania fiszek. Strona główna (generations page) zawiera pole tekstowe do wprowadzenia treści, licznik znaków oraz walidację inline. Po kliknięciu "Generate" aplikacja wywołuje endpoint generations API i wyświetla listę propozycji fiszek.

Każda fiszka na liście posiada trzy opcje: Zatwierdź, Usuń, Edytuj. Edycja odbywa się inline, z natychmiastową walidacją i wyświetlaniem błędów pod polem. Krytyczne błędy (np. walidacja, błąd generowania) są prezentowane inline, natomiast mniej istotne oraz komunikaty sukcesu – jako toast.

Pod listą znajdują się dwa przyciski: "Save Accepted" (aktywny tylko, gdy są zaakceptowane fiszki) oraz "Save All". Oba wywołują odpowiedni endpoint bulk create. Usuwanie propozycji fiszki nie wymaga potwierdzenia, ale użytkownik może cofnąć tę akcję przez toast z opcją "undo".

UI powinien być zbudowany w oparciu o komponenty Shadcn/ui i stylowany Tailwindem, z naciskiem na prostotę, czytelność i dostępność. Walidacja pól front/back odbywa się inline, zgodnie z ograniczeniami API (front: max 200, back: max 500 znaków).

Responsywność i dostępność są zapewnione przez użycie nowoczesnych bibliotek UI oraz Tailwinda. Bezpieczeństwo na poziomie UI nie jest kluczowe w MVP (brak auth), ale należy pamiętać o walidacji danych wejściowych i obsłudze błędów API.

Strategia zarządzania stanem opiera się na lokalnym przechowywaniu listy propozycji fiszek oraz ich statusów (zaakceptowane, edytowane, usunięte), z natychmiastową aktualizacją UI po każdej akcji użytkownika.

Kluczowe widoki i przepływy użytkownika:
- Strona główna: pole tekstowe do generowania, lista propozycji fiszek, opcje akcji, przyciski zapisu.
- Brak osobnych widoków auth/dashboard w MVP.

Integracja z API: wywołanie generations po "Generate", bulk create po "Save Accepted"/"Save All", obsługa błędów i walidacji inline.

</ui_architecture_planning_summary>
<unresolved_issues>
1. Czy po zapisaniu fiszek lista powinna się odświeżyć, czy użytkownik powinien pozostać na stronie z komunikatem? -odświeżyć
2. Czy istnieje limit liczby fiszek, które można wygenerować i wyświetlić jednocześnie? w UI nie przejmujemy się tym
3. Jakie dokładnie dane powinny być widoczne przy każdej fiszce na liście (np. tylko front/back, czy także źródło, status)? - front,back,status
4. Czy po usunięciu fiszki z listy powinna być możliwość cofnięcia tej akcji (undo) tylko przez toast, czy także inną metodą? - tylko toast
</unresolved_issues>
</conversation_summary> 