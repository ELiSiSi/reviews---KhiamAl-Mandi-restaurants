document.addEventListener('DOMContentLoaded', () => {
  const filterBtn = document.getElementById('filterBtn');
  const resetBtn = document.getElementById('resetBtn');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const tableBody = document.getElementById('ratingsTableBody');
  const totalCount = document.getElementById('totalCount');
  const avgRating = document.getElementById('avgRating');

  if (!tableBody || !totalCount || !avgRating || !filterBtn || !resetBtn) {
    console.error('عناصر الصفحة مش موجودة!');
    return;
  }

  // حفظ القيم والـ HTML الأصلي
  const originalTotal = totalCount.textContent.trim();
  const originalAvg = avgRating.textContent.trim();
  const originalTableHTML = tableBody.innerHTML.trim();

  // حفظ الصفوف الأصلية (كـ nodes حقيقية)
  const originalRows = Array.from(tableBody.querySelectorAll('tr'));

  // دالة لإرجاع الجدول الأصلي
  const restoreOriginalTable = () => {
    tableBody.innerHTML = originalTableHTML;
  };

  // دالة الفلترة
  const applyFilter = () => {
    const startDate = startDateInput.value
      ? new Date(startDateInput.value)
      : null;
    const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999);

    // إرجاع الجدول الأصلي أولاً (مهم جدًا!)
    restoreOriginalTable();

    const rows = Array.from(tableBody.querySelectorAll('tr')).filter(
      (row) => !row.querySelector('.no-data')
    );

    let visibleCount = 0;
    let totalAvg = 0;
    let hasVisibleRows = false;

    rows.forEach((row) => {
      const rowDate = new Date(row.getAttribute('data-date'));
      const shouldShow =
        (!startDate || rowDate >= startDate) &&
        (!endDate || rowDate <= endDate);

      if (shouldShow) {
        row.style.display = '';
        visibleCount++;
        const avgCell = row.querySelector('.average');
        if (avgCell) totalAvg += parseFloat(avgCell.textContent);
        hasVisibleRows = true;
      } else {
        row.style.display = 'none';
      }
    });

    totalCount.textContent = visibleCount;
    avgRating.textContent =
      visibleCount > 0 ? (totalAvg / visibleCount).toFixed(1) + '/10' : '-';

    if (!hasVisibleRows) {
      tableBody.innerHTML =
        '<tr><td colspan="11" class="no-data">لا توجد تقييمات في هذه الفترة</td></tr>';
    }
  };

  // البحث
  filterBtn.addEventListener('click', applyFilter);

  // إعادة التعيين
  resetBtn.addEventListener('click', () => {
    startDateInput.value = '';
    endDateInput.value = '';
    restoreOriginalTable();
    totalCount.textContent = originalTotal;
    avgRating.textContent = originalAvg;
  });
});


