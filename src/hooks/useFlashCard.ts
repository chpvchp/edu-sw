import { useState, useEffect } from "react";
import type { FlashCard } from "../type/flashcard.type";
import { getFlashCards } from "../api/flashcard.api";

export const useListFlashCard = () => {
  const [data, setData] = useState<FlashCard[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    getFlashCards()
      .then((flashcardList) => {
        if (isMounted) {
          setData(flashcardList);
          setError(null);
        }
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(fetchError);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
};