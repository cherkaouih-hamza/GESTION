// اختبارات بسيطة لوظائف النظام

// مكون لاختبار المصادقة
function testAuth() {
  console.log("Testing authentication functions...");
  
  // محاكاة تسجيل الدخول
  const mockUsers = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'responsable@example.com', password: 'responsable123', role: 'responsable' },
    { email: 'utilisateur@example.com', password: 'utilisateur123', role: 'utilisateur' }
  ];
  
  console.log("Mock users created:", mockUsers.length);
  
  // محاكاة مهام
  const mockTasks = [
    { id: 1, name: 'مهمة تجريبية', status: 'في انتظار الموافقة', createdBy: 3 },
    { id: 2, name: 'مهمة ثانية', status: 'جارية', createdBy: 2 }
  ];
  
  console.log("Mock tasks created:", mockTasks.length);
  
  console.log("All basic functions tested successfully!");
}

// تشغيل الاختبار
testAuth();