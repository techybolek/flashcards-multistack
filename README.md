# LLM-powered Flashcard Generator

A basic flashcard generator that creates flashcards from user-provided content.

## ✨ Features

* Generate flashcards from input text using an LLM via OpenRouter
* Uses Open Router 
* Save flashcards to a database (Supabase)
* Manual editing of flashcards
* User registration and login (via Supabase Auth)
* Row-level security (RLS) enforced via Supabase
* Multiple frontend/backend implementations

## 🧱 Tech Stack

**Frontend options:**

* Angular
* React

**Backend options:**

* Node.js (Express)
* Spring Boot

**Full-stack options:**

* Astro
* Next.js

## 🚀 Getting Started

Curious but not sure where to begin?
**Start with the Astro full-stack implementation. Use it run the migrations**

1. Clone the repo
2. Set up Supabase
3. Navigate to the Astro implementation and run DB migrations
4. Set SUPABASE_URL, SUPABASE_KEY, OPENROUTER_API_KEY
5. Start the Astro app
6. Begin generating flashcards


## Code Metrics

<details>
<summary>Astro (Fullstack - contains extra code)</summary>

```text
Language     | Files | Blank | Comment | Code
-------------|-------|-------|---------|------
TypeScript   |   66  |  699  |   240   | 5294 - extra
CSS          |    1  |    2  |     0   |   64
-------------|-------|-------|---------|------
**Total**    |   67  |  701  |   240   | 5358 - extra
```
</details>

<details>
<summary>Next.js (Fullstack)</summary>

```text
Language     | Files | Blank | Comment | Code
-------------|-------|-------|---------|------
TypeScript   |   48  |  498  |   140   | 3672
CSS          |    1  |    3  |     0   |   57
-------------|-------|-------|---------|------
**Total**    |   49  |  501  |   140   | 3729
```
</details>

<details>
<summary>Express (Backend)</summary>

```text
Language     | Files | Blank | Comment | Code
-------------|-------|-------|---------|------
TypeScript   |   13  |  224  |    86   | 1350
-------------|-------|-------|---------|------
**Total**    |   13  |  224  |    86   | 1350
```
</details>

<details>
<summary>Java Spring Boot (Backend)</summary>

```text
Language     | Files | Blank | Comment | Code
-------------|-------|-------|---------|------
Java         |   35  |  577  |    71   | 2092
YAML         |    1  |   15  |     6   |   83
-------------|-------|-------|---------|------
**Total**    |   36  |  592  |    77   | 2175
```
</details>

<details>
<summary>React (Frontend)</summary>

```text
Language     | Files | Blank | Comment | Code
-------------|-------|-------|---------|------
TypeScript   |   35  |  298  |    36   | 2432
CSS          |    1  |    3  |     0   |   56
-------------|-------|-------|---------|------
**Total**    |   36  |  301  |    36   | 2488
```
</details>

<details>
<summary>Angular (Frontend)</summary>

```text
Language     | Files | Blank | Comment | Code
-------------|-------|-------|---------|------
TypeScript   |   46  |  220  |    38   | 1759
HTML         |   16  |   35  |     2   |  561
Sass         |    1  |    3  |     0   |   57
Markdown     |    1  |   10  |     0   |   37
-------------|-------|-------|---------|------
**Total**    |   64  |  268  |    40   | 2414
```
</details>
