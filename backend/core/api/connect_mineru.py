import httpx
from pathlib import Path

def pdf_to_md_mineru(name_file):
    
    ROOT = Path(__file__).resolve().parents[2]
    pdf_path = ROOT / "pdf" / name_file
    
    # print(ROOT)
    # print(pdf_path)
    
    url = "http://localhost:8888/file_parse"

    data = {
        "image_analysis": "true",
        "client_side_output_generation": "false",
        "return_middle_json": "false",
        "return_model_output": "false",
        "return_md": "true",
        "return_images": "false",
        "end_page_id": "99999",
        "effort": "high",
        "parse_method": "auto",
        "start_page_id": "0",
        "lang_list": "ch",
        "return_content_list": "false",
        "backend": "vlm-engine",
        "table_enable": "true",
        "response_format_zip": "false",
        "return_original_file": "false",
        "formula_enable": "true",
    }
    
    timeout = httpx.Timeout(
        connect=10.0,
        read=600.0,
        write=600.0,
        pool=10.0
    )
    
    with open(pdf_path, "rb") as file:
        files = {"files": (name_file, file, "application/pdf")}
        
        response = httpx.post(
            url,
            files=files,
            data=data,
            timeout=timeout
        )
    
    return response.json().get("results").get("pdf").get("md_content")