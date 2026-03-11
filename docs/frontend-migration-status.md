# Frontend Migration Status

## Objective
Migrate `HRMS-2026` frontend features/pages into this template while preserving template UI patterns.

## Completed in this pass

1. Core migration foundation
- Added API/auth/service layer under `src/lib`:
  - `api-client.ts`
  - `auth-storage.ts`
  - `auth-context.tsx`
  - `services/*.ts` (auth, employees, attendance, payroll, salary, ats, dms, company, departments, positions)

2. Provider and auth guard wiring
- Added `src/app/providers.tsx` with `ThemeProvider`, `SidebarProvider`, `AuthProvider`.
- Updated `src/app/layout.tsx` to use `AppProviders`.
- Updated `src/app/(admin)/layout.tsx` to enforce authenticated access and redirect to `/signin` if not authenticated.

3. Auth screens wired to backend
- `src/components/auth/SignInForm.tsx` now calls backend login via migrated auth context.
- `src/components/auth/SignUpForm.tsx` now calls backend register via migrated auth context.
- `src/components/header/UserDropdown.tsx` now shows live user data and performs logout.

4. Route parity scaffold
- Added `src/components/migration/MigratedFeaturePage.tsx` for template-native page shells.
- Generated missing HRMS/settings pages under `src/app/(admin)/...` to ensure URL parity.
- Route parity check result:
  - Source routes: 103
  - Template routes: 119
  - Missing source routes in template: 0

5. Public ATS careers routes
- Added template-native API-backed pages:
  - `src/app/(full-width-pages)/careers/page.tsx`
  - `src/app/(full-width-pages)/careers/[jobId]/page.tsx`

6. Auth alias routes for source compatibility
- Added:
  - `src/app/(full-width-pages)/auth/login/page.tsx` -> redirects to `/signin`
  - `src/app/(full-width-pages)/auth/register/page.tsx` -> redirects to `/signup`
  - `src/app/(full-width-pages)/auth/forgot-password/page.tsx`

7. Entry route behavior
- Updated `src/app/(admin)/page.tsx` to redirect to `/hrms/dashboard`.

8. Template navigation mapping
- Updated `src/layout/AppSidebar.tsx` nav data to expose HRMS/CRM/DMS/Payroll/Attendance/Recruitment/Platform routes using existing sidebar UI.

## Verification
- `npx tsc --noEmit` passed.
- `npm run build` is blocked by file lock/permission issues on `.next` artifacts (`EPERM unlink ... .next/build/chunks/...`), likely from active process lock.

## Next phases

1. Replace generated migration shells with fully functional template-native pages module-by-module:
- Dashboard/company
- Employees
- Attendance/leave
- Payroll/salary
- ATS
- DMS
- CRM
- Self-service and remaining static pages

2. Standardize page-level data patterns
- loading/error/empty states
- pagination and filtering
- form validation and submission states

3. Permission-aware UI actions
- hide/disable actions based on `hasPermission`.

4. Final stabilization
- Build/lint pass after lock issue is resolved.
- Full smoke tests across all critical flows.
