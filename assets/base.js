(function(){
  var d=document, html=d.documentElement;
  d.body.classList.remove('no-js'); html.classList.add('js');
  var reduz=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // menu do celular
  var btn=d.querySelector('.menu-btn'), painel=d.getElementById('painel');
  function fechar(){painel.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Abrir menu');d.body.style.overflow='';}
  btn.addEventListener('click',function(){
    var abrir=!painel.classList.contains('open');
    if(!abrir){fechar();return;}
    painel.classList.add('open');btn.setAttribute('aria-expanded','true');btn.setAttribute('aria-label','Fechar menu');d.body.style.overflow='hidden';
  });
  [].forEach.call(painel.querySelectorAll('a'),function(a,i){a.style.transitionDelay=Math.min(i*60,340)+'ms';a.addEventListener('click',fechar);});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')fechar();});

  // revelação das seções
  var rev=[].slice.call(d.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:0.05});
    rev.forEach(function(el){io.observe(el);});
  } else rev.forEach(function(el){el.classList.add('in');});

  // item atual da navegação
  var links=[].slice.call(d.querySelectorAll('.nav-links a'));
  var alvo={elementos:'#elementos',claude:'#claude','caminho-a':'#claude','caminho-b':'#claude',kit:'#claude',skills:'#claude',vozes:'#vozes',formula:'#formula',referencias:'#formula',seedance:'#seedance',roteiro:'#roteiro',metricas:'#metricas',cuidados:'#cuidados',faq:'#cuidados'};
  if('IntersectionObserver' in window){
    var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var h=alvo[e.target.id];links.forEach(function(a){var hr=a.getAttribute('href');if(hr.charAt(0)==='#')a.setAttribute('aria-current',hr===h?'true':'false');});}});},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(alvo).forEach(function(id){var s=d.getElementById(id);if(s)spy.observe(s);});
  }

  // frase de impacto: palavra por palavra
  var tg=d.getElementById('tagline');
  if(tg){
    var palavras=tg.textContent.trim().split(/\s+/);
    tg.textContent='';
    palavras.forEach(function(p,i){var s=d.createElement('span');s.className='w';s.textContent=p;tg.appendChild(s);if(i<palavras.length-1)tg.appendChild(d.createTextNode(' '));});
    var ws=[].slice.call(tg.querySelectorAll('.w'));
    if(reduz){ws.forEach(function(w){w.classList.add('on');});}
    else{
      var marcado=false;
      var atualizar=function(){marcado=false;var linha=window.innerHeight*0.68;ws.forEach(function(w){if(w.getBoundingClientRect().top<linha)w.classList.add('on');});};
      var aoRolar=function(){if(!marcado){marcado=true;requestAnimationFrame(atualizar);}};
      window.addEventListener('scroll',aoRolar,{passive:true});window.addEventListener('resize',aoRolar);atualizar();
    }
  }

  // abas dos prompts
  var tabs=[].slice.call(d.querySelectorAll('[role=tab]'));
  function escolher(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on?'true':'false');x.tabIndex=on?0:-1;d.getElementById(x.getAttribute('aria-controls')).hidden=!on;});}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){escolher(t);});
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];escolher(n);n.focus();}});
  });
  if(tabs.length)escolher(tabs[0]);

  // copiar prompt
  [].forEach.call(d.querySelectorAll('.copy'),function(b){
    var rot=b.querySelector('span'), ic=b.querySelector('i');
    b.addEventListener('click',function(){
      var texto=b.closest('.prompt').querySelector('pre').textContent;
      var fim=function(ok){b.classList.toggle('ok',ok);b.classList.toggle('err',!ok);rot.textContent=ok?'Copiado':'Selecione o texto e copie';ic.className=ok?'ph ph-check':'ph ph-warning';setTimeout(function(){b.classList.remove('ok','err');rot.textContent='Copiar';ic.className='ph ph-copy';},2400);};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(texto).then(function(){fim(true);},function(){fim(false);});}
      else fim(false);
    });
  });

  // listas de conferência guardadas no navegador
  [].forEach.call(d.querySelectorAll('.checks'),function(lista){
    var chave='shorts-claude-'+lista.getAttribute('data-lista'), estado=[];
    try{estado=JSON.parse(localStorage.getItem(chave)||'[]');}catch(e){}
    [].forEach.call(lista.querySelectorAll('input'),function(c,i){
      c.checked=!!estado[i];
      c.addEventListener('change',function(){estado[i]=c.checked;try{localStorage.setItem(chave,JSON.stringify(estado));}catch(e){}});
    });
  });
})();
