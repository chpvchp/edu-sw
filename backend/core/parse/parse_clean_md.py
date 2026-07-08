import re
from .rule_parse import list_replace

def parse_clean_md(text_md):
    total_count = 0
    
    for pattern, replacement in list_replace:
        text_md, n = re.subn(pattern, replacement, text_md, flags=re.MULTILINE)
        total_count += n
        
    return text_md, total_count