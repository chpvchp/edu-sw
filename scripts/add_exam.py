#!/usr/bin/env python3

import argparse
import json
import re
import sys
from pathlib import Path

YAML_HEADER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?", re.DOTALL)


def parse_scalar(value: str):
    cleaned = value.strip()
    if cleaned.startswith('"') and cleaned.endswith('"'):
        return cleaned[1:-1]
    if cleaned.startswith("'") and cleaned.endswith("'"):
        return cleaned[1:-1]
    if cleaned.lower() in {"true", "false"}:
        return cleaned.lower() == "true"
    if cleaned.lower() in {"null", "none"}:
        return None
    if re.fullmatch(r"-?\d+", cleaned):
        return int(cleaned)
    if re.fullmatch(r"-?\d+\.\d+", cleaned):
        return float(cleaned)
    return cleaned


def parse_metadata(markdown_text: str):
    match = YAML_HEADER_RE.match(markdown_text)
    if not match:
        return {}, markdown_text

    metadata = {}
    for raw_line in match.group(1).splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = [item.strip() for item in line.split(":", 1)]
        metadata[key] = parse_scalar(value)

    body = markdown_text[match.end():]
    return metadata, body


def is_question(line: str) -> bool:
    return bool(re.match(r"^\*\*Câu\s+\d+.*\*\*", line))


def clean_question(line: str) -> str:
    return re.sub(r"^\*\*Câu\s+\d+(?::\*\*|\*\*:)?\s*", "", line).strip()


def is_question_continuation(line: str) -> bool:
    return bool(
        re.match(r"^\*\([a-z]\)\*", line)
        or re.match(r"^\*\(\d+\)\*", line)
        or re.match(r"^- Bước ", line)
        or re.match(r"^_a\)_", line)
        or re.match(r"^_b\)_", line)
        or re.match(r"^_c\)_", line)
        or re.match(r"^_d\)_", line)
    )


def is_answer_four_choice(line: str) -> bool:
    return bool(re.match(r"^\*\*[A-D]\.?\*\*", line))


def is_answer_true_false(line: str) -> bool:
    return bool(re.match(r"^\*?[a-d]\)", line) or re.match(r"^_?[a-d]\)", line))


def is_answer_short_answer(line: str) -> bool:
    return bool(re.match(r"^\*\*Đáp án là:\*\*\s*.*", line))


def is_path_image(line: str) -> bool:
    return "![](" in line


def remove_correct_marker(line: str) -> str:
    return re.sub(r"\s+\*\*ĐápÁnĐúng\*\*|\s+ĐápÁnĐúng", "", line)


def remove_true_false_marker(line: str) -> str:
    return re.sub(r"\s+\*\*ĐápÁnĐúng\*\*|\s+\*\*ĐápÁnSai\*\*|\s+ĐápÁnĐúng|\s+ĐápÁnSai", "", line)


def clean_answer(line: str) -> str:
    line = re.sub(r"^\*\*[A-D]\.?\*\*\s*", "", line)
    line = re.sub(r"^\*?[a-d]\)\s*", "", line)
    line = re.sub(r"^_?[a-d]\)\s*", "", line)
    line = re.sub(r"^\*\(\s*[a-d]\s*\)\*\s*", "", line)
    line = re.sub(r"^\*\([a-d]\)\*\s*", "", line)
    line = re.sub(r"^\*\*Đáp án là:\*\*\s*", "", line)
    return line.strip()


