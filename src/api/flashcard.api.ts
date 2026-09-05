import type { Cards, FlashCard } from "../type/flashcard.type";
import { fetchJson } from "./api";

const FLASHCARDS_INDEX_PATH = "/data/flashcards/index.json";
const flashCardCache = new Map<string, FlashCardData>();

export type FlashCardData = FlashCard & {
  cards: Cards[]
}

async function loadFlashcarddata(idFlashcard: string): Promise<FlashCardData> {
  const cachedFlashcard = flashCardCache.get(idFlashcard);

  if (cachedFlashcard) {
    return cachedFlashcard;
  }

  const flashcard = await fetchJson<FlashCardData>(`/data/flashcards/${idFlashcard}.json`);
  flashCardCache.set(idFlashcard, flashcard);
  return flashcard;
}


export const getFlashCards = async (): Promise<FlashCard[]> => fetchJson<FlashCard[]>(FLASHCARDS_INDEX_PATH);

export const getCard = async (idFlashcard: string): Promise<Cards[]> => {
  const flashcard = await loadFlashcarddata(idFlashcard);
  return flashcard.cards
}

export const getInfoFlashcard = async (idFlashcard: string): Promise<FlashCardData> => {
  const infoFlashcard = await loadFlashcarddata(idFlashcard);
  return infoFlashcard;
};
