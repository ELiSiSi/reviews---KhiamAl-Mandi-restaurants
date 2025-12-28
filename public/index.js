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

    // الحقول الإجبارية فقط: الاسم ورقم الهاتف
    if (!nameInput.value.trim()) {
      nameInput.classList.add('input-error');
      hasError = true;
    }

    if (!phoneInput.value.trim()) {
      phoneInput.classList.add('input-error');
      hasError = true;
    }

    // رقم الطاولة والخيمة اختياريين → مفيش تحقق عليهم خالص

    if (hasError) {
      message.textContent = '⚠️ من فضلك أدخل الاسم ورقم الهاتف';
      message.classList.add('show', 'error');
      setTimeout(() => message.classList.remove('show', 'error'), 4000);
      return;
    }

    const formData = new FormData(form);

   const data = {
     name: formData.get('name'),
     phone: formData.get('phone'),
     numGTables: formData.get('numGTables')
       ? Number(formData.get('numGTables'))
       : null,

     tent: formData.get('tent') || null,
     cashier: Number(formData.get('cashier')),
     cleanliness: Number(formData.get('cleanliness')),
     foodQuality: Number(formData.get('foodQuality')),
     service: Number(formData.get('service')),
     notes: formData.get('notes') || '',
   };

    console.log('📤 Sending data:', data);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
        message.textContent = '❌ حدث خطأ أثناء الإرسال.';
        message.classList.add('show', 'error');
      }

      setTimeout(
        () => message.classList.remove('show', 'success', 'error'),
        4000
      );
    } catch (error) {
      console.error('Fetch error:', error);
      message.textContent = '❌ فشل الاتصال: ' + error.message;
      message.classList.add('show', 'error');
      setTimeout(() => message.classList.remove('show', 'error'), 4000);
    }
  });
});
