from .img_to_pdf import img_to_pdf
from .pdf_to_md import pdf_to_md

def img_to_md(name):
    img_to_pdf(name)
    pdf_to_md(name)
    
name = input("Input Name: ")
img_to_md(name)