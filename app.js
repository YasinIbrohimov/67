(function () {
  var $ = function (id) { return document.getElementById(id); };

  /* Tempo of the palms */
  $('tempo').addEventListener('input', function (e) {
    document.documentElement.style.setProperty('--dur', (3.6 - parseFloat(e.target.value)) + 's');
  });
  document.documentElement.style.setProperty('--dur', (3.6 - 1.2) + 's');

  /* Tap game */
  var count = 0, t0 = 0, done = false, BEST_KEY = 'tap67-best';
  function getBest() { try { var v = localStorage.getItem(BEST_KEY); return v ? parseFloat(v) : null; } catch (e) { return null; } }
  function setBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) {} }
  function fmt(s) { return s.toFixed(2).replace('.', ',') + ' с'; }
  function render() {
    $('count').textContent = count;
    $('bar').style.width = (count / 67 * 100) + '%';
    $('bar-wrap').setAttribute('aria-valuenow', count);
  }
  function idle() {
    var b = getBest();
    $('status').textContent = b ? 'Ждём первого нажатия. Лучшее время: ' + fmt(b) + '.' : 'Ждём первого нажатия.';
  }
  $('tap').addEventListener('click', function () {
    if (done) return;
    if (count === 0) t0 = performance.now();
    count++;
    render();
    if (count < 67) {
      $('status').textContent = 'Осталось ' + (67 - count) + '.';
    } else {
      done = true;
      var t = (performance.now() - t0) / 1000, b = getBest(), msg = 'Готово за ' + fmt(t) + '.';
      if (!b || t < b) { setBest(t); msg = 'Новый рекорд: ' + fmt(t) + '.'; }
      $('status').innerHTML = '<b>' + msg + '</b> Лучшее время: ' + fmt(getBest() || t) + '.';
    }
  });
  $('reset').addEventListener('click', function () { count = 0; done = false; render(); idle(); });
  render(); idle();

  /* Number lab */
  function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function primeIndex(n) { var c = 0; for (var i = 2; i <= n; i++) if (isPrime(i)) c++; return c; }
  function roman(n) {
    if (n < 1 || n > 3999) return 'только для 1–3999';
    var map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']], s = '';
    map.forEach(function (p) { while (n >= p[0]) { s += p[1]; n -= p[0]; } });
    return s;
  }
  function divisors(n) { var d = []; for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
  function plural(n, a, b, c) { var m = n % 100, k = n % 10; if (m > 10 && m < 20) return c; if (k === 1) return a; if (k >= 2 && k <= 4) return b; return c; }
  function lab() {
    var raw = parseInt($('num').value, 10), out = $('lab-out');
    if (isNaN(raw) || raw < 0 || raw > 999999) { out.innerHTML = '<div><dt>Ошибка</dt><dd>Введи целое число от 0 до 999 999.</dd></div>'; return; }
    var n = raw, prime = isPrime(n), rows = [];
    rows.push(['Простое?', prime ? 'Да, ' + primeIndex(n) + '-е по счёту' : 'Нет']);
    var dv = n === 0 ? [] : divisors(n);
    rows.push(['Делители', n === 0 ? 'любое число' : dv.length + ' ' + plural(dv.length, 'делитель', 'делителя', 'делителей') + ': ' + (dv.length > 12 ? dv.slice(0, 12).join(', ') + '…' : dv.join(', '))]);
    rows.push(['Двоичная запись', n.toString(2)]);
    rows.push(['Шестнадцатеричная', n.toString(16).toUpperCase()]);
    rows.push(['Римскими цифрами', roman(n)]);
    rows.push(['Задом наперёд', String(n).split('').reverse().join('')]);
    rows.push(['Сумма цифр', String(n).split('').reduce(function (a, d) { return a + +d; }, 0)]);
    rows.push(['Квадрат', (n * n).toLocaleString('ru-RU')]);
    rows.push(['Секунды в минутах', Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0')]);
    out.innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
  }
  $('num').addEventListener('input', lab);
  $('rand').addEventListener('click', function () { $('num').value = Math.floor(Math.random() * 1000000); lab(); });
  $('back67').addEventListener('click', function () { $('num').value = 67; lab(); });
  lab();

  /* Height */
  var TARGET = 6 * 30.48 + 7 * 2.54; /* 200.66 cm */
  function height() {
    var cm = parseInt($('h-cm').value, 10), inchesTotal = cm / 2.54, ft = Math.floor(inchesTotal / 12), inch = Math.round(inchesTotal - ft * 12);
    if (inch === 12) { ft++; inch = 0; }
    $('h-out').textContent = cm + ' см = ' + ft + '′' + inch + '″';
    var diff = Math.round(cm - TARGET), s;
    if (Math.abs(diff) <= 0) s = 'Это почти ровно 6′7″ (200,66 см).';
    else if (diff > 0) s = 'Выше 6′7″ примерно на ' + diff + ' см.';
    else s = 'До 6′7″ не хватает примерно ' + (-diff) + ' см.';
    $('h-sub').textContent = s;
  }
  $('h-cm').addEventListener('input', height);
  height();
})();