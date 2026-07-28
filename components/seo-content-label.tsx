"use client";

import { useI18n, type LanguageCode } from "@/lib/i18n";

type SeoLabelKey = "to" | "output" | "examples" | "example1" | "example2" | "input" | "faq" | "tryMore";

const labels: Record<LanguageCode, Record<SeoLabelKey, string>> = {
  EN: { to: "to", output: "Output", examples: "Examples", example1: "Example 1", example2: "Example 2", input: "Input", faq: "Frequently Asked Questions", tryMore: "More" },
  PT: { to: "para", output: "Saida", examples: "Exemplos", example1: "Exemplo 1", example2: "Exemplo 2", input: "Entrada", faq: "Perguntas frequentes", tryMore: "Mais" },
  ES: { to: "a", output: "Salida", examples: "Ejemplos", example1: "Ejemplo 1", example2: "Ejemplo 2", input: "Entrada", faq: "Preguntas frecuentes", tryMore: "Mas" },
  DE: { to: "zu", output: "Ausgabe", examples: "Beispiele", example1: "Beispiel 1", example2: "Beispiel 2", input: "Eingabe", faq: "Haufige Fragen", tryMore: "Mehr" },
  RU: { to: "в", output: "Вывод", examples: "Примеры", example1: "Пример 1", example2: "Пример 2", input: "Ввод", faq: "Частые вопросы", tryMore: "Еще" },
  FR: { to: "vers", output: "Sortie", examples: "Exemples", example1: "Exemple 1", example2: "Exemple 2", input: "Entree", faq: "Questions frequentes", tryMore: "Plus" },
  TR: { to: "hedefine", output: "Cikti", examples: "Ornekler", example1: "Ornek 1", example2: "Ornek 2", input: "Girdi", faq: "Sik Sorulan Sorular", tryMore: "Daha fazla" },
  PL: { to: "do", output: "Wynik", examples: "Przyklady", example1: "Przyklad 1", example2: "Przyklad 2", input: "Wejscie", faq: "Czesto zadawane pytania", tryMore: "Wiecej" },
  CN: { to: "到", output: "输出", examples: "示例", example1: "示例 1", example2: "示例 2", input: "输入", faq: "常见问题", tryMore: "更多" },
  TW: { to: "到", output: "輸出", examples: "範例", example1: "範例 1", example2: "範例 2", input: "輸入", faq: "常見問題", tryMore: "更多" }
};

export function SeoContentLabel({ label }: { label: SeoLabelKey }) {
  const { language } = useI18n();
  return <>{(labels[language] ?? labels.EN)[label]}</>;
}
