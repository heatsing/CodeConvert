import Link from "next/link";
import type { ReactNode } from "react";
import { SeoContentLabel } from "@/components/seo-content-label";
import { directoryTools, getCategoryId, getCategoryLabel } from "@/lib/home-tools";
import type { LanguageCode } from "@/lib/i18n";
import { onlineTools } from "@/lib/online-tools";
import { buildToolFaqs } from "@/lib/seo";
import { normalizeSearchText } from "@/lib/seo-keywords";
import { shouldIndexDirectoryTool, shouldIndexOnlineTool } from "@/lib/seo-quality";
import type { ToolPageContent } from "@/lib/tool-content-types";
import { getToolUserIntent } from "@/lib/tool-user-intent";

type ToolSeoContentProps = {
  title: string;
  description: string;
  category: string;
  content: ToolPageContent;
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
  if (lowerTitle.includes("json to xml")) return '{\n  "user": {\n    "name": "John",\n    "active": true,\n    "roles": ["admin", "editor"]\n  }\n}';
  if (lowerTitle.includes("xml to json")) return '<user>\n  <name>John</name>\n  <active>true</active>\n  <roles>\n    <role>admin</role>\n    <role>editor</role>\n  </roles>\n</user>';
  if (lowerTitle.includes("html to markdown")) return '<h1>Release Notes</h1>\n<p>Version 2.0 improves the API response format.</p>\n<ul>\n  <li>Cleaner JSON output</li>\n  <li>Faster validation</li>\n</ul>';
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
  if (lowerTitle.includes("json to xml")) return '<root>\n  <user>\n    <name>John</name>\n    <active>true</active>\n    <roles>\n      <item>admin</item>\n      <item>editor</item>\n    </roles>\n  </user>\n</root>';
  if (lowerTitle.includes("xml to json")) return '{\n  "user": {\n    "name": "John",\n    "active": true,\n    "roles": {\n      "role": ["admin", "editor"]\n    }\n  }\n}';
  if (lowerTitle.includes("html to markdown")) return '# Release Notes\n\nVersion 2.0 improves the API response format.\n\n- Cleaner JSON output\n- Faster validation';
  if (lowerTitle.includes("base64 encode")) return "SGVsbG8gZnJvbSBDb2RlQ29udmVydC5uZXQ=";
  if (lowerTitle.includes("json")) return "{\n  \"name\": \"CodeConvert\",\n  \"tools\": [\n    \"format\",\n    \"convert\",\n    \"check\"\n  ]\n}";
  if (lowerTitle.includes("duplicate line")) return "apple\nbanana\norange";
  if (lowerTitle.includes("duplicate word")) return "Repeated words found:\n- has: 2\n- repeated: 2";
  if (lowerTitle.includes("line break")) return "This text has line breaks that should become one paragraph.";
  if (lowerTitle.includes("comment")) return "const total = price + tax;";
  if (categoryLabel === "Text Tools") return "Clean text output appears here.";
  return "Processed output appears here after the tool runs.";
}

function toolHref(tool: { name: string } & ({ href: string } | { slug: string })) {
  return "href" in tool ? tool.href : `/${tool.slug}`;
}

function relatedAnchorLabel(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("json formatter")) return "format JSON online";
  if (lowerName.includes("json validator")) return "validate JSON syntax";
  if (lowerName.includes("base64 encode")) return "encode Base64 text";
  if (lowerName.includes("base64 decode")) return "decode Base64 strings";
  if (lowerName.includes("url encode")) return "encode URL parameters";
  if (lowerName.includes("url decode")) return "decode URL strings";
  if (lowerName.includes("regex tester")) return "test a regular expression";
  if (lowerName.includes("regex")) return name.replace(/^Regex/i, "work with regex");
  if (lowerName.includes("remove line breaks")) return "remove line breaks";
  if (lowerName.includes("duplicate line")) return "remove duplicate lines";
  if (lowerName.includes("duplicate word")) return "find duplicate words";
  if (lowerName.includes("word counter")) return "count words online";
  if (lowerName.includes("character counter")) return "count characters online";
  if (lowerName.includes("formatter")) return `format ${name.replace(/\s*Formatter$/i, "")}`;
  if (lowerName.includes("beautifier")) return `beautify ${name.replace(/\s*Beautifier$/i, "")}`;
  if (lowerName.includes("converter")) return name.replace(/\s+Converter$/i, " converter");
  return name;
}

