# nettruyen

Crawl 1 comic to read offline.

## Prerequisites
- Node.js 8+ (support async/await)
- Yarn or NPM
- A guy who love reading comic

## How to use

### Crawl the comic
- Edit `CHAPTER_LIST_URL`, `CHAPTER_START`, `CHAPTER_END`, `PARALLEL_DOWNLOAD` in `crawl.js`
- Run
```bash
node crawl.js
```

### Read and enjoy
- Run
```bash
node server.js
```
- Open your browser http://localhost:3000 and enjoy


## Features
- [x] Crawl comic & read offline
- [x] Use keyboard to switch next/prev chapter
- [x] Hot key to GOTO a chapter
- [x] Remember last chapter you read
- [x] Setting for parallel download
- [x] Pass `COMIC`/`CHAPTER_START`/`CHAPTER_END`/`PARALLEL_DOWNLOAD` into crawler args
- [x] Build cli
- [ ] Manage multiple comic
