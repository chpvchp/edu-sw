import type { FlashCard } from "../type/flashcard.type";
import { fetchJson } from "./api";

const FLASHCARDS_INDEX_PATH = "/data/flashcards/index.json";

export const getFlashCards = async (): Promise<FlashCard[]> => fetchJson<FlashCard[]>(FLASHCARDS_INDEX_PATH);