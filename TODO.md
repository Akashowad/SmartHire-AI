# TODO: Make SmartHire AI Browser-Deployable (Static Site)

## Steps
- [x] 1. Update `frontend/vite.config.js` — add `base: './'`
- [x] 2. Update `frontend/src/api.js` — replace with mock API client + demo data
- [x] 3. Update `frontend/src/context/AuthContext.jsx` — mock auth via localStorage
- [x] 4. Update `frontend/src/context/AppContext.jsx` — mock jobs, apps, analysis
- [x] 5. Update `frontend/src/components/UploadModal.jsx` — simulated resume upload (works via mock API)
- [x] 6. Update `frontend/src/components/JobCard.jsx` — deterministic mock match scores (works via mock API)
- [x] 7. Update `frontend/src/components/ApplicationAssistant.jsx` — mock AI content (works via mock API)
- [x] 8. Update `frontend/src/pages/Dashboard.jsx` — mock auto-apply (works via mock API)
- [x] 9. Update `frontend/src/pages/Login.jsx` / `Signup.jsx` — wire to mock auth (works via mock API)
- [x] 10. Build and verify — `npm run build`, check `dist/`

## Result
Build successful. `frontend/dist/` is a fully self-contained static site.

