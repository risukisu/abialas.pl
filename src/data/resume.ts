/**
 * Résumé facts for the ResumeTile — read off the real file, not typed
 * from memory. Regenerate the sheet + refresh these when public/resume.pdf
 * changes (git log -1 -- public/resume.pdf gives the date):
 *
 *   # page 1 → PNG at 2x (PyMuPDF), then → webp via sharp (already a dep)
 *   python -c "import fitz; d=fitz.open('public/resume.pdf'); d[0].get_pixmap(matrix=fitz.Matrix(2,2), alpha=False).save('resume-p1.png'); print(len(d))"
 *   node -e "require('sharp')('resume-p1.png').resize({width:560}).webp({quality:82}).toFile('public/resume-p1.webp')"
 */
export const resume = {
  href: "/work",
  pdf: "/resume.pdf",
  sheet: "/resume-p1.webp", // page 1, 560×792
  pages: 2,
  updated: "2026-06-19", // commit date of the current PDF (900c29c)
} as const;
