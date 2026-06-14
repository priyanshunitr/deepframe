# AI Video Editor

An AI-assisted video editor that turns prompts, scripts, audio, and uploaded media into rendered videos using a timeline-based rendering pipeline.

## Overview

This app does not ask AI to directly create a video file. Instead, AI creates a structured timeline plan that can be rendered deterministically.

```txt
User input
  -> script/audio/video analysis
  -> AI storyboard
  -> timeline JSON
  -> Remotion render
  -> FFmpeg post-processing
  -> final MP4 stored in R2/S3
```

## Tech Stack

- Next.js + TypeScript
- PostgreSQL + Prisma
- Cloudflare R2 / S3-compatible storage
- BullMQ or a simple job queue
- Remotion for video rendering
- FFmpeg for media processing
- OpenAI / Whisper / Deepgram APIs
- Background worker for long-running render jobs

## Project Structure

```txt
apps/
  web/              # Next.js app
  worker/           # background rendering worker

packages/
  db/               # Prisma schema and client
  shared/           # shared types, zod schemas, timeline models
  renderer/         # Remotion compositions and render helpers
```

## Main Features

- Create video projects from a prompt or script
- Upload audio, video, images, and brand assets
- Generate transcripts from uploaded audio/video
- Generate storyboard and timeline JSON using AI
- Render videos with Remotion
- Process media with FFmpeg
- Store project state, assets, jobs, and timelines in Postgres
- Store uploaded and rendered media in R2/S3
- Track render job status
- Support future AI revision commands

## Data Flow

1. User creates a project.
2. User uploads a script, audio, video, or assets.
3. Backend stores metadata in Postgres.
4. Files are uploaded to R2/S3.
5. Analysis job is queued.
6. AI generates storyboard and timeline JSON.
7. Render job is queued.
8. Worker renders video with Remotion.
9. FFmpeg compresses or transcodes the output.
10. Final video URL is saved to Postgres.

## Environment Variables

```env
DATABASE_URL=

NEXT_PUBLIC_APP_URL=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

OPENAI_API_KEY=
DEEPGRAM_API_KEY=

REDIS_URL=

WORKER_CONCURRENCY=1
```

## Prisma Models

Core entities:

- User
- Project
- Asset
- TimelineVersion
- RenderJob
- Transcript
- Export

## Timeline JSON

The AI should output a renderable timeline format.

```json
{
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "duration": 52,
  "scenes": [
    {
      "id": "scene_1",
      "start": 0,
      "end": 4,
      "type": "hook",
      "caption": "How does a VPN bypass a block?",
      "visual": {
        "kind": "infographic",
        "description": "Blocked website screen with warning icon"
      }
    }
  ]
}
```

## Development

```bash
npm install
npm run db:push
npm run dev
npm run worker
```

### Suggested Scripts

```json
{
  "dev": "next dev",
  "worker": "tsx apps/worker/src/index.ts",
  "db:push": "prisma db push",
  "db:migrate": "prisma migrate dev",
  "db:studio": "prisma studio",
  "render:test": "tsx apps/worker/src/render-test.ts"
}
```

## Rendering Strategy

Use Remotion as the main rendering engine.

Use FFmpeg for:

- Extracting audio
- Converting uploaded media
- Compressing exports
- Generating thumbnails
- Fixing codec/container issues

## MVP Roadmap

- [ ] Project dashboard
- [ ] Prisma schema
- [ ] R2/S3 file uploads
- [ ] Basic render job queue
- [ ] Simple Remotion template
- [ ] Render worker
- [ ] Captions
- [ ] Script-to-storyboard AI
- [ ] Timeline JSON renderer
- [ ] AI revision commands
# ai-video-editor
