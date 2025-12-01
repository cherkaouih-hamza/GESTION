import React, { createContext, useState, useContext } from 'react';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    phone: '0612345678',
    password: 'admin123',
    name: 'مدير النظام',
    role: 'admin',
    isActive: true
  },
  {
    id: 2,
    email: 'responsable@example.com',
    phone: '0623456789',
    password: 'responsable123',
    name: 'المسؤول',
    role: 'responsable',
    isActive: true
  },
  {
    id: 3,
    email: 'utilisateur@example.com',
    phone: '0634567890',
    password: 'utilisateur123',
    name: 'المستخدم',
    role: 'utilisateur',
    isActive: true
  },
  {
    id: 4,
    email: 'ahmed.benali@example.com',
    phone: '0645678901',
    password: 'password123',
    name: 'أحمد بنعلي',
    role: 'utilisateur',
    isActive: true
  },
  {
    id: 5,
    email: 'fatima.morocco@example.com',
    phone: '0656789012',
    password: 'password123',
    name: 'فاطمة المغرب',
    role: 'utilisateur',
    isActive: true
  },
  {
    id: 6,
    email: 'youssef.kaoui@example.com',
    phone: '0667890123',
    password: 'password123',
    name: 'يوسف الكعوي',
    role: 'responsable',
    isActive: true
  },
  {
    id: 7,
    email: 'hassan.rachid@example.com',
    phone: '0678901234',
    password: 'password123',
    name: 'حسن رشيد',
    role: 'utilisateur',
    isActive: true
  },
  {
    id: 8,
    email: 'laila.othmani@example.com',
    phone: '0689012345',
    password: 'password123',
    name: 'ليلى العثماني',
    role: 'utilisateur',
    isActive: true
  },
  {
    id: 9,
    email: 'karim.malik@example.com',
    phone: '0690123456',
    password: 'password123',
    name: 'كريم مالك',
    role: 'utilisateur',
    isActive: true
  },
  {
    id: 10,
    email: 'nadia.tazi@example.com',
    phone: '0601234567',
    password: 'password123',
    name: 'نادية التازي',
    role: 'utilisateur',
    isActive: true
  }
];

// Mock data for registration requests
const mockRegistrationRequests = [];

