(function () {
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('menu');
  var cab = document.querySelector('.cabecera');
  function cerrar() {
    menu.classList.remove('abierto');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menú');
  }
  btn.addEventListener('click', function () {
    var abierto = menu.classList.toggle('abierto');
    btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    btn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') cerrar(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  function alScroll() { cab.classList.toggle('cabecera--solida', window.scrollY > 40); }
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();
  var a = document.getElementById('anio');
  if (a) a.textContent = new Date().getFullYear();

  /* Visor de imágenes (galería) */
  var visor = document.getElementById('visor');
  if (visor && visor.showModal) {
    var vi = document.getElementById('visor-img'), vc = document.getElementById('visor-cap');
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.foto__btn') : null;
      if (b) {
        vi.src = b.getAttribute('data-src');
        vi.alt = b.querySelector('img').alt;
        vc.textContent = b.getAttribute('data-cap');
        visor.showModal();
      } else if (e.target === visor) { visor.close(); }
    });
  }

  /* Buscador del catálogo de videos */
  var q = document.getElementById('buscar');
  if (q) {
    var items = document.querySelectorAll('#catalogo .vid');
    var conteo = document.getElementById('conteo');
    q.addEventListener('input', function () {
      var t = q.value.trim().toLowerCase(), n = 0;
      items.forEach(function (li) {
        var ok = !t || li.getAttribute('data-t').indexOf(t) > -1;
        li.hidden = !ok; if (ok) n++;
      });
      conteo.textContent = 'Mostrando ' + n + ' de ' + items.length + ' videos.';
    });
  }
})();

// Video de portada: se carga desde texto base64 (media/*.b64.txt)
(function(){
  var v=document.querySelector('video'); if(!v) return;
  function b64blob(t,type){var s=atob(t.trim()),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return URL.createObjectURL(new Blob([a],{type:type}));}
  fetch('media/poster.b64.txt').then(function(r){return r.ok?r.text():null}).then(function(t){if(t)v.poster=b64blob(t,'image/jpeg');}).catch(function(){});
  var cargado=false;
  function cargar(){ if(cargado) return; cargado=true;
    fetch('media/video.b64.txt').then(function(r){return r.text()}).then(function(t){
      var s=v.querySelector('source'); var u=b64blob(t,'video/mp4');
      if(s){s.src=u;} else {v.src=u;} v.load(); v.play().catch(function(){});
    }).catch(function(){cargado=false;});
  }
  v.addEventListener('play',cargar,{once:true}); v.addEventListener('click',cargar,{once:true});
  if('IntersectionObserver' in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){cargar();o.disconnect();}}).observe(v);}
})();
