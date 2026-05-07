(function(){
'use strict';

/* ── CONFIGURAÇÃO SUPABASE ── */
const SUPABASE_URL = 'SUA_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_KEY_ANON_AQUI';

/* ── Observer global — criado imediatamente, antes de tudo ── */
window.ro = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
        if(entry.isIntersecting){
            entry.target.classList.add('on');
        }
    });
}, {
    threshold: 0.1
});

// FUNÇÃO GLOBAL PARA OBSERVAR QUALQUER COISA
window.observeAll = function(){
    document.querySelectorAll('.rv').forEach(function(el){
        window.ro.observe(el);
    });
};

/* Observa qualquer coisa: string seletor, NodeList, ou elemento único */
window.observeRv = function(target){
    var els;
    if(typeof target === 'string'){
        els = document.querySelectorAll(target);
    } else if(target instanceof NodeList || Array.isArray(target)){
        els = target;
    } else if(target instanceof Element){
        window.ro.observe(target);
        return;
    }
    if(els) els.forEach(function(el){ window.ro.observe(el); });
};

/* ── Nav scroll ── */
var nav = document.getElementById('nav');
window.addEventListener('scroll', function(){
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}, {passive:true});

/* ── Hamburger ── */
var ham = document.getElementById('ham');
var mob = document.getElementById('mob-menu');
if(ham && mob){
    ham.addEventListener('click', function(){
        var o = mob.classList.toggle('open');
        ham.classList.toggle('open', o);
        ham.setAttribute('aria-expanded', o);
    });
    window.mClose = function(){
        mob.classList.remove('open');
        ham.classList.remove('open');
        ham.setAttribute('aria-expanded', false);
    };
    document.addEventListener('click', function(e){
        if(!mob.contains(e.target) && !ham.contains(e.target)) mClose();
    });
}

/* ── Banner ken-burns ── */
var banner = document.getElementById('banner');
if(banner) setTimeout(function(){ banner.classList.add('loaded'); }, 100);

/* ── Máscara tel ── */
var ti = document.getElementById('ft');
if(ti) ti.addEventListener('input', function(){
    var v = this.value.replace(/\D/g,'').slice(0,11);
    if(v.length>=2) v='('+v.slice(0,2)+') '+v.slice(2);
    if(v.length>=10) v=v.slice(0,10)+'-'+v.slice(10);
    this.value = v;
});

/* ── Cards de Seleção (delegação) ── */
document.addEventListener('click', function(e){
    var sCard = e.target.closest('.service-card');
    var zCard = e.target.closest('.size-card');
    if(sCard){
        document.querySelectorAll('.service-card').forEach(function(c){ c.classList.remove('active'); });
        sCard.classList.add('active');
        var inp = document.getElementById('fs');
        if(inp) inp.value = sCard.getAttribute('data-service');
    }
    if(zCard){
        document.querySelectorAll('.size-card').forEach(function(c){ c.classList.remove('active'); });
        zCard.classList.add('active');
        var inp = document.getElementById('fsize');
        if(inp) inp.value = zCard.getAttribute('data-size');
    }
});

/* ── Scroll-to-Top ── */
if(!document.getElementById('scrollTop')){
    var scrollTop = document.createElement('div');
    scrollTop.id = 'scrollTop';
    scrollTop.innerHTML = '↑';
    scrollTop.onclick = function(){ window.scrollTo({top:0,behavior:'smooth'}); };
    document.body.appendChild(scrollTop);
    window.addEventListener('scroll', function(){
        scrollTop.classList.toggle('show', window.scrollY > 300);
    }, {passive:true});
}

/* ── Abas ── */
window.tab = function(btn, id){
    document.querySelectorAll('.tab-btn').forEach(function(b){
        b.classList.remove('active');
        b.setAttribute('aria-selected','false');
    });
    document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    var target = document.getElementById(id);
    if(target) target.classList.add('active');
};

/* ── FAQ Toggle ── */
window.toggleFaq = function(btn){
    var ans = btn.nextElementSibling;
    if(ans){
        var on = ans.classList.toggle('active');
        btn.classList.toggle('active', on);
    }
};

