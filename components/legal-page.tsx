"use client";

import { useI18n, type LanguageCode } from "@/lib/i18n";
import { privacyCopy } from "@/lib/privacy-policy";
import { AnalyticsSettings } from "@/components/analytics-settings";

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
        {kind === "privacy" && <AnalyticsSettings />}
      </article>
    </main>
  );
}
