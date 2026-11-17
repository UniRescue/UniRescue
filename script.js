(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Smooth Scroll Engine (Cubic-Bezier Easing)
   * ------------------------------------------------------------------ */
  function smoothScrollTo(targetY, duration) {
    var startY = window.pageYOffset;
    var difference = targetY - startY;
    var startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    }

    function step(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var ease = easeOutQuart(progress);

      window.scrollTo(0, startY + difference * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // Bắt sự kiện click anchor link mượt mà
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute('href');
    if (hash === '#' || hash === '#top') {
      e.preventDefault();
      smoothScrollTo(0, 700);
      return;
    }

    var targetEl = document.querySelector(hash);
    if (targetEl) {
      e.preventDefault();
      var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
      smoothScrollTo(targetPosition, 750);
    }
  });

  /* ------------------------------------------------------------------ *
   * Scroll Reveal Observer
   * ------------------------------------------------------------------ */
  var revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  /* ------------------------------------------------------------------ *
   * Pointer effects: soft glow that follows the mouse + click ring.
   * The native cursor is kept (arrow / hand), nothing replaces it.
   * ------------------------------------------------------------------ */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    var gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy;

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add('is-on');
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', function () {
      glow.classList.remove('is-on');
    });

    (function follow() {
      gx += (tx - gx) * 0.14;
      gy += (ty - gy) * 0.14;
      glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
      requestAnimationFrame(follow);
    })();

    var clickable = 'a, button, input, select, textarea, label, summary, [role="button"], .chip, .jump, .card, .card-cta';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(clickable)) document.body.classList.add('pointer-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(clickable)) document.body.classList.remove('pointer-hover');
    });

    document.addEventListener('mousedown', function (e) {
      var ring = document.createElement('span');
      ring.className = 'click-ring';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
      document.body.appendChild(ring);
      setTimeout(function () { ring.remove(); }, 700);
    });
  }

  /* ------------------------------------------------------------------ *
   * Data
   * ------------------------------------------------------------------ */
  var PRODUCTS = [
    {
      id: 1,
      name: 'Combo vượt cạn phòng thi',
      cat: 'urgent',
      catLabel: 'Thi & thuyết trình',
      price: 18000,
      unit: '/ combo',
      billing: 'once',
      detail: 'Casio, bút chì, gôm, thước kẻ và pin dự phòng.',
      image: 'https://images.pexels.com/photos/7111550/pexels-photo-7111550.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Máy tính, bút chì và giấy nhớ trên bàn học'
    },
    {
      id: 2,
      name: 'Máy tính Casio fx-880BTG',
      cat: 'urgent',
      catLabel: 'Thi & thuyết trình',
      price: 15000,
      unit: '/ ngày',
      billing: 'daily',
      detail: 'Kèm nắp bảo vệ, pin đã kiểm tra trước khi giao.',
      image: 'https://images.pexels.com/photos/8250936/pexels-photo-8250936.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Máy tính khoa học'
    },
    {
      id: 3,
      name: 'Sạc laptop USB-C 65W',
      cat: 'power',
      catLabel: 'Sạc & pin',
      price: 22000,
      unit: '/ ngày',
      billing: 'daily',
      detail: 'USB-C Power Delivery 65W kèm cáp; kiểm tra công suất máy trước khi thuê.',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      alt: 'Củ sạc USB-C kèm cáp'
    },
    {
      id: 4,
      name: 'Bút trình chiếu không dây',
      cat: 'urgent',
      catLabel: 'Thi & thuyết trình',
      price: 18000,
      unit: '/ ngày',
      billing: 'daily',
      detail: 'Kèm đầu thu USB; điều khiển slide và đánh dấu nội dung.',
      image: 'https://images.pexels.com/photos/33797485/pexels-photo-33797485.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Điều khiển trình chiếu cầm tay'
    },
    {
      id: 5,
      name: 'Pin AA / AAA dự phòng',
      cat: 'power',
      catLabel: 'Sạc & pin',
      price: 8000,
      unit: '/ bộ',
      billing: 'once',
      detail: 'Chọn cỡ AA hoặc AAA; tính phí một lần theo bộ.',
      image: 'https://images.pexels.com/photos/6015268/pexels-photo-6015268.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Bộ pin AA trên nền sáng'
    },
    {
      id: 6,
      name: 'Ổ cắm điện 3 chấu',
      cat: 'extras',
      catLabel: 'Kết nối & ổ cắm',
      price: 10000,
      unit: '/ ngày',
      billing: 'daily',
      detail: 'Dây nguồn gọn, kiểm tra an toàn trước khi giao.',
      image: 'https://images.pexels.com/photos/16886334/pexels-photo-16886334.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Ổ cắm điện nhiều chấu'
    },
    {
      id: 7,
      name: 'Hub chuyển đổi USB-C',
      cat: 'extras',
      catLabel: 'Kết nối & ổ cắm',
      price: 20000,
      unit: '/ ngày',
      billing: 'daily',
      detail: 'Cổng HDMI, USB-A và USB-C; kiểm tra cổng máy trước khi thuê.',
      image: 'https://images.unsplash.com/photo-1760376789487-994070337c76?auto=format&fit=crop&w=800&q=80',
      alt: 'Hub chuyển đổi USB-C nhiều cổng'
    }
  ];

  var CATEGORIES = [
    { id: 'all', label: 'Tất cả' },
    { id: 'urgent', label: 'Thi & thuyết trình' },
    { id: 'power', label: 'Sạc & pin' },
    { id: 'extras', label: 'Kết nối & ổ cắm' }
  ];

  var PROMO_CODES = { SV10: 10 };

  /* ------------------------------------------------------------------ *
   * State
   * ------------------------------------------------------------------ */
  var cart = {};
  var days = 1;
  var promo = null;
  var category = 'all';
  var step = 'items';
  var lastFocused = null;
  var hasReceipt = false;
  try { var saved = JSON.parse(sessionStorage.getItem('ur-cart') || 'null'); if (saved) { cart = saved.cart || {}; days = saved.days || 1; promo = saved.promo || null; } } catch (err) {}

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function formatVND(value) {
    return Math.round(value).toLocaleString('vi-VN') + 'đ';
  }

  function productById(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === Number(id)) return PRODUCTS[i];
    }
    return null;
  }

  function cartCount() {
    return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id]; }, 0);
  }

  function lineTotal(product, qty) {
    return product.price * qty * (product.billing === 'daily' ? days : 1);
  }

  function totals() {
    var rent = 0;
    Object.keys(cart).forEach(function (id) {
      var p = productById(id);
      if (p) rent += lineTotal(p, cart[id]);
    });
    var discount = promo ? Math.round(rent * promo.percent / 100) : 0;
    return { rent: rent, discount: discount, grand: rent - discount };
  }

  /* ------------------------------------------------------------------ *
   * Product Grid
   * ------------------------------------------------------------------ */
  function matches(product, query) {
    if (category !== 'all' && product.cat !== category) return false;
    if (!query) return true;
    var haystack = [product.name, product.detail, product.catLabel, product.unit].join(' ').toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function cardHTML(product) {
    return '' +
      '<article class="card" id="product-' + product.id + '" data-id="' + product.id + '">' +
        '<div class="card-media aspect-[4/3]">' +
          '<img src="' + product.image + '" alt="' + product.alt + '" width="600" height="450" loading="lazy" decoding="async" onerror="this.style.visibility=\'hidden\'">' +
          '<span class="card-badge">' + product.catLabel + '</span>' +
        '</div>' +
        '<div class="flex flex-1 flex-col p-4">' +
          '<h3 class="text-[15px] font-semibold leading-snug text-slate-900">' + product.name + '</h3>' +
          '<p class="mt-1.5 clamp-2 text-[12.5px] leading-relaxed text-slate-500">' + product.detail + '</p>' +
          '<div class="mt-4 flex items-end justify-between gap-3 border-t border-slate-200/70 pt-3">' +
            '<p class="leading-tight">' +
              '<span class="text-[15px] font-semibold tabular-nums text-slate-900">' + formatVND(product.price) + '</span>' +
              '<span class="ml-0.5 text-[12px] text-slate-400">' + product.unit + '</span>' +
            '</p>' +
            '<button type="button" class="card-cta" data-add="' + product.id + '">' +
              '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-plus"/></svg>' +
              'Thêm vào giỏ<span class="sr-only"> — ' + product.name + '</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderProducts() {
    if (!$('#product-grid')) return;
    var query = ($('#search-input').value || '').trim().toLowerCase();
    var list = PRODUCTS.filter(function (p) { return matches(p, query); });

    $('#product-grid').innerHTML = list.map(cardHTML).join('');
    $('#empty-state').classList.toggle('hidden', list.length > 0);
    $('#result-count').textContent = list.length + ' thiết bị' +
      (list.length === PRODUCTS.length ? ' đang cho thuê' : ' khớp bộ lọc');
  }

  function renderFilters() {
    if (!$('#filters')) return;
    $('#filters').innerHTML = CATEGORIES.map(function (cat) {
      var count = cat.id === 'all'
        ? PRODUCTS.length
        : PRODUCTS.filter(function (p) { return p.cat === cat.id; }).length;

      return '<button type="button" class="chip" data-cat="' + cat.id + '" aria-pressed="' +
        (category === cat.id ? 'true' : 'false') + '">' +
        cat.label + '<span class="chip-count">' + count + '</span></button>';
    }).join('');
  }

  function setCategory(next) {
    category = next;
    renderFilters();
    renderProducts();
  }

  /* ------------------------------------------------------------------ *
   * Cart Rendering
   * ------------------------------------------------------------------ */
  function cartRowHTML(product, qty) {
    var daily = product.billing === 'daily';
    var calc = daily
      ? formatVND(product.price) + ' × ' + days + ' ngày × ' + qty
      : formatVND(product.price) + ' × ' + qty + ' ' + product.unit.replace('/', '').trim();

    return '' +
      '<div class="flex gap-3 border-b border-slate-200/70 py-4 first:pt-0">' +
        '<img src="' + product.image + '" alt="" width="56" height="56" loading="lazy" decoding="async" class="h-14 w-14 shrink-0 rounded-lg border border-slate-200/70 object-cover">' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex items-start justify-between gap-2">' +
            '<p class="text-[13px] font-medium leading-snug text-slate-900">' + product.name + '</p>' +
            '<button type="button" data-remove="' + product.id + '" class="-mr-1 -mt-1 shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">' +
              '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-trash"/></svg>' +
              '<span class="sr-only">Xóa ' + product.name + '</span>' +
            '</button>' +
          '</div>' +
          '<p class="mt-0.5 text-[11.5px] tabular-nums text-slate-500">' + calc + '</p>' +
          '<div class="mt-2.5 flex items-center justify-between gap-3">' +
            '<div class="inline-flex items-center rounded-lg border border-slate-200">' +
              '<button type="button" data-qty="' + product.id + '" data-delta="-1" class="grid h-9 w-9 place-items-center rounded-l-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">' +
                '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-minus"/></svg>' +
                '<span class="sr-only">Giảm số lượng ' + product.name + '</span>' +
              '</button>' +
              '<span class="w-7 text-center text-[12.5px] font-medium tabular-nums text-slate-900" aria-live="polite">' + qty + '</span>' +
              '<button type="button" data-qty="' + product.id + '" data-delta="1" class="grid h-9 w-9 place-items-center rounded-r-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">' +
                '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-plus"/></svg>' +
                '<span class="sr-only">Tăng số lượng ' + product.name + '</span>' +
              '</button>' +
            '</div>' +
            '<span class="text-[13px] font-semibold tabular-nums text-slate-900">' + formatVND(lineTotal(product, qty)) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderCart() {
    try { sessionStorage.setItem('ur-cart', JSON.stringify({ cart: cart, days: days, promo: promo })); } catch (err) {}
    var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });
    var count = cartCount();
    var sum = totals();

    $('#cart-badge').textContent = count;
    $('#cart-badge-sr').textContent = count + ' thiết bị trong giỏ';
    $('#cart-count-label').textContent = count + ' món';

    $('#cart-items').innerHTML = ids.map(function (id) {
      return cartRowHTML(productById(id), cart[id]);
    }).join('');

    var isEmpty = ids.length === 0;
    $('#cart-empty').classList.toggle('hidden', !isEmpty);
    $('#cart-controls').classList.toggle('hidden', isEmpty);

    $('#total-rent').textContent = formatVND(sum.rent);
    $('#total-discount').textContent = '−' + formatVND(sum.discount);
    $('#total-discount-row').classList.toggle('hidden', !promo);
    $('#discount-code').textContent = promo ? '(' + promo.code + ')' : '';
    $('#total-grand').textContent = formatVND(sum.grand);
    $('#footer-total').textContent = formatVND(sum.grand);

    applyPaymentLabels(isEmpty);
  }

  function applyPaymentLabels(isEmpty) {
    var primary = $('#cart-primary');

    if (step === 'items') {
      primary.innerHTML = 'Tiếp tục nhập thông tin' +
        '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-arrow-right"/></svg>';
      primary.disabled = isEmpty;
    } else if (step === 'checkout') {
      primary.innerHTML = 'Gửi yêu cầu thuê';
      primary.disabled = false;
    }
  }

  /* ------------------------------------------------------------------ *
   * Cart Actions
   * ------------------------------------------------------------------ */
  function addToCart(id) {
    if (hasReceipt) {
      hasReceipt = false;
      $('#order-receipt').innerHTML = '';
      step = 'items';
      $('#cart-step-success').classList.add('hidden');
      $('#cart-step-items').classList.remove('hidden');
      $('#cart-footer').classList.remove('hidden');
      $('#cart-title').textContent = 'Giỏ thuê';
    }
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    var product = productById(id);
    showToast('Đã thêm “' + product.name + '” vào giỏ thuê.', 'Xem giỏ', openCart);
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    renderCart();
  }

  function removeItem(id) {
    delete cart[id];
    renderCart();
  }

  function applyPromo() {
    var input = $('#promo-input');
    var msg = $('#promo-msg');
    var code = (input.value || '').trim().toUpperCase();

    if (!code) {
      promo = null;
      msg.textContent = 'Nhập mã ưu đãi sinh viên (VD: SV10 — giảm 10% tiền thuê).';
      renderCart();
      return;
    }
    if (PROMO_CODES[code]) {
      promo = { code: code, percent: PROMO_CODES[code] };
      input.value = '';
      msg.textContent = 'Đã áp dụng ' + code + ' — giảm ' + promo.percent + '% tiền thuê.';
      msg.style.color = '#4338ca';
      renderCart();
      return;
    }
    promo = null;
    msg.textContent = 'Mã “' + code + '” không tồn tại hoặc đã hết hạn.';
    msg.style.color = '#b91c1c';
    renderCart();
  }

  /* ------------------------------------------------------------------ *
   * Drawer
   * ------------------------------------------------------------------ */
  function lockScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  function openCart() {
    lastFocused = document.activeElement;
    var root = $('#cart-root');
    root.classList.remove('hidden');
    lockScroll(true);
    requestAnimationFrame(function () { root.classList.add('is-open'); });
    setStep(hasReceipt ? 'success' : 'items');
    setTimeout(function () { $('#cart-close').focus(); }, 60);
  }

  function closeCart() {
    var root = $('#cart-root');
    root.classList.remove('is-open');
    lockScroll(false);
    setTimeout(function () {
      root.classList.add('hidden');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }, 280);
  }

  function setStep(next) {
    step = next;
    $('#cart-step-items').classList.toggle('hidden', next !== 'items');
    $('#cart-step-checkout').classList.toggle('hidden', next !== 'checkout');
    $('#cart-step-success').classList.toggle('hidden', next !== 'success');

    $('#cart-title').textContent =
      next === 'checkout' ? 'Thông tin nhận' :
      next === 'success' ? 'Yêu cầu thuê' : 'Giỏ thuê';

    var footer = $('#cart-footer');
    footer.classList.toggle('hidden', next === 'success');

    $('#back-to-items').classList.toggle('hidden', next !== 'checkout');
    $('#cart-body').scrollTop = 0;

    applyPaymentLabels(cartCount() === 0);
  }

  function goCheckout() {
    if (cartCount() === 0) return;
    setStep('checkout');
    setTimeout(function () { $('#cust-student-id').focus(); }, 80);
  }

  /* ------------------------------------------------------------------ *
   * Order Placement
   * ------------------------------------------------------------------ */
  function receiptItemHTML(product, qty) {
    var suffix = product.billing === 'daily' ? ' · ' + days + ' ngày' : ' · ' + product.unit.replace('/', '').trim();
    return '<li class="flex items-baseline justify-between gap-3 py-1">' +
      '<span class="text-slate-600">' + qty + ' × ' + product.name + suffix + '</span>' +
      '<span class="shrink-0 font-medium tabular-nums text-slate-900">' + formatVND(lineTotal(product, qty)) + '</span>' +
      '</li>';
  }

  function placeOrder() {
    var form = $('#checkout-form');
    if (!form.reportValidity()) return;

    var snapshot = {
      id: 'UR-' + Math.floor(100000 + Math.random() * 900000),
      studentId: $('#cust-student-id').value.trim(),
      name: $('#cust-name').value.trim(),
      phone: $('#cust-phone').value.trim(),
      location: $('#cust-location').value.trim(),
      payment: $('#cust-payment').value,
      days: days,
      items: Object.keys(cart).map(function (id) {
        return { product: productById(id), qty: cart[id] };
      }),
      totals: totals(),
      promo: promo
    };

    var rows = snapshot.items.map(function (item) {
      return receiptItemHTML(item.product, item.qty);
    }).join('');

    $('#order-receipt').innerHTML = '' +
      '<div class="divide-y divide-slate-200/70 border-b border-slate-200/70 px-4 py-1 text-[12.5px]">' +
        '<div class="flex items-baseline justify-between gap-3 py-2.5">' +
          '<span class="text-slate-500">Mã yêu cầu</span>' +
          '<span class="font-semibold tabular-nums text-slate-900">' + snapshot.id + '</span>' +
        '</div>' +
        '<div class="flex items-baseline justify-between gap-3 py-2.5">' +
          '<span class="text-slate-500">Người thuê</span>' +
          '<span class="text-right font-medium text-slate-900">' + snapshot.name + ' · ' + snapshot.studentId + '</span>' +
        '</div>' +
        '<div class="flex items-baseline justify-between gap-3 py-2.5">' +
          '<span class="text-slate-500">Điểm hẹn</span>' +
          '<span class="text-right font-medium text-slate-900">' + snapshot.location + '</span>' +
        '</div>' +
        '<div class="flex items-baseline justify-between gap-3 py-2.5">' +
          '<span class="text-slate-500">Thời hạn</span>' +
          '<span class="font-medium text-slate-900">' + snapshot.days + ' ngày</span>' +
        '</div>' +
        '<div class="flex items-baseline justify-between gap-3 py-2.5">' +
          '<span class="text-slate-500">Phương thức thanh toán</span>' +
          '<span class="text-right font-medium text-slate-900">' + snapshot.payment + '</span>' +
        '</div>' +
      '</div>' +
      '<ul class="border-b border-slate-200/70 px-4 py-3 text-[12.5px]">' + rows + '</ul>' +
      '<dl class="space-y-1.5 px-4 py-3 text-[12.5px]">' +
        '<div class="flex items-baseline justify-between gap-3">' +
          '<dt class="text-slate-500">Tiền thuê</dt>' +
          '<dd class="font-medium tabular-nums text-slate-900">' + formatVND(snapshot.totals.rent) + '</dd>' +
        '</div>' +
        (snapshot.promo
          ? '<div class="flex items-baseline justify-between gap-3">' +
              '<dt class="text-slate-500">Giảm giá (' + snapshot.promo.code + ')</dt>' +
              '<dd class="font-medium tabular-nums text-indigo-600">−' + formatVND(snapshot.totals.discount) + '</dd>' +
            '</div>'
          : '') +
        '<div class="flex items-baseline justify-between gap-3 border-t border-slate-200/70 pt-2">' +
          '<dt class="font-medium text-slate-900">Tổng thanh toán</dt>' +
          '<dd class="text-[14px] font-semibold tabular-nums text-slate-900">' + formatVND(snapshot.totals.grand) + '</dd>' +
        '</div>' +
      '</dl>';

    setStep('success');
    hasReceipt = true;
    cart = {};
    renderCart();
  }

  function resetFlow() {
    cart = {};
    promo = null;
    days = 1;
    $('#rental-days').value = '1';
    $('#promo-input').value = '';
    $('#promo-msg').textContent = 'Nhập mã ưu đãi sinh viên (VD: SV10 — giảm 10% tiền thuê).';
    $('#promo-msg').style.color = '';
    $('#checkout-form').reset();
    renderCart();
    setStep('items');
    hasReceipt = false;
    closeCart();
  }

  /* ------------------------------------------------------------------ *
   * Toast
   * ------------------------------------------------------------------ */
  var toastTimer = null;

  function showToast(message, actionLabel, action) {
    var toast = $('#toast');
    var actionBtn = $('#toast-action');

    $('#toast-message').textContent = message;

    if (actionLabel) {
      actionBtn.textContent = actionLabel;
      actionBtn.classList.remove('hidden');
      actionBtn.onclick = function () {
        if (action) action();
        hideToast();
      };
    } else {
      actionBtn.classList.add('hidden');
    }

    toast.classList.remove('hidden');
    requestAnimationFrame(function () { toast.classList.add('is-visible'); });

    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4200);
  }

  function hideToast() {
    var toast = $('#toast');
    toast.classList.remove('is-visible');
    setTimeout(function () { toast.classList.add('hidden'); }, 300);
  }

  /* ------------------------------------------------------------------ *
   * Event Listeners
   * ------------------------------------------------------------------ */
  document.addEventListener('click', function (event) {
    var addBtn = event.target.closest('[data-add]');
    if (addBtn) { addToCart(addBtn.getAttribute('data-add')); return; }

    var qtyBtn = event.target.closest('[data-qty]');
    if (qtyBtn) {
      changeQty(qtyBtn.getAttribute('data-qty'), Number(qtyBtn.getAttribute('data-delta')));
      return;
    }

    var removeBtn = event.target.closest('[data-remove]');
    if (removeBtn) { removeItem(removeBtn.getAttribute('data-remove')); return; }

    var chip = event.target.closest('.chip');
    if (chip) { setCategory(chip.getAttribute('data-cat')); return; }

    var jump = event.target.closest('.jump');
    if (jump) {
      if (!document.getElementById('product-grid')) { window.location.href = 'thiet-bi.html#product-' + jump.getAttribute('data-target'); return; }
      if (category !== 'all' || $('#search-input').value.trim()) {
        category = 'all';
        $('#search-input').value = '';
        renderFilters();
        renderProducts();
      }
      var card = document.getElementById('product-' + jump.getAttribute('data-target'));
      if (card) {
        var cardPos = card.getBoundingClientRect().top + window.pageYOffset - 120;
        smoothScrollTo(cardPos, 800);
        card.classList.add('is-highlight');
        setTimeout(function () { card.classList.remove('is-highlight'); }, 2000);
        var cta = card.querySelector('[data-add]');
        if (cta) setTimeout(function () { cta.focus({ preventScroll: true }); }, 650);
      }
    }
  });

  if ($('#search-input')) $('#search-input').addEventListener('input', renderProducts);

  if ($('#reset-filters')) $('#reset-filters').addEventListener('click', function () {
    category = 'all';
    $('#search-input').value = '';
    renderFilters();
    renderProducts();
  });

  $('#cart-open').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#cart-overlay').addEventListener('click', closeCart);

  $('#cart-empty-action').addEventListener('click', function () {
    closeCart();
    setTimeout(function () {
      var prodSection = document.getElementById('products');
      if (!prodSection) { window.location.href = 'thiet-bi.html'; return; }
      if (prodSection) {
        var top = prodSection.getBoundingClientRect().top + window.pageYOffset - 80;
        smoothScrollTo(top, 700);
      }
    }, 280);
  });

  $('#rental-days').addEventListener('change', function (event) {
    days = Number(event.target.value);
    renderCart();
  });

  $('#promo-apply').addEventListener('click', applyPromo);
  $('#promo-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') { event.preventDefault(); applyPromo(); }
  });

  $('#back-to-items').addEventListener('click', function () { setStep('items'); });

  $('#cart-primary').addEventListener('click', function () {
    if (step === 'items') { goCheckout(); return; }
    if (step === 'checkout') { placeOrder(); }
  });

  $('#checkout-form').addEventListener('submit', function (event) {
    event.preventDefault();
    placeOrder();
  });

  var successReset = document.createElement('button');
  successReset.type = 'button';
  successReset.className = 'btn btn-secondary mt-6 w-full';
  successReset.textContent = 'Tiếp tục chọn thiết bị';
  successReset.addEventListener('click', resetFlow);
  $('#cart-step-success').appendChild(successReset);

  if ($('#feedback-form')) $('#feedback-form').addEventListener('submit', function (event) {
    event.preventDefault();
    if (!event.target.reportValidity()) return;
    event.target.reset();
    showToast('Cảm ơn bạn đã gửi ý kiến đóng góp!');
  });

  $('#menu-toggle').addEventListener('click', function () {
    var menu = $('#mobile-menu');
    var open = menu.classList.toggle('hidden') === false;
    this.setAttribute('aria-expanded', String(open));
  });

  $$('#mobile-menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      $('#mobile-menu').classList.add('hidden');
      $('#menu-toggle').setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', function (event) {
    if ($('#cart-root').classList.contains('hidden')) return;

    if (event.key === 'Escape') {
      closeCart();
      return;
    }

    if (event.key === 'Tab') {
      var focusables = Array.prototype.filter.call(
        document.querySelectorAll('#cart-panel button, #cart-panel input, #cart-panel select, #cart-panel textarea, #cart-panel a[href]'),
        function (el) { return !el.disabled && el.offsetParent !== null; }
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  var header = $('#site-header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 12) header.classList.add('shadow-hair');
    else header.classList.remove('shadow-hair');
  }, { passive: true });

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */
  renderFilters();
  renderProducts();
  renderCart();
  setStep('items');
  $('#rental-days').value = String(days);

  if (location.hash.indexOf('#product-') === 0) {
    var hc = document.querySelector(location.hash);
    if (hc) setTimeout(function () {
      smoothScrollTo(hc.getBoundingClientRect().top + window.pageYOffset - 120, 800);
      hc.classList.add('is-highlight');
      setTimeout(function () { hc.classList.remove('is-highlight'); }, 2000);
    }, 400);
  }
})();

