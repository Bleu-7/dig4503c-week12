# GameLog - A Video Game Tracker Website

A Letterboxd-style web application for discovering, logging, and reviewing video games. Designed with a clean, dark-first aesthetic and a scalable architecture, this project aims to give players a personal, social space to track their gaming history and share their takes with others.


## Feature List

1. **User Accounts & Authentication** — Sign up, log in, user profiles
2. **Game Search & Database Integration** — Connect to IGDB or RAWG API for game data
3. **Game Logging** — Add games with status: Played / Playing / Want to Play
4. **Ratings & Reviews** — Rate games (1–10 or star system) with optional text review
5. **User Profile Page** — Public-facing page showing a user's logged games, ratings, and reviews


## Tech Stack

Front-End: **React + Vite**
Styling: **Tailwind CSS + shadcn/ui**
Data (MVP): **localStorage (abstracted behind a service layer)**
Back-End Data (Post-MVP): **Supabase (migration-ready by design)**
Game Data API: **IGDB (preferred) or RAWG**