function uniqueRelatedLinks(title: string, category: string, categoryLabel: string) {
  const normalizedTitle = normalizeSearchText(title);
  const directoryMatches = directoryTools
    .filter(shouldIndexDirectoryTool)
    .filter((tool) => tool.category.toLowerCase() === category.toLowerCase())
    .filter((tool) => !normalizedTitle.includes(normalizeSearchText(tool.name)) && !normalizeSearchText(tool.name).includes(normalizedTitle))
    .slice(0, 6);
  const onlineMatches = onlineTools
    .filter(shouldIndexOnlineTool)
    .filter((tool) => tool.mode.toLowerCase() === category.toLowerCase())
    .filter((tool) => !normalizedTitle.includes(normalizeSearchText(tool.name)) && !normalizeSearchText(tool.name).includes(normalizedTitle))
    .slice(0, 6);

  const fallbackLinks = [
    { name: "Code Converter", href: "/code-converter" },
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "Base64 Encode", href: "/base64-encode" },
    { name: "Regex Tester", href: "/regex-tester" },
    { name: categoryLabel, href: `/#${getCategoryId(category)}` }
  ];

  return [...directoryMatches, ...onlineMatches, ...fallbackLinks]
    .filter((tool, index, tools) => tools.findIndex((item) => toolHref(item) === toolHref(tool)) === index)
    .slice(0, 5);
}

function configuredRelatedLinks(slugs: string[]) {
  const links: Array<(typeof directoryTools)[number] | (typeof onlineTools)[number]> = [];

  for (const slug of slugs) {
    const href = `/${slug.replace(/^\/|\/$/g, "")}`;
    const directoryTool = directoryTools.find((tool) => tool.href === href);
    if (directoryTool) {
      links.push(directoryTool);
      continue;
    }
    const onlineTool = onlineTools.find((tool) => `/${tool.slug}` === href);
    if (onlineTool) links.push(onlineTool);
  }

  return links;
}

function whatHeading(title: string) {
  return `What is ${title}?`;
}

function howHeading(title: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("json to xml")) return "How to Convert JSON to XML?";
  if (lowerTitle.includes("xml to json")) return "How to Convert XML to JSON?";
  if (lowerTitle.includes("html to markdown")) return "How to Convert HTML to Markdown?";
  if (lowerTitle.includes("json formatter")) return "How to Format JSON?";
  if (lowerTitle.includes("base64")) return "How to Encode Text to Base64?";
  if (lowerTitle.includes("remove line breaks")) return "How to Remove Line Breaks?";
  return copySafeHowHeading(title);
}

function copySafeHowHeading(title: string) {
  return `How to Use ${title}?`;
}

function exampleIntro(title: string, conversionPair: ConversionPair | null) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("json to xml")) return "The examples below show how object values, booleans, and arrays can be represented in XML-style markup. Always review array naming rules before using the result in production.";
  if (lowerTitle.includes("xml to json")) return "The examples below show how nested XML tags can be converted into JSON objects and arrays for API testing, scripts, and data cleanup.";
  if (lowerTitle.includes("html to markdown")) return "The examples below show how headings, paragraphs, and lists can be converted from HTML into readable Markdown for documentation workflows.";
  if (lowerTitle.includes("json formatter")) return "The examples below show compact JSON becoming readable formatted JSON with predictable indentation and preserved values.";
  if (lowerTitle.includes("base64")) return "The examples below show plain text being encoded into a Base64 string that can be copied into tests, docs, or developer payloads.";
  if (lowerTitle.includes("remove line breaks")) return "The examples below show broken copied text becoming a single clean paragraph while preserving the original words.";

  return conversionPair
    ? `The examples below show common ${conversionPair.from} to ${conversionPair.to} conversion patterns. Generated code should always be reviewed before production use.`
    : `The examples below show the kind of input and output you can expect when using ${title}.`;
}

