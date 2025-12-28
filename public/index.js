document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ratingForm');
  const message = document.getElementById('message');
  const nameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const numGTablesInput = document.getElementById('numGTablesInput');
  const tentInput = document.getElementById('tentInput');

  // تهيئة قيم الـ sliders عند التحميل
  ['cashier', 'cleanliness', 'foodQuality', 'service'].forEach((id) => {
    const slider = document.getElementById(id);
    const valueSpan = document.getElementById(id + 'Value');
    if (slider && valueSpan) {
      valueSpan.textContent = slider.value;
      slider.addEventListener('input', () => {
        valueSpan.textContent = slider.value;
      });
    }
  });

  // إزالة التحذير الأحمر عند الكتابة أو الاختيار
  nameInput.addEventListener('input', () =>
    nameInput.classList.remove('input-error')
  );
  phoneInput.addEventListener('input', () =>
    phoneInput.classList.remove('input-error')
  );
  numGTablesInput.addEventListener('input', () =>
    numGTablesInput.classList.remove('input-error')
  );
  tentInput.addEventListener('change', () =>
    tentInput.classList.remove('input-error')
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let hasError = false;

    // التحقق من الحقول الإجبارية فقط
    if (!nameInput.value.trim()) {
      nameInput.classList.add('input-error');
      hasError = true;
    }
    if (!phoneInput.value.trim()) {
      phoneInput.classList.add('input-error');
      hasError = true;
    }

    if (hasError) {
      message.textContent = '⚠️ من فضلك أدخل الاسم ورقم الهاتف';
      message.classList.add('show', 'error');
      setTimeout(() => message.classList.remove('show', 'error'), 4000);
      return;
    }

    // إنشاء FormData مرة واحدة فقط
    const formData = new FormData(form);

    console.log('📤 Sending data:', Object.fromEntries(formData));

    // دالة الإرسال مع retry تلقائي في حالة cold start على Vercel
    const sendForm = async () => {
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData, // بدون headers → المتصفح يضيف Content-Type تلقائي
        });

        if (response.ok) {
          message.textContent = '✅ تم إرسال التقييم بنجاح!';
          message.classList.add('show', 'success');
          form.reset();

          // إعادة تعيين قيم الـ sliders
          document
            .querySelectorAll('span[id$="Value"]')
            .forEach((span) => (span.textContent = '5'));
          ['cashier', 'cleanliness', 'foodQuality', 'service'].forEach((id) => {
            const slider = document.getElementById(id);
            if (slider) slider.value = 5;
          });
        } else {
          throw new Error(`Server responded with ${response.status}`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        message.textContent = '🔄 جاري المحاولة مرة أخرى...';
        message.classList.add('show', 'error');

        // retry بعد 4 ثواني (مفيد جداً مع cold starts على Vercel)
        setTimeout(sendForm, 4000);
      }

      // إخفاء الرسالة بعد 4 ثواني (فقط إذا كانت success)
      setTimeout(
        () => message.classList.remove('show', 'success', 'error'),
        4000
      );
    };

    // بدء الإرسال
    sendForm();
  });
});
