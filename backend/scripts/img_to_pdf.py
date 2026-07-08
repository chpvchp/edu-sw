from pathlib import Path
import img2pdf

def img_to_pdf(name):
    ROOT = Path(__file__).resolve().parents[1]
    img_folder_path = ROOT / "imgs" / name
    pdf_file = ROOT / "pdf" / f"{name}.pdf"
    
    images = sorted(img_folder_path.glob("*.jpg"))

    with open(pdf_file, "wb") as file:
        file.write(img2pdf.convert([img for img in images]))

name = input("Input Name Exam: ")        

img_to_pdf(
    name=name
)