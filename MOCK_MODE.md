# Mock Mode Setup

This project has been configured to run in **mock mode**, which bypasses Google OAuth authentication and uses mock calendar data instead.

## What Changed

### 1. Mock Data (`lib/mock-data.ts`)
- Created mock calendars (Primary, Work, Personal)
- Generated sample events including holidays, work events, and personal events
- In-memory storage for creating/updating/deleting custom events

### 2. API Routes Modified
All API routes now check `USE_MOCK_DATA` flag:

- **`app/api/events/route.ts`**: Returns mock events, handles CRUD operations in memory
- **`app/api/calendars/route.ts`**: Returns mock calendars and accounts
- **`app/api/preferences/route.ts`**: Stores preferences in memory instead of database

### 3. Frontend (`app/page.tsx`)
- Overrides authentication status to "authenticated" when `USE_MOCK_DATA` is true
- All features work without requiring Google login

## Running the Project

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app**:
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## Features Available in Mock Mode

✅ View calendar for any year
✅ See mock events across three calendars
✅ Create new events
✅ Edit existing events
✅ Delete events
✅ Toggle calendar visibility
✅ Change calendar colors
✅ All UI preferences (show days of week, align weekends, etc.)

## Switching Back to Real Google Calendar

To switch back to using real Google Calendar authentication:

1. Set `USE_MOCK_DATA = false` in these files:
   - `app/api/events/route.ts`
   - `app/api/calendars/route.ts`
   - `app/api/preferences/route.ts`
   - `app/page.tsx`

2. Set up proper environment variables in `.env`:
   ```
   DATABASE_URL=your-postgresql-database-url
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secure-random-string
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   ```

3. Set up Google OAuth credentials and database as described in README.md

## Mock Data Details

### Calendars
- **My Calendar** (Primary) - Blue
- **Work** - Green
- **Personal** - Red

### Sample Events
- **Holidays**: New Year's, Valentine's Day, Independence Day, Halloween, etc.
- **Work Events**: Quarterly planning, team offsites, conferences
- **Personal Events**: Vacations, birthday parties, family visits

Events are automatically generated for the current year and will regenerate for different years.
