# Campusly Student Administration

Responsive React/Vite frontend for the Codveda student API.

## Run locally

```sh
npm install
npm run dev
```

The development server proxies `/api` requests to `http://localhost:5000`, avoiding cross-origin browser requests without changing the backend. For a different API origin, set `VITE_API_BASE_URL` to its `/api` base URL.

## API integration

The frontend uses the backend routes and response shapes in `../task-1-authentication`:

- `POST /api/auth/login`
- `POST /api/auth/register-user` (the backend's registration route)
- `GET /api/students?page=1&limit=10`, including its nested `students` and `pagination` response
- `GET`, `POST`, `PUT`, and `DELETE /api/students/:id`

New accounts receive the backend's default `staff` role. Staff can view student records; add, edit, and delete controls are shown only for admins. The backend remains responsible for authorization.

Student search filters the currently loaded server page because the API does not provide a search parameter. Student pagination uses the API's `pagination` object.

## Checks

```sh
npm run lint
npm run build
```
