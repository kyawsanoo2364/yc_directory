const Ping = () => {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-1">
        <span className="flex size-[11px]">
          <span className="absolute inline-flex w-full h-full rounded-full bg-primary animate-ping opacity-75"></span>
          <span className="absolute inline-flex w-full h-full rounded-full bg-primary "></span>
        </span>
      </div>
    </div>
  );
};
export default Ping;
