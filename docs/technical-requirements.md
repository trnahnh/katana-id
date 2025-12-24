# Technical Requirements Document

**Project:** Deepfake Video Generation Platform
**Target Users:** Streamers and Content Creators
**Version:** 1.0 Draft

---

## 1. Overview

A web platform that allows users to create deepfake videos of themselves as other personas. Videos are limited to 60 seconds initially, with async processing for cost efficiency.

### Core User Flow
1. User uploads source video (their face/performance)
2. User selects or uploads target persona
3. System queues the job and processes asynchronously
4. User receives notification when video is ready
5. User downloads or shares the result

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Frontend                                    │
│                         (React + TypeScript)                            │
│                              Vite + SPA                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              API Gateway                                 │
│                           (Go + Chi/Gin)                                │
├─────────────────────────────────────────────────────────────────────────┤
│  Auth Service  │  Upload Service  │  Job Service  │  Notification Svc  │
└─────────────────────────────────────────────────────────────────────────┘
        │                 │                │                  │
        ▼                 ▼                ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │ Object Store │  │ Message Queue│  │   WebSocket  │
│   (Users,    │  │   (S3/R2/    │  │   (Redis/    │  │   Server     │
│    Jobs)     │  │    GCS)      │  │    NATS)     │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                                           │
                                           ▼
                              ┌──────────────────────┐
                              │    Worker Pool       │
                              │  (Go worker service) │
                              └──────────────────────┘
                                           │
                                           ▼
                              ┌──────────────────────┐
                              │   ML API Provider    │
                              │ (Replicate/RunPod/   │
                              │  FAL/Stability)      │
                              └──────────────────────┘
```

---

## 3. Frontend (React + TypeScript)

### 3.1 Tech Stack
| Category | Choice | Rationale |
|----------|--------|-----------|
| Framework | React 18+ | User requirement |
| Language | TypeScript | User requirement |
| Build Tool | Vite | Already initialized |
| Routing | React Router v6 | Industry standard |
| State Management | Zustand or TanStack Query | Lightweight, good for async state |
| Styling | Tailwind CSS | Rapid development |
| Forms | React Hook Form + Zod | Type-safe validation |
| HTTP Client | Axios or fetch wrapper | Standard |
| Video Player | Video.js or Plyr | Robust video handling |

### 3.2 Key Pages/Components
```
src/
├── pages/
│   ├── Landing.tsx           # Marketing page
│   ├── Login.tsx             # OAuth + email login
│   ├── Register.tsx          # Account creation
│   ├── Dashboard.tsx         # User's video library
│   ├── CreateVideo.tsx       # Upload + generation wizard
│   ├── VideoDetail.tsx       # View/download completed video
│   └── Settings.tsx          # Account settings
├── components/
│   ├── VideoUploader.tsx     # Drag-drop upload with progress
│   ├── PersonaSelector.tsx   # Choose target persona
│   ├── JobProgress.tsx       # Real-time job status
│   ├── VideoPlayer.tsx       # Playback component
│   └── NotificationBell.tsx  # Job completion alerts
└── hooks/
    ├── useAuth.ts            # Auth state management
    ├── useJobs.ts            # Job polling/websocket
    └── useUpload.ts          # Chunked upload logic
```

### 3.3 Upload Requirements
- **Chunked uploads** for large video files (resumable)
- **Client-side validation**: file type, duration (≤60s), file size
- **Progress indicator** with cancel capability
- **Preview** before submission

---

## 4. Backend (Go)

### 4.1 Tech Stack
| Category | Choice | Rationale |
|----------|--------|-----------|
| HTTP Framework | Chi or Gin | Lightweight, performant |
| ORM | GORM or sqlc | sqlc for type-safe SQL, GORM for rapid dev |
| Auth | golang-jwt + OAuth2 | Industry standard |
| Validation | go-playground/validator | Struct validation |
| Config | Viper | Environment management |
| Logging | Zap or Zerolog | Structured logging |
| Queue Client | Redis (go-redis) or NATS | Job queue interface |

### 4.2 Service Structure
```
backend/
├── cmd/
│   ├── api/main.go           # HTTP API server
│   └── worker/main.go        # Job processing worker
├── internal/
│   ├── auth/                 # JWT, OAuth handlers
│   ├── user/                 # User CRUD
│   ├── video/                # Video metadata, upload handling
│   ├── job/                  # Job creation, status, queue
│   ├── notification/         # WebSocket, email notifications
│   └── ml/                   # ML API client wrapper
├── pkg/
│   ├── storage/              # S3/R2/GCS abstraction
│   ├── queue/                # Redis/NATS abstraction
│   └── middleware/           # Auth, logging, CORS
└── migrations/               # SQL migrations
```

### 4.3 API Endpoints

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Email registration |
| POST | `/api/v1/auth/login` | Email login |
| POST | `/api/v1/auth/refresh` | Refresh JWT |
| GET | `/api/v1/auth/oauth/:provider` | OAuth initiation |
| GET | `/api/v1/auth/oauth/:provider/callback` | OAuth callback |

#### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/videos/upload-url` | Get presigned upload URL |
| POST | `/api/v1/videos/complete-upload` | Mark upload complete |
| GET | `/api/v1/videos` | List user's videos |
| GET | `/api/v1/videos/:id` | Get video details |
| DELETE | `/api/v1/videos/:id` | Delete video |

#### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/jobs` | Create deepfake job |
| GET | `/api/v1/jobs` | List user's jobs |
| GET | `/api/v1/jobs/:id` | Get job status |
| DELETE | `/api/v1/jobs/:id` | Cancel pending job |

#### WebSocket
| Endpoint | Description |
|----------|-------------|
| `/ws/notifications` | Real-time job updates |

---

## 5. Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),  -- NULL for OAuth-only users
    oauth_provider VARCHAR(50),   -- 'google', 'discord', etc.
    oauth_id VARCHAR(255),
    display_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Source videos (user uploads)
CREATE TABLE source_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    storage_key VARCHAR(500) NOT NULL,  -- S3/R2 key
    filename VARCHAR(255),
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    status VARCHAR(20) DEFAULT 'processing',  -- processing, ready, failed
    created_at TIMESTAMP DEFAULT NOW()
);

-- Target personas (faces to swap to)
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- NULL for system personas
    name VARCHAR(100) NOT NULL,
    image_storage_key VARCHAR(500) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Deepfake generation jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source_video_id UUID REFERENCES source_videos(id),
    persona_id UUID REFERENCES personas(id),
    status VARCHAR(20) DEFAULT 'pending',  -- pending, processing, completed, failed
    progress INTEGER DEFAULT 0,            -- 0-100
    output_storage_key VARCHAR(500),       -- Result video location
    error_message TEXT,
    ml_job_id VARCHAR(255),                -- External API job ID
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_jobs_user_status ON jobs(user_id, status);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_source_videos_user ON source_videos(user_id);
```

---

## 6. Job Queue & Worker Architecture

### 6.1 Queue Design
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   pending   │ ──▶ │  processing │ ──▶ │  completed  │
│    queue    │     │    queue    │     │   (done)    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   failed    │
                    │   (retry?)  │
                    └─────────────┘
```

### 6.2 Worker Process
```go
// Pseudocode for worker loop
for {
    job := queue.Dequeue("pending")
    if job == nil {
        time.Sleep(1 * time.Second)
        continue
    }

    // Update status
    db.UpdateJobStatus(job.ID, "processing")
    notifyUser(job.UserID, "processing", job.ID)

    // Call ML API
    result, err := mlClient.GenerateDeepfake(
        job.SourceVideoURL,
        job.PersonaImageURL,
    )

    if err != nil {
        db.UpdateJobFailed(job.ID, err.Error())
        notifyUser(job.UserID, "failed", job.ID)
        continue
    }

    // Upload result to storage
    outputKey := storage.Upload(result.VideoBytes)

    // Update job
    db.UpdateJobCompleted(job.ID, outputKey)
    notifyUser(job.UserID, "completed", job.ID)
}
```

### 6.3 Scaling Workers
- Run multiple worker instances
- Use Redis BRPOPLPUSH or NATS for reliable dequeue
- Consider worker pools per ML API (avoid rate limits)

---

## 7. ML API Integration

### 7.1 Recommended Providers

| Provider | Pros | Cons |
|----------|------|------|
| **Replicate** | Easy API, many models, pay-per-use | Can be expensive at scale |
| **RunPod** | Serverless GPU, cost-effective | More setup required |
| **FAL.ai** | Fast, good for real-time | Newer, fewer models |
| **Stability AI** | Quality models | Limited face swap options |

### 7.2 Recommended Models (Replicate examples)
- `lucataco/faceswap` - Basic face swap
- `zsxkib/instant-id` - Identity-preserving generation
- `tencentarc/photomaker` - Style transfer with identity

### 7.3 API Client Interface
```go
type MLClient interface {
    // Start async job
    CreateJob(sourceVideoURL, targetImageURL string) (jobID string, err error)

    // Poll job status
    GetJobStatus(jobID string) (status JobStatus, err error)

    // Get result when complete
    GetResult(jobID string) (videoURL string, err error)
}

type JobStatus struct {
    Status   string  // "starting", "processing", "succeeded", "failed"
    Progress float64 // 0.0 - 1.0
    Error    string
}
```

---

## 8. File Storage

### 8.1 Recommended Options
| Provider | Pros | Cons |
|----------|------|------|
| **Cloudflare R2** | No egress fees, S3-compatible | Newer |
| **AWS S3** | Industry standard, mature | Egress costs |
| **Backblaze B2** | Cheap, S3-compatible | Less features |

### 8.2 Storage Structure
```
bucket/
├── uploads/
│   └── {user_id}/
│       └── {video_id}/
│           └── source.mp4
├── personas/
│   └── {persona_id}/
│       └── face.jpg
└── outputs/
    └── {job_id}/
        └── result.mp4
```

