# My PYQ Hub – React

## Setup
```bash
npm install
npm run dev        # localhost:5173
npm run build      # production build → dist/
```

## Deploy to Netlify
1. Run `npm run build`
2. Drag the `dist/` folder to netlify.com/drop

## Connect Real PDFs
In `src/App.jsx`, find `GhostBtn` (View) and `SolidBtn` (Download) 
inside `PaperCard` and replace the `alert()` with:
```js
// View:     window.open(paper.pdf, '_blank')
// Download: Object.assign(document.createElement('a'), { href: paper.pdf, download: '' }).click()
```
Then add a `pdf: "https://..."` field to each paper object in the data arrays.
