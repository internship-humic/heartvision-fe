export default function HeroCircles() {
  return (
    <>
      {/* Top Left Circle */}
      <div className="absolute top-[10%] -left-[5%] w-[60vw] md:w-[30vw] max-w-[347px] aspect-[347/395] bg-primary rounded-full blur-[70px] lg:blur-[25px] opacity-80 pointer-events-none z-0" />
      
      {/* Bottom Right Circle */}
      <div className="absolute bottom-[5%] -right-[5%] w-[70vw] md:w-[25vw] max-w-[314.5px] aspect-[314.5/198] bg-primary rounded-full blur-[64px] lg:blur-[25px] opacity-85 pointer-events-none z-0" />
    </>
  );
}
