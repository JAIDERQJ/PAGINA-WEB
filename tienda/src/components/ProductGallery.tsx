"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [""];

  return (
    <div>
      <div className="relative aspect-[3/4] bg-moss-soft mb-3">
        {list[active] && (
          <Image src={list[active]} alt={name} fill priority className="object-cover" />
        )}
      </div>
      {list.length > 1 && (
        <div className="flex gap-3">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 aspect-[3/4] bg-moss-soft ${i === active ? "ring-2 ring-ink" : ""}`}
            >
              <Image src={img} alt={name} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
