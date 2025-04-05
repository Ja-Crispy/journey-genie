import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

let vectorStore: MemoryVectorStore | null = null;
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  modelName: "text-embedding-3-large"
});

export async function initializeVectorStore() {
  try {
    if (!vectorStore) {
      await loadPDFs();
    }
    return true;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    return false;
  }
}

async function loadPDFs() {
  const pdfUrls = [
    '/data/Colette Worldwide Travel Guide 2021-2023.pdf',
    '/data/Lonely Planet.pdf'
  ];

  let allDocs = [];
  
  for (const pdfUrl of pdfUrls) {
    try {
      const response = await fetch(pdfUrl);
      const pdfBlob = await response.blob();
      
      // Load PDF
      const loader = new PDFLoader(pdfBlob);
      const docs = await loader.load();

      // Split into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await textSplitter.splitDocuments(docs);
      
      // Add source metadata
      chunks.forEach(chunk => {
        chunk.metadata.source = pdfUrl.split('/').pop();
      });

      allDocs.push(...chunks);
      console.log(`Processed ${chunks.length} chunks from ${pdfUrl}`);
    } catch (error) {
      console.error(`Error processing PDF ${pdfUrl}:`, error);
    }
  }

  // Create vector store from all documents
  if (allDocs.length > 0) {
    vectorStore = await MemoryVectorStore.fromDocuments(
      allDocs,
      embeddings
    );
    console.log("Vector store initialized with", allDocs.length, "documents");
  }
}

export async function queryVectorStore(query: string, numResults: number = 3) {
  if (!vectorStore) {
    const initialized = await initializeVectorStore();
    if (!initialized) throw new Error("Failed to initialize vector store");
  }

  try {
    const results = await vectorStore!.similaritySearch(query, numResults);
    return results.map(doc => ({
      content: doc.pageContent,
      source: doc.metadata.source,
      page: doc.metadata.loc?.pageNumber || 1
    }));
  } catch (error) {
    console.error("Error querying vector store:", error);
    return [];
  }
}