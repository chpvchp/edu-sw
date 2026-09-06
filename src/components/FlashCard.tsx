  import { useState, useRef } from "react"
  import type { Cards } from "../type/flashcard.type";
  import { Volume2 } from 'lucide-react';

  export default function FlashCard ({ order, audio, vocab, pos, ipa, mean, example } : Cards) {
    const [fliped, setFlip] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    const playAudio = () => {
      audioRef.current?.play();
    };

    console.log(order)

    return (
      <div className="w-full max-w-lg aspect-3/2  cursor-pointer perspective-distant" onClick={() => setFlip(!fliped)}>
        
        {/* Flashcard */}
        <div className={`w-full h-full bg-white shadow-lg p-2 border border-gray-200 rounded-2xl relative transform-3d transition duration-400 ${fliped ? "rotate-y-180": ""} `}>

          {/* Front Face Card (Vocab) */}
          <div className="absolute inset-0 flex flex-col gap-1 justify-center items-center backface-hidden">
              <p className="font-bold text-xl lg:text-4xl">{vocab}</p>
            <div className="p-2 flex gap-2">
              <p className="text-gray-600 text-xs lg:text-sm">{pos}</p>
              <p className="text-gray-600 text-xs lg:text-sm">-</p>
              <p className="text-gray-600 text-xs lg:text-sm">{ipa}</p>
            </div>
            <div>
              {/* Audio */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                className="p-2 rounded-full hover:bg-gray-100 absolute bottom-2 right-2"
              >
                <Volume2 size={24} />
              </button>
              <audio ref={audioRef} src={audio} />
            </div>
          </div>

          {/* Back Face Card (Mean) */}
          <div className="absolute inset-0 flex flex-col gap-1 justify-center items-center backface-hidden rotate-y-180">
            <p className="font-bold text-xl lg:text-4xl">{mean}</p>
            <div className="p-2 flex gap-2">
              <p className="text-gray-600 text-sm lg:text-md">{example}</p>
            </div>
            <div>
              {/* Audio */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                className="p-2 rounded-full hover:bg-gray-100 absolute bottom-2 right-2"
              >
                <Volume2 size={24} />
              </button>
              <audio ref={audioRef} src={audio} />
            </div>
          </div>

        </div>

      </div>
    )
  }