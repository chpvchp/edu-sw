#!/usr/bin/env python3

import json
from pathlib import Path

EXAMS_DIR = Path("./public/data/exams")
INDEX_PATH = EXAMS_DIR / "index.json"


def main():
    EXAMS_DIR.mkdir(parents=True, exist_ok=True)
    entries = []

    for file_path in sorted(EXAMS_DIR.glob("*.json")):
        if file_path.name == "index.json":
            continue

        data = json.loads(file_path.read_text(encoding="utf-8"))
        entry = {
            "id_exam": data.get("id_exam"),
            "name_exam": data.get("name_exam"),
            "name_subject": data.get("name_subject"),
            "class_exam": data.get("class_exam"),
            "duration": data.get("duration"),
            "updated": data.get("updated") or data.get("created"),
            "created": data.get("created"),
        }

        if entry["id_exam"]:
            entries.append(entry)

    INDEX_PATH.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Updated exam index: {INDEX_PATH}")
    print(f"Entries: {len(entries)}")


if __name__ == "__main__":
    main()
