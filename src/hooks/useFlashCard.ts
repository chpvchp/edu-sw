import { useState, useEffect } from "react";
import type { Cards, FlashCard } from "../type/flashcard.type";
import { getCard, getFlashCards } from "../api/flashcard.api";

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

export const useCards = ( id_flashcard: string ) => {
  const [data, setData] = useState<Cards[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setIsError(false);

    getCard(id_flashcard)
      .then((questions) => {
        if (isMounted) {
          setData(questions);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsError(true);
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
  }, [id_flashcard]);

  return { data, isLoading, isError };
}