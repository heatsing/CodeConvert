"use client";

import { useI18n, type LanguageCode } from "@/lib/i18n";

type LegalSection = {
  heading: string;
  body: string;
};

type LegalCopy = {
  title: string;
  updated: string;
  sections: LegalSection[];
};

type LegalPageKind = "privacy" | "terms";

const privacyCopy: Record<LanguageCode, LegalCopy> = {
  EN: {
    title: "Privacy Policy",
    updated: "Last Updated: July 2026",
    sections: [
      { heading: "Overview", body: "CodeConvert.net provides browser-based tools for code conversion, formatting, encoding, decoding, text processing, and developer workflows." },
      { heading: "Tool Input", body: "Most tools process the text you enter in the browser interface. Do not paste passwords, private keys, production secrets, confidential source code, or other sensitive information." },
      { heading: "Analytics and Cookies", body: "We may use analytics services and cookies to understand page usage, improve navigation, remember basic preferences, and identify technical issues." },
      { heading: "Third-Party Services", body: "Hosting, analytics, security, or performance providers may process limited data according to their own policies and only as needed to operate the site." },
      { heading: "Changes and Contact", body: "We may update this policy as the site changes. For privacy questions, contact the site owner through the contact method provided on CodeConvert.net." }
    ]
  },
  PT: {
    title: "Política de Privacidade",
    updated: "Atualizado: julho de 2026",
    sections: [
      { heading: "Visão geral", body: "CodeConvert.net oferece ferramentas no navegador para conversão de código, formatação, codificação, decodificação, texto e fluxos de desenvolvimento." },
      { heading: "Entrada nas ferramentas", body: "A maioria das ferramentas processa o texto inserido na interface do navegador. Não cole senhas, chaves privadas, segredos de produção ou código confidencial." },
      { heading: "Analytics e cookies", body: "Podemos usar analytics e cookies para entender o uso das páginas, melhorar a navegação, lembrar preferências básicas e encontrar problemas técnicos." },
      { heading: "Serviços terceiros", body: "Provedores de hospedagem, analytics, segurança ou desempenho podem processar dados limitados conforme suas próprias políticas." },
      { heading: "Alterações e contato", body: "Podemos atualizar esta política quando o site mudar. Para dúvidas de privacidade, entre em contato pelo método indicado no CodeConvert.net." }
    ]
  },
  ES: {
    title: "Política de Privacidad",
    updated: "Actualizado: julio de 2026",
    sections: [
      { heading: "Resumen", body: "CodeConvert.net ofrece herramientas en el navegador para conversión de código, formato, codificación, decodificación, texto y flujos de desarrollo." },
      { heading: "Entrada de herramientas", body: "La mayoría de las herramientas procesa el texto que escribes en el navegador. No pegues contraseñas, claves privadas, secretos de producción ni código confidencial." },
      { heading: "Analítica y cookies", body: "Podemos usar analítica y cookies para entender el uso de páginas, mejorar la navegación, recordar preferencias básicas y detectar problemas técnicos." },
      { heading: "Servicios de terceros", body: "Proveedores de hosting, analítica, seguridad o rendimiento pueden procesar datos limitados según sus propias políticas." },
      { heading: "Cambios y contacto", body: "Podemos actualizar esta política cuando el sitio cambie. Para preguntas de privacidad, usa el método de contacto indicado en CodeConvert.net." }
    ]
  },
  DE: {
    title: "Datenschutzerklärung",
    updated: "Aktualisiert: Juli 2026",
    sections: [
      { heading: "Überblick", body: "CodeConvert.net bietet browserbasierte Tools für Code-Konvertierung, Formatierung, Kodierung, Dekodierung, Textverarbeitung und Entwicklerabläufe." },
      { heading: "Tool-Eingaben", body: "Die meisten Tools verarbeiten Text im Browser. Füge keine Passwörter, privaten Schlüssel, Produktionsgeheimnisse oder vertraulichen Quellcode ein." },
      { heading: "Analyse und Cookies", body: "Wir können Analyse-Dienste und Cookies nutzen, um Seitennutzung zu verstehen, Navigation zu verbessern und technische Probleme zu finden." },
      { heading: "Drittanbieter", body: "Anbieter für Hosting, Analyse, Sicherheit oder Leistung können begrenzte Daten gemäß ihren eigenen Richtlinien verarbeiten." },
      { heading: "Änderungen und Kontakt", body: "Diese Richtlinie kann aktualisiert werden. Bei Datenschutzfragen nutze die auf CodeConvert.net angegebene Kontaktmöglichkeit." }
    ]
  },
  RU: {
    title: "Политика конфиденциальности",
    updated: "Обновлено: июль 2026",
    sections: [
      { heading: "Обзор", body: "CodeConvert.net предоставляет браузерные инструменты для конвертации кода, форматирования, кодирования, декодирования, обработки текста и задач разработки." },
      { heading: "Ввод данных", body: "Большинство инструментов обрабатывает введенный текст в браузере. Не вставляйте пароли, приватные ключи, секреты или конфиденциальный код." },
      { heading: "Аналитика и cookies", body: "Мы можем использовать аналитику и cookies для понимания использования страниц, улучшения навигации и поиска технических проблем." },
      { heading: "Сторонние сервисы", body: "Провайдеры хостинга, аналитики, безопасности или производительности могут обрабатывать ограниченные данные по своим правилам." },
      { heading: "Изменения и контакт", body: "Мы можем обновлять эту политику. По вопросам конфиденциальности используйте контактный способ на CodeConvert.net." }
    ]
  },
  FR: {
    title: "Politique de Confidentialité",
    updated: "Mis à jour : juillet 2026",
    sections: [
      { heading: "Aperçu", body: "CodeConvert.net fournit des outils dans le navigateur pour convertir, formater, encoder, décoder et traiter du texte de développement." },
      { heading: "Entrées des outils", body: "La plupart des outils traitent le texte saisi dans le navigateur. Ne collez pas de mots de passe, clés privées, secrets de production ou code confidentiel." },
      { heading: "Analytics et cookies", body: "Nous pouvons utiliser des services d'analyse et des cookies pour comprendre l'usage, améliorer la navigation et détecter les problèmes techniques." },
      { heading: "Services tiers", body: "Des fournisseurs d'hébergement, d'analyse, de sécurité ou de performance peuvent traiter des données limitées selon leurs propres politiques." },
      { heading: "Changements et contact", body: "Cette politique peut être mise à jour. Pour toute question, utilisez le moyen de contact indiqué sur CodeConvert.net." }
    ]
  },
  TR: {
    title: "Gizlilik Politikası",
    updated: "Güncellendi: Temmuz 2026",
    sections: [
      { heading: "Genel bakış", body: "CodeConvert.net kod dönüştürme, biçimlendirme, kodlama, çözme, metin işleme ve geliştirici iş akışları için tarayıcı tabanlı araçlar sunar." },
      { heading: "Araç girdisi", body: "Çoğu araç tarayıcı arayüzüne girdiğiniz metni işler. Parola, özel anahtar, üretim sırrı veya gizli kaynak kodu yapıştırmayın." },
      { heading: "Analitik ve çerezler", body: "Sayfa kullanımını anlamak, gezinmeyi geliştirmek ve teknik sorunları bulmak için analitik ve çerezler kullanabiliriz." },
      { heading: "Üçüncü taraf hizmetleri", body: "Barındırma, analitik, güvenlik veya performans sağlayıcıları sınırlı verileri kendi politikalarına göre işleyebilir." },
      { heading: "Değişiklikler ve iletişim", body: "Bu politikayı güncelleyebiliriz. Gizlilik soruları için CodeConvert.net üzerindeki iletişim yöntemini kullanın." }
    ]
  },
  PL: {
    title: "Polityka Prywatności",
    updated: "Ostatnia aktualizacja: lipiec 2026",
    sections: [
      { heading: "Przegląd", body: "CodeConvert.net oferuje narzędzia w przeglądarce do konwersji kodu, formatowania, kodowania, dekodowania, tekstu i pracy deweloperskiej." },
      { heading: "Dane w narzędziach", body: "Większość narzędzi przetwarza tekst wpisany w przeglądarce. Nie wklejaj haseł, kluczy prywatnych, sekretów produkcyjnych ani poufnego kodu." },
      { heading: "Analityka i cookies", body: "Możemy używać analityki i cookies, aby rozumieć użycie stron, poprawiać nawigację i wykrywać problemy techniczne." },
      { heading: "Usługi zewnętrzne", body: "Dostawcy hostingu, analityki, bezpieczeństwa lub wydajności mogą przetwarzać ograniczone dane zgodnie ze swoimi zasadami." },
      { heading: "Zmiany i kontakt", body: "Możemy aktualizować tę politykę. W sprawach prywatności użyj kontaktu podanego na CodeConvert.net." }
    ]
  },
  CN: {
    title: "隐私政策",
    updated: "最后更新：2026年7月",
    sections: [
      { heading: "概览", body: "CodeConvert.net 提供基于浏览器的代码转换、格式化、编码、解码、文本处理和开发者工作流工具。" },
      { heading: "工具输入", body: "大多数工具会在浏览器界面中处理你输入的文本。请不要粘贴密码、私钥、生产密钥、机密源码或其他敏感信息。" },
      { heading: "分析与 Cookie", body: "我们可能使用分析服务和 Cookie 来了解页面使用情况、改进导航、保存基础偏好并发现技术问题。" },
      { heading: "第三方服务", body: "托管、分析、安全或性能服务商可能会按照其政策处理有限数据，仅用于网站运行所需。" },
      { heading: "变更与联系", body: "网站变化时我们可能更新本政策。如有隐私问题，请通过 CodeConvert.net 提供的联系方式联系站点所有者。" }
    ]
  },
  TW: {
    title: "隱私權政策",
    updated: "最後更新：2026年7月",
    sections: [
      { heading: "概覽", body: "CodeConvert.net 提供基於瀏覽器的程式碼轉換、格式化、編碼、解碼、文字處理與開發者工作流程工具。" },
      { heading: "工具輸入", body: "多數工具會在瀏覽器介面中處理你輸入的文字。請不要貼上密碼、私鑰、正式環境祕密、機密原始碼或其他敏感資訊。" },
      { heading: "分析與 Cookie", body: "我們可能使用分析服務和 Cookie 來了解頁面使用情況、改善導覽、保存基本偏好並發現技術問題。" },
      { heading: "第三方服務", body: "託管、分析、安全或效能服務商可能依其政策處理有限資料，僅用於網站運作所需。" },
      { heading: "變更與聯絡", body: "網站變更時我們可能更新本政策。如有隱私問題，請透過 CodeConvert.net 提供的方式聯絡站點所有者。" }
    ]
  }
};

