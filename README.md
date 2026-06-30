# HeartVision Frontend

A Next.js 16 medical AI application for early detection of heart disease through X-ray analysis, with doctor verification workflow.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **Auth**: JWT (access + refresh tokens) via localStorage
- **API**: REST API to Express.js backend (`apiFetch` utility)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout + AuthModal
│   ├── patient/
│   │   ├── dashboard/page.tsx            # Patient dashboard
│   │   ├── detection/                    #  AI Detection Pipeline
│   │   │   ├── page.tsx                  # Main  (5 steps)
│   │   │   ├── components/
│   │   │   │   └── DetectionStepper.tsx  # Step progress indicator
│   │   │   └── steps/
│   │   │       ├── Upload.tsx            # Step 1: X-ray upload
│   │   │       ├── Detect.tsx            # Step 2: AI analysis display
│   │   │       ├── ChooseDoctor.tsx      # Step 3: Doctor selection
│   │   │       ├── GiveNote.tsx          # Step 4: Patient symptoms
│   │   │       └── FinalResult.tsx       # Step 5: Final result
│   │   ├── doctors/page.tsx              # Doctor list
│   │   ├── history/page.tsx              # Scan history
│   │   └── profile/page.tsx              # Patient profile
│   └── doctor/
│       ├── dashboard/page.tsx            # Doctor dashboard (AI stats)
│       ├── queue/
│       │   ├── page.tsx                  # Verification queue
│       │   └── [patientId]/
│       │       ├── page.tsx              #  AI Verification Detail
│       │       └── result/page.tsx       # Verified result display
│       ├── patient-history/page.tsx      # Verified scan history
│       └── profile/page.tsx              # Doctor profile
├── components/
│   ├── auth/                             # Login, Register, AuthModal
│   ├── layouts/                          # Navbar, Sidebar, DashboardHeader
│   └── modal/                            # EditProfile, ChangePassword, etc.
└── utils/
    └── api.ts                            #  Central API utility (apiFetch)
```

---

### Architecture Overview

```
┌─────────────────┐     POST /predictions/upload     ┌──────────────────┐
│  Patient Upload  │ ──────────────────────────────►  │  Express.js API  │
│  (detection/     │     FormData: { xray: File }     │                  │
│   page.tsx)      │                                  │  prediction      │
│                  │  ◄─────────────────────────────  │  .controller.js  │
│  uploadAndAnalyze│     { prediction_label,          │                  │
│  ()              │       ctr_ratio, heart_size,     │  ┌────────────┐  │
│                  │       confidence_score,           │  │  AI Model  │  │
│                  │       image_path, id }            │  │  (Python?) │  │
└─────────────────┘                                   │  └────────────┘  │
                                                      └──────────────────┘
        │
        │  result stored in state
        ▼
┌─────────────────┐
│  Detect.tsx      │  Displays AI results to patient
│  (Step 2 UI)     │  Shows: prediction, CTR ratio, heart size
└─────────────────┘
        │
        │  Doctor selected, notes submitted
        ▼
┌─────────────────┐     GET /verifications/:id        ┌──────────────────┐
│  Doctor Queue    │ ◄─────────────────────────────── │  Express.js API  │
│  Detail Page     │     { prediction_label,          │                  │
│  ([patientId]/   │       confidence_score,          │                  │
│   page.tsx)      │       ctr_ratio, image_path,     │                  │
│                  │       patient_notes, insight }    │                  │
│                  │                                  │                  │
│                  │ ──PUT /verifications/:id/verify─► │                  │
│                  │     { doctorNotes, assessment,   │                  │
│                  │       aiAccuracyConfirmed }      │                  │
└─────────────────┘                                   └──────────────────┘
```

### API Endpoints Related to AI

| # | Method | Endpoint | Purpose | File |
|---|--------|----------|---------|------|
| 1 | `POST` | `/predictions/upload` | Upload X-ray & get AI prediction | `patient/detection/page.tsx` |
| 2 | `GET` | `/predictions/:id` | Get prediction detail | `steps/FinalResult.tsx` |
| 3 | `PUT` | `/predictions/:id/notes` | Submit patient symptoms | `patient/detection/page.tsx` |
| 4 | `PUT` | `/predictions/:id/select-doctor` | Assign doctor to prediction | `steps/ChooseDoctor.tsx` |
| 5 | `GET` | `/verifications/:id` | Get full verification data for doctor | `doctor/queue/[patientId]/page.tsx` |
| 6 | `PUT` | `/verifications/:id/verify` | Doctor submits verification | `doctor/queue/[patientId]/page.tsx` |

## Scripts

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # ESLint
npm test        # Run Jest tests
```
