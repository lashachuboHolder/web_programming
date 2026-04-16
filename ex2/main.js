const checkAll = document.getElementById('checkAll');
const rowChecks = document.querySelectorAll('tbody input[type="checkbox"]');

function syncHeader() {
  const checked = [...rowChecks].filter(c => c.checked).length;
  if (checked === 0) {
    checkAll.checked = false;
    checkAll.indeterminate = false;
  } else {
    checkAll.checked = false;
    checkAll.indeterminate = true;
  }
}

checkAll.addEventListener('change', () => {
  rowChecks.forEach(c => c.checked = checkAll.checked);
});

rowChecks.forEach(c => c.addEventListener('change', syncHeader));

syncHeader();
