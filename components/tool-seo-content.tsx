"use client";

import Link from "next/link";
import { directoryTools, getCategoryLabel } from "@/lib/home-tools";
import { useI18n, type LanguageCode } from "@/lib/i18n";
import { onlineTools } from "@/lib/online-tools";
import { buildToolFaqs } from "@/lib/seo";

type ToolSeoContentProps = {
  title: string;
  description: string;
  category: string;
};

type ConversionPair = {
  from: string;
  to: string;
};

const seoCopy: Record<LanguageCode, {
  howTo: string;
  step1: string;
  settingsStep: string;
  step3: string;
  step4: string;
  to: string;
  output: string;
  examples: string;
  example1: string;
  example2: string;
  simpleFunction: string;
  practicalCheck: string;
  input: string;
  characteristic: string;
  syntax: string;
  workflow: string;
  review: string;
  bestUse: string;
  faq: string;
  tryMore: string;
}> = {
  EN: { howTo: "How to use this tool?", step1: "Type, paste, or upload the input you want to process.", settingsStep: "Review the selected tool settings and sample input.", step3: "Click the main action button and review the result in the output panel.", step4: "Copy the result, download it as a text file, or clear the editor and run another input.", to: "to", output: "Output", examples: "Examples", example1: "Example 1 - Simple function", example2: "Example 2 - Practical check", simpleFunction: "A short input processed into a cleaner output.", practicalCheck: "A second sample that shows repeatable processing behavior.", input: "Input", characteristic: "Characteristic", syntax: "Syntax", workflow: "Workflow", review: "Review", bestUse: "Best use", faq: "Frequently Asked Questions", tryMore: "Try more" },
  PT: { howTo: "Como usar esta ferramenta?", step1: "Digite, cole ou envie a entrada que deseja processar.", settingsStep: "Revise as configurações e a entrada de exemplo.", step3: "Clique no botão principal e veja o resultado no painel de saída.", step4: "Copie, baixe como texto ou limpe o editor para executar outra entrada.", to: "para", output: "Saída", examples: "Exemplos", example1: "Exemplo 1 - Função simples", example2: "Exemplo 2 - Verificação prática", simpleFunction: "Uma entrada curta processada em uma saída mais limpa.", practicalCheck: "Uma segunda amostra que mostra o comportamento repetível.", input: "Entrada", characteristic: "Característica", syntax: "Sintaxe", workflow: "Fluxo", review: "Revisão", bestUse: "Melhor uso", faq: "Perguntas frequentes", tryMore: "Veja mais" },
  ES: { howTo: "¿Cómo usar esta herramienta?", step1: "Escribe, pega o sube la entrada que quieres procesar.", settingsStep: "Revisa la configuración y la entrada de ejemplo.", step3: "Haz clic en el botón principal y revisa el resultado en el panel de salida.", step4: "Copia, descarga como texto o limpia el editor para ejecutar otra entrada.", to: "a", output: "Salida", examples: "Ejemplos", example1: "Ejemplo 1 - Función simple", example2: "Ejemplo 2 - Comprobación práctica", simpleFunction: "Una entrada corta procesada en una salida más limpia.", practicalCheck: "Una segunda muestra que enseña un comportamiento repetible.", input: "Entrada", characteristic: "Característica", syntax: "Sintaxis", workflow: "Flujo", review: "Revisión", bestUse: "Mejor uso", faq: "Preguntas frecuentes", tryMore: "Ver más" },
  DE: { howTo: "Wie benutzt man dieses Tool?", step1: "Gib die Eingabe ein, füge sie ein oder lade sie hoch.", settingsStep: "Prüfe die ausgewählten Einstellungen und die Beispieleingabe.", step3: "Klicke auf die Hauptaktion und prüfe das Ergebnis im Ausgabebereich.", step4: "Kopiere das Ergebnis, lade es als Textdatei herunter oder leere den Editor.", to: "zu", output: "Ausgabe", examples: "Beispiele", example1: "Beispiel 1 - Einfache Funktion", example2: "Beispiel 2 - Praktische Prüfung", simpleFunction: "Eine kurze Eingabe wird in eine klarere Ausgabe verarbeitet.", practicalCheck: "Ein zweites Beispiel zeigt wiederholbares Verhalten.", input: "Eingabe", characteristic: "Merkmal", syntax: "Syntax", workflow: "Ablauf", review: "Prüfung", bestUse: "Bester Einsatz", faq: "Häufige Fragen", tryMore: "Mehr" },
  RU: { howTo: "Как использовать этот инструмент?", step1: "Введите, вставьте или загрузите данные для обработки.", settingsStep: "Проверьте настройки инструмента и пример ввода.", step3: "Нажмите основную кнопку и проверьте результат в панели вывода.", step4: "Скопируйте результат, скачайте его как текстовый файл или очистите редактор.", to: "в", output: "Вывод", examples: "Примеры", example1: "Пример 1 - Простая функция", example2: "Пример 2 - Практическая проверка", simpleFunction: "Короткий ввод преобразуется в более чистый результат.", practicalCheck: "Второй пример показывает повторяемую обработку.", input: "Ввод", characteristic: "Характеристика", syntax: "Синтаксис", workflow: "Процесс", review: "Проверка", bestUse: "Лучшее применение", faq: "Частые вопросы", tryMore: "Еще" },
  FR: { howTo: "Comment utiliser cet outil ?", step1: "Saisissez, collez ou importez l'entrée à traiter.", settingsStep: "Vérifiez les paramètres et l'exemple d'entrée.", step3: "Cliquez sur le bouton principal et consultez le résultat dans le panneau de sortie.", step4: "Copiez, téléchargez en texte ou videz l'éditeur pour relancer.", to: "vers", output: "Sortie", examples: "Exemples", example1: "Exemple 1 - Fonction simple", example2: "Exemple 2 - Vérification pratique", simpleFunction: "Une courte entrée transformée en sortie plus propre.", practicalCheck: "Un second exemple montre un comportement répétable.", input: "Entrée", characteristic: "Caractéristique", syntax: "Syntaxe", workflow: "Flux", review: "Révision", bestUse: "Meilleur usage", faq: "Questions fréquentes", tryMore: "Voir plus" },
  TR: { howTo: "Bu araç nasıl kullanılır?", step1: "İşlemek istediğiniz girdiyi yazın, yapıştırın veya yükleyin.", settingsStep: "Seçili ayarları ve örnek girdiyi gözden geçirin.", step3: "Ana işlem düğmesine tıklayın ve sonucu çıktı panelinde inceleyin.", step4: "Sonucu kopyalayın, metin dosyası olarak indirin veya düzenleyiciyi temizleyin.", to: "->", output: "Çıktı", examples: "Örnekler", example1: "Örnek 1 - Basit fonksiyon", example2: "Örnek 2 - Pratik kontrol", simpleFunction: "Kısa bir girdi daha temiz bir çıktıya dönüştürülür.", practicalCheck: "İkinci örnek tekrarlanabilir davranışı gösterir.", input: "Girdi", characteristic: "Özellik", syntax: "Sözdizimi", workflow: "İş akışı", review: "İnceleme", bestUse: "En iyi kullanım", faq: "Sık Sorulan Sorular", tryMore: "Daha fazla" },
  PL: { howTo: "Jak używać tego narzędzia?", step1: "Wpisz, wklej lub prześlij dane do przetworzenia.", settingsStep: "Sprawdź ustawienia narzędzia i przykładowe dane.", step3: "Kliknij główny przycisk i sprawdź wynik w panelu wyjścia.", step4: "Skopiuj wynik, pobierz jako plik tekstowy albo wyczyść edytor.", to: "do", output: "Wynik", examples: "Przykłady", example1: "Przykład 1 - Prosta funkcja", example2: "Przykład 2 - Praktyczne sprawdzenie", simpleFunction: "Krótki tekst przetworzony w czystszy wynik.", practicalCheck: "Drugi przykład pokazuje powtarzalne działanie.", input: "Wejście", characteristic: "Cecha", syntax: "Składnia", workflow: "Przepływ", review: "Przegląd", bestUse: "Najlepsze użycie", faq: "Często zadawane pytania", tryMore: "Więcej" },
  CN: { howTo: "如何使用此工具？", step1: "输入、粘贴或上传你想处理的内容。", settingsStep: "检查当前工具设置和示例输入。", step3: "点击主操作按钮，并在输出面板查看结果。", step4: "复制结果、下载为文本文件，或清空编辑器继续处理。", to: "到", output: "输出", examples: "示例", example1: "示例 1 - 简单函数", example2: "示例 2 - 实用检查", simpleFunction: "将一段短输入处理成更清晰的输出。", practicalCheck: "第二个示例展示可重复的处理效果。", input: "输入", characteristic: "特性", syntax: "语法", workflow: "流程", review: "检查", bestUse: "适用场景", faq: "常见问题", tryMore: "更多" },
  TW: { howTo: "如何使用此工具？", step1: "輸入、貼上或上傳你想處理的內容。", settingsStep: "檢查目前工具設定和範例輸入。", step3: "點擊主要操作按鈕，並在輸出面板查看結果。", step4: "複製結果、下載為文字檔，或清空編輯器繼續處理。", to: "到", output: "輸出", examples: "範例", example1: "範例 1 - 簡單函式", example2: "範例 2 - 實用檢查", simpleFunction: "將一段短輸入處理成更清晰的輸出。", practicalCheck: "第二個範例展示可重複的處理效果。", input: "輸入", characteristic: "特性", syntax: "語法", workflow: "流程", review: "檢查", bestUse: "適用場景", faq: "常見問題", tryMore: "更多" }
};

