# nettruyen

Crawl 1 comic to read offline.

## Prerequisites
- Node.js 8+ (support async/await)
- Yarn or NPM
- A guy who love reading comic

## How to use

### Crawl the comic
- Edit `CHAPTER_LIST_URL`, `CHAPTER_START`, `CHAPTER_END` in `crawl.js`
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
- [ ] Hot key to GOTO a chapter
- [x] Remember last chapter you read
- [ ] Manage multiple comic
- [ ] Pass `comic name`/`chapt start`/`chapt end` into cli args
- [ ] Build cli
- [ ] Setting for parallel download
