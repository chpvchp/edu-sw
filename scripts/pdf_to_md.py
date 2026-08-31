# source .venv/bin/activate
# cd scripts
# python3 ./pdf_to_md.py

from core.api.connect_mineru import pdf_to_md_mineru
from core.parse.parse_clean_md import parse_clean_md

from pathlib import Path

def pdf_to_md(path):
    data_path = Path(path)

    text_md = pdf_to_md_mineru(pdf_path=data_path)
    # text_md, total_replace = parse_clean_md(text_md)
    
    output_file = Path("./cache/raw.md")

    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w", encoding="utf-8") as file:
        file.write(str(text_md))
        
    print("Done!")
    print(output_file)
    
    
    
if __name__ == "__main__":
    path = "./cache/raw_pdf.pdf"
        
    pdf_to_md(path=path)