function getConversionPair(title: string): ConversionPair | null {
  const match = title.match(/^(.+?) to (.+?) Converter$/i);
  if (!match) return null;
  return { from: match[1], to: match[2] };
}

function codeSample(language: string, example: "palindrome" | "evenOdd") {
  const normalized = language.toLowerCase();
  if (normalized.includes("python")) {
    return example === "palindrome"
      ? "def is_palindrome(text):\n    clean = text.lower()\n    return clean == clean[::-1]\n\nprint(is_palindrome('level'))"
      : "def even_or_odd(number):\n    return 'even' if number % 2 == 0 else 'odd'\n\nprint(even_or_odd(7))";
  }
  if (normalized.includes("typescript") || normalized.includes("javascript")) {
    return example === "palindrome"
      ? "function isPalindrome(text: string) {\n  const clean = text.toLowerCase();\n  return clean === clean.split('').reverse().join('');\n}\n\nconsole.log(isPalindrome('level'));"
      : "function evenOrOdd(number: number) {\n  return number % 2 === 0 ? 'even' : 'odd';\n}\n\nconsole.log(evenOrOdd(7));";
  }
  if (normalized.includes("java")) {
    return example === "palindrome"
      ? "class Main {\n  static boolean isPalindrome(String text) {\n    String clean = text.toLowerCase();\n    return clean.equals(new StringBuilder(clean).reverse().toString());\n  }\n}"
      : "class Main {\n  static String evenOrOdd(int number) {\n    return number % 2 == 0 ? \"even\" : \"odd\";\n  }\n}";
  }
  if (normalized.includes("sql")) {
    return example === "palindrome"
      ? "select word,\n       reverse(word) = word as is_palindrome\nfrom words;"
      : "select number,\n       case when number % 2 = 0 then 'even' else 'odd' end as result\nfrom values_table;";
  }
  if (normalized.includes("bash") || normalized.includes("shell")) {
    return example === "palindrome"
      ? "text=\"level\"\nreverse=$(echo \"$text\" | rev)\n[ \"$text\" = \"$reverse\" ] && echo true || echo false"
      : "number=7\nif (( number % 2 == 0 )); then echo even; else echo odd; fi";
  }
  return example === "palindrome"
    ? "function isPalindrome(text) {\n  clean = lowercase(text)\n  return clean == reverse(clean)\n}\nprint(isPalindrome('level'))"
    : "function evenOrOdd(number) {\n  if number % 2 == 0 return 'even'\n  return 'odd'\n}\nprint(evenOrOdd(7))";
}

