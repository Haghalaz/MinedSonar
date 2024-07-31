import { Github } from "lucide-react";

export default function Credits() {
  return (
    <div className="absolute hidden items-center right-12 bottom-6 gap-4 md:flex">
      <p className="text-sm">Feito por Luiz Coelho</p>

      <span className="size-2 rounded-full bg-stone-500" />

      <a href="https://github.com/Haghalaz" target="_blank" rel="noreferrer">
        <Github className="size-5" />
      </a>
    </div>
  );
}
