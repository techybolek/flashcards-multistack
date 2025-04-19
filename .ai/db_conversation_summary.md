<conversation_summary>
<decisions>
1. Kluczowe encje to: users (obsługiwane przez Supabase), flashcards, generations oraz generation_error_logs, przy czym encja dotycząca sesji nauki zostanie wdrożona w późniejszym etapie.
2. Jeden użytkownik może mieć wiele flashcards oraz wiele rekordów w tabelach generations i generation_error_logs.
3. W tabeli flashcards pole generation_id może być NULL dla fiszek tworzonych ręcznie.
4. Relacje między encjami nie wymagają opcji CASCADE.
5. Pole source w tabeli flashcards przyjmuje tylko wartości: "ai-full", "ai-edited", "manual".
6. Ograniczenia dla flashcards: pole front do 200 znaków, back do 500 znaków.
7. Ograniczenia dla tabel generations i generation_error_logs: source_text_length musi mieścić się w przedziale od 1000 do 10 000 znaków, a source_text_hash nie jest używane jako unikalny identyfikator.
8. Dodano pole generation_time w tabeli generations, które reprezentuje czas trwania generacji.
9. Triggery mają automatycznie aktualizować pole updated_at przy modyfikacjach rekordów.
10. Nie przewidujemy dodatkowych pól audytu ani specjalnych wymagań dotyczących strefy czasowej.
11. Kolumna model w tabelach generations i generation_error_logs powinna mieć sensowny limit długości (np. ustawiony jako varchar z odpowiednim limitem).
12. Zaleca się indeksowanie kolumn user_id we wszystkich tabelach oraz generation_id w tabeli flashcards dla optymalizacji wydajności.
</decisions>

<matched_recommendations>
1. Utworzenie tabeli flashcards z polami: id (bigserial), front (varchar(200)), back (varchar(500)), source (varchar z check constraint), created_at, updated_at, generation_id (fk, akceptujące NULL), user_id (fk).
2. Utworzenie tabeli generations z polami: id (bigserial), user_id (fk), model (varchar o sensownym limicie), generated_count, accepted_unedited_count, accepted_edited_count, source_text_hash, source_text_length (od 1000 do 10 000), generation_time.
3. Utworzenie tabeli generation_error_logs z polami: id (bigserial), user_id (fk), model (varchar o sensownym limicie), source_text_hash, source_text_length (z ograniczeniem), error_code, error_message.
4. Implementacja rygorystycznych reguł RLS, by każdy użytkownik miał dostęp tylko do rekordów powiązanych z jego user_id.
5. Zastosowanie triggerów do automatycznej aktualizacji pola updated_at przy każdej modyfikacji rekordu.
6. Zalecenie indeksowania kolumn user_id i generation_id dla poprawy wydajności zapytań.
</matched_recommendations>

<database_planning_summary>
Główne wymagania dotyczące schematu bazy danych obejmują stworzenie trzech tabel (flashcards, generations, generation_error_logs) uzupełnionych o relacje do użytkowników zarządzanych przez Supabase. Tabela flashcards przechowuje fiszki z ograniczeniami znaków dla pól front i back oraz atrybutem source wskazującym źródło powstawania fiszki. Fiszki generowane przez AI są powiązane z rekordami w tabeli generations przez pole generation_id, które pozostaje NULL dla fiszek ręcznych. Tabela generations zawiera informacje o modelu, liczbach generacji, długościach tekstu oraz dodatkowo o czasie trwania generacji (generation_time). Tabela generation_error_logs rejestruje błędy generacji z odpowiednimi ograniczeniami długości tekstu. Kluczowe relacje są 1:n między użytkownikami a kolejnymi tabelami, a bezpieczeństwo zapewnia wdrożenie reguł RLS ograniczających dostęp do rekordów na podstawie user_id. W kwestiach wydajności zaplanowano indeksowanie kolumn user_id i generation_id oraz implementację prostych triggerów do aktualizacji timestampów. Inne zaawansowane mechanizmy, takie jak cascade czy dodatkowe audyty, nie są wymagane na etapie MVP.
</database_planning_summary>

<unresolved_issues>
Brak nierozwiązanych kwestii – wszystkie kluczowe zagadnienia zostały jasno określone.
</unresolved_issues>
</conversation_summary>