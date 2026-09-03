export type Cards = {
  order: number;
  vocab: string;
  pos: string;
  ipa: string; 
  mean: string; 
  example: string
}


export type FlashCard = {
  id_flashcard: string;
  name_flashcard: string;
  language: string;
  num_cards: number;
  updated: string;
  created: string;
  source: string;
}