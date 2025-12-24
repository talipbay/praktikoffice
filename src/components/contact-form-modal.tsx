"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import emailjs from "@emailjs/browser";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: "office" | "meeting" | "coworking";
}

export const ContactFormModal = ({
  isOpen,
  onClose,
  defaultService = "office",
}: ContactFormModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    officeType: defaultService,
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
        from_phone: formData.phone,
        service_type:
          formData.officeType === "office"
            ? "Офис"
            : formData.officeType === "meeting"
            ? "Переговорная"
            : "Коворкинг",
        to_name: "Praktik Office",
        message: `Новая заявка от ${formData.name}
Телефон: ${formData.phone}
Тип услуги: ${
          formData.officeType === "office"
            ? "Офис"
            : formData.officeType === "meeting"
            ? "Переговорная"
            : "Коворкинг"
        }

Заявка отправлена с сайта praktikoffice.kz`,
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
      const TELEGRAM_CHAT_ID = "569529167";

      // Prepare Telegram message
      const telegramMessage = `🔔 *Новая заявка с сайта praktikoffice.kz*

👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
🏢 *Тип услуги:* ${
        formData.officeType === "office"
          ? "Офис"
          : formData.officeType === "meeting"
          ? "Переговорная"
          : "Коворкинг"
      }

📝 *Источник:* Модальное окно на сайте
🌐 *Сайт:* praktikoffice.kz`;

      // Send Telegram notification
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: "Markdown",
          }),
        }
      );

      console.log("Email sent successfully:", response);
      console.log("Telegram notification sent:", telegramResponse.ok);
      setSubmitMessage("Спасибо! Мы свяжемся с вами в ближайшее время.");
      setFormData({ name: "", phone: "", officeType: defaultService });

      // Close modal after successful submission
      setTimeout(() => {
        onClose();
        setSubmitMessage("");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitMessage("Произошла ошибка при отправке. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-background border border-foreground/20 rounded-2xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors"
              data-cursor="small"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
              >
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Form Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-foreground">
                Оставить заявку
              </h2>
              <p className="text-sm opacity-70">
                Оставьте свои контакты, и наш менеджер свяжется с вами
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="modal-name"
                  className="block text-xs opacity-60 mb-2"
                >
                  имя
                </label>
                <input
                  type="text"
                  id="modal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-3 bg-transparent border border-foreground/20 rounded-lg text-sm text-foreground placeholder-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                  placeholder="Ваше имя"
                  data-cursor="small"
                />
              </div>

              <div>
                <label
                  htmlFor="modal-phone"
                  className="block text-xs opacity-60 mb-2"
                >
                  телефон
                </label>
                <input
                  type="tel"
                  id="modal-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-3 bg-transparent border border-foreground/20 rounded-lg text-sm text-foreground placeholder-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                  placeholder="+7 (___) ___-__-__"
                  data-cursor="small"
                />
              </div>

              <div>
                <label
                  htmlFor="modal-officeType"
                  className="block text-xs opacity-60 mb-2"
                >
                  тип помещения
                </label>
                <select
                  id="modal-officeType"
                  name="officeType"
                  value={formData.officeType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 bg-background border border-foreground/20 rounded-lg text-sm text-foreground focus:border-foreground focus:outline-none transition-colors"
                  data-cursor="small"
                >
                  <option value="office">Офис</option>
                  <option value="meeting">Переговорная</option>
                  <option value="coworking">Коворкинг</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity mt-6"
                data-cursor="small"
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </button>

              {submitMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm text-center ${
                    submitMessage.includes("Спасибо")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {submitMessage}
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