function toolInputExample(title: string, categoryLabel: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("base64")) return "Hello from CodeConvert.net";
  if (lowerTitle.includes("json")) return '{"name":"CodeConvert","tools":["format","convert","check"]}';
  if (lowerTitle.includes("regex")) return "Email alice@example.com and ticket user-123 are in this text.";
  if (lowerTitle.includes("duplicate line")) return "apple\nbanana\napple\norange\nbanana";
  if (lowerTitle.includes("duplicate word")) return "This line has has a repeated repeated word.";
  if (lowerTitle.includes("line break")) return "This text\nhas line breaks\nthat should become one paragraph.";
  if (lowerTitle.includes("comment")) return "// Remove this comment\nconst total = price + tax;";
  if (categoryLabel === "Text Tools") return "Paste plain text here.\nAdd a second line for processing.";
  return "Paste input for this tool, then run it to generate a clean output.";
}

function toolOutputExample(title: string, categoryLabel: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("base64 encode")) return "SGVsbG8gZnJvbSBDb2RlQ29udmVydC5uZXQ=";
  if (lowerTitle.includes("json")) return "{\n  \"name\": \"CodeConvert\",\n  \"tools\": [\n    \"format\",\n    \"convert\",\n    \"check\"\n  ]\n}";
  if (lowerTitle.includes("duplicate line")) return "apple\nbanana\norange";
  if (lowerTitle.includes("duplicate word")) return "Repeated words found:\n- has: 2\n- repeated: 2";
  if (lowerTitle.includes("line break")) return "This text has line breaks that should become one paragraph.";
  if (lowerTitle.includes("comment")) return "const total = price + tax;";
  if (categoryLabel === "Text Tools") return "Clean text output appears here.";
  return "Processed output appears here after the tool runs.";
}

