document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ratingForm');
  const message = document.getElementById('message');
  const nameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const numGTablesInput = document.getElementById('numGTablesInput');

  // عرض القيمة الحالية لكل slider
  ['cashier', 'cleanliness', 'foodQuality', 'service'].forEach((id) => {
    const slider = document.getElementById(id);
    const valueSpan = document.getElementById(id + 'Value');
    slider.addEventListener('input', () => {
      valueSpan.textContent = slider.value;
    });
  });

  // إزالة التحذير الأحمر عند الكتابة
  nameInput.addEventListener('input', () => {
    nameInput.classList.remove('input-error');
  });

  phoneInput.addEventListener('input', () => {
    phoneInput.classList.remove('input-error');
  });

  numGTablesInput.addEventListener('input', () => {
    numGTablesInput.classList.remove('input-error');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // التحقق من الحقول المطلوبة
    let hasError = false;

    if (!nameInput.value.trim()) {
      nameInput.classList.add('input-error');
      hasError = true;
    }

    if (!phoneInput.value.trim()) {
      phoneInput.classList.add('input-error');
      hasError = true;
    }

    if (!numGTablesInput.value.trim()) {
      numGTablesInput.classList.add('input-error');
      hasError = true;
    }

    if (hasError) {
      message.textContent = '⚠️ من فضلك أدخل الاسم و رقم الهاتف ورقم الطاولة';
      message.classList.add('show', 'error');
      setTimeout(() => {
        message.classList.remove('show', 'error');
      }, 3000);
      return;
    }

    const formData = new FormData(form);

    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      numGTables: formData.get('numGTables'),
      cashier: formData.get('cashier'),
      cleanliness: formData.get('cleanliness'),
      foodQuality: formData.get('foodQuality'),
      service: formData.get('service'),
      notes: formData.get('notes') || '',
    };

    console.log('📤 Sending data:', data);

    try {
      // ⛳ استخدام action من الفورم (المسار الصحيح تلقائيًا)
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        message.textContent = '✅ تم إرسال التقييم بنجاح!';
        message.classList.add('show', 'success');
        form.reset();

        document
          .querySelectorAll('span[id$="Value"]')
          .forEach((span) => (span.textContent = '5'));
      } else {
        message.textContent = '❌ حدث خطأ أثناء الإرسال.';
        message.classList.add('show', 'error');
      }

      setTimeout(() => {
        message.classList.remove('show', 'success', 'error');
      }, 3000);
    } catch (error) {
      message.textContent = '❌ حدث خطأ: ' + error.message;
      message.classList.add('show', 'error');

      setTimeout(() => {
        message.classList.remove('show', 'error');
      }, 3000);
    }
  });
});
