# 🔧 استكشاف الأخطاء والدعم

## ✅ تم حل المشكلة الأساسية

إذا كنت لا تزال تواجه مشاكل أداء، اتبع الخطوات أدناه.

---

## 🎯 الحل السريع

### **الخطوة 1: امسح بيانات المتصفح**
```
Chrome > Settings > Privacy > Clear browsing data
✅ Select: Cookies and cached images
✅ Time: All time
✅ Click: Clear data
```

### **الخطوة 2: أعد تحميل الصفحة**
```
F5 أو Ctrl+R أو ⌘R على Mac
```

### **الخطوة 3: تحقق من Chrome**
```
Chrome > Menu > About Google Chrome
(يجب أن يتحدّث تلقائياً)
```

---

## 🔍 استكشاف الأخطاء

### **الخطأ #1: ما زال يوجد جيتر**

**الحل**:
1. فعّل Lite Mode يدويّاً:
```javascript
// في Chrome Console (F12 > Console)
localStorage.setItem('labo-performance-mode', 'lite');
location.reload();
```

2. إذا استمرت المشكلة:
```javascript
// تحقق من الحالة الحالية
console.log(localStorage.getItem('labo-performance-mode'));
```

---

### **الخطأ #2: الصفحة بطيئة في التحميل**

**الحل**:
1. فعّل Network Throttling في DevTools:
```
DevTools > Network > Throttling > Slow 4G
(للتحقق من الأداء على شبكات بطيئة)
```

2. تحقق من حجم الصور:
```
DevTools > Network > Filter: img
(الصور يجب أن تكون < 100KB لكل صورة)
```

---

### **الخطأ #3: أخطاء في Console**

**الحل**:
1. افتح Chrome DevTools:
```
F12 أو Ctrl+Shift+I
```

2. اذهب إلى Console tab

3. التقط الأخطاء وشاركها

**الأخطاء الشائعة**:
- ❌ `Firebase not initialized`
  → تحقق من الاتصال بالإنترنت

- ❌ `Service Worker failed`
  → امسح بيانات المتصفح

- ❌ `EmailJS failed`
  → تحقق من API key

---

### **الخطأ #4: Black screen أو تحميل معلق**

**الحل**:
1. أعد تحميل الصفحة:
```
Ctrl+Shift+R (Hard Refresh - مسح الـ cache)
```

2. إذا استمرت:
```javascript
// في Console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 🖥️ اختبار الأداء المتقدم

### **استخدم Chrome DevTools Performance Profiler**:

```
1. DevTools > Performance
2. اضغط ● (Record)
3. تفاعل مع الصفحة (اسحب، انقر، تمرير)
4. اضغط ■ (Stop)
5. حلل النتائج
```

**ماذا تبحث عنه**:
- 🟢 أخضر = جيد (> 50 FPS)
- 🟡 أصفر = تحذير (30-50 FPS)
- 🔴 أحمر = سيء (< 30 FPS)

---

### **استخدم Lighthouse Audit**:

```
1. DevTools > Lighthouse
2. اختر "Mobile"
3. اضغط "Analyze page load"
4. انتظر التقرير
```

**الدرجات المتوقعة**:
- Performance: > 80 ✅
- Accessibility: > 90 ✅
- Best Practices: > 80 ✅

---

## 🔄 إعادة تفعيل الحلول

### **إذا عكست التحسينات عن طريق الخطأ**:

```javascript
// استعادة الـ CSS الأصلي
// (لا تفعل هذا إلا إذا كنت متأكداً!)
localStorage.setItem('labo-restore-defaults', 'true');
```

### **للعودة إلى الإصدار الأصلي**:

1. في `style.css`، ابحث عن:
```css
@media (max-width: 768px) {
  .bg-blob {
    filter: none !important;
    animation: none !important;
  }
}
```

2. غيّره إلى:
```css
/* معطل - تسبب جيتر */
```

---

## 📞 الاتصال بالدعم

### **قبل التواصل، تأكد من**:
- ✅ امسحت بيانات المتصفح
- ✅ حدّثت Chrome إلى أحدث إصدار
- ✅ اختبرت على شبكة WiFi
- ✅ حاولت إعادة تحميل الصفحة

### **عند التواصل، وفّر**:
```
1. رقم الهاتف والموديل
   مثلاً: Samsung Galaxy S22, iPhone 14 Pro

2. إصدار Chrome
   Chrome > Menu > About Google Chrome

3. لقطة شاشة أو فيديو للمشكلة

4. رسائل الأخطاء من Console
   DevTools > Console > انسخ الأخطاء
```

---

## 🎓 معلومات تقنية إضافية

### **متغيرات localStorage المتاحة**:

```javascript
// تفعيل Lite Mode
localStorage.setItem('labo-performance-mode', 'lite');

// تفعيل Full Mode
localStorage.setItem('labo-performance-mode', 'full');

// حذف جميع البيانات
localStorage.clear();
```

### **معايير الأداء**:

```
Desktop:
- FPS: 55-60
- Paint: < 50ms
- Long Tasks: < 2

Mobile:
- FPS: 50-60
- Paint: < 100ms
- Long Tasks: < 1
```

---

## 🚨 حالات طوارئ

### **إذا كان هناك خطأ حرج**:

1. **أعد تحديد الملفات الأساسية**:
```bash
# قائمة الملفات الأساسية التي يجب ألا تُحذف
- index.html
- script.js
- style.css
- manifest.webmanifest
- sw.js
```

2. **تحقق من الاتصال**:
```
- الإنترنت متصل ✓
- Firebase يستجيب ✓
- جميع الموارد تحملت ✓
```

3. **أخبر الفريق**:
```
البريد: support@labonejma.com
الوصف: Performance Issue on Chrome Mobile
الملفات: Screenshot + Console Errors
```

---

## ✅ قائمة تحقق نهائية

قبل الإبلاغ عن مشكلة:

- [ ] امسحت بيانات المتصفح (Cache)
- [ ] حدّثت Chrome إلى أحدث إصدار
- [ ] اختبرت على شبكة WiFi مستقرة
- [ ] أعدت تحميل الصفحة (Ctrl+Shift+R)
- [ ] اختبرت على متصفح آخر (Firefox, Safari)
- [ ] فعّلت Lite Mode وحاولت مجدداً
- [ ] التقطت لقطة شاشة أو فيديو للمشكلة
- [ ] نسخت رسائل الأخطاء من Console

---

## 🎁 نصائح إضافية

### **لتحسين الأداء أكثر**:
- أغلق التطبيقات الأخرى على الهاتف
- افصل VPN إن كنت تستخدمه
- استخدم شبكة WiFi بدلاً من بيانات الهاتف
- أعد تشغيل الهاتف إذا كان بطيئاً

### **لحفظ البيانات**:
```javascript
// استخدم Storage API
localStorage.setItem('key', 'value');
JSON.parse(localStorage.getItem('key'));
```

---

## 📚 قراءات إضافية

- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/)
- [Web Vitals](https://web.dev/vitals/)
- [Performance Best Practices](https://web.dev/performance/)

---

**آخر تحديث**: 01 مايو 2026
**الإصدار**: 5.1.0 + Performance Hotfix
**الحالة**: ✅ مستقر وآمن

🎯 **نحن هنا لمساعدتك!**
