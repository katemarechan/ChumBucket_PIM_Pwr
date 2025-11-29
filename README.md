# ChumBucket

[English Version]

## Project Overview

ChumBucket is a recipe sharing and discussion platform designed to bring together cooking enthusiasts, home chefs, and food lovers in a collaborative online community. The application allows users to discover new recipes, share their own, and build a personalized collection of favorite dishes. On top of that, the app allows the creation of To-Do lists, where users can check the ingredients they need to buy, summarizing them later in a shopping list.

This project serves as a comprehensive implementation of modern web development practices and technologies covered in the PIM curriculum, demonstrating proficiency in full-stack development, database design, user authentication, and responsive web design principles. Modern design elements were chosen for this project to make it look up to date, like the ability of changing themes, glassmorphism in some elements, as well as the modern user-friendly, yet aesthetic UI. The pallets were also chosen to fit into the cozy aesthetic, using warm colors for both dark and light themes.

**Built with React Native, Firebase backend, and TypeScript.**  
**Testing environment: Android Studio**

---

## Key Features

### User Management
- User registration and authentication system
- User profiles with customizable information (nickname, photo, username)
- Personal recipe collections and favorites

### Recipe Management
- Create, edit, and delete recipes with detailed information
- Upload and display recipe images
- Search and filter recipes by ingredients, cuisine type, difficulty level, and preparation time
- Advanced search functionality for discovering recipes
- Comment system for recipe discussions
- Rating and review system for recipes
- Ability to bookmark and save favorite recipes
- Browse recipes by various categories
- Trending and popular recipes section

---

## Technical Architecture

### Backend
The backend infrastructure handles business logic, data persistence, user authentication, and API endpoints for frontend consumption. It implements proper security measures including input validation, SQL injection prevention, and secure password storage. All users can be viewed as a list in the Firebase database.

### Frontend
The frontend provides an intuitive and responsive user interface that works seamlessly across different devices and screen sizes. It focuses on user experience with smooth navigation, quick loading times, and accessible design patterns.

### Database
The database is designed to efficiently store user information, recipe data, comments, ratings, and relationships between entities. It maintains data integrity through proper normalization and constraint enforcement.

### Testing
The application includes comprehensive testing coverage including unit tests for individual components, integration tests for API endpoints, and end-to-end tests for critical user workflows. Testing ensures reliability and helps prevent regressions during development.

### Deployment
Deployment guidelines and production environment configuration are documented to enable smooth deployment to hosting platforms. This includes environment variable configuration, database migration procedures, and server setup instructions.

---

## Future Enhancements

Potential future enhancements include:
- Advanced recommendation algorithm based on user preferences and history (implementing AI into the system)
- Integration with nutrition databases for automatic nutritional information
- Video recipe tutorials and step-by-step cooking guides
- Multi-language support for international users
- Social sharing integration with popular platforms

Diagram C4:



[Polish Version]

## Opis projektu

ChumBucket to platforma do udostępniania przepisów i dyskusji, stworzona z myślą o integrowaniu entuzjastów gotowania, domowych kucharzy i miłośników jedzenia w ramach społeczności online. Aplikacja pozwala użytkownikom odkrywać nowe przepisy, dzielić się swoimi i budować spersonalizowaną kolekcję ulubionych potraw. Dodatkowo, aplikacja umożliwia tworzenie list zadań do wykonania, gdzie użytkownicy mogą sprawdzać składniki, które muszą kupić, i podsumowywać je później na liście zakupów.

Ten projekt stanowi kompleksowe wdrożenie nowoczesnych praktyk i technologii tworzenia stron internetowych objętych programem nauczania PIM, demonstrując biegłość w zakresie programowania full-stack, projektowania baz danych, uwierzytelniania użytkowników i zasad responsywnego projektowania stron internetowych. Aby nadać projektowi nowoczesny wygląd, wybrano nowoczesne elementy, takie jak możliwość zmiany motywów, szklanomorfizm w niektórych elementach, a także nowoczesny, przyjazny dla użytkownika, a jednocześnie estetyczny interfejs użytkownika. Palety kolorów zostały również dobrane tak, aby pasowały do ​​przytulnej estetyki, wykorzystując ciepłe kolory zarówno w ciemnych, jak i jasnych motywach.

**Zbudowano z wykorzystaniem React Native, back-endu Firebase i TypeScript.**
**Środowisko testowe: Android Studio**

---

## Najważniejsze funkcje

### Zarządzanie użytkownikami
- System rejestracji i uwierzytelniania użytkowników
- Profile użytkowników z konfigurowalnymi informacjami (pseudonim, zdjęcie, nazwa użytkownika)
- Osobiste kolekcje przepisów i ulubione

### Zarządzanie przepisami
- Tworzenie, edycja i usuwanie przepisów ze szczegółowymi informacjami
- Przesyłanie i wyświetlanie obrazów przepisów
- Wyszukiwanie i filtrowanie przepisów według składników, rodzaju kuchni, poziomu trudności i czasu przygotowania
- Zaawansowana funkcja wyszukiwania ułatwiająca odkrywanie przepisów
- System komentarzy do dyskusji o przepisach
- System oceniania i recenzowania przepisów
- Możliwość dodawania zakładek i zapisywania ulubionych przepisów
- Przeglądanie przepisów według różnych kategorii
- Sekcja popularnych i popularnych przepisów

---


## Architektura techniczna

### Backend
Infrastruktura backendowa obsługuje logikę biznesową, trwałość danych, uwierzytelnianie użytkowników i punkty końcowe API do użytku frontendowego. Implementuje odpowiednie środki bezpieczeństwa, takie jak walidacja danych wejściowych, zapobieganie atakom SQL injection oraz bezpieczne przechowywanie haseł. Wszyscy użytkownicy są wyświetlani jako lista w bazie danych Firebase.

### Frontend
Frontend zapewnia intuicyjny i responsywny interfejs użytkownika, który działa płynnie na różnych urządzeniach i rozmiarach ekranów. Koncentruje się na doświadczeniu użytkownika, zapewniając płynną nawigację, szybkie ładowanie i przystępne wzorce projektowe.

### Baza danych
Baza danych została zaprojektowana z myślą o efektywnym przechowywaniu informacji o użytkownikach, danych receptur, komentarzy, ocen i relacji między encjami. Utrzymuje integralność danych poprzez odpowiednią normalizację i egzekwowanie ograniczeń.

### Testowanie
Aplikacja obejmuje kompleksowe testy, w tym testy jednostkowe dla poszczególnych komponentów, testy integracyjne dla punktów końcowych API oraz testy kompleksowe dla krytycznych przepływów pracy użytkowników. Testowanie zapewnia niezawodność i pomaga zapobiegać regresjom podczas rozwoju.

### Wdrożenie
Wytyczne dotyczące wdrożenia i konfiguracja środowiska produkcyjnego są udokumentowane, aby umożliwić płynne wdrożenie na platformach hostingowych. Obejmuje to konfigurację zmiennych środowiskowych, procedury migracji bazy danych oraz instrukcje konfiguracji serwera.

---

## Przyszłe ulepszenia

Potencjalne przyszłe ulepszenia obejmują:
- Zaawansowany algorytm rekomendacji oparty na preferencjach użytkownika i historii (wdrożenie sztucznej inteligencji w systemie)
- Integrację z bazami danych żywieniowych w celu automatycznego generowania informacji żywieniowych
- Samouczki wideo z przepisami i przewodniki kulinarne krok po kroku
- Wsparcie wielojęzyczne dla użytkowników z całego świata
- Integrację z popularnymi platformami społecznościowymi

Diagram C4: 
