# source .venv/bin/activate
# cd scripts
# python3 ./pdf_to_md.py

from core.api.connect_mineru import pdf_to_md_mineru
from core.parse.parse_clean_md import parse_clean_md

from pathlib import Path

def pdf_to_md(name_file):
    ROOT = Path(__file__).resolve().parents[1]
    data_path = ROOT / "data"

    text_md = pdf_to_md_mineru(name_file=f"{name_file}.pdf")
    text_md, total_replace = parse_clean_md(text_md)
    
    output_file = Path(data_path) / name_file / f"{name_file}.md"

    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w", encoding="utf-8") as file:
        file.write(str(text_md))
        
    print("Done!")
    print(output_file)

# name = input("Input Name Exam: ")     

# pdf_to_md(
#     name_file=name
# )