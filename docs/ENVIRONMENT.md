# Environment Variables

ProtegeDesk is a client-side application and currently does not require any environment variables to run.

## Running the Application

No `.env` file is needed. Simply install and start:

```bash
npm ci
npm run dev
```

## Future Configuration

As the project evolves, the following environment variables may be introduced:

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_APP_URL` | Public URL of the application for meta tags and sharing | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend API endpoint if a server is added | (none) |
| `PORT` | Development server port | `3000` |

### Adding New Environment Variables

1. For **client-side** variables (accessible in the browser), prefix with `NEXT_PUBLIC_`.
2. For **server-side** variables (API routes, server components), use any name without the prefix.
3. Document the variable in this file with its purpose and default value.
4. Add it to `.env.local` for local development (never commit secrets).

## Notes

- This project runs entirely in the browser with no backend server.
- All ontology processing, reasoning, and visualization happen client-side.
- No API keys or external service credentials are required.
