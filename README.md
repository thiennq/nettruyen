# nettruyen

Crawl 1 comic to read offline.

## Prerequisites
- Node.js 8+ (support async/await)
- Yarn or NPM
- A guy who love reading comic

## How to use


## Using like a boss (developer way)

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





## Features
- [x] Crawl comic & read offline
- [x] Use keyboard to switch next/prev chapter
- [x] Hot key to GOTO a chapter
- [x] Remember last chapter you read
- [x] Setting for parallel download
- [x] Pass `COMIC`/`CHAPTER_START`/`CHAPTER_END`/`PARALLEL_DOWNLOAD` into crawler args
- [x] Build cli
- [x] Open in browser automatically
- [x] Select/search comic by wizard
- [ ] Manage multiple comic
