from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain_chroma import Chroma
from pathlib import Path
from tqdm import tqdm

# Embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="AITeamVN/Vietnamese_Embedding_v2",
)

# Tạo hoặc mở ChromaDB
db = Chroma(
    collection_name="demo",
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)

# # Add docs from obsidian vault
# ROOT = Path("/home/caophuc/Documents/obsidian-vault-chp")
# docs = []
# chunk_size = 1024
# for md_file in ROOT.rglob("*.md"):
#     with open(md_file, "r", encoding="utf-8") as file:
#         data_file = file.read()
        
#         for i in tqdm(range(0, len(data_file), chunk_size)):
#             batch = data_file[i:i + chunk_size]
#             docs.append(
#                 Document(
#                     page_content=batch,
#                     metadata={
#                         "source": str(md_file),
#                         "file_name": md_file.name,
#                     }
#                 )
#             )

# # Thêm vào database
# db.add_documents(documents=docs)

query = """
Phản ứng ester hóa là gì
"""

results = db.similarity_search_with_score(query=query, k=4)
for doc, score in results:   
    print(f"ID: {doc.id}")
    print(score)
    print(f"Content: {doc.page_content}")
    print("=" * 32)