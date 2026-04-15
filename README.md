# Week 12 Exercise - AI Powered Feature

For this exercise, I decided to extend my previous midterm project "GameLog" (a Letterboxd-style web application for discovering, logging, and reviewing video games) by implementing two new features: corresponding video trailers and Supabase Authentication.

## Feature 01: Video Trailers
As the name suggests, this new feature adds a new video game trailers option to logged games that allows users to view related video media. The reason for its inclusion was that it would give users more context on the type of game they were adding to their personal log tracker. In order to implement such a feature, I used Youtube Data API v3.

## Feature 02: Supabase Authentication
This feature was originally planned to be implemented much earlier, but was cut due to time constraints at the time. Now, it is being fully realized in order to create a more seamless, flexible, cross platform login/logout experience.

## How to Run it (This part was written by Claude)

### Prerequisites
- Node.js (v18 or later)
- npm
- A [RAWG API key](https://rawg.io/apidocs) (free)
- A [YouTube Data API v3 key](https://console.cloud.google.com) (free tier)
- A [Supabase](https://supabase.com) project (free tier)

### 1. Navigate to the project
```bash
cd game-log
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in all four values:
```
VITE_RAWG_API_KEY=               # From rawg.io/apidocs
VITE_YOUTUBE_API_KEY=            # From Google Cloud Console → YouTube Data API v3
VITE_SUPABASE_URL=               # From Supabase project → Settings → API
VITE_SUPABASE_PUBLISHABLE_KEY=   # From Supabase project → Settings → API
```

### 4. Set up the Supabase database
In your Supabase project, open the **SQL Editor** and run:
```sql
create table game_logs (
  id           bigint primary key,
  user_id      uuid references auth.users not null,
  name         text not null,
  cover_url    text,
  release_year text,
  status       text not null default 'Want to Play',
  rating       smallint check (rating between 1 and 10),
  review       text,
  added_at     timestamptz default now(),
  reviewed_at  timestamptz,
  constraint game_logs_user_game_unique unique (user_id, id)
);

alter table game_logs enable row level security;

create policy "Users manage own logs"
  on game_logs for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```
Then go to **Authentication → Settings** and disable **Email Confirmations** so new accounts can log in immediately.

### 5. Start the development server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 6. Create an account and start logging
- Click **Sign up** — provide an email, username, and password
- Search for any game using the search bar
- Add it to your log, set a status, write a review, and watch the trailer
