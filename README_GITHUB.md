# منصة إدارة المشاريع و المتابعة الإعلامية

نظام إدارة مهام إعلامية متكامل باللغة العربية avec دعم كامل للبيانات المخزنة في قاعدة بيانات PostgreSQL على Neon ودعم كامل للاتجاه من اليمين إلى اليسار (RTL).

## الميزات

- **Stockage persistant**: Les tâches et utilisateurs sont maintenant stockés dans une base de données PostgreSQL sur Neon.tech
- **Nouvelle API complète**: Accès aux données via des endpoints RESTful
- **Scalabilité**: L'application peut maintenant supporter plusieurs utilisateurs et une grande quantité de données
- **Synchronisation**: Les données sont synchronisées entre tous les utilisateurs en temps réel
- **نظام تسجيل دخول متعدد الأدوار**: أدمين، مسؤول، مستخدم
- **نظام تسجيل المستخدمين الجدد**: مع إمكانية التسجيل وطلب التحقق من قبل فريق الإعلام
- **نظام إدارة المستخدمين**: إمكانية إضافة، تعديل، وحذف المستخدمين (لﻸدمن والمسؤولين)
- **لوحة تحكم مخصصة حسب الدور**: مع مؤشرات رئيسية وتوزيع المهام
- **تتبع المهام**: مع إمكانية الفلترة والبحث
- **نظام تأكيد المهام وطلبات التسجيل**: للمسؤولين والأدمن
- **واجهة مخصصة للهاتف المحمول**: تصميم متجاوب
- **دعم اللغة العربية بالكامل**: مع اتجاه RTL

## الأدوار

1. **أدمين (Admin)**: لديه صلاحيات كاملة، يرى جميع المهام والإحصائيات، يمكنه تأكيد أو رفض المهام وطلبات التسجيل
2. **مسؤول (Responsable)**: يمكنه تأكيد أو رفض المهام، يرى إحصائيات فريقه، يمكنه تأكيد أو رفض طلبات التسجيل
3. **مستخدم (Utilisateur)**: يمكنه إنشاء وتعديل مهامه، يرى لوحة تحكم شخصية

## متطلبات النظام

- Node.js 14 أو أحدث
- npm أو yarn
- PostgreSQL (للاتصال بقاعدة البيانات)

## التثبيت

1. تأكد من تثبيت Node.js على جهازك
2. استنساخ هذا المستودع إلى جهازك المحلي
3. افتح الطرفية في مجلد المشروع
4. نفذ الأمر التالي لتنصيب الحزم:

```bash
npm install
```

5. إنشاء ملف `.env` وفقًا لملف `.env.example`:
```bash
cp .env.example .env
```
 ثم قم بتحديث متغيرات البيئة وفقًا لبيئتك.

6. لتشغيل التطبيق في وضع التطوير:

```bash
# لتشغيل الخادم الخلفي فقط
npm run server

# لتشغيل الواجهة الأمامية فقط
npm start

# لتشغيل كليهما في نافذة واحدة
npm run dev
```

## الملفات الرئيسية

- `src/App.js`: المكون الرئيسي للتطبيق
- `src/context/AuthContext.js`: سياق المصادقة mis à jour pour utiliser l'API
- `src/pages/`: تحتوي على صفحات التطبيق
- `src/components/`: تحتوي على المكونات القابلة لإعادة الاستخدام
- `src/styles/`: تحتوي على ملفات CSS
- `server.js`: Serveur Express avec endpoints API
- `config/db.js`: Configuration de la connexion PostgreSQL
- `api/`: Endpoints API pour les tâches et les utilisateurs
- `src/api/`: Appels API côté frontend

## بنية المشروع

```
.
├── api/                    # API routes
│   ├── auth.js            # Authentication endpoints
│   ├── poles.js           # Poles management
│   ├── user-manager.js    # User management (NEW!)
│   ├── task-manager.js    # Task management (NEW!)
│   └── pole-manager.js    # Pole management (NEW!)
├── config/                # Configuration files
│   └── db.js              # Database configuration
├── src/                   # Frontend source code
│   ├── api/               # API service files
│   ├── components/        # React components
│   ├── context/           # React context providers
│   ├── pages/             # React pages
│   ├── styles/            # CSS styles
│   └── utils/             # Utility functions
├── public/                # Static assets
├── .env.example          # Environment variables example
├── package.json          # Project dependencies and scripts
├── server.js             # Backend server
└── README.md             # Project documentation
```

## المساهمة

1. فرع المشروع (fork)
2. إنشاء فرع جديد (`git checkout -b feature/AmazingFeature`)
3. إجراء التغييرات المطلوبة (`git commit -m 'Add some AmazingFeature'`)
4. دفع التغييرات إلى الفرع (`git push origin feature/AmazingFeature`)
5. إنشاء طلب سحب (pull request)

## المتغيرات البيئية

ينبغي إنشاء ملف `.env` مع المتغيرات التالية:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api
```

## المتطلبات المسبقة

- Node.js 14 أو أحدث
- npm أو yarn
- قاعدة بيانات PostgreSQL (Neon موصى به)

## البيانات التجريبية

- **أدمين**:
  - البريد: admin@example.com
  - كلمة المرور: admin123

- **مسؤول**:
  - البريد: responsable@example.com
  - كلمة المرور: responsable123

- **مستخدم**:
  - البريد: utilisateur@example.com
  - كلمة المرور: utilisateur13

## ملاحظات

- تم استخدام Tailwind CSS لتصميم واجهة مستخدم متجاوبة
- جميع النصوص باللغة العربية مع دعم RTL
- تم تنفيذ تصميم مخصص للهاتف المحمول أولاً
- يحتوي على زر WhatsApp عائم للتواصل مع الإدارة
- تم ترقية النظام لاستخدام قاعدة بيانات PostgreSQL على Neon.tech بدلاً من البيانات المزيفة

## الملفات الإضافية

- `schema.sql`: تعريف جداول قاعدة البيانات
- `database-migration.sql`: عمليات ترحيل قاعدة البيانات
- `migrate-database.js`: تنفيذ المهاجرات
- أدلة الاختبار في الجذر: ملفات مختلفة لاختبار الوظائف

## دعم وتوثيق إضافي

- `POSTGRESQL_SETUP.md`: تعليمات إعداد قاعدة البيانات
- `DEPLOYMENT.md`: تعليمات النشر
- `TROUBLESHOOTING.md`: دليل استكشاف الأخطاء وإصلاحها
- `BEST_PRACTICES.md`: أفضل الممارسات
- `VERCEL_SETUP.md`: تعليمات إعداد Vercel