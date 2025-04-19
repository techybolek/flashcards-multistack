5. Wprowadzimy automatyczną walidację fiszek na poziomie frontendu, backendu i bazy danych. Będziemy weryfikowali w ten sposób przód i tył fiszek. Interesuje nas również walidacja tekstu przekazanego jako wejście do generowania fiszek przez AI, powinien mieć on od 1000 do 10 000 znaków — tak aby można było z niego utworzyć od kilku do kilkunastu fiszek.
6. Nie
7. Nie
8. Nie

Ważne:
Istotna tutaj jest podstawowa struktura fiszki: przód (front) i tył (back).
Zależy nam jedynie na prostej edycji pól przód i tył, tak samo jak w przypadku już zapisanych fiszek. Nie pozwalamy na dodawanie nowych pól, trzymamy się prostej struktury fiszki w MVP.
proces recenzji to prosty przegląd kandydatów na fiszki zwróconych po zakończeniu procesu generowania w sposób synchroniczny. Użytkownik klika w przycisk "zaakceptuj", "edytuj" lub "odrzuć" i potem w formie bulk zapisuje swoją decyzję. Zaakceptowane fiszki trafiają do bazy danych. To wszystko, bez udziwnień.
---

Jesteś asystentem AI, którego zadaniem jest podsumowanie rozmowy na temat planowania PRD (Product Requirements Document) dla MVP i przygotowanie zwięzłego podsumowania dla następnego etapu rozwoju. W historii konwersacji znajdziesz następujące informacje:
1. Opis projektu
2. Zidentyfikowany problem użytkownika
3. Historia rozmów zawierająca pytania i odpowiedzi
4. Zalecenia dotyczące zawartości PRD

Twoim zadaniem jest:
1. Podsumować historię konwersacji, koncentrując się na wszystkich decyzjach związanych z planowaniem PRD.
2. Dopasowanie zaleceń modelu do odpowiedzi udzielonych w historii konwersacji. Zidentyfikuj, które zalecenia są istotne w oparciu o dyskusję.
3. Przygotuj szczegółowe podsumowanie rozmowy, które obejmuje:
   a. Główne wymagania funkcjonalne produktu
   b. Kluczowe historie użytkownika i ścieżki korzystania
   c. Ważne kryteria sukcesu i sposoby ich mierzenia
   d. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia
4. Sformatuj wyniki w następujący sposób:

<conversation_summary>
<decisions>
[Wymień decyzje podjęte przez użytkownika, ponumerowane].
</decisions>

<matched_recommendations>
[Lista najistotniejszych zaleceń dopasowanych do rozmowy, ponumerowanych]
</matched_recommendations>

<prd_planning_summary>
[Podaj szczegółowe podsumowanie rozmowy, w tym elementy wymienione w kroku 3].
</prd_planning_summary>

<unresolved_issues>
[Wymień wszelkie nierozwiązane kwestie lub obszary wymagające dalszych wyjaśnień, jeśli takie istnieją]
</unresolved_issues>
</conversation_summary>

Końcowy wynik powinien zawierać tylko treść w formacie markdown. Upewnij się, że Twoje podsumowanie jest jasne, zwięzłe i zapewnia cenne informacje dla następnego etapu tworzenia PRD.