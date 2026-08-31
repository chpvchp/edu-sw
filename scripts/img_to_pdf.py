from pathlib import Path
import img2pdf

def img_to_pdf(img_folder_path: Path, output_pdf: Path):
    images = sorted(img_folder_path.glob("*.jpg"))

    with open(output_pdf, "wb") as f:
        f.write(img2pdf.convert(images))

    print("Đã xong!")
    print(output_pdf)



if __name__ == "__main__":
    name = "raw_pdf"
    img_folder_path = Path("./imgs")
    output_pdf = Path(f"./cache/{name}.pdf")

    img_to_pdf(
        img_folder_path=img_folder_path,
        output_pdf=output_pdf,
    )