/* ------------------------------------------------------------------ *
 * Visual effects + laptop repair booking
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Scroll progress bar */
  var bar = document.getElementById('scroll-progress');
  var ticking = false;

  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.setProperty('--p', p.toFixed(4));
    ticking = false;
  }

  if (bar) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* Hero headline: reveal word by word */
  var h1 = document.querySelector('main h1');
  if (h1 && !reduceMotion) {
    var text = h1.textContent.trim().replace(/\s+/g, ' ');
    h1.setAttribute('aria-label', text);
    h1.innerHTML = text.split(' ').map(function (word, i) {
      return '<span class="hw" aria-hidden="true"><span style="--d:' +
        (0.12 + i * 0.07).toFixed(2) + 's">' + word + '</span></span>';
    }).join(' ');
  }

  /* Cards: cursor spotlight + subtle 3D tilt */
  if (canHover) {
    var activeCard = null;

    function resetCard(card) {
      if (!card) return;
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    }

    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest ? e.target.closest('.card') : null;
      if (card !== activeCard) {
        resetCard(activeCard);
        activeCard = card;
      }
      if (!card) return;

      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');

      if (!reduceMotion) {
        card.style.setProperty('--ry', (((x / r.width) - 0.5) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (((y / r.height) - 0.5) * -7).toFixed(2) + 'deg');
      }
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', function () {
      resetCard(activeCard);
      activeCard = null;
    });
  }

  /* Click ripple on buttons */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.btn, .card-cta') : null;
    if (!btn || btn.disabled || reduceMotion) return;

    var r = btn.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2;
    var cx = e.detail === 0 ? r.width / 2 : e.clientX - r.left;
    var cy = e.detail === 0 ? r.height / 2 : e.clientY - r.top;

    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (cx - size / 2) + 'px';
    ripple.style.top = (cy - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 700);
  });

  /* AI / repair CTAs: prefill the contact form (go to lien-he.html if the form is not on this page) */
  function prefillMessage(text) {
    var msg = document.getElementById('fb-message');
    if (!msg) {
      try { sessionStorage.setItem('ur-prefill', text); } catch (err) {}
      window.location.href = 'lien-he.html';
      return;
    }
    msg.value = text;
    msg.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    setTimeout(function () {
      msg.focus({ preventScroll: true });
      msg.setSelectionRange(msg.value.length, msg.value.length);
    }, 600);
  }

  document.addEventListener('click', function (e) {
    var ai = e.target.closest ? e.target.closest('[data-ai]') : null;
    if (ai) { prefillMessage('Tôi muốn thuê tài khoản ' + ai.getAttribute('data-ai') + '.\nSố tháng: \nMục đích sử dụng: '); return; }
    var rp = e.target.closest ? e.target.closest('[data-repair]') : null;
    if (rp) prefillMessage('Tôi muốn đặt lịch sửa laptop: ' + rp.getAttribute('data-repair') + '.\nTình trạng máy: ');
  });

  try {
    var pre = sessionStorage.getItem('ur-prefill');
    if (pre && document.getElementById('fb-message')) {
      sessionStorage.removeItem('ur-prefill');
      setTimeout(function () { prefillMessage(pre); }, 500);
    }
  } catch (err) {}

  /* Highlight the current page in the nav */
  var here = location.pathname.split('/').pop() || 'index.html';
  Array.prototype.forEach.call(document.querySelectorAll('#site-header nav a[href]'), function (a) {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });
})();
