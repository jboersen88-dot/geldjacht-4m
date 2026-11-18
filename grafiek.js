/* Grafieken als SVG: scherp op elk scherm, getekend uit dezelfde getallen als de vraag.
   Lettergrootte 17-19 in een viewBox van 620 breed: op een iPad (kaart ~900 px) ruim leesbaar. */
var GK={ink:"#1d2433",grid:"#e3e7ef",blauw:"#2f6db3",oranje:"#e76f51",grijs:"#8a93a6",groen:"#2a9d8f"};
var FONT='font-family="-apple-system,system-ui,Segoe UI,sans-serif"';
function nl(x){return String(x).replace(".",",");}
function stapVoor(max){return max<=12?1:max<=24?2:max<=60?5:10;}

/* Budgetlijn(en). o: {xlab, ylab, lijnen:[{x0,y0,kleur,stip,label}], punten:[{x,y,label}], xmax?, ymax?} */
function budgetSvg(o){
  var xm=o.xmax||Math.max.apply(null,o.lijnen.map(function(l){return l.x0;}).concat((o.punten||[]).map(function(p){return p.x;})))+2;
  var ym=o.ymax||Math.max.apply(null,o.lijnen.map(function(l){return l.y0;}).concat((o.punten||[]).map(function(p){return p.y;})))+2;
  var xs=stapVoor(xm),ys=stapVoor(ym);xm=Math.ceil(xm/xs)*xs;ym=Math.ceil(ym/ys)*ys;
  var L=78,R=600,T=24,B=380,s="";
  var X=function(v){return L+v/xm*(R-L);},Y=function(v){return B-v/ym*(B-T);};
  for(var x=0;x<=xm;x+=xs)s+='<line x1="'+X(x)+'" y1="'+T+'" x2="'+X(x)+'" y2="'+B+'" stroke="'+GK.grid+'"/><text x="'+X(x)+'" y="'+(B+24)+'" text-anchor="middle" font-size="17" fill="'+GK.ink+'">'+x+'</text>';
  for(var y=0;y<=ym;y+=ys)s+='<line x1="'+L+'" y1="'+Y(y)+'" x2="'+R+'" y2="'+Y(y)+'" stroke="'+GK.grid+'"/><text x="'+(L-10)+'" y="'+(Y(y)+6)+'" text-anchor="end" font-size="17" fill="'+GK.ink+'">'+y+'</text>';
  s+='<line x1="'+L+'" y1="'+B+'" x2="'+R+'" y2="'+B+'" stroke="'+GK.ink+'" stroke-width="2"/><line x1="'+L+'" y1="'+T+'" x2="'+L+'" y2="'+B+'" stroke="'+GK.ink+'" stroke-width="2"/>'+
     '<text x="'+R+'" y="'+(B+50)+'" text-anchor="end" font-size="18" font-weight="700" fill="'+GK.ink+'">'+o.xlab+'</text>'+
     '<text transform="translate(20 '+T+') rotate(-90)" text-anchor="end" font-size="18" font-weight="700" fill="'+GK.ink+'">'+o.ylab+'</text>';
  o.lijnen.forEach(function(l,i){
    s+='<line x1="'+X(0)+'" y1="'+Y(l.y0)+'" x2="'+X(l.x0)+'" y2="'+Y(0)+'" stroke="'+l.kleur+'" stroke-width="4"'+(l.stip?' stroke-dasharray="10 7"':'')+'/>';
    if(l.label){ // label net boven (eerste lijn) of onder (tweede lijn) het midden van de lijn
      var mx=X(l.x0*0.5),my=Y(l.y0*0.5),boven=i===0;
      s+='<text x="'+(mx+(boven?10:-12))+'" y="'+(my+(boven?-12:30))+'" text-anchor="'+(boven?"start":"end")+'" font-size="20" font-weight="800" fill="'+l.kleur+'">'+l.label+'</text>';
    }
  });
  (o.punten||[]).forEach(function(p){
    s+='<circle cx="'+X(p.x)+'" cy="'+Y(p.y)+'" r="7" fill="'+GK.oranje+'" stroke="#fff" stroke-width="2"/><text x="'+(X(p.x)+12)+'" y="'+(Y(p.y)-10)+'" font-size="20" font-weight="800" fill="'+GK.oranje+'">'+p.label+'</text>';
  });
  return '<svg viewBox="0 0 620 440" role="img" '+FONT+'>'+s+'</svg>';
}

