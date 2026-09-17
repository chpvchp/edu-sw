  import { useState, useRef } from "react"
  import type { Cards } from "../type/flashcard.type";
  import { Volume2 } from 'lucide-react';

  export default function FlashCard ({ audio, vocab, pos, ipa, mean, example } : Cards) {
    const [fliped, setFlip] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    const playAudio = () => {
      audioRef.current?.play();
    };

    return (
      <div className="w-full max-w-lg aspect-3/2 cursor-pointer perspective-distant" onClick={() => setFlip(!fliped)}>
        
        {/* Flashcard */}
        <div className={`relative h-full w-full rounded-2xl border border-[#dbe7ee] bg-white p-2 shadow-xl shadow-[#18324b]/8 transform-3d transition duration-400 ${fliped ? "rotate-y-180": ""} `}>

          {/* Front Face Card (Vocab) */}
          <div className="absolute inset-0 flex flex-col gap-1 justify-center items-center backface-hidden">
              <p className="text-3xl font-extrabold text-[#18324b] lg:text-4xl">{vocab}</p>
            <div className="p-2 flex gap-2">
              <p className="text-xs text-[#6c8494] lg:text-sm">{pos}</p>
              <p className="text-xs text-[#6c8494] lg:text-sm">-</p>
              <p className="text-xs text-[#6c8494] lg:text-sm">{ipa}</p>
            </div>
            <div>
              {/* Audio */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                aria-label="Phát âm từ vựng"
                className="absolute bottom-2 right-2 rounded-full p-2 text-[#27735f] hover:bg-[#e9f7f0]"
              >
                <Volume2 size={24} />
              </button>
              <audio ref={audioRef} src={audio} />
            </div>
          </div>

          {/* Back Face Card (Mean) */}
          <div className="absolute inset-0 flex flex-col gap-1 justify-center items-center backface-hidden rotate-y-180">
            <p className="text-center text-3xl font-extrabold text-[#18324b] lg:text-4xl">{mean}</p>
            <div className="p-2 flex gap-2">
              <p className="px-5 text-center text-sm text-[#6c8494] lg:text-base">{example}</p>
            </div>
            <div>
              {/* Audio */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                aria-label="Phát âm từ vựng"
                className="absolute bottom-2 right-2 rounded-full p-2 text-[#27735f] hover:bg-[#e9f7f0]"
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