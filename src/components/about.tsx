"use client";

export const About = () => {
  return (
    <section className="py-16 lg:py-24 relative z-20 bg-black text-foreground transition-colors duration-300">
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
              <strong>Praktik Office</strong> — сервисные офисы класса A с
              форматом «всё включено», созданные для компаний и специалистов,
              выбирающих комфорт и надёжность. Мы продумали рабочую среду так,
              чтобы все ключевые сервисы и инфраструктура были доступны в одном
              пространстве и не требовали дополнительного администрирования.
            </p>
          </div>

          {/* Second column with bubbles */}
          <div className="space-y-8">
            <p className="text-lg lg:text-xl leading-relaxed text-foreground">
              Резидентство освобождает от операционных задач и позволяет сразу
              приступить к работе в полностью готовом пространстве. <br></br>
              Основные преимущества резидентства:
            </p>

            {/* Feature bubbles under second column */}
            <div className="flex flex-wrap gap-3">
              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-white rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #FF7A1A 0%, #FF9500 50%, #FFB84D 100%)",
                  boxShadow: "0 8px 32px rgba(255, 122, 26, 0.3)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">Юридический адрес</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFB84D 0%, #FF7A1A 100%)",
                  }}
                />
              </div>

              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-white rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #F16001 0%, #FF7A1A 50%, #FF9500 100%)",
                  boxShadow: "0 8px 32px rgba(241, 96, 1, 0.3)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">Доступ 24/7</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF9500 0%, #F16001 100%)",
                  }}
                />
              </div>

              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-gray-800 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #E8D5C4 0%, #F4E4D1 50%, #F9F0E8 100%)",
                  boxShadow: "0 8px 32px rgba(232, 213, 196, 0.4)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">Инфраструктура класса A</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #F9F0E8 0%, #E8D5C4 100%)",
                  }}
                />
              </div>

              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-white rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #E85014 0%, #F16001 50%, #FF7A1A 100%)",
                  boxShadow: "0 8px 32px rgba(232, 80, 20, 0.3)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">Переговорные комнаты</div>
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
                <div className="relative z-10">Формат «всё включено»</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #F16001 0%, #C10801 100%)",
                  }}
                />
              </div>

              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-white rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #4A2C1A 0%, #6B3E2A 50%, #8B5A3C 100%)",
                  boxShadow: "0 8px 32px rgba(74, 44, 26, 0.4)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">Административные сервисы</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5A3C 0%, #4A2C1A 100%)",
                  }}
                />
              </div>

              <div
                className="relative overflow-hidden px-6 py-3 text-sm font-medium text-gray-800 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{
                  background:
                    "linear-gradient(135deg, #D9C3AB 0%, #E8D5C4 50%, #F4E4D1 100%)",
                  boxShadow: "0 8px 32px rgba(217, 195, 171, 0.4)",
                }}
                data-cursor="small"
              >
                <div className="relative z-10">Комфортные рабочие зоны</div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #F4E4D1 0%, #D9C3AB 100%)",
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
