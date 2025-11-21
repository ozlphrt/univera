# College Database API Integration

This application integrates with the **College Scorecard API** provided by the U.S. Department of Education to fetch real college data.

## Setup Instructions

### 1. Get Your Free API Key

1. Visit [api.data.gov/signup/](https://api.data.gov/signup/)
2. Sign up for a free account
3. You'll receive an API key via email

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env` (if it doesn't exist)
2. Add your API key:

```env
VITE_COLLEGE_SCORECARD_API_KEY=your_api_key_here
```

### 3. API Features

The integration provides:

- **Real college data** from the U.S. Department of Education
- **Automatic fallback** to sample data if API is unavailable
- **Search functionality** by name, state, city, size
- **Comprehensive data** including:
  - Admissions rates
  - Tuition costs (in-state/out-of-state)
  - Average net price
  - Student body size
  - Popular majors
  - Location and environment

### 4. API Functions

Located in `src/api/collegeApi.ts`:

- `fetchCollegesFromAPI()` - Fetch colleges with optional filters
- `searchCollegesByName()` - Search colleges by name
- `getCollegeById()` - Get a specific college by ID

### 5. Fallback Behavior

If the API key is not configured or the API request fails:
- The app automatically falls back to the sample dataset (8 colleges)
- No errors are thrown - the app continues to function
- A console warning is logged for debugging

### 6. Rate Limits

The College Scorecard API has rate limits:
- **Free tier**: 1,000 requests per hour
- **Paid tier**: Higher limits available

The app caches results in localStorage to minimize API calls.

### 7. Data Source Indicator

The app tracks whether data came from the API or sample data:
- Check `localStorage.getItem('colleges_source')` - returns `'api'` or `'sample'`

## Testing Without API Key

The app works perfectly without an API key - it will use the sample dataset. This is useful for:
- Development
- Testing
- Demos

## Production Considerations

For production use:
1. Set up proper API key management
2. Consider caching strategies
3. Implement error monitoring
4. Add retry logic for failed requests
5. Consider using a backend proxy to hide API keys

## Alternative APIs

If you want to use a different college database API, you can:
1. Modify `src/api/collegeApi.ts`
2. Update the conversion functions
3. Keep the same interface for compatibility

Available alternatives:
- CollegeAI API
- US College Data API (Zyla)
- Custom database

