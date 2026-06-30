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
│   │   ├── detection/                    # ⭐ AI Detection Pipeline
│   │   │   ├── page.tsx                  # Main orchestrator (5 steps)
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
│       │       ├── page.tsx              # ⭐ AI Verification Detail
│       │       └── result/page.tsx       # Verified result display
│       ├── patient-history/page.tsx      # Verified scan history
│       └── profile/page.tsx              # Doctor profile
├── components/
│   ├── auth/                             # Login, Register, AuthModal
│   ├── layouts/                          # Navbar, Sidebar, DashboardHeader
│   └── modal/                            # EditProfile, ChangePassword, etc.
└── utils/
    └── api.ts                            # ⭐ Central API utility (apiFetch)
```

---

## ⭐ AI Implementation Guide

This section is for the **next developer** who will implement or modify the AI model integration.

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

### AI Prediction Response Schema

```jsonc
// POST /predictions/upload response
{
  "success": true,
  "data": {
    "prediction": {
      "id": "uuid-string",                          // Database record ID
      "prediction_label": "Normal",                  // "Normal" | "Cardiomegaly"
      "ctr_ratio": 0.45,                            // Cardiothoracic ratio (float)
      "heart_size": "Normal",                       // "Normal" | "Enlarged"
      "confidence_score": 0.94,                     // Model confidence (0.0 - 1.0)
      "image_path": "uploads/xrays/scan-uuid.jpg",  // Stored image path
      "insight": "Analysis text...",                 // (Optional) AI insight text
      "created_at": "2026-06-30T10:00:00Z"
    }
  }
}
```

### Step-by-Step: How to Modify the AI Model

#### 1. Backend Changes (Primary)

The AI model is invoked in the **backend**. The frontend does NOT run any ML models.

**File to modify:** `HeartVision_BE/src/controllers/prediction.controller.js`

```javascript
// In the upload handler, after saving the image:
// 1. Call your AI model (Python microservice, TensorFlow.js, ONNX, etc.)
// 2. Get the prediction result
// 3. Save it to the database
// 4. Return it in the API response

// Example: Calling a Python AI microservice
const aiResponse = await fetch('http://localhost:8000/predict', {
  method: 'POST',
  body: formData, // Forward the X-ray image
});
const aiResult = await aiResponse.json();

// Map AI result to database fields:
// prediction_label, ctr_ratio, heart_size, confidence_score, insight
```

#### 2. Frontend Changes (If Adding New Fields)

If your AI model returns **new fields** not currently in the schema (e.g., `heatmap_url`, `segmentation_data`, `risk_score`):

**Step 2a. Map the new field in `page.tsx`** (`src/app/patient/detection/page.tsx`)

Find the `uploadAndAnalyze()` function and add your field to `setAiResult()`:

```typescript
// Look for the TODO [AI] comment in uploadAndAnalyze()
setAiResult({
  prediction: pred.prediction_label,
  ctrRatio: pred.ctr_ratio != null ? String(pred.ctr_ratio) : "0.50",
  heartSize: pred.heart_size || "Normal",
  // ADD YOUR NEW FIELD HERE:
  heatmapUrl: pred.heatmap_url || null,
  confidenceScore: pred.confidence_score || null,
});
```

**Step 2b. Update the result interface in `Detect.tsx`** (`src/app/patient/detection/steps/Detect.tsx`)

```typescript
// Find the TODO [AI] comment in the DetectProps interface
interface DetectProps {
  // ... existing props ...
  result: {
    prediction: string;
    ctrRatio: string;
    heartSize: string;
    // ADD YOUR NEW FIELD HERE:
    heatmapUrl?: string;
    confidenceScore?: number;
  } | null;
}
```

**Step 2c. Display the new field in the UI** (still in `Detect.tsx`)

```tsx
{/* Replace the hardcoded accuracy badge with real confidence */}
{!isProcessing && result && (
  <div className="absolute bottom-6 right-6 ...">
    CONFIDENCE: {result.confidenceScore
      ? `${Math.round(result.confidenceScore * 100)}%`
      : "N/A"}
  </div>
)}

{/* Add a heatmap overlay */}
{!isProcessing && result?.heatmapUrl && (
  <Image
    src={result.heatmapUrl}
    alt="AI Heatmap"
    fill
    className="object-contain opacity-50 mix-blend-screen"
  />
)}
```

**Step 2d. Update doctor's verification page** (`src/app/doctor/queue/[patientId]/page.tsx`)

Find the `loadDetail()` function and map the new field in the `setPatient()` call. Also add it to the `PatientDetail` interface at the top of the file.

#### 3. Adding Real-Time AI Progress

Currently, the progress bar in Step 2 is **simulated** (increments to 95% while waiting). To add real progress:

**Option A: Server-Sent Events (SSE)**

```typescript
// In uploadAndAnalyze(), replace the setInterval with:
const eventSource = new EventSource(`/api/predictions/${predictionId}/progress`);
eventSource.onmessage = (event) => {
  const { progress } = JSON.parse(event.data);
  setAiProgress(progress);
};
```

**Option B: WebSocket**

```typescript
// In uploadAndAnalyze(), replace the setInterval with:
const ws = new WebSocket('ws://localhost:5000/ai-progress');
ws.onmessage = (event) => {
  const { progress, stage } = JSON.parse(event.data);
  setAiProgress(progress);
};
```

### Files with `TODO [AI]` Markers

Search for `TODO [AI]` across the codebase to find all AI integration points:

| File | Location | Description |
|------|----------|-------------|
| `patient/detection/page.tsx` | `uploadAndAnalyze()` | Progress simulation, FormData params, result mapping |
| `patient/detection/steps/Detect.tsx` | `DetectProps` interface | Result type definition for AI outputs |
| `doctor/queue/[patientId]/page.tsx` | `loadDetail()` | Verification data mapping |

---

## API Communication

All API calls use the `apiFetch()` utility from `src/utils/api.ts`:

```typescript
import { apiFetch } from "@/utils/api";

// GET request
const res = await apiFetch("/predictions");

// POST with FormData (file upload)
const formData = new FormData();
formData.append("xray", file);
const res = await apiFetch("/predictions/upload", {
  method: "POST",
  body: formData,
});

// PUT with JSON
const res = await apiFetch("/predictions/123/notes", {
  method: "PUT",
  body: JSON.stringify({ notes: "Patient symptoms..." }),
});
```

### Features of `apiFetch`:
- Auto-attaches Bearer token from session
- Auto-refreshes expired tokens (POST /auth/refresh-token)
- 30-second timeout with AbortController
- Content-Type auto-detection (JSON vs FormData)
- CSRF protection via X-Requested-With header

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## Testing

```bash
npm install --save-dev jest ts-jest @types/jest
npm test
```

Test file: `src/__tests__/api-integration.test.ts` — covers all 22 API endpoints.

---

## Scripts

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # ESLint
npm test        # Run Jest tests
```
