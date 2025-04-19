# Schemat Bazy Danych PostgreSQL

## 1. Tabele i kolumny

### a. `flashcards`
- `id`: BIGSERIAL, PRIMARY KEY
- `front`: VARCHAR(200) NOT NULL
- `back`: VARCHAR(500) NOT NULL
- `source`: VARCHAR(20) NOT NULL, CHECK (source IN ('ai-full', 'ai-edited', 'manual'))
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `generation_id`: BIGINT REFERENCES generations(id) ON DELETE SET NULL
- `user_id`: UUID NOT NULL REFERENCES users(id)

### b. `generations`
- `id`: BIGSERIAL, PRIMARY KEY
- `user_id`: UUID NOT NULL REFERENCES users(id)
- `model`: VARCHAR(50) NOT NULL
- `generated_count`: INTEGER NOT NULL DEFAULT 0
- `accepted_unedited_count`: INTEGER NOT NULL DEFAULT 0
- `accepted_edited_count`: INTEGER NOT NULL DEFAULT 0
- `source_text_hash`: TEXT NOT NULL
- `source_text_length`: INTEGER NOT NULL, CHECK (source_text_length BETWEEN 1000 AND 10000)
- `generation_duration`: INTERVAL NOT NULL
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### c. `generation_error_logs`
- `id`: BIGSERIAL, PRIMARY KEY
- `user_id`: UUID NOT NULL REFERENCES users(id)
- `model`: VARCHAR(50) NOT NULL
- `source_text_hash`: TEXT NOT NULL
- `source_text_length`: INTEGER NOT NULL, CHECK (source_text_length BETWEEN 1000 AND 10000)
- `error_code`: VARCHAR(50) NOT NULL
- `error_message`: TEXT NOT NULL
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

## 2. Relacje między tabelami
- Każdy rekord w tabeli `flashcards` jest powiązany z jednym użytkownikiem (`user_id`) oraz opcjonalnie z jednym rekordem w tabeli `generations` (`generation_id`).
- Każdy rekord w tabelach `generations` oraz `generation_error_logs` jest powiązany z jednym użytkownikiem (`user_id`).

## 3. Indeksy
- Indeks na kolumnie `user_id` w tabelach: `flashcards`, `generations` i `generation_error_logs`.
- Indeks na kolumnie `generation_id` w tabeli `flashcards`.

## 4. Zasady PostgreSQL (RLS)
- Włączone zabezpieczenia na poziomie wiersza (RLS) dla tabel `flashcards`, `generations` i `generation_error_logs`.
- Polityki RLS zapewniają, że użytkownik ma dostęp tylko do rekordów, gdzie `user_id` odpowiada jego identyfikatorowi.

## 5. Dodatkowe uwagi
- Wyzwalacze (triggers) automatycznie aktualizują kolumnę `updated_at` przy każdej modyfikacji rekordu.
- Schemat jest zaprojektowany zgodnie z zasadami normalizacji (3NF) oraz zoptymalizowany pod kątem wydajności dzięki odpowiednim indeksom. 