def parse_exam(markdown_text: str, defaults: dict):
    questions = []
    current_question = None
    order = 1
    question_number = 1
    answer_index = 0
    id_exam = defaults["id_exam"]

    for raw_line in markdown_text.splitlines():
        line = raw_line.strip()

        if not line:
            continue

        if is_question(line):
            answer_index = 0
            question_id = f"{id_exam}-q{question_number}"
            question_number += 1
            current_question = {
                "id_question": question_id,
                "order": order,
                "question": clean_question(line),
                "type_question": "",
                "path_images": None,
                "answers": [],
                "results": {
                    "explain": "",
                    "correct_answer": None,
                    "true_answer": [],
                    "false_answer": [],
                    "short_answer": "",
                },
            }
            questions.append(current_question)
            order += 1
            continue

        if is_question_continuation(line) and current_question is not None:
            current_question["question"] += "\n" + line
            continue

        if is_path_image(line) and current_question is not None:
            match = re.search(r"!\[\]\(([^)]+)\)", line)
            if match:
                current_question["path_images"] = f"/data/images/{id_exam}/" + match.group(1)
            continue

        if is_answer_four_choice(line) and current_question is not None:
            answer_key = line[2:3]
            answer_id = f"{current_question['id_question']}-{answer_key.lower()}"
            answer_index += 1

            if current_question["type_question"] != "four_choice":
                current_question["type_question"] = "four_choice"

            if "ĐápÁnĐúng" in line:
                current_question["results"]["correct_answer"] = answer_id
                line = remove_correct_marker(line)

            line = clean_answer(line)
            current_question["answers"].append({
                "id_answer": answer_id,
                "answer": line,
            })
            continue

        if is_answer_true_false(line) and current_question is not None:
            answer_key = re.search(r"[a-d]", line)
            if not answer_key:
                continue
            answer_id = f"{current_question['id_question']}-{answer_key.group(0)}"
            answer_index += 1

            if current_question["type_question"] != "true_false":
                current_question["type_question"] = "true_false"

            if "ĐápÁnĐúng" in line:
                current_question["results"]["true_answer"].append(answer_id)
            elif "ĐápÁnSai" in line:
                current_question["results"]["false_answer"].append(answer_id)

            line = remove_true_false_marker(line)
            line = clean_answer(line)
            current_question["answers"].append({
                "id_answer": answer_id,
                "answer": line,
            })
            continue

        if is_answer_short_answer(line) and current_question is not None:
            current_question["type_question"] = "short_answer"
            value = re.sub(r"^\*\*Đáp án là:\*\*\s*", "", line).strip()
            current_question["results"]["short_answer"] = value
            continue

    exam = {
        "id_exam": id_exam,
        "id_subject": defaults.get("id_subject"),
        "name_exam": defaults.get("name_exam"),
        "name_subject": defaults.get("name_subject"),
        "class_exam": defaults.get("class_exam"),
        "duration": defaults.get("duration"),
        "updated": defaults.get("updated") or defaults.get("created"),
        "created": defaults.get("created"),
        "source": defaults.get("source") or f"/documents/pdf/{id_exam}.pdf",
        "questions": questions,
    }

    return exam


def build_defaults(metadata: dict, file_path: Path):
    id_exam = metadata.get("id_exam") or file_path.stem
    defaults = {
        "id_exam": id_exam,
        "id_subject": metadata.get("id_subject"),
        "name_exam": metadata.get("name_exam") or id_exam,
        "name_subject": metadata.get("name_subject") or "",
        "class_exam": metadata.get("class_exam"),
        "duration": metadata.get("duration", 0),
        "updated": metadata.get("updated") or metadata.get("created"),
        "created": metadata.get("created"),
        "source": metadata.get("source") or f"/documents/pdf/{id_exam}.pdf",
    }
    return defaults


def validate_exam(exam: dict):
    required = [
        "id_exam",
        "name_exam",
        "name_subject",
        "class_exam",
        "duration",
        "created",
        "questions",
    ]

    missing_fields = [field for field in required if field not in exam or exam.get(field) in (None, "")]
    if missing_fields:
        raise ValueError(f"Missing required exam fields: {', '.join(missing_fields)}")

    if not isinstance(exam["questions"], list):
        raise ValueError("Field 'questions' must be a list.")

    for question in exam["questions"]:
        if not question.get("id_question"):
            raise ValueError("Each question must have an id_question.")
        if not question.get("type_question"):
            raise ValueError(f"Question {question.get('id_question')} has no type_question.")

        if question["type_question"] == "four_choice":
            if len(question.get("answers", [])) < 4:
                raise ValueError(f"Question {question['id_question']} is missing four_choice answers.")
            if not question["results"].get("correct_answer"):
                raise ValueError(f"Question {question['id_question']} is missing correct_answer.")

        if question["type_question"] == "true_false":
            if len(question.get("answers", [])) < 4:
                raise ValueError(f"Question {question['id_question']} is missing true_false answers.")
            if not question["results"].get("true_answer") or not question["results"].get("false_answer"):
                raise ValueError(f"Question {question['id_question']} has incomplete true/false answer sets.")

        if question["type_question"] == "short_answer":
            if not question["results"].get("short_answer"):
                raise ValueError(f"Question {question['id_question']} is missing short_answer.")


def main():
    parser = argparse.ArgumentParser(description="Convert Markdown exam content into the JSON schema used by EduSW.")
    parser.add_argument("md_file", help="Markdown file path to convert")
    args = parser.parse_args()

    source_path = Path(args.md_file)
    if not source_path.exists():
        print(f"File not found: {source_path}", file=sys.stderr)
        return 1

    text = source_path.read_text(encoding="utf-8")
    metadata, body_text = parse_metadata(text)
    defaults = build_defaults(metadata, source_path)

    exam = parse_exam(body_text, defaults)
    validate_exam(exam)

    output_folder = Path("./public/data/exams")
    output_folder.mkdir(parents=True, exist_ok=True)
    output_path = output_folder / f"{exam['id_exam']}.json"
    output_path.write_text(json.dumps(exam, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Created exam JSON: {output_path}")
    print(f"Questions: {len(exam['questions'])}")
    print(f"Exam id: {exam['id_exam']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