function CodePanel({ label, code }: { label: string; code: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-black text-slate-950">{label}</p>
      <pre className="code-scrollbar max-h-72 overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100 shadow-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ToolSeoContent({ title, description, category }: ToolSeoContentProps) {
  const { language } = useI18n();
  const copy = seoCopy[language] ?? seoCopy.EN;
  const categoryLabel = getCategoryLabel(category);
  const conversionPair = getConversionPair(title);
  const relatedLinks = directoryTools
    .filter((tool) => tool.category.toLowerCase() === category.toLowerCase() && tool.name !== title)
    .slice(0, 18);
  const relatedOnlineLinks = onlineTools
    .filter((tool) => tool.mode.toLowerCase() === category.toLowerCase() && tool.name !== title)
    .slice(0, 18);
  const sampleLinks = relatedLinks.length > 0 ? relatedLinks : relatedOnlineLinks;
  const faqs = buildToolFaqs(title, categoryLabel);
  const inputExample = conversionPair ? codeSample(conversionPair.from, "palindrome") : toolInputExample(title, categoryLabel);
  const outputExample = conversionPair ? codeSample(conversionPair.to, "palindrome") : toolOutputExample(title, categoryLabel);
  const secondInputExample = conversionPair ? codeSample(conversionPair.from, "evenOdd") : toolInputExample(title, categoryLabel);
  const secondOutputExample = conversionPair ? codeSample(conversionPair.to, "evenOdd") : toolOutputExample(title, categoryLabel);
  const relatedHeading = categoryLabel.toLowerCase().endsWith("tools") ? categoryLabel.toLowerCase() : `${categoryLabel.toLowerCase()} tools`;

  const useIntro = conversionPair
    ? `This free online converter helps you convert ${conversionPair.from} code to ${conversionPair.to} in a focused browser workspace.`
    : `This free online ${categoryLabel.toLowerCase()} tool helps you process pasted input and produce a clean result in a focused browser workspace.`;

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10">
      <article className="rounded-lg border bg-white p-6 shadow-soft sm:p-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
          <div>
            <h2 className="text-xl font-black text-slate-950">{copy.howTo}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {useIntro} {description}
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
              <li>{copy.step1}</li>
              <li>{conversionPair ? `${conversionPair.from} ${copy.to} ${conversionPair.to}` : copy.settingsStep}</li>
              <li>{copy.step3}</li>
              <li>{copy.step4}</li>
            </ol>
          </div>
          <div className="hidden rounded-lg border bg-gradient-to-br from-blue-50 via-white to-violet-50 p-5 text-center lg:block">
            <p className="text-sm font-black text-slate-600">{conversionPair?.from ?? categoryLabel}</p>
            <div className="my-5 text-3xl font-black text-blue-700">{copy.to}</div>
            <p className="text-sm font-black text-slate-600">{conversionPair?.to ?? copy.output}</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">{copy.examples}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {conversionPair
              ? `The examples below show common ${conversionPair.from} to ${conversionPair.to} conversion patterns. Generated code should always be reviewed before production use.`
              : `The examples below show the kind of input and output you can expect when using ${title}.`}
          </p>

          <div className="mt-5 space-y-8">
            <div>
              <h3 className="text-base font-black text-slate-950">{copy.example1}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {conversionPair ? copy.simpleFunction : copy.simpleFunction}
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_80px_1fr] lg:items-center">
                <CodePanel label={conversionPair?.from ?? copy.input} code={inputExample} />
                <div className="hidden text-center text-2xl font-black text-blue-600 lg:block">{copy.to}</div>
                <CodePanel label={conversionPair?.to ?? copy.output} code={outputExample} />
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-950">{copy.example2}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {conversionPair ? copy.practicalCheck : copy.practicalCheck}
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_80px_1fr] lg:items-center">
                <CodePanel label={conversionPair?.from ?? copy.input} code={secondInputExample} />
                <div className="hidden text-center text-2xl font-black text-blue-600 lg:block">{copy.to}</div>
                <CodePanel label={conversionPair?.to ?? copy.output} code={secondOutputExample} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">
            {conversionPair ? `${conversionPair.from} ${copy.to} ${conversionPair.to}` : title}
          </h2>
          <div className="mt-4 overflow-hidden rounded-md border">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-950">
                <tr>
                  <th className="px-4 py-3 font-black">{copy.characteristic}</th>
                  <th className="px-4 py-3 font-black">{conversionPair?.from ?? copy.input}</th>
                  <th className="px-4 py-3 font-black">{conversionPair?.to ?? copy.output}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">{copy.syntax}</td>
                  <td className="px-4 py-3 text-slate-600">{conversionPair ? `${conversionPair.from} code may use language-specific syntax, libraries, and runtime conventions.` : "Raw input may be messy, duplicated, encoded, minified, or hard to scan."}</td>
                  <td className="px-4 py-3 text-slate-600">{conversionPair ? `${conversionPair.to} output should be checked for idiomatic syntax and equivalent behavior.` : "The result is normalized into a clearer text output that is easier to copy or save."}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">{copy.workflow}</td>
                  <td className="px-4 py-3 text-slate-600">Paste a focused snippet, sample data, or text block into the editor.</td>
                  <td className="px-4 py-3 text-slate-600">Review the output, then copy, download, or refine the input and run it again.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">{copy.review}</td>
                  <td className="px-4 py-3 text-slate-600">Inputs can include edge cases, comments, unusual spacing, or project-specific names.</td>
                  <td className="px-4 py-3 text-slate-600">Outputs should be validated before using them in a production codebase or document.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">{copy.bestUse}</td>
                  <td className="px-4 py-3 text-slate-600">Small examples, quick checks, text cleanup, code snippets, and developer utilities.</td>
                  <td className="px-4 py-3 text-slate-600">A fast starting point for manual review, refactoring, documentation, or sharing.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-lg bg-sky-50 p-5 sm:p-6">
          <h2 className="text-xl font-black text-slate-950">{copy.faq}</h2>
          <div className="mt-4 grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-md bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-black text-slate-950">{faq.question}</summary>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {sampleLinks.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-black text-slate-950">{copy.tryMore} {relatedHeading}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {sampleLinks.slice(0, 12).map((tool) => (
                <Link key={tool.name} href={"href" in tool ? tool.href : `/${tool.slug}`} className="rounded-md bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
