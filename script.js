(function () {
  "use strict";

  /* ---------- ano no rodapé ---------- */
  var anoEl = document.getElementById("ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ---------- menu mobile ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- render da galeria a partir de TRABALHOS ---------- */
  var gallery = document.getElementById("gallery");

  function cardHTML(item, index) {
    return (
      '<article class="card" data-categoria="' + item.categoria + '" data-index="' + index + '" tabindex="0" role="button" aria-label="Ver detalhes: ' + item.titulo + '">' +
        '<div class="card-media ' + item.tone + '">' +
          '<span class="card-tag">' + item.categoriaLabel + '</span>' +
          '<div class="grain-layer" aria-hidden="true"></div>' +
          item.icon +
        '</div>' +
        '<div class="card-body">' +
          '<h3>' + item.titulo + '</h3>' +
          '<div class="card-specs">' +
            '<span><b>Material</b> ' + item.material + '</span>' +
            '<span><b>Medidas</b> ' + item.medidas + '</span>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  if (gallery && typeof TRABALHOS !== "undefined") {
    gallery.innerHTML = TRABALHOS.map(cardHTML).join("");
  }

  /* ---------- filtro por categoria ---------- */
  var filters = document.getElementById("filters");
  var cards = gallery ? Array.prototype.slice.call(gallery.querySelectorAll(".card")) : [];

  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-chip");
      if (!btn) return;

      filters.querySelectorAll(".filter-chip").forEach(function (c) {
        c.classList.remove("is-active");
      });
      btn.classList.add("is-active");

      var alvo = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var mostra = alvo === "todos" || card.getAttribute("data-categoria") === alvo;
        card.classList.toggle("is-hidden", !mostra);
      });
    });
  }

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbMedia = document.getElementById("lightboxMedia");
  var lbTag = document.getElementById("lightboxTag");
  var lbTitle = document.getElementById("lightboxTitle");
  var lbSpecs = document.getElementById("lightboxSpecs");
  var btnClose = document.getElementById("lightboxClose");
  var btnPrev = document.getElementById("lightboxPrev");
  var btnNext = document.getElementById("lightboxNext");
  var currentIndex = null;

  function visibleIndexes() {
    return cards
      .filter(function (c) { return !c.classList.contains("is-hidden"); })
      .map(function (c) { return parseInt(c.getAttribute("data-index"), 10); });
  }

  function openLightbox(index) {
    var item = TRABALHOS[index];
    if (!item) return;
    currentIndex = index;

    lbMedia.className = "lightbox-media " + item.tone;
    lbMedia.innerHTML = item.icon;
    lbTag.textContent = item.categoriaLabel;
    lbTitle.textContent = item.titulo;
    lbSpecs.innerHTML =
      "<div><dt>Material</dt><dd>" + item.material + "</dd></div>" +
      "<div><dt>Medidas</dt><dd>" + item.medidas + "</dd></div>" +
      "<div><dt>Acabamento</dt><dd>" + item.acabamento + "</dd></div>";

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    currentIndex = null;
  }

  function step(dir) {
    var visible = visibleIndexes();
    if (!visible.length || currentIndex === null) return;
    var pos = visible.indexOf(currentIndex);
    var next = (pos + dir + visible.length) % visible.length;
    openLightbox(visible[next]);
  }

  if (gallery) {
    gallery.addEventListener("click", function (e) {
      var card = e.target.closest(".card");
      if (!card) return;
      openLightbox(parseInt(card.getAttribute("data-index"), 10));
    });
    gallery.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest(".card");
      if (!card) return;
      e.preventDefault();
      openLightbox(parseInt(card.getAttribute("data-index"), 10));
    });
  }

  if (btnClose) btnClose.addEventListener("click", closeLightbox);
  if (btnPrev) btnPrev.addEventListener("click", function () { step(-1); });
  if (btnNext) btnNext.addEventListener("click", function () { step(1); });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
})();

