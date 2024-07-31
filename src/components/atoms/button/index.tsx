type ButtonProps = {
  handler: () => void;
  children: React.ReactNode;
};

export default function Button({ handler, children }: ButtonProps) {
  return (
    <button className="group relative inline-flex h-12 items-center border justify-center overflow-hidden rounded-md bg-transparent px-6 font-medium text-neutral-200 transition hover:scale-110" onClick={handler} type="button">
      <span className="uppercase">{children}</span>
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
        <div className="relative h-full w-8 bg-white/20" />
      </div>
    </button>
  );
}