/* Staafdiagram. o: {ylab, ymax, ystep, reeksen:[{naam,kleur}], groepen:[{label,waarden:[]}]} */
function staafSvg(o){
  var L=78,R=600,T=24,B=380,W=R-L,s="",Y=function(v){return B-v/o.ymax*(B-T);};
  for(var y=0;y<=o.ymax;y+=o.ystep)s+='<line x1="'+L+'" y1="'+Y(y)+'" x2="'+R+'" y2="'+Y(y)+'" stroke="'+GK.grid+'"/><text x="'+(L-10)+'" y="'+(Y(y)+6)+'" text-anchor="end" font-size="17" fill="'+GK.ink+'">'+y+'</text>';
  s+='<line x1="'+L+'" y1="'+B+'" x2="'+R+'" y2="'+B+'" stroke="'+GK.ink+'" stroke-width="2"/><line x1="'+L+'" y1="'+T+'" x2="'+L+'" y2="'+B+'" stroke="'+GK.ink+'" stroke-width="2"/>'+
     '<text transform="translate(20 '+T+') rotate(-90)" text-anchor="end" font-size="17" font-weight="700" fill="'+GK.ink+'">'+o.ylab+'</text>';
  var gw=W/o.groepen.length,bw=Math.min(62,(gw-40)/o.reeksen.length);
  o.groepen.forEach(function(g,gi){
    var x0=L+gi*gw+(gw-bw*o.reeksen.length)/2;
    g.waarden.forEach(function(v,ri){var x=x0+ri*bw,y=Y(v);
      s+='<rect x="'+(x+3)+'" y="'+y+'" width="'+(bw-6)+'" height="'+(B-y)+'" rx="3" fill="'+o.reeksen[ri].kleur+'"/><text x="'+(x+bw/2)+'" y="'+(y-8)+'" text-anchor="middle" font-size="17" font-weight="700" fill="'+GK.ink+'">'+nl(v)+'</text>';});
    s+='<text x="'+(L+gi*gw+gw/2)+'" y="406" text-anchor="middle" font-size="19" font-weight="700" fill="'+GK.ink+'">'+g.label+'</text>';
  });
  var lx=L;o.reeksen.forEach(function(r){s+='<rect x="'+lx+'" y="430" width="18" height="18" rx="3" fill="'+r.kleur+'"/><text x="'+(lx+26)+'" y="445" font-size="17" fill="'+GK.ink+'">'+r.naam+'</text>';lx+=r.naam.length*9.2+56;});
  return '<svg viewBox="0 0 620 462" role="img" '+FONT+'>'+s+'</svg>';
}

/* Lijngrafiek met waarden bij elk punt. o: {jaren, ymin, ymax, ystep, ylab, reeksen:[{naam,kleur,w,boven}]} */
function lijnSvg(o){
  var L=78,R=590,T=24,B=360,s="";
  var X=function(i){return L+24+i*(R-L-48)/(o.jaren.length-1);},Y=function(v){return B-(v-o.ymin)/(o.ymax-o.ymin)*(B-T);};
  for(var y=o.ymin;y<=o.ymax;y+=o.ystep)s+='<line x1="'+L+'" y1="'+Y(y)+'" x2="'+R+'" y2="'+Y(y)+'" stroke="'+GK.grid+'"/><text x="'+(L-10)+'" y="'+(Y(y)+6)+'" text-anchor="end" font-size="17" fill="'+GK.ink+'">'+y+'</text>';
  o.jaren.forEach(function(j,i){s+='<text x="'+X(i)+'" y="'+(B+26)+'" text-anchor="middle" font-size="17" font-weight="700" fill="'+GK.ink+'">'+j+'</text>';});
  s+='<line x1="'+L+'" y1="'+B+'" x2="'+R+'" y2="'+B+'" stroke="'+GK.ink+'" stroke-width="2"/><line x1="'+L+'" y1="'+T+'" x2="'+L+'" y2="'+B+'" stroke="'+GK.ink+'" stroke-width="2"/>'+
     '<text transform="translate(20 '+T+') rotate(-90)" text-anchor="end" font-size="17" font-weight="700" fill="'+GK.ink+'">'+o.ylab+'</text>';
  o.reeksen.forEach(function(r){
    s+='<polyline fill="none" stroke="'+r.kleur+'" stroke-width="4" points="'+r.w.map(function(v,i){return X(i)+","+Y(v);}).join(" ")+'"/>';
    r.w.forEach(function(v,i){s+='<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="6" fill="'+r.kleur+'" stroke="#fff" stroke-width="2"/>';
      if(i===0&&r.boven)return; // basisjaar: één label (100) is genoeg
      s+='<text x="'+X(i)+'" y="'+(r.boven?Y(v)-13:Y(v)+28)+'" text-anchor="middle" font-size="16" font-weight="800" fill="'+r.kleur+'">'+nl(v)+'</text>';});
  });
  var lx=L;o.reeksen.forEach(function(r){s+='<rect x="'+lx+'" y="410" width="18" height="18" rx="3" fill="'+r.kleur+'"/><text x="'+(lx+26)+'" y="425" font-size="17" fill="'+GK.ink+'">'+r.naam+'</text>';lx+=r.naam.length*9+56;});
  return '<svg viewBox="0 0 620 444" role="img" '+FONT+'>'+s+'</svg>';
}

