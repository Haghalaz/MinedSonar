type PopUpProps = {
  title: string;
  children?: React.ReactNode;
};

export default function PopUp({ title, children }: PopUpProps) {
  return (
    <div className="absolute z-50 animate-fadeIn bg-stone-900/90 size-full space-y-12 h-svh grid place-content-center">
      <h1 className="text-center font-extrabold font-mono text-4xl uppercase">{title}</h1>

      {children}
    </div>
  );
}