### 8.3 Upload Flow (Presigned URLs)
1. Frontend requests presigned URL from backend
2. Backend generates URL with 15-min expiry
3. Frontend uploads directly to storage (no backend proxy)
4. Frontend notifies backend of completion
5. Backend validates and creates DB record

---

## 9. Authentication

### 9.1 JWT Structure
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890
}
```

### 9.2 Token Lifecycle
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days (stored in httpOnly cookie)

### 9.3 OAuth Providers (Initial)
- Google
- Discord (popular with streamers)
- Twitch (consider for v2)

---

## 10. Real-time Notifications

### 10.1 WebSocket Protocol
```typescript
// Client -> Server
{ type: "subscribe", channel: "jobs" }

// Server -> Client
{
  type: "job_update",
  payload: {
    job_id: "uuid",
    status: "processing",
    progress: 45
  }
}
```

### 10.2 Fallback
- Long-polling endpoint for clients that can't use WebSocket
- Polling interval: 5 seconds

---

## 11. Infrastructure

### 11.1 Recommended Stack (Cloud-Agnostic)
| Component | Option 1 | Option 2 | Option 3 |
|-----------|----------|----------|----------|
| Compute | Railway | Render | Fly.io |
| Database | Neon (Postgres) | Supabase | PlanetScale (MySQL) |
| Queue | Upstash Redis | Railway Redis | NATS on Fly |
| Storage | Cloudflare R2 | AWS S3 | Backblaze B2 |
| CDN | Cloudflare | Fastly | CloudFront |

### 11.2 Environment Configuration
```bash
# Database
DATABASE_URL=postgres://user:pass@host:5432/dbname

# Redis/Queue
REDIS_URL=redis://host:6379

# Storage
S3_ENDPOINT=https://xyz.r2.cloudflarestorage.com
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_BUCKET=deepfake-videos

# ML API
REPLICATE_API_TOKEN=r8_xxx

# Auth
JWT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
DISCORD_CLIENT_ID=xxx
DISCORD_CLIENT_SECRET=xxx

# App
FRONTEND_URL=https://app.example.com
API_URL=https://api.example.com
```

---

## 12. Security Considerations

### 12.1 Required Measures
- [ ] Rate limiting on all endpoints (especially upload/job creation)
- [ ] Input validation (file types, sizes, duration)
- [ ] CORS configuration (whitelist frontend domain only)
- [ ] Presigned URLs with short expiry
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize user inputs)
- [ ] HTTPS everywhere
- [ ] Secure cookie flags (httpOnly, secure, sameSite)

### 12.2 Video Validation
```go
func ValidateVideo(file io.Reader) error {
    // Check file magic bytes (not just extension)
    // Extract duration using ffprobe
    // Reject if > 60 seconds
    // Check for malicious payloads
    // Scan with ClamAV (optional)
}
```

### 12.3 Content Moderation (Future)
- NSFW detection before processing
- Face detection to ensure valid inputs
- Output review queue for flagged content

---

## 13. Development Roadmap

### Phase 1: MVP
- [ ] User auth (email + Google OAuth)
- [ ] Single video upload
- [ ] Single persona selection (preset personas)
- [ ] Basic job queue with single worker
- [ ] Job status polling (no WebSocket yet)
- [ ] Video download

### Phase 2: Core Features
- [ ] Discord/Twitch OAuth
- [ ] Custom persona upload
- [ ] WebSocket notifications
- [ ] Job history with pagination
- [ ] Video preview before processing

### Phase 3: Enhancement
- [ ] Multiple workers with scaling
- [ ] Progress tracking from ML API
- [ ] Video gallery with thumbnails
- [ ] Share links (public video URLs)
- [ ] Usage analytics

---

## 14. Cost Estimation (Rough)

| Component | Estimated Monthly Cost (MVP) |
|-----------|------------------------------|
| Compute (API + 1 Worker) | $20-50 |
| PostgreSQL (managed) | $15-25 |
| Redis (managed) | $10-20 |
| Storage (100GB) | $5-15 |
| ML API (1000 videos @ ~$0.10-0.50/video) | $100-500 |
| **Total** | **~$150-600/month** |

Note: ML API costs dominate. Actual costs depend heavily on video length and model choice.

---

## 15. Open Questions

1. **Persona library**: Build a preset library of personas, or user-upload only?
2. **Video length tiers**: Different processing for 15s vs 60s videos?
3. **Quality settings**: Offer quality/speed tradeoff to users?
4. **Watermarking**: Watermark free tier outputs?
5. **Retry policy**: How many times to retry failed ML jobs?
6. **Storage retention**: How long to keep generated videos?

---

## Appendix A: Useful Resources

- [Replicate API Docs](https://replicate.com/docs)
- [RunPod Serverless Docs](https://docs.runpod.io/serverless)
- [Go Chi Router](https://github.com/go-chi/chi)
- [sqlc - Type-safe SQL](https://sqlc.dev/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