// Mock data for tasks
const mockTasks = [
  {
    id: 1,
    name: 'مهمة تجريبية 1',
    description: 'هذا وصف مهمتنا التجريبية الأولى',
    type: 'فيديو',
    startDate: '2023-12-01',
    endDate: '2023-12-10',
    mediaLink: 'https://example.com/video1',
    isActive: true,
    status: 'جارية',
    createdBy: 3,
    validatedBy: 2,
    assignedTo: 3,
    pole: 'التواصل',
    priority: 'Normal'
  },
  {
    id: 2,
    name: 'مهمة تجريبية 2',
    description: 'هذا وصف مهمتنا التجريبية الثانية',
    type: 'بطاقة',
    startDate: '2023-12-05',
    endDate: '2023-12-15',
    mediaLink: 'https://example.com/image1',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 3,
    validatedBy: null,
    assignedTo: 3,
    pole: 'الموارد البشرية',
    priority: 'Faible'
  },
  {
    id: 3,
    name: 'مهمة تجريبية 3',
    description: 'هذا وصف مهمتنا التجريبية الثالثة',
    type: 'إعلان',
    startDate: '2023-11-25',
    endDate: '2023-12-05',
    mediaLink: 'https://example.com/ad1',
    isActive: true,
    status: 'مكتملة',
    createdBy: 2,
    validatedBy: 1,
    assignedTo: 2,
    pole: 'التسويق',
    priority: 'Important'
  },
  {
    id: 4,
    name: 'تحديث الموقع',
    description: 'تحديث محتوى الصفحة الرئيسية للWebsite',
    type: 'ويب',
    startDate: '2024-01-15',
    endDate: '2024-01-30',
    mediaLink: 'https://example.com/website-update',
    isActive: true,
    status: 'مكتملة',
    createdBy: 1,
    validatedBy: 2,
    assignedTo: 4,
    pole: 'التكنولوجيا',
    priority: 'Normal'
  },
  {
    id: 5,
    name: 'تصميم المحتوى البصري',
    description: 'تصميم غلاف لفيديو توعوي',
    type: 'تصميم',
    startDate: '2024-02-01',
    endDate: '2024-02-10',
    mediaLink: 'https://example.com/design-cover',
    isActive: true,
    status: 'جارية',
    createdBy: 2,
    validatedBy: 1,
    assignedTo: 5,
    pole: 'الإتصال',
    priority: 'Urgent'
  },
  {
    id: 6,
    name: 'حملة إعلانية',
    description: 'إعداد محتوى لحملة إعلانية على وسائل التواصل',
    type: 'محتوى',
    startDate: '2024-01-20',
    endDate: '2024-02-05',
    mediaLink: 'https://example.com/ad-campaign',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 3,
    validatedBy: null,
    assignedTo: 6,
    pole: 'التسويق',
    priority: 'Normal'
  },
  {
    id: 7,
    name: 'مهمة تحليل البيانات',
    description: 'تحليل البيانات للفترة السابقة',
    type: 'تحليل',
    startDate: '2024-01-10',
    endDate: '2024-01-25',
    mediaLink: 'https://example.com/data-analysis',
    isActive: true,
    status: 'مكتملة',
    createdBy: 4,
    validatedBy: 1,
    assignedTo: 4,
    pole: 'التحليل',
    priority: 'Important'
  },
  {
    id: 8,
    name: 'مهمة بحثية',
    description: 'بحث حول سلوك المستهلك',
    type: 'بحث',
    startDate: '2024-02-05',
    endDate: '2024-02-20',
    mediaLink: 'https://example.com/research',
    isActive: true,
    status: 'جارية',
    createdBy: 5,
    validatedBy: 2,
    assignedTo: 7,
    pole: 'البحث',
    priority: 'Normal'
  },
  {
    id: 9,
    name: 'مهمة تدريب الموظفين',
    description: 'ورشة تدريبية للموظفين الجدد',
    type: 'تدريب',
    startDate: '2024-02-15',
    endDate: '2024-02-28',
    mediaLink: 'https://example.com/training',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 6,
    validatedBy: null,
    assignedTo: 8,
    pole: 'الموارد البشرية',
    priority: 'Important'
  },
  {
    id: 10,
    name: 'مهمة إنشاء تقارير',
    description: 'تجميع التقارير الشهرية',
    type: 'تقرير',
    startDate: '2024-01-25',
    endDate: '2024-02-10',
    mediaLink: 'https://example.com/monthly-report',
    isActive: true,
    status: 'مكتملة',
    createdBy: 7,
    validatedBy: 1,
    assignedTo: 9,
    pole: 'التحليل',
    priority: 'Normal'
  },
  {
    id: 11,
    name: 'مهمة مراجعة الجودة',
    description: 'مراجعة جودة المنتجات',
    type: 'جودة',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    mediaLink: 'https://example.com/quality-review',
    isActive: true,
    status: 'جارية',
    createdBy: 8,
    validatedBy: 2,
    assignedTo: 10,
    pole: 'الجودة',
    priority: 'Urgent'
  },
  {
    id: 12,
    name: 'مهمة تسويق المحتوى',
    description: 'تسويق محتوى فيديو على وسائل التواصل',
    type: 'تسويق',
    startDate: '2024-02-10',
    endDate: '2024-02-25',
    mediaLink: 'https://example.com/content-marketing',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 9,
    validatedBy: null,
    assignedTo: 3,
    pole: 'التسويق',
    priority: 'Normal'
  },
  {
    id: 13,
    name: 'مهمة إنشاء محتوى صوتي',
    description: 'إعداد بودكاست جديد',
    type: 'صوتي',
    startDate: '2024-01-30',
    endDate: '2024-02-14',
    mediaLink: 'https://example.com/podcast',
    isActive: true,
    status: 'مكتملة',
    createdBy: 10,
    validatedBy: 1,
    assignedTo: 4,
    pole: 'الإتصال',
    priority: 'Important'
  },
  {
    id: 14,
    name: 'مهمة تطوير البرمجيات',
    description: 'تطوير تطبيق جديد',
    type: 'برمجيات',
    startDate: '2024-02-05',
    endDate: '2024-03-01',
    mediaLink: 'https://example.com/software-dev',
    isActive: true,
    status: 'جارية',
    createdBy: 1,
    validatedBy: 2,
    assignedTo: 5,
    pole: 'التكنولوجيا',
    priority: 'Urgent'
  },
  {
    id: 15,
    name: 'مهمة تحليل سوق العمل',
    description: 'تحليل المنافسين في السوق',
    type: 'تحليل',
    startDate: '2024-02-12',
    endDate: '2024-02-27',
    mediaLink: 'https://example.com/market-analysis',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 2,
    validatedBy: null,
    assignedTo: 6,
    pole: 'التحليل',
    priority: 'Normal'
  },
  {
    id: 16,
    name: 'مهمة تنظيم الأرشيف',
    description: 'تنظيم وتوثيق الأرشيف الرقمي',
    type: 'توثيق',
    startDate: '2024-01-18',
    endDate: '2024-02-02',
    mediaLink: 'https://example.com/digital-archiving',
    isActive: true,
    status: 'مكتملة',
    createdBy: 3,
    validatedBy: 1,
    assignedTo: 7,
    pole: 'الإدارة',
    priority: 'Normal'
  },
  {
    id: 17,
    name: 'مهمة دعم العملاء',
    description: 'تقديم الدعم الفني للعملاء',
    type: 'دعم',
    startDate: '2024-02-08',
    endDate: '2024-02-22',
    mediaLink: 'https://example.com/customer-support',
    isActive: true,
    status: 'جارية',
    createdBy: 4,
    validatedBy: 2,
    assignedTo: 8,
    pole: 'الدعم',
    priority: 'Important'
  },
  {
    id: 18,
    name: 'مهمة إعداد ورقة سياسات',
    description: 'تحديث ورقة السياسات الداخلية',
    type: 'سياسات',
    startDate: '2024-02-15',
    endDate: '2024-03-05',
    mediaLink: 'https://example.com/policies',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 5,
    validatedBy: null,
    assignedTo: 9,
    pole: 'الإدارة',
    priority: 'Normal'
  },
  {
    id: 19,
    name: 'مهمة تطوير مهارات',
    description: 'ورشة عمل لتطوير المهارات التقنية',
    type: 'تدريب',
    startDate: '2024-02-01',
    endDate: '2024-02-16',
    mediaLink: 'https://example.com/skills-workshop',
    isActive: true,
    status: 'مكتملة',
    createdBy: 6,
    validatedBy: 1,
    assignedTo: 10,
    pole: 'الموارد البشرية',
    priority: 'Important'
  },
  {
    id: 20,
    name: 'مهمة تقييم الأداء',
    description: 'تقييم أداء الموظفين للربع الأول',
    type: 'تقييم',
    startDate: '2024-02-20',
    endDate: '2024-03-10',
    mediaLink: 'https://example.com/performance-review',
    isActive: true,
    status: 'جارية',
    createdBy: 7,
    validatedBy: 2,
    assignedTo: 3,
    pole: 'الموارد البشرية',
    priority: 'Urgent'
  },
  {
    id: 21,
    name: 'مهمة إنشاء فيديو تعريفي',
    description: 'فيديو تعريفي عن الشركة',
    type: 'فيديو',
    startDate: '2024-01-25',
    endDate: '2024-02-08',
    mediaLink: 'https://example.com/company-video',
    isActive: true,
    status: 'مكتملة',
    createdBy: 8,
    validatedBy: 1,
    assignedTo: 4,
    pole: 'الإتصال',
    priority: 'Normal'
  },
  {
    id: 22,
    name: 'مهمة تحليل البيانات المالية',
    description: 'تحليل الميزانية للربع الأول',
    type: 'تحليل',
    startDate: '2024-02-10',
    endDate: '2024-02-25',
    mediaLink: 'https://example.com/financial-analysis',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 9,
    validatedBy: null,
    assignedTo: 5,
    pole: 'التحليل',
    priority: 'Urgent'
  },
  {
    id: 23,
    name: 'مهمة تصميم هوية بصرية',
    description: 'تصميم الهوية البصرية لمنتج جديد',
    type: 'تصميم',
    startDate: '2024-02-05',
    endDate: '2024-02-20',
    mediaLink: 'https://example.com/visual-identity',
    isActive: true,
    status: 'جارية',
    createdBy: 10,
    validatedBy: 2,
    assignedTo: 6,
    pole: 'التصميم',
    priority: 'Important'
  },
  {
    id: 24,
    name: 'مهمة تطوير استراتيجية',
    description: 'تطوير استراتيجية تسويقية للعام القادم',
    type: 'استراتيجية',
    startDate: '2024-02-15',
    endDate: '2024-03-05',
    mediaLink: 'https://example.com/marketing-strategy',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 1,
    validatedBy: null,
    assignedTo: 7,
    pole: 'التسويق',
    priority: 'Normal'
  },
  {
    id: 25,
    name: 'مهمة تنظيم الحدث',
    description: 'تنظيم الحدث السنوي للشركة',
    type: 'حدث',
    startDate: '2024-01-30',
    endDate: '2024-02-15',
    mediaLink: 'https://example.com/annual-event',
    isActive: true,
    status: 'مكتملة',
    createdBy: 2,
    validatedBy: 1,
    assignedTo: 8,
    pole: 'الإدارة',
    priority: 'Important'
  },
  {
    id: 26,
    name: 'مهمة تطوير تطبيق الجوال',
    description: 'تطوير تطبيق جوال لنظام Android',
    type: 'برمجيات',
    startDate: '2024-02-01',
    endDate: '2024-03-15',
    mediaLink: 'https://example.com/mobile-app',
    isActive: true,
    status: 'جارية',
    createdBy: 3,
    validatedBy: 2,
    assignedTo: 9,
    pole: 'التكنولوجيا',
    priority: 'Urgent'
  },
  {
    id: 27,
    name: 'مهمة تدقيق الحسابات',
    description: 'تدقيق الحسابات المالية للربع الأول',
    type: 'تدقيق',
    startDate: '2024-02-18',
    endDate: '2024-03-08',
    mediaLink: 'https://example.com/audit',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 4,
    validatedBy: null,
    assignedTo: 10,
    pole: 'الإدارة',
    priority: 'Normal'
  },
  {
    id: 28,
    name: 'مهمة تطوير المحتوى التعليمي',
    description: 'تطوير محتوى تعليمي لمنصة التعلم',
    type: 'محتوى',
    startDate: '2024-02-12',
    endDate: '2024-03-02',
    mediaLink: 'https://example.com/educational-content',
    isActive: true,
    status: 'مكتملة',
    createdBy: 5,
    validatedBy: 1,
    assignedTo: 3,
    pole: 'التعليم',
    priority: 'Normal'
  },
  {
    id: 29,
    name: 'مهمة تحسين محركات البحث',
    description: 'تحسين ترتيب الموقع في محركات البحث',
    type: 'SEO',
    startDate: '2024-02-08',
    endDate: '2024-02-23',
    mediaLink: 'https://example.com/seo-optimization',
    isActive: true,
    status: 'جارية',
    createdBy: 6,
    validatedBy: 2,
    assignedTo: 4,
    pole: 'التسويق',
    priority: 'Important'
  },
  {
    id: 30,
    name: 'مهمة تحليل تجربة المستخدم',
    description: 'تحليل تجربة المستخدم على الموقع',
    type: 'تجربة',
    startDate: '2024-02-05',
    endDate: '2024-02-20',
    mediaLink: 'https://example.com/user-experience',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 7,
    validatedBy: null,
    assignedTo: 5,
    pole: 'التحليل',
    priority: 'Normal'
  },
  {
    id: 31,
    name: 'مهمة تدريب الموارد البشرية',
    description: 'ورشة تدريبية لمديري الموارد البشرية',
    type: 'تدريب',
    startDate: '2024-01-22',
    endDate: '2024-02-06',
    mediaLink: 'https://example.com/hr-training',
    isActive: true,
    status: 'مكتملة',
    createdBy: 8,
    validatedBy: 1,
    assignedTo: 6,
    pole: 'الموارد البشرية',
    priority: 'Important'
  },
  {
    id: 32,
    name: 'مهمة تطوير منصة التعلم',
    description: 'تطوير منصة تعليمية إلكترونية',
    type: 'منصة',
    startDate: '2024-02-20',
    endDate: '2024-03-30',
    mediaLink: 'https://example.com/learning-platform',
    isActive: true,
    status: 'جارية',
    createdBy: 9,
    validatedBy: 2,
    assignedTo: 7,
    pole: 'التكنولوجيا',
    priority: 'Urgent'
  },
  {
    id: 33,
    name: 'مهمة إنشاء بروشور',
    description: 'تصميم بروشور تعريفي بالخدمات',
    type: 'تصميم',
    startDate: '2024-02-15',
    endDate: '2024-02-28',
    mediaLink: 'https://example.com/brochure',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 10,
    validatedBy: null,
    assignedTo: 8,
    pole: 'التصميم',
    priority: 'Normal'
  },
  {
    id: 34,
    name: 'مهمة تحليل بيانات السوق',
    description: 'تحليل بيانات السوق لمنتج جديد',
    type: 'تحليل',
    startDate: '2024-02-10',
    endDate: '2024-02-25',
    mediaLink: 'https://example.com/market-data',
    isActive: true,
    status: 'مكتملة',
    createdBy: 1,
    validatedBy: 1,
    assignedTo: 9,
    pole: 'التحليل',
    priority: 'Important'
  },
  {
    id: 35,
    name: 'مهمة إدارة المشاريع',
    description: 'إدارة مشروع تطوير نظام داخلي',
    type: 'إدارة',
    startDate: '2024-02-05',
    endDate: '2024-03-20',
    mediaLink: 'https://example.com/project-management',
    isActive: true,
    status: 'جارية',
    createdBy: 2,
    validatedBy: 2,
    assignedTo: 10,
    pole: 'الإدارة',
    priority: 'Urgent'
  },
  {
    id: 36,
    name: 'مهمة تطوير العلامة التجارية',
    description: 'تطوير استراتيجية العلامة التجارية',
    type: 'علامة',
    startDate: '2024-02-25',
    endDate: '2024-03-15',
    mediaLink: 'https://example.com/branding',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 3,
    validatedBy: null,
    assignedTo: 3,
    pole: 'التسويق',
    priority: 'Normal'
  },
  {
    id: 37,
    name: 'مهمة تطوير مهارات القيادة',
    description: 'ورشة تطوير مهارات القيادة',
    type: 'تدريب',
    startDate: '2024-02-18',
    endDate: '2024-03-05',
    mediaLink: 'https://example.com/leadership',
    isActive: true,
    status: 'مكتملة',
    createdBy: 4,
    validatedBy: 1,
    assignedTo: 4,
    pole: 'الموارد البشرية',
    priority: 'Important'
  },
  {
    id: 38,
    name: 'مهمة تحليل المخاطر',
    description: 'تحليل المخاطر المحتملة للمشروع',
    type: 'تحليل',
    startDate: '2024-02-12',
    endDate: '2024-02-27',
    mediaLink: 'https://example.com/risk-analysis',
    isActive: true,
    status: 'جارية',
    createdBy: 5,
    validatedBy: 2,
    assignedTo: 5,
    pole: 'التحليل',
    priority: 'Urgent'
  },
  {
    id: 39,
    name: 'مهمة تجربة المستهلك',
    description: 'تجربة المستهلك مع المنتج الجديد',
    type: 'تجربة',
    startDate: '2024-02-01',
    endDate: '2024-02-16',
    mediaLink: 'https://example.com/consumer-test',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 6,
    validatedBy: null,
    assignedTo: 6,
    pole: 'التسويق',
    priority: 'Normal'
  },
  {
    id: 40,
    name: 'مهمة تطوير واجهة المستخدم',
    description: 'تطوير واجهة مستخدم سهلة الاستخدام',
    type: 'واجهة',
    startDate: '2024-02-22',
    endDate: '2024-03-12',
    mediaLink: 'https://example.com/ui-design',
    isActive: true,
    status: 'مكتملة',
    createdBy: 7,
    validatedBy: 1,
    assignedTo: 7,
    pole: 'التكنولوجيا',
    priority: 'Important'
  },
  {
    id: 41,
    name: 'مهمة إعداد تقرير الأداء',
    description: 'تقرير أداء الفريق للربع الأول',
    type: 'تقرير',
    startDate: '2024-02-15',
    endDate: '2024-03-01',
    mediaLink: 'https://example.com/performance-report',
    isActive: true,
    status: 'جارية',
    createdBy: 8,
    validatedBy: 2,
    assignedTo: 8,
    pole: 'التحليل',
    priority: 'Normal'
  },
  {
    id: 42,
    name: 'مهمة تطوير خطة العمل',
    description: 'خطة العمل السنوية الجديدة',
    type: 'خطة',
    startDate: '2024-02-10',
    endDate: '2024-02-25',
    mediaLink: 'https://example.com/action-plan',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 9,
    validatedBy: null,
    assignedTo: 9,
    pole: 'الإدارة',
    priority: 'Important'
  },
  {
    id: 43,
    name: 'مهمة تطوير محتوى تدريبي',
    description: 'محتوى تدريبي للموظفين الجدد',
    type: 'محتوى',
    startDate: '2024-02-05',
    endDate: '2024-02-20',
    mediaLink: 'https://example.com/training-content',
    isActive: true,
    status: 'مكتملة',
    createdBy: 10,
    validatedBy: 1,
    assignedTo: 10,
    pole: 'الموارد البشرية',
    priority: 'Normal'
  },
  {
    id: 44,
    name: 'مهمة تحليل العمليات',
    description: 'تحليل وتحسين العمليات الداخلية',
    type: 'تحليل',
    startDate: '2024-02-28',
    endDate: '2024-03-18',
    mediaLink: 'https://example.com/process-analysis',
    isActive: true,
    status: 'جارية',
    createdBy: 1,
    validatedBy: 2,
    assignedTo: 3,
    pole: 'الإدارة',
    priority: 'Urgent'
  },
  {
    id: 45,
    name: 'مهمة تطوير الأنظمة',
    description: 'تطوير أنظمة الأمان الداخلي',
    type: 'أنظمة',
    startDate: '2024-02-18',
    endDate: '2024-03-10',
    mediaLink: 'https://example.com/systems',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 2,
    validatedBy: null,
    assignedTo: 4,
    pole: 'التكنولوجيا',
    priority: 'Important'
  },
  {
    id: 46,
    name: 'مهمة تقييم الأداء الفردي',
    description: 'تقييم أداء الموظفين الفردي',
    type: 'تقييم',
    startDate: '2024-02-12',
    endDate: '2024-02-27',
    mediaLink: 'https://example.com/personal-review',
    isActive: true,
    status: 'مكتملة',
    createdBy: 3,
    validatedBy: 1,
    assignedTo: 5,
    pole: 'الموارد البشرية',
    priority: 'Normal'
  },
  {
    id: 47,
    name: 'مهمة تطوير استراتيجية الاتصال',
    description: 'استراتيجية الاتصال الداخلي والخارجي',
    type: 'اتصال',
    startDate: '2024-02-05',
    endDate: '2024-02-20',
    mediaLink: 'https://example.com/communication',
    isActive: true,
    status: 'جارية',
    createdBy: 4,
    validatedBy: 2,
    assignedTo: 6,
    pole: 'الإتصال',
    priority: 'Urgent'
  },
  {
    id: 48,
    name: 'مهمة إدارة علاقات العملاء',
    description: 'نظام إدارة علاقات العملاء',
    type: 'CRM',
    startDate: '2024-02-25',
    endDate: '2024-03-15',
    mediaLink: 'https://example.com/crm',
    isActive: true,
    status: 'في انتظار الموافقة',
    createdBy: 5,
    validatedBy: null,
    assignedTo: 7,
    pole: 'الدعم',
    priority: 'Normal'
  },
  {
    id: 49,
    name: 'مهمة تطوير خدمة العملاء',
    description: 'تحسين خدمة العملاء عبر الهاتف',
    type: 'خدمة',
    startDate: '2024-02-15',
    endDate: '2024-03-05',
    mediaLink: 'https://example.com/customer-service',
    isActive: true,
    status: 'مكتملة',
    createdBy: 6,
    validatedBy: 1,
    assignedTo: 8,
    pole: 'الدعم',
    priority: 'Important'
  },
  {
    id: 50,
    name: 'مهمة تطوير خطة استدامة',
    description: 'خطة استدامة الشركة للسنوات القادمة',
    type: 'استدامة',
    startDate: '2024-02-20',
    endDate: '2024-03-20',
    mediaLink: 'https://example.com/sustainability',
    isActive: true,
    status: 'جارية',
    createdBy: 7,
    validatedBy: 2,
    assignedTo: 9,
    pole: 'الإدارة',
    priority: 'Urgent'
  }
];

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);

  const login = async (identifier, password) => {
    // Find user by email or phone
    const user = mockUsers.find(
      u => (u.email === identifier || u.phone === identifier) && u.password === password
    );

    if (!user) {
      return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    if (!user.isActive) {
      return { success: false, message: 'الحساب غير نشط' };
    }

    setCurrentUser(user);
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return !!currentUser;
  };

  const getUserRole = () => {
    return currentUser ? currentUser.role : null;
  };

  const getAllTasks = () => {
    return tasks;
  };

  const getTasksByUser = (userId) => {
    return tasks.filter(task => task.createdBy === userId || task.assignedTo === userId);
  };

  const getTasksForValidation = () => {
    return tasks.filter(task => task.status === 'في انتظار الموافقة');
  };

  const createTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
      ...taskData,
      status: 'في انتظار الموافقة',
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTaskStatus = (taskId, status, validatedBy = null, comment = null) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status, 
            validatedBy: validatedBy || task.validatedBy,
            comment: comment || task.comment
          } 
        : task
    ));
  };

  const updateTask = (taskId, taskData) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...taskData } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const registerUser = async (userData) => {
    // Check if email or phone already exists
    const existingUser = mockUsers.find(
      u => u.email === userData.email || u.phone === userData.phone
    );

    if (existingUser) {
      return { success: false, message: 'هذا البريد الإلكتروني أو رقم الهاتف مستخدم من قبل' };
    }

    // Create registration request
    const registrationRequest = {
      id: mockRegistrationRequests.length + 1,
      ...userData,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString(),
      validatedBy: null,
      validatedAt: null
    };

    mockRegistrationRequests.push(registrationRequest);

    // Simulate email notification to responsible/admin
    console.log(`Notification: New registration request from ${userData.name} (${userData.email})`);

    return { success: true, message: 'تم إرسال طلب التسجيل بنجاح. في انتظار المصادقة.' };
  };

  const getRegistrationRequests = () => {
    return mockRegistrationRequests;
  };

  const updateRegistrationRequestStatus = (requestId, status, validatedBy = null) => {
    const requestIndex = mockRegistrationRequests.findIndex(req => req.id === requestId);
    if (requestIndex !== -1) {
      mockRegistrationRequests[requestIndex].status = status;
      mockRegistrationRequests[requestIndex].validatedBy = validatedBy;
      mockRegistrationRequests[requestIndex].validatedAt = new Date().toISOString();

      // If approved, add user to mockUsers
      if (status === 'approved') {
        const request = mockRegistrationRequests[requestIndex];
        const newUser = {
          id: mockUsers.length + 1,
          email: request.email,
          phone: request.phone,
          password: request.password,
          name: request.name,
          role: 'utilisateur', // Default role for new users
          isActive: true
        };
        mockUsers.push(newUser);
      }
    }
  };

  const getAllUsers = () => {
    return mockUsers;
  };

  const createUser = async (userData) => {
    // Check if email or phone already exists
    const existingUser = mockUsers.find(
      u => u.email === userData.email || u.phone === userData.phone
    );

    if (existingUser) {
      throw new Error('هذا البريد الإلكتروني أو رقم الهاتف مستخدم من قبل');
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      isActive: true
    };

    mockUsers.push(newUser);
    return newUser;
  };

  const updateUser = async (userId, userData) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    // Check if email or phone already exists for another user
    const existingUser = mockUsers.find(
      u => (u.email === userData.email || u.phone === userData.phone) && u.id !== userId
    );

    if (existingUser) {
      throw new Error('هذا البريد الإلكتروني أو رقم الهاتف مستخدم من قبل');
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  };

  const deleteUser = async (userId) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    // Don't allow deleting the current user
    if (currentUser && currentUser.id === userId) {
      throw new Error('لا يمكن حذف حسابك الخاص');
    }

    // Don't allow deleting other admins if current user is not admin
    const userToDelete = mockUsers[userIndex];
    if (currentUser.role !== 'admin' && userToDelete.role === 'admin') {
      throw new Error('لا يمكن حذف حساب المدير');
    }

    mockUsers.splice(userIndex, 1);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    getAllTasks,
    getTasksByUser,
    getTasksForValidation,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    registerUser,
    getRegistrationRequests,
    updateRegistrationRequestStatus,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};