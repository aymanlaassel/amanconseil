import type { Locale } from '@/i18n/routing';

export type LegalSlug = 'mentions-legales' | 'cgu' | 'confidentialite';

type LegalDoc = {
  title: Record<Locale, string>;
  updated: Record<Locale, string>;
  /** HTML body rendered inside .prose-block. Company-specific values marked […]. */
  body: Record<Locale, string>;
};

const UPDATED = { fr: '30 mai 2026', ar: '30 ماي 2026', en: '30 May 2026' };

export const LEGAL: Record<LegalSlug, LegalDoc> = {
  'mentions-legales': {
    title: { fr: 'Mentions légales', ar: 'الإشعارات القانونية', en: 'Legal notice' },
    updated: UPDATED,
    body: {
      fr: `
        <h2>Éditeur du site</h2>
        <p><b>Aman Conseil</b> — cabinet de conseil et d'assistance à maîtrise d'ouvrage (AMO)
        en promotion immobilière. Forme juridique : […]. RC : […]. ICE : […]. Siège : […], Maroc.
        Email : contact@amanconseil.ma.</p>
        <h2>Directeur de la publication</h2>
        <p>[…]</p>
        <h2>Hébergement</h2>
        <p>Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
        <h2>Activité</h2>
        <p>Aman Conseil exerce une activité de conseil et d'assistance à maîtrise d'ouvrage.
        Le cabinet n'exerce <b>aucune activité de collecte de fonds ni d'intermédiation financière</b>,
        et ne présente aucune opportunité d'investissement. Les missions sont réalisées dans le cadre
        d'une <b>obligation de moyens</b>, sans garantie de résultat.</p>
        <h2>Propriété intellectuelle</h2>
        <p>L'ensemble des contenus (textes, marques, logos, éléments graphiques) est protégé.
        Toute reproduction sans autorisation est interdite.</p>
      `,
      ar: `
        <h2>ناشر الموقع</h2>
        <p><b>أمان للاستشارة</b> — مكتب استشارة ومساعدة لصاحب المشروع في الترقية العقارية.
        الشكل القانوني: […]. السجل التجاري: […]. المعرّف الموحد للمقاولة (ICE): […]. المقر: […]، المغرب.
        البريد الإلكتروني: contact@amanconseil.ma.</p>
        <h2>مدير النشر</h2>
        <p>[…]</p>
        <h2>الاستضافة</h2>
        <p>الموقع مُستضاف لدى Vercel Inc.، الولايات المتحدة الأمريكية.</p>
        <h2>النشاط</h2>
        <p>يمارس أمان للاستشارة نشاط الاستشارة والمساعدة لصاحب المشروع. لا يمارس المكتب
        <b>أي نشاط لجمع الأموال أو الوساطة المالية</b>، ولا يعرض أي فرصة استثمارية.
        تُنجَز المهام في إطار <b>التزام ببذل العناية</b>، دون ضمان النتيجة.</p>
        <h2>الملكية الفكرية</h2>
        <p>جميع المحتويات (النصوص، العلامات، الشعارات، العناصر التصويرية) محمية.
        يُمنع أي استنساخ دون إذن.</p>
      `,
      en: `
        <h2>Site publisher</h2>
        <p><b>Aman Conseil</b> — advisory and project-owner assistance (AMO) firm in real-estate
        development. Legal form: […]. Trade register: […]. ICE: […]. Head office: […], Morocco.
        Email: contact@amanconseil.ma.</p>
        <h2>Publication director</h2>
        <p>[…]</p>
        <h2>Hosting</h2>
        <p>This site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
        <h2>Activity</h2>
        <p>Aman Conseil provides advisory and project-owner assistance services. The firm carries out
        <b>no fundraising and no financial intermediation</b>, and presents no investment opportunity.
        Engagements are performed on a <b>best-efforts basis</b>, with no guarantee of results.</p>
        <h2>Intellectual property</h2>
        <p>All content (text, trademarks, logos, graphics) is protected. Any reproduction without
        authorisation is prohibited.</p>
      `,
    },
  },
  cgu: {
    title: { fr: "Conditions générales d'utilisation", ar: 'شروط الاستخدام العامة', en: 'Terms of use' },
    updated: UPDATED,
    body: {
      fr: `
        <h2>Objet</h2>
        <p>Les présentes conditions régissent l'utilisation du site amanconseil.ma. En naviguant sur
        le site, vous les acceptez.</p>
        <h2>Pré-diagnostic foncier</h2>
        <p>Le pré-diagnostic est un outil gratuit et <b>indicatif</b>. Il ne remplace ni une
        vérification professionnelle, ni l'intervention d'un notaire. Aucune décision d'achat ne
        devrait être prise sur sa seule base.</p>
        <h2>Nature des services</h2>
        <p>Aman Conseil fournit du conseil et de l'assistance à maîtrise d'ouvrage. Le cabinet
        <b>ne collecte aucun fonds</b>, n'assure aucune intermédiation financière et ne propose
        aucune opportunité d'investissement. Les prestations relèvent d'une <b>obligation de moyens</b>,
        sans garantie de résultat.</p>
        <h2>Responsabilité</h2>
        <p>Les informations publiées le sont à titre indicatif et peuvent évoluer. Aman Conseil ne
        saurait être tenue responsable d'un usage qui en serait fait hors de tout accompagnement.</p>
        <h2>Propriété intellectuelle &amp; droit applicable</h2>
        <p>Les contenus sont protégés. Les présentes conditions sont régies par le droit marocain.
        Pour toute question : contact@amanconseil.ma.</p>
      `,
      ar: `
        <h2>الموضوع</h2>
        <p>تنظّم هذه الشروط استخدام موقع amanconseil.ma. بتصفّحك للموقع فإنك توافق عليها.</p>
        <h2>التشخيص العقاري الأولي</h2>
        <p>التشخيص الأولي أداة مجانية و<b>إرشادية</b>. لا يغني عن تحقّق مهني ولا عن تدخّل موثّق.
        لا ينبغي اتخاذ أي قرار شراء بناءً عليه وحده.</p>
        <h2>طبيعة الخدمات</h2>
        <p>يقدّم أمان للاستشارة خدمات الاستشارة والمساعدة لصاحب المشروع. لا يجمع المكتب
        <b>أي أموال</b>، ولا يقوم بأي وساطة مالية، ولا يعرض أي فرصة استثمارية.
        الخدمات في إطار <b>التزام ببذل العناية</b>، دون ضمان النتيجة.</p>
        <h2>المسؤولية</h2>
        <p>تُنشر المعلومات على سبيل الإرشاد وقد تتغيّر. لا يتحمّل أمان للاستشارة مسؤولية أي استخدام
        يتمّ خارج إطار مرافقة.</p>
        <h2>الملكية الفكرية والقانون المطبّق</h2>
        <p>المحتويات محمية. تخضع هذه الشروط للقانون المغربي. لأي سؤال: contact@amanconseil.ma.</p>
      `,
      en: `
        <h2>Purpose</h2>
        <p>These terms govern the use of amanconseil.ma. By browsing the site, you accept them.</p>
        <h2>Land pre-diagnosis</h2>
        <p>The pre-diagnosis is a free and <b>indicative</b> tool. It replaces neither a professional
        verification nor a notary's involvement. No purchase decision should be made on its sole basis.</p>
        <h2>Nature of the services</h2>
        <p>Aman Conseil provides advisory and project-owner assistance. The firm <b>collects no funds</b>,
        provides no financial intermediation and offers no investment opportunity. Services are provided
        on a <b>best-efforts basis</b>, with no guarantee of results.</p>
        <h2>Liability</h2>
        <p>Published information is indicative and may change. Aman Conseil cannot be held liable for any
        use made of it outside of an engagement.</p>
        <h2>Intellectual property &amp; applicable law</h2>
        <p>Content is protected. These terms are governed by Moroccan law. Questions:
        contact@amanconseil.ma.</p>
      `,
    },
  },
  confidentialite: {
    title: { fr: 'Politique de confidentialité', ar: 'سياسة الخصوصية', en: 'Privacy policy' },
    updated: UPDATED,
    body: {
      fr: `
        <p>Aman Conseil traite vos données à caractère personnel conformément à la <b>loi 09-08</b>
        relative à la protection des personnes physiques à l'égard du traitement des données à
        caractère personnel (CNDP).</p>
        <h2>Responsable du traitement</h2>
        <p>Aman Conseil — contact@amanconseil.ma.</p>
        <h2>Données collectées</h2>
        <p>Nom, téléphone, email (facultatif), réponses au pré-diagnostic et son verdict, message de
        contact, et pour les prestataires : métier, ville et références.</p>
        <h2>Finalités</h2>
        <p>Vous recontacter au sujet de votre projet, qualifier votre demande, et — pour les
        prestataires — évaluer votre candidature. <b>Aucune donnée n'est vendue ni utilisée à des fins
        d'intermédiation financière.</b></p>
        <h2>Base légale &amp; conservation</h2>
        <p>Traitement fondé sur votre <b>consentement</b> (horodaté à l'envoi du formulaire). Les
        données sont conservées le temps nécessaire au suivi de la relation, puis archivées ou
        supprimées (à titre indicatif, 3 ans après le dernier contact).</p>
        <h2>Vos droits</h2>
        <p>Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression. Pour
        l'exercer : contact@amanconseil.ma. Le traitement fait l'objet des formalités requises auprès
        de la CNDP (n° […]).</p>
        <h2>Cookies &amp; mesure d'audience</h2>
        <p>Les outils de mesure d'audience ne sont activés qu'après votre consentement.</p>
      `,
      ar: `
        <p>يعالج أمان للاستشارة بياناتك الشخصية وفقًا <b>للقانون 09-08</b> المتعلق بحماية الأشخاص
        الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي (CNDP).</p>
        <h2>المسؤول عن المعالجة</h2>
        <p>أمان للاستشارة — contact@amanconseil.ma.</p>
        <h2>البيانات المجمَّعة</h2>
        <p>الاسم، الهاتف، البريد الإلكتروني (اختياري)، أجوبة التشخيص الأولي ونتيجته، رسالة التواصل،
        وبالنسبة للمزوّدين: المهنة، المدينة والمراجع.</p>
        <h2>الغايات</h2>
        <p>التواصل معك بخصوص مشروعك، تأهيل طلبك، و— بالنسبة للمزوّدين — تقييم ترشّحك.
        <b>لا تُباع أي بيانات ولا تُستعمل لأغراض الوساطة المالية.</b></p>
        <h2>الأساس القانوني والحفظ</h2>
        <p>تستند المعالجة إلى <b>موافقتك</b> (مؤرَّخة عند إرسال النموذج). تُحفظ البيانات للمدة اللازمة
        لتتبّع العلاقة، ثم تُؤرشَف أو تُحذف (إرشاديًا، 3 سنوات بعد آخر تواصل).</p>
        <h2>حقوقك</h2>
        <p>لك حق الوصول والتصحيح والاعتراض والحذف. لممارسته: contact@amanconseil.ma.
        تخضع المعالجة للإجراءات اللازمة لدى CNDP (رقم […]).</p>
        <h2>ملفات تعريف الارتباط وقياس الجمهور</h2>
        <p>لا تُفعَّل أدوات قياس الجمهور إلا بعد موافقتك.</p>
      `,
      en: `
        <p>Aman Conseil processes your personal data in accordance with <b>law 09-08</b> on the
        protection of individuals with regard to the processing of personal data (CNDP).</p>
        <h2>Data controller</h2>
        <p>Aman Conseil — contact@amanconseil.ma.</p>
        <h2>Data collected</h2>
        <p>Name, phone, email (optional), pre-diagnosis answers and verdict, contact message, and for
        providers: profession, city and references.</p>
        <h2>Purposes</h2>
        <p>To contact you about your project, qualify your request, and — for providers — assess your
        application. <b>No data is sold or used for financial-intermediation purposes.</b></p>
        <h2>Legal basis &amp; retention</h2>
        <p>Processing is based on your <b>consent</b> (timestamped on form submission). Data is kept for
        as long as needed to manage the relationship, then archived or deleted (indicatively, 3 years
        after the last contact).</p>
        <h2>Your rights</h2>
        <p>You have rights of access, rectification, objection and deletion. To exercise them:
        contact@amanconseil.ma. The processing is subject to the required CNDP formalities (no. […]).</p>
        <h2>Cookies &amp; analytics</h2>
        <p>Analytics tools are only enabled after your consent.</p>
      `,
    },
  },
};
