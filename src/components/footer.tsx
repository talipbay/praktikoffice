"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import emailjs from "@emailjs/browser";

export const Footer = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('footer');
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    officeType: "office",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // EmailJS configuration
      const EMAILJS_SERVICE_ID = "service_by1hs1a";
      const EMAILJS_TEMPLATE_ID = "template_t5wlycd";
      const EMAILJS_PUBLIC_KEY = "Qq3M7jh2eWO_Jybnt";

      // Initialize EmailJS with your public key
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_company: formData.company,
        from_phone: formData.phone,
        service_type:
          formData.officeType === "office"
            ? "Офис"
            : formData.officeType === "meeting"
            ? "Переговорная"
            : "Коворкинг",
        to_name: "Praktik Office",
        message: `Новая заявка от ${formData.name}
${formData.company ? `Компания: ${formData.company}` : ""}
Телефон: ${formData.phone}
Тип услуги: ${
          formData.officeType === "office"
            ? "Офис"
            : formData.officeType === "meeting"
            ? "Переговорная"
            : "Коворкинг"
        }

Заявка отправлена с сайта praktikoffice.kz (Footer)`,
        reply_to: formData.phone,
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      // Telegram Bot configuration
      const TELEGRAM_BOT_TOKEN =
        "8507260245:AAFoyElkM1bfT6ztcI8OLT5D8IHI6jnJ2i4";
      const TELEGRAM_CHAT_IDS = ["569529167", "7629492001", "520591256"]; // Multiple recipients

      // Prepare Telegram message
      const telegramMessage = `🔔 *Новая заявка с сайта praktikoffice.kz*

👤 *Имя:* ${formData.name}
${formData.company ? `🏢 *Компания:* ${formData.company}` : ""}
📞 *Телефон:* ${formData.phone}
🏢 *Тип услуги:* ${
        formData.officeType === "office"
          ? "Офис"
          : formData.officeType === "meeting"
          ? "Переговорная"
          : "Коворкинг"
      }

📝 *Источник:* Форма в футере сайта
🌐 *Сайт:* praktikoffice.kz`;

      // Send Telegram notification to multiple users
      const telegramPromises = TELEGRAM_CHAT_IDS.map((chatId) =>
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: "Markdown",
          }),
        })
      );

      const telegramResponses = await Promise.all(telegramPromises);

      console.log("Email sent successfully:", response);
      console.log(
        "Telegram notifications sent to:",
        TELEGRAM_CHAT_IDS.length,
        "users"
      );
      telegramResponses.forEach((resp, index) => {
        console.log(`Telegram notification ${index + 1}:`, resp.ok);
      });
      setSubmitMessage(t('successMessage'));
      setFormData({ name: "", company: "", phone: "", officeType: "office" });
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitMessage(t('errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer
      id="footer"
      data-footer
      className="h-screen bg-black text-foreground z-0 flex flex-col transition-colors duration-300"
    >
      <div className="flex-1 flex flex-col justify-around container mx-auto p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 mt-16">
          {/* Contact Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {t('contacts')}
              </h3>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-2">{t('address')}</p>
              <p className="text-sm">
                {t('addressValue')}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-2">{t('email')}</p>
              <a
                href="mailto:manager@praktikoffice.kz"
                className="text-sm hover:opacity-70 transition-opacity block"
                data-cursor="small"
              >
                manager@praktikoffice.kz
              </a>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-2">{t('phone')}</p>
              <a
                href="tel:+77017117226"
                className="text-sm hover:opacity-70 transition-opacity block"
                data-cursor="small"
              >
                +7 701 711 72 26
              </a>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-2">{t('social')}</p>
              <div className="space-y-1">
                <a
                  href="https://www.instagram.com/praktikoffice/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:opacity-70 transition-opacity block"
                  data-cursor="small"
                >
                  instagram
                </a>
                <a
                  href="https://wa.me/77017117226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:opacity-70 transition-opacity block"
                  data-cursor="small"
                >
                  whatsapp
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {t('services')}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 max-w-xs">
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer"
                onClick={() => router.push(`/${locale}/offices`)}
                data-cursor="small"
              >
                {t('offices')}
              </Badge>
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer"
                onClick={() => router.push(`/${locale}/meeting-room`)}
                data-cursor="small"
              >
                {t('meetingRooms')}
              </Badge>
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer"
                onClick={() => router.push(`/${locale}/open-space`)}
                data-cursor="small"
              >
                {t('coworking')}
              </Badge>
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                {t('lounge')}
              </Badge>
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                {t('fitness')}
              </Badge>
            </div>
          </div>

          {/* Application Form */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {t('formTitle')}
              </h3>
              <p className="text-sm opacity-70 mb-6">
                {t('formDescription')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs opacity-60 mb-2">
                  {t('name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-transparent border border-foreground/20 rounded-md text-sm text-foreground placeholder-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                  placeholder={t('namePlaceholder')}
                  data-cursor="small"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-xs opacity-60 mb-2"
                >
                  {t('company')}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-transparent border border-foreground/20 rounded-md text-sm text-foreground placeholder-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                  placeholder={t('companyPlaceholder')}
                  data-cursor="small"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs opacity-60 mb-2"
                >
                  {t('phoneLabel')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9+\-\s()]/g, "");
                    setFormData((prev) => ({ ...prev, phone: value }));
                  }}
                  required
                  className="w-full px-3 py-2 bg-transparent border border-foreground/20 rounded-md text-sm text-foreground placeholder-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                  placeholder={t('phonePlaceholder')}
                  data-cursor="small"
                />
              </div>

              <div>
                <label
                  htmlFor="officeType"
                  className="block text-xs opacity-60 mb-2"
                >
                  {t('officeType')}
                </label>
                <select
                  id="officeType"
                  name="officeType"
                  value={formData.officeType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-transparent border border-foreground/20 rounded-md text-sm text-foreground focus:border-foreground focus:outline-none transition-colors"
                  data-cursor="small"
                >
                  <option value="office" className="bg-black text-foreground">
                    {t('officeOption')}
                  </option>
                  <option value="meeting" className="bg-black text-foreground">
                    {t('meetingOption')}
                  </option>
                  <option
                    value="coworking"
                    className="bg-black text-foreground"
                  >
                    {t('coworkingOption')}
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-2 bg-foreground text-background rounded-md text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
                data-cursor="small"
              >
                {isSubmitting ? t('sending') : t('submit')}
              </button>

              {submitMessage && (
                <p
                  className={`text-sm ${
                    submitMessage.includes("Спасибо") || submitMessage.includes("Thank") || submitMessage.includes("Рахмет")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="flex justify-between items-end mt-16">
          <p className="text-xs opacity-60">{t('copyright')}</p>
          <div className="flex items-center gap-2 text-xs opacity-60">
            <div className="w-2 h-2 bg-foreground rounded-full"></div>
            <span>{t('madeBy')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