/* Tabel als 'document'. kop: [links, rechts], rijen: [[tekst, bedrag], ...] */
function tabelDoc(kop,rijen){
  return '<table class="doc"><tr><th>'+kop[0]+'</th><th class="n">'+kop[1]+'</th></tr>'+rijen.map(function(r){return '<tr><td>'+r[0]+'</td><td class="n">'+r[1]+'</td></tr>';}).join("")+'</table>';
}
/* Tabel met jaren als kolommen. rijen: [[naam, w1, w2, ...]] */
function tabelJaren(jaren,rijen){
  return '<table class="doc"><tr><th></th>'+jaren.map(function(j){return '<th class="n">'+j+'</th>';}).join("")+'</tr>'+
    rijen.map(function(r){return '<tr><td>'+r[0]+'</td>'+r.slice(1).map(function(v){return '<td class="n">'+v+'</td>';}).join("")+'</tr>';}).join("")+'</table>';
}

/* Lorenzcurve. w = cumulatief % inkomen bij 0, 20, 40, 60, 80, 100% van de bevolking. */
function lorenzSvg(w){
  var L=78,R=560,T=24,B=400,s="",X=function(v){return L+v/100*(R-L);},Y=function(v){return B-v/100*(B-T);};
  for(var v=0;v<=100;v+=10){var d=v%20===0;
    s+='<line x1="'+X(v)+'" y1="'+T+'" x2="'+X(v)+'" y2="'+B+'" stroke="'+GK.grid+'"/><line x1="'+L+'" y1="'+Y(v)+'" x2="'+R+'" y2="'+Y(v)+'" stroke="'+GK.grid+'"/>';
    if(d)s+='<text x="'+X(v)+'" y="'+(B+24)+'" text-anchor="middle" font-size="17" fill="'+GK.ink+'">'+v+'</text><text x="'+(L-10)+'" y="'+(Y(v)+6)+'" text-anchor="end" font-size="17" fill="'+GK.ink+'">'+v+'</text>';}
  s+='<line x1="'+L+'" y1="'+B+'" x2="'+R+'" y2="'+B+'" stroke="'+GK.ink+'" stroke-width="2"/><line x1="'+L+'" y1="'+T+'" x2="'+L+'" y2="'+B+'" stroke="'+GK.ink+'" stroke-width="2"/>'+
     '<line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(100)+'" y2="'+Y(100)+'" stroke="'+GK.grijs+'" stroke-width="3" stroke-dasharray="9 7"/>'+
     '<polyline fill="none" stroke="'+GK.blauw+'" stroke-width="4" points="'+w.map(function(v,i){return X(i*20)+","+Y(v);}).join(" ")+'"/>';
  w.forEach(function(v,i){if(i===0||i===5)return;
    s+='<circle cx="'+X(i*20)+'" cy="'+Y(v)+'" r="6" fill="'+GK.blauw+'" stroke="#fff" stroke-width="2"/><text x="'+(X(i*20)+8)+'" y="'+(Y(v)+24)+'" font-size="17" font-weight="800" fill="'+GK.blauw+'">'+nl(v)+'%</text>';});
  s+='<text x="'+R+'" y="'+(B+50)+'" text-anchor="end" font-size="17" font-weight="700" fill="'+GK.ink+'">% van de bevolking (van laag naar hoog inkomen)</text>'+
     '<text transform="translate(20 '+T+') rotate(-90)" text-anchor="end" font-size="17" font-weight="700" fill="'+GK.ink+'">% van het totale inkomen</text>';
  return '<svg viewBox="0 0 620 460" role="img" '+FONT+'>'+s+'</svg>';
}
