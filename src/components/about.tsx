"use client";

export const About = () => {
  return (
    <section className="py-16 lg:py-24 relative z-20 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-5 space-y-12">
        {/* Main heading at the top */}
        <div className="text-center">
          <h2 className="text-6xl lg:text-8xl xl:text-9xl font-bold font-melodrama leading-tight text-left">
            class A.
          </h2>
        </div>

        {/* Two columns for description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* First column */}
          <div>
            <p className="text-lg lg:text-xl leading-relaxed text-foreground">
              Praktik Office — полностью готовые к работе офисные помещения, где
              обслуживание и инфраструктура уже включены в аренду, обеспечивая
              современные условия для компаний, стартапов и независимых
              специалистов.
            </p>
          </div>

          {/* Second column with bubbles */}
          <div className="space-y-8">
            <p className="text-lg lg:text-xl leading-relaxed text-foreground">
              В одном месте объединены сервисные офисы формата «всё включено»,
              коворкинг, переговорные, лаундж- и фитнес-зоны.
            </p>

            {/* Feature bubbles under second column */}
            <div className="flex flex-wrap gap-3">
              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-white rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #E85014 0%, #F16001 50%, #FF7A1A 100%)",
                  boxShadow: "0 8px 32px rgba(232, 80, 20, 0.3)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">офисы</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF7A1A 0%, #E85014 100%)",
                  }}
                />
              </div>

              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-white rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #C10801 0%, #E85014 50%, #F16001 100%)",
                  boxShadow: "0 8px 32px rgba(193, 8, 1, 0.3)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">переговорные</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #F16001 0%, #C10801 100%)",
                  }}
                />
              </div>

              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-gray-800 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #D9C3AB 0%, #F4E4D1 50%, #E8D5C4 100%)",
                  boxShadow: "0 8px 32px rgba(217, 195, 171, 0.4)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">коворкинг</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8D5C4 0%, #D9C3AB 100%)",
                  }}
                />
              </div>

              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-white rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #000000 0%, #2D1810 50%, #1A0F08 100%)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">лаундж зона</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #1A0F08 0%, #000000 100%)",
                  }}
                />
              </div>

              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-white rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #E85014 0%, #C10801 50%, #8B0000 100%)",
                  boxShadow: "0 8px 32px rgba(232, 80, 20, 0.3)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">фитнес зона</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B0000 0%, #E85014 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