/* ── Depoimentos ── */
function initTestimonials(){
    var d = [
        {t:'O acabamento ficou perfeito! Pintaram toda a casa sem deixar nenhuma sujeira. Recomendo demais.', a:'Ana C.', l:'Piracicaba'},
        {t:'Profissionalismo do início ao fim. Orçamento claro, prazo cumprido e resultado que superou expectativas.', a:'Roberto M.', l:'Piracicaba'},
        {t:'Textura na sala ficou incrível. Já indiquei para dois vizinhos e todos adoraram o trabalho.', a:'Fernanda L.', l:'Piracicaba'},
        {t:'Fiz a fachada da minha casa e ficou nova! Atendimento excelente e preço justo. Vou chamar novamente.', a:'Carlos H.', l:'Piracicaba'},
        {t:'Resolveram um problema de umidade que tinha há anos. Serviço caprichado e equipe muito educada.', a:'Marcia S.', l:'Piracicaba'},
        {t:'Pontualidade e organização impecáveis. Protegeram todos os móveis e deixaram tudo limpo.', a:'Paulo R.', l:'Piracicaba'},
        {t:'Gostei muito do serviço, foram rápidos e cuidadosos com a casa. Ficou melhor do que eu esperava.', a:'Carlos M.', l:'Piracicaba'},
        {t:'Quarto das crianças ficou lindo depois da pintura. Trataram tudo com muito cuidado, sem sujar nada.', a:'Juliana T.', l:'Piracicaba'},
        {t:'Chamei pra pintar a sala e acabei pedindo o corredor também. O resultado foi ótimo nos dois ambientes.', a:'Marcos A.', l:'Piracicaba'},
        {t:'Serviço honesto. O preço foi exatamente o que foi combinado, sem surpresa nenhuma no final.', a:'Renata B.', l:'Piracicaba'},
        {t:'Já tinha tido experiência ruim com outros pintores antes. Dessa vez foi diferente, muito cuidado e atenção.', a:'Eduardo F.', l:'Piracicaba'},
        {t:'Pintaram a fachada inteira em dois dias. Ficou com cara de casa nova. Super recomendo.', a:'Simone O.', l:'Piracicaba'},
    ];
    var tr = document.getElementById('ttrack');
    if(!tr) return;
    tr.innerHTML = '';
    d.concat(d).forEach(function(x){
        var c = document.createElement('div');
        c.className = 't-card';
        c.innerHTML = '<div class="t-stars">★★★★★</div><div class="t-txt">"' + x.t + '"</div><div class="t-auth">' + x.a + ' · <span class="t-loc">' + (x.l||'Piracicaba') + '</span></div>';
        tr.appendChild(c);
    });
}

/* ── GALERIA DINÂMICA (SUPABASE) ── */
var supabaseClient;
if(window.supabase && SUPABASE_URL !== 'SUA_URL_AQUI'){
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function createPostCard(post){
    var card = document.createElement('div');
    card.className = 'post-card rv';
    card.innerHTML = `
        <div class="post-img-wrapper">
            <img src="${post.imagem_url}" alt="Trabalho de Pintura" loading="lazy">
        </div>
        <div class="post-content">
            <p class="post-desc">${post.descricao || 'Serviço de pintura residencial finalizado.'}</p>
            <div class="post-footer">
                <div class="post-actions">
                    <button class="action-btn" onclick="this.classList.toggle('liked')">❤️ Curtir</button>
                    <button class="action-btn" onclick="alert('Comentários em breve!')">💬 Comentar</button>
                </div>
            </div>
        </div>
    `;
    return card;
}

async function loadPosts(){
    var feed = document.getElementById('feed');
    if(!feed || !supabaseClient) return;
    try {
        var { data, error } = await supabaseClient
            .from('posts').select('*')
            .order('created_at', { ascending: false });
        if(error) throw error;
        feed.innerHTML = '';
        if(data && data.length > 0){
            data.forEach(function(post){
                var card = createPostCard(post);
                feed.appendChild(card);
                window.observeRv(card);
            });
        }
    } catch(err){
        console.error('Erro na galeria:', err.message);
    }
}

/* ── Nav link ativo ── */
function initActiveLinks(){
    var secs = document.querySelectorAll('section[id],footer[id]');
    var nls  = document.querySelectorAll('.nav-links a');
    if(secs.length === 0 || nls.length === 0) return;
    var nio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
            if(e.isIntersecting){
                nls.forEach(function(a){ a.classList.remove('active'); });
                var al = document.querySelector('.nav-links a[href="#'+e.target.id+'"]');
                if(al) al.classList.add('active');
            }
        });
    }, {threshold:.4});
    secs.forEach(function(s){ nio.observe(s); });
}

/* ── Enviar via WhatsApp ── */
window.enviarWhatsApp = function(){
    var n=(document.getElementById('fn')||{}).value||'';
    var t=(document.getElementById('ft')||{}).value||'';
    var mail=(document.getElementById('fmail')||{}).value||'';
    var e=(document.getElementById('fe')||{}).value||'';
    var s=(document.getElementById('fs')||{}).value||'';
    var sz=(document.getElementById('fsize')||{}).value||'Nao informado';
    var d=(document.getElementById('fd')||{}).value||'';
    if(!n.trim()||!t.trim()||!mail.trim()||!e.trim()||!s){
        var b=document.querySelector('.btn-sub');
        var orig=b.textContent;
        b.style.background='#c41e3a';
        b.textContent='Preencha os campos obrigatorios';
        setTimeout(function(){ b.style.background=''; b.textContent=orig; },2600);
        return;
    }
    var msg='Ola! Gostaria de solicitar um orcamento.%0A%0A';
    msg+='*DADOS DO CLIENTE*%0A';
    msg+='Nome: '+n+'%0A';
    msg+='WhatsApp: '+t+'%0A';
    msg+='E-mail: '+mail+'%0A';
    msg+='Endereco: '+e+'%0A%0A';
    msg+='*SERVICO SOLICITADO*%0A';
    msg+='Tipo: '+s+'%0A';
    msg+='Tamanho Estimado: '+sz+'%0A';
    if(d.trim()){ msg+='%0A*DETALHES*%0A'+d; }
    window.open('https://wa.me/5519998060453?text='+msg,'_blank');
    var fc=document.getElementById('fc');
    if(fc){
        fc.style.opacity='0'; fc.style.transition='opacity .4s';
        setTimeout(function(){ fc.style.display='none'; document.getElementById('fok').classList.add('on'); },380);
    }
};

/* ── INICIALIZAÇÃO ── */
document.addEventListener('DOMContentLoaded', function(){
    initTestimonials();
    initActiveLinks();
    loadPosts();
    window.observeAll(); // Ativa as animações .rv
});

}());
