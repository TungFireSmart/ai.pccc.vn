# ai-pccc/app

Frontend review build for `ai.pccc.vn`.

## Current UI direction

This version has been refactored into a cleaner, more reviewable product walkthrough with 4 primary surfaces:

1. **Landing / homepage** — product positioning, premium visual system, PCCC-specialized use cases
2. **Auth screens** — Google / email / team-workspace concepts
3. **Chat app shell** — ChatGPT-like layout with threads, context, prompts, and output rail
4. **AI Station** — workspace skeleton for sales, technical, bid, and knowledge operations in PCCC

## Notes

- This is still a frontend concept build, but it now reads much closer to a real SaaS product review candidate.
- Content is intentionally specialized for the Vietnamese PCCC domain.
- Visual direction stays premium: dark glass UI, cyan-blue gradients, spacious layout, clear panel hierarchy.

## Run

```bash
npm install
npm run dev
npm run build
```

## Review path

Start on **Trang chủ**, then review in this order:

- **Đăng nhập**
- **Chat app**
- **AI Station**

That sequence shows the product story most clearly.
