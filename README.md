# EduSW

EduSW is now a static exam-practice web app built with React, TypeScript, and Vite.

The app loads exam metadata and questions from JSON files in `public/data/exams/` and evaluates submissions fully on the client.

## Structure
```text
public/data/exams/index.json   # exam list shown on the practice page
public/data/exams/{id}.json    # full exam payload with questions and answers
```

## Run
```bash
npm install
npm run dev
```

## Notes
The current workspace includes a sample exam derived from the old backend template. If you want the real production content migrated into `public/data/exams/`, provide the source or confirm the exact dataset to use.