function CodePanel({ label, code }: { label: ReactNode; code: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-black text-slate-950">{label}</p>
      <pre className="code-scrollbar max-h-72 overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100 shadow-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ToolSeoContent({ title, description, category, content }: ToolSeoContentProps) {
  const categoryLabel = getCategoryLabel(category);
  const conversionPair = getConversionPair(title);
  const relatedLinks = directoryTools
    .filter(shouldIndexDirectoryTool)
    .filter((tool) => tool.category.toLowerCase() === category.toLowerCase() && tool.name !== title)
    .slice(0, 18);
  const relatedOnlineLinks = onlineTools
    .filter(shouldIndexOnlineTool)
    .filter((tool) => tool.mode.toLowerCase() === category.toLowerCase() && tool.name !== title)
    .slice(0, 18);
  const configuredLinks = configuredRelatedLinks(content.relatedTools);
  const sampleLinks = configuredLinks.length > 0 ? configuredLinks : relatedLinks.length > 0 ? relatedLinks : relatedOnlineLinks;
  const faqs = content.faq.length > 0 ? content.faq : buildToolFaqs(title, categoryLabel);
  const userIntent = getToolUserIntent(title, category);
  const seoLinks = [...configuredLinks, ...uniqueRelatedLinks(title, category, categoryLabel)]
    .filter((tool, index, tools) => tools.findIndex((item) => toolHref(item) === toolHref(tool)) === index)
    .slice(0, 5);
  const inputExample = content.examples[0]?.input ?? (conversionPair ? codeSample(conversionPair.from, "palindrome") : toolInputExample(title, categoryLabel));
  const outputExample = content.examples[0]?.output ?? (conversionPair ? codeSample(conversionPair.to, "palindrome") : toolOutputExample(title, categoryLabel));
  const secondInputExample = content.examples[1]?.input ?? (conversionPair ? codeSample(conversionPair.from, "evenOdd") : toolInputExample(title, categoryLabel));
  const secondOutputExample = content.examples[1]?.output ?? (conversionPair ? codeSample(conversionPair.to, "evenOdd") : toolOutputExample(title, categoryLabel));
  const relatedHeading = categoryLabel.toLowerCase().endsWith("tools") ? categoryLabel.toLowerCase() : `${categoryLabel.toLowerCase()} tools`;
  const currentWhatHeading = whatHeading(title);
  const currentHowHeading = howHeading(title);
  const currentExampleIntro = exampleIntro(title, conversionPair);
  const audience = content.audience || userIntent.audience;
  const input = content.input || userIntent.input;
  const outcome = content.outcome || userIntent.outcome;
  const review = content.review || userIntent.review;
  const bestFor = content.bestFor || userIntent.bestFor;
  const steps = content.steps || userIntent.steps;
  const useCases = content.useCases || userIntent.useCases;

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10">
      <article className="rounded-lg border bg-white p-6 shadow-soft sm:p-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
          <div>
            <h2 className="text-xl font-black text-slate-950">{currentWhatHeading}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {content.intro} <strong>{audience}</strong> use it when {userIntent.situation.charAt(0).toLowerCase()}
              {userIntent.situation.slice(1)} {description}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Start with <strong>{input}</strong> A useful result is <strong>{outcome.charAt(0).toLowerCase()}
              {outcome.slice(1)}</strong> For the next step in the same workflow, open{" "}
              {seoLinks.slice(0, 3).map((tool, index) => (
                <span key={toolHref(tool)}>
                  {index > 0 ? (index === seoLinks.slice(0, 3).length - 1 ? ", or " : ", ") : ""}
                  <Link href={toolHref(tool)} className="font-bold text-blue-700 underline-offset-4 hover:underline">
                    {relatedAnchorLabel(tool.name)}
                  </Link>
                </span>
              ))}
              .
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              <strong>Before you use the output:</strong> {review}
            </p>
            <h2 className="mt-5 text-lg font-black text-slate-950">{currentHowHeading}</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="hidden rounded-lg border bg-gradient-to-br from-blue-50 via-white to-violet-50 p-5 text-center lg:block">
            <p className="text-sm font-black text-slate-600">{conversionPair?.from ?? categoryLabel}</p>
            <div className="my-5 text-3xl font-black text-blue-700"><SeoContentLabel label="to" /></div>
            <p className="text-sm font-black text-slate-600">{conversionPair?.to ?? <SeoContentLabel label="output" />}</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950"><SeoContentLabel label="examples" /></h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {currentExampleIntro}
          </p>

          <div className="mt-5 space-y-8">
            <div>
              <h3 className="text-base font-black text-slate-950">{content.examples[0]?.title ?? <SeoContentLabel label="example1" />}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {content.examples[0]?.description ?? "This sample starts with a small, representative input so the main transformation is easy to verify."}
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_80px_1fr] lg:items-center">
                <CodePanel label={conversionPair?.from ?? <SeoContentLabel label="input" />} code={inputExample} />
                <div className="hidden text-center text-2xl font-black text-blue-600 lg:block"><SeoContentLabel label="to" /></div>
                <CodePanel label={conversionPair?.to ?? <SeoContentLabel label="output" />} code={outputExample} />
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-950">{content.examples[1]?.title ?? <SeoContentLabel label="example2" />}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {content.examples[1]?.description ?? "Run a second sample with different values or edge cases before applying the result to a larger workflow."}
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_80px_1fr] lg:items-center">
                <CodePanel label={conversionPair?.from ?? <SeoContentLabel label="input" />} code={secondInputExample} />
                <div className="hidden text-center text-2xl font-black text-blue-600 lg:block"><SeoContentLabel label="to" /></div>
                <CodePanel label={conversionPair?.to ?? <SeoContentLabel label="output" />} code={secondOutputExample} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">Common Use Cases</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase} className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {useCase}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black text-slate-950">
            What to Check Before You Use the Result
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            The output from <strong>{title}</strong> is most useful when you compare it with the original input and test it
            where it will actually be used. The table separates the source state, expected result, and review responsibility.
            If the next task changes, continue with{" "}
            {seoLinks.slice(0, 4).map((tool, index) => (
              <span key={`context-${toolHref(tool)}`}>
                {index > 0 ? (index === seoLinks.slice(0, 4).length - 1 ? ", or " : ", ") : ""}
                <Link href={toolHref(tool)} className="font-bold text-blue-700 underline-offset-4 hover:underline">
                  {relatedAnchorLabel(tool.name)}
                </Link>
              </span>
            ))}
            .
          </p>
          <div className="mt-4 overflow-hidden rounded-md border">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-950">
                <tr>
                  <th className="px-4 py-3 font-black">Stage</th>
                  <th className="px-4 py-3 font-black">What you have</th>
                  <th className="px-4 py-3 font-black">What good looks like</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Input</td>
                  <td className="px-4 py-3 text-slate-600">{userIntent.inputState}</td>
                  <td className="px-4 py-3 text-slate-600">{content.tips[0]}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Result</td>
                  <td className="px-4 py-3 text-slate-600">{userIntent.outputState}</td>
                  <td className="px-4 py-3 text-slate-600">{content.tips[1]}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Review</td>
                  <td className="px-4 py-3 text-slate-600">Keep the original available for a side-by-side comparison.</td>
                  <td className="px-4 py-3 text-slate-600">{content.tips[2]}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Best fit</td>
                  <td className="px-4 py-3 text-slate-600">{bestFor}</td>
                  <td className="px-4 py-3 text-slate-600">{content.tips[3]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-lg bg-sky-50 p-5 sm:p-6">
          <h2 className="text-xl font-black text-slate-950"><SeoContentLabel label="faq" /></h2>
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
            <h2 className="text-xl font-black text-slate-950"><SeoContentLabel label="tryMore" /> {relatedHeading}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Continue with a related <strong>{relatedHeading}</strong> when the next step uses the same input or helps verify
              the result. These links stay within the current task group.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {sampleLinks.slice(0, 12).map((tool) => (
                <Link key={tool.name} href={"href" in tool ? tool.href : `/${tool.slug}`} className="rounded-md bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                  {relatedAnchorLabel(tool.name)}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