const termsCopy: Record<LanguageCode, LegalCopy> = {
  EN: {
    title: "Terms of Service",
    updated: "Last Updated: July 2026",
    sections: [
      { heading: "Use of the Site", body: "CodeConvert.net offers free online tools for developers, writers, and technical users. Use the site lawfully and responsibly." },
      { heading: "No Professional Advice", body: "Tool output is provided for convenience and may be incomplete, inaccurate, or unsuitable for production use." },
      { heading: "User Content", body: "You are responsible for the text, code, files, and other content you enter into the tools." },
      { heading: "Availability", body: "The site may change, pause, or stop without notice. Features may be updated, removed, or replaced as the project evolves." },
      { heading: "Limitation of Liability", body: "CodeConvert.net is provided as-is. To the maximum extent permitted by law, we are not liable for consequences from using the site or tool output." }
    ]
  },
  PT: { title: "Termos de Serviço", updated: "Atualizado: julho de 2026", sections: [
    { heading: "Uso do site", body: "CodeConvert.net oferece ferramentas online gratuitas para desenvolvedores, escritores e usuários técnicos. Use o site de forma legal e responsável." },
    { heading: "Sem aconselhamento profissional", body: "A saída das ferramentas é fornecida por conveniência e pode estar incompleta, incorreta ou inadequada para produção." },
    { heading: "Conteúdo do usuário", body: "Você é responsável pelo texto, código, arquivos e outros conteúdos inseridos nas ferramentas." },
    { heading: "Disponibilidade", body: "O site pode mudar, pausar ou encerrar sem aviso. Recursos podem ser atualizados, removidos ou substituídos." },
    { heading: "Limitação de responsabilidade", body: "CodeConvert.net é fornecido no estado em que se encontra. Na medida permitida por lei, não nos responsabilizamos por consequências do uso." }
  ] },
  ES: { title: "Términos del Servicio", updated: "Actualizado: julio de 2026", sections: [
    { heading: "Uso del sitio", body: "CodeConvert.net ofrece herramientas online gratuitas para desarrolladores, escritores y usuarios técnicos. Usa el sitio de forma legal y responsable." },
    { heading: "Sin asesoramiento profesional", body: "La salida de las herramientas se ofrece por conveniencia y puede ser incompleta, inexacta o inadecuada para producción." },
    { heading: "Contenido del usuario", body: "Eres responsable del texto, código, archivos y otros contenidos que ingresas en las herramientas." },
    { heading: "Disponibilidad", body: "El sitio puede cambiar, pausarse o detenerse sin aviso. Las funciones pueden actualizarse, eliminarse o reemplazarse." },
    { heading: "Limitación de responsabilidad", body: "CodeConvert.net se proporciona tal cual. En la medida permitida por la ley, no somos responsables por consecuencias de uso." }
  ] },
  DE: { title: "Nutzungsbedingungen", updated: "Aktualisiert: Juli 2026", sections: [
    { heading: "Nutzung der Website", body: "CodeConvert.net bietet kostenlose Online-Tools für Entwickler, Autoren und technische Nutzer. Nutze die Website rechtmäßig und verantwortungsvoll." },
    { heading: "Keine professionelle Beratung", body: "Tool-Ausgaben dienen der Bequemlichkeit und können unvollständig, ungenau oder ungeeignet für Produktion sein." },
    { heading: "Nutzerinhalte", body: "Du bist für Text, Code, Dateien und andere Inhalte verantwortlich, die du in die Tools eingibst." },
    { heading: "Verfügbarkeit", body: "Die Website kann sich ändern, pausieren oder ohne Hinweis beendet werden. Funktionen können aktualisiert, entfernt oder ersetzt werden." },
    { heading: "Haftungsbeschränkung", body: "CodeConvert.net wird wie besehen bereitgestellt. Soweit gesetzlich zulässig, haften wir nicht für Folgen der Nutzung." }
  ] },
  RU: { title: "Условия обслуживания", updated: "Обновлено: июль 2026", sections: [
    { heading: "Использование сайта", body: "CodeConvert.net предлагает бесплатные онлайн-инструменты для разработчиков, авторов и технических пользователей. Используйте сайт законно и ответственно." },
    { heading: "Не является профессиональным советом", body: "Результаты инструментов предоставляются для удобства и могут быть неполными, неточными или неподходящими для продакшена." },
    { heading: "Контент пользователя", body: "Вы отвечаете за текст, код, файлы и другой контент, который вводите в инструменты." },
    { heading: "Доступность", body: "Сайт может изменяться, приостанавливаться или прекращать работу без уведомления. Функции могут обновляться или удаляться." },
    { heading: "Ограничение ответственности", body: "CodeConvert.net предоставляется как есть. В пределах закона мы не отвечаем за последствия использования сайта." }
  ] },
  FR: { title: "Conditions d'Utilisation", updated: "Mis à jour : juillet 2026", sections: [
    { heading: "Utilisation du site", body: "CodeConvert.net propose des outils gratuits en ligne pour développeurs, rédacteurs et utilisateurs techniques. Utilisez le site légalement et de façon responsable." },
    { heading: "Pas de conseil professionnel", body: "Les résultats des outils sont fournis par commodité et peuvent être incomplets, inexacts ou inadaptés à la production." },
    { heading: "Contenu utilisateur", body: "Vous êtes responsable du texte, du code, des fichiers et des autres contenus saisis dans les outils." },
    { heading: "Disponibilité", body: "Le site peut changer, être suspendu ou s'arrêter sans préavis. Les fonctionnalités peuvent être mises à jour, supprimées ou remplacées." },
    { heading: "Limitation de responsabilité", body: "CodeConvert.net est fourni tel quel. Dans les limites de la loi, nous ne sommes pas responsables des conséquences de l'utilisation." }
  ] },
  TR: { title: "Hizmet Şartları", updated: "Güncellendi: Temmuz 2026", sections: [
    { heading: "Site kullanımı", body: "CodeConvert.net geliştiriciler, yazarlar ve teknik kullanıcılar için ücretsiz online araçlar sunar. Siteyi yasal ve sorumlu şekilde kullanın." },
    { heading: "Profesyonel tavsiye değildir", body: "Araç çıktıları kolaylık için sunulur ve eksik, hatalı veya üretim kullanımı için uygun olmayabilir." },
    { heading: "Kullanıcı içeriği", body: "Araçlara girdiğiniz metin, kod, dosya ve diğer içeriklerden siz sorumlusunuz." },
    { heading: "Kullanılabilirlik", body: "Site haber vermeden değişebilir, duraklayabilir veya kapanabilir. Özellikler güncellenebilir, kaldırılabilir veya değiştirilebilir." },
    { heading: "Sorumluluk sınırı", body: "CodeConvert.net olduğu gibi sağlanır. Yasaların izin verdiği ölçüde kullanım sonuçlarından sorumlu değiliz." }
  ] },
  PL: { title: "Regulamin Usługi", updated: "Ostatnia aktualizacja: lipiec 2026", sections: [
    { heading: "Korzystanie z witryny", body: "CodeConvert.net oferuje darmowe narzędzia online dla programistów, autorów i użytkowników technicznych. Korzystaj z witryny zgodnie z prawem." },
    { heading: "Brak profesjonalnej porady", body: "Wyniki narzędzi są udostępniane dla wygody i mogą być niepełne, niedokładne lub nieodpowiednie do produkcji." },
    { heading: "Treści użytkownika", body: "Odpowiadasz za tekst, kod, pliki i inne treści wprowadzane do narzędzi." },
    { heading: "Dostępność", body: "Witryna może się zmienić, zostać wstrzymana lub zakończona bez powiadomienia. Funkcje mogą być aktualizowane lub usuwane." },
    { heading: "Ograniczenie odpowiedzialności", body: "CodeConvert.net jest udostępniany takim, jaki jest. W granicach prawa nie odpowiadamy za skutki korzystania." }
  ] },
  CN: { title: "服务条款", updated: "最后更新：2026年7月", sections: [
    { heading: "网站使用", body: "CodeConvert.net 为开发者、写作者和技术用户提供免费在线工具。请合法、负责地使用本站。" },
    { heading: "非专业建议", body: "工具输出仅为方便使用而提供，可能不完整、不准确，或不适合生产环境。" },
    { heading: "用户内容", body: "你需要对输入工具的文本、代码、文件和其他内容负责。" },
    { heading: "可用性", body: "网站可能在不通知的情况下变更、暂停或停止。功能可能会更新、删除或替换。" },
    { heading: "责任限制", body: "CodeConvert.net 按现状提供。在法律允许范围内，我们不对使用本站或工具输出造成的后果承担责任。" }
  ] },
  TW: { title: "服務條款", updated: "最後更新：2026年7月", sections: [
    { heading: "網站使用", body: "CodeConvert.net 為開發者、寫作者與技術使用者提供免費線上工具。請合法且負責地使用本站。" },
    { heading: "非專業建議", body: "工具輸出僅為方便使用而提供，可能不完整、不準確，或不適合正式環境。" },
    { heading: "使用者內容", body: "你需要對輸入工具的文字、程式碼、檔案與其他內容負責。" },
    { heading: "可用性", body: "網站可能在不通知的情況下變更、暫停或停止。功能可能會更新、移除或替換。" },
    { heading: "責任限制", body: "CodeConvert.net 按現狀提供。在法律允許範圍內，我們不對使用本站或工具輸出造成的後果承擔責任。" }
  ] }
};

export function LegalPage({ kind }: { kind: LegalPageKind }) {
  const { language } = useI18n();
  const copy = (kind === "privacy" ? privacyCopy : termsCopy)[language] ?? (kind === "privacy" ? privacyCopy.EN : termsCopy.EN);

  return (
    <main className="bg-slate-50 px-4 py-10">
      <article className="mx-auto max-w-4xl rounded-lg border bg-white p-6 text-slate-700 shadow-soft sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">CodeConvert.net</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{copy.title}</h1>
        <p className="mt-3 text-sm text-slate-500">{copy.updated}</p>
        <div className="mt-8 grid gap-7 text-[15px] leading-7">
          {copy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-black text-slate-950">{section.heading}</h2>
              <p className="mt-2">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
