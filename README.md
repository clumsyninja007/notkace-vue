# vue-kace-open-tickets-typescript

Vue 3 + TypeScript SPA built with Vite.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```
(`npm run serve` is kept as an alias.)

### Type-checks, compiles and minifies for production
```
npm run build
```

### Previews the production build locally
```
npm run preview
```

### Lints and fixes files
```
npm run lint
```

### Configuration
The API base URL comes from `VITE_API_BASE_URL` (see `.env.production`, written by
CI in `.github/workflows/deploy.yml`); it falls back to `http://localhost:5001`.

See the [Vite configuration reference](https://vite.dev/config/).
