/* Rekenvragen 4 mavo: H1, H2, 5.1 en 5.2. Elke functie maakt een nieuwe vraag met nieuwe getallen en context:
   {p: paragraaf, k: kopje in het boek, v: vraagtekst, fig: html (grafiek/tabel, mag ontbreken), ant: juist antwoord,
    alt: andere goed te rekenen antwoorden (mag ontbreken), soort: "euro"|"procent"|"aantal"|"getal", tol: toegestane afwijking,
    formule: aanpak (alleen voor de AI, nooit in beeld), uitw: uitwerking (zelftest)}
   Niveau en rekenwijze volgen de SE-toets AT4.11 en de rekentraining 4 mavo: euro's op 2 decimalen, procenten en indexcijfers op 1 decimaal. */
function rnd(a,b){return a+Math.floor(Math.random()*(b-a+1));}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function rd(x,d){var f=Math.pow(10,d||0);return Math.round(x*f+(x>=0?1e-9:-1e-9))/f;}
function getalNL(x,d){return Number(x).toLocaleString("nl-NL",{minimumFractionDigits:d||0,maximumFractionDigits:d==null?2:d});}
function eu(x){var c=Math.abs(rd(x,2)%1)>0.0001;return (x<0?"− ":"")+"€ "+getalNL(Math.abs(x),c?2:0);}
function e2(x){return (x<0?"− ":"")+"€ "+getalNL(Math.abs(x),2);}
function pc(x){return getalNL(x,1)+"%";}
function pr(x){return getalNL(x,x%1?(rd(x,1)===x?1:2):0)+"%";} // percentage zoals gegeven (2,5% · 1,65% · 3%)
function cent(a,b){return rnd(a*100,b*100)/100;}
function dec(a,b,d){var f=Math.pow(10,d);return rnd(a*f,b*f)/f;}
var NAMEN=["Sanne","Yusuf","Fleur","Ruben","Noah","Aylin","Daan","Mila","Mohammed","Lotte","Bram","Priya","Jesse","Fatima","Sem","Ilse","Kevin","Zara","Tim","Nora"];
var BRON="\n\n"; // witregel tussen context en opdracht
var RO2=" Rond af op 2 decimalen.",RO1=" Rond af op 1 decimaal.";

var REKEN=[
// 1.2 Nieuw bedrag met een groeifactor (stijging of daling)
function(){var n=pick(NAMEN),c=pick([
   {w:"Het brutoloon van "+n+" is ",o:cent(1850,3400),t:"Volgens de cao stijgt het loon per 1 juli met ",p:pick([1.8,2.25,2.5,2.75,3.1,3.4,4.2]),up:1,x:"het nieuwe brutoloon"},
   {w:"De huur van de studentenkamer van "+n+" is ",o:rnd(380,690)+pick([0,0.5,0.95]),t:"De verhuurder verhoogt de huur met ",p:pick([3.1,4.4,5.5,2.8]),up:1,x:"de nieuwe huur per maand"},
   {w:n+" werkt als vakkenvuller en verdient per maand ",o:cent(480,820),t:"Omdat "+n+" minder uren gaat werken, daalt dit loon met ",p:pick([12.5,15,20,8.5]),up:0,x:"het nieuwe loon per maand"},
   {w:"Een nieuwe e-bike kost ",o:rnd(1899,3299)+0.0,t:"In de uitverkoop daalt de prijs met ",p:pick([15,17.5,22,12.5]),up:0,x:"de prijs in de uitverkoop"}]);
  var gf=(100+(c.up?c.p:-c.p))/100,ant=rd(c.o*gf,2);
  return {p:"1.2",k:"Loonsverhoging",v:c.w+e2(c.o)+". "+c.t+pr(c.p)+"."+BRON+"Bereken met een groeifactor "+c.x+"."+RO2,ant:ant,soort:"euro",
   formule:"groeifactor = (100 "+(c.up?"+":"−")+" percentage) : 100; nieuw bedrag = oud bedrag × groeifactor",uitw:"groeifactor "+getalNL(gf,4)+"; "+getalNL(c.o,2)+" × "+getalNL(gf,4)+" = "+e2(ant)};},
// 1.2 Twee veranderingen na elkaar (groeifactoren vermenigvuldigen)
function(){var n=pick(NAMEN),L=cent(1950,3150),a=pick([1.5,2,2.5,3]),b=pick([1.2,1.8,2.4,3.5]);
  var c=pick([{t:"Het brutoloon van "+n+" is "+e2(L)+". Op 1 januari stijgt het loon met "+pr(a)+" en op 1 juli nog eens met "+pr(b)+".",gb:1+b/100,x:"het brutoloon na beide verhogingen"},
             {t:"Een scooter kost "+e2(L)+". De prijs stijgt eerst met "+pr(a)+". Een paar maanden later krijgt "+n+" "+pr(b*4)+" korting op de nieuwe prijs.",gb:1-b*4/100,x:"wat "+n+" voor de scooter betaalt"}]);
  var ga=1+a/100,ant=rd(L*ga*c.gb,2);
  return {p:"1.2",k:"Loonsverhoging",v:c.t+BRON+"Bereken "+c.x+". Gebruik groeifactoren."+RO2,ant:ant,soort:"euro",tol:Math.max(0.03,ant*0.0005),
   formule:"groeifactor per verandering; nieuw = oud × groeifactor 1 × groeifactor 2 (niet de procenten optellen)",uitw:getalNL(L,2)+" × "+getalNL(ga,4)+" × "+getalNL(c.gb,4)+" = "+e2(ant)};},
// procentuele verandering in een context uit H1, H2 of H5
function(){var n=pick(NAMEN),f=function(o,a,b,d){return d?rd(o*dec(a,b,3),2):Math.round(o*dec(a,b,3));},c=pick([
   function(){var o=rnd(18,40)*1000+rnd(0,999),x=f(o,1.08,1.35);return {p:"1.1",k:"Op wie richt de producent zich?",o:o,x:x,t:"Een webshop in sportkleding richt zich op jongeren. In 2024 verkocht de webshop "+getalNL(o)+" producten aan jongeren, in 2025 waren dat er "+getalNL(x)+"."};},
   function(){var o=rnd(2050,2150),x=f(o,1.04,1.14,1);return {p:"1.2",k:"Verschil in inkomen",o:o,x:x,t:"Het modaal inkomen was in 2021 "+eu(o)+" netto per maand. In 2025 was het "+e2(x)+"."};},
   function(){var o=dec(14,24,2),x=f(o,1.06,1.25,1);return {p:"5.1",k:"Op eigen benen",o:o,x:x,t:"Na de privatisering van een busbedrijf steeg de prijs van een weekabonnement van "+e2(o)+" naar "+e2(x)+"."};},
   function(){var o=rnd(40,90)*1000,x=f(o,0.8,0.95);return {p:"5.1",k:"Aanmoedigen en ontmoedigen",o:o,x:x,t:"Na een flinke accijnsverhoging daalde het aantal rokers in een stad van "+getalNL(o)+" naar "+getalNL(x)+"."};},
   function(){var o=rnd(80,160)*1000,x=f(o,1.1,1.6);return {p:"5.1",k:"Aanmoedigen en ontmoedigen",o:o,x:x,t:"Door een nieuwe subsidie steeg het aantal verkochte warmtepompen in Nederland van "+getalNL(o)+" per jaar naar "+getalNL(x)+" per jaar."};},
   function(){var o=rnd(240,320)*1000,x=f(o,0.82,0.96);return {p:"5.2",k:"De economie groeit",o:o,x:x,t:"Door economische groei daalde het aantal WW-uitkeringen van "+getalNL(o)+" naar "+getalNL(x)+"."};},
   function(){var o=cent(400,1500),x=f(o,1.15,1.6,1);return {p:"2.2",k:"Heeft sparen zin?",o:o,x:x,t:"Op de spaarrekening van "+n+" stond begin dit jaar "+e2(o)+". Eind dit jaar staat er "+e2(x)+"."};},
   function(){var o=rnd(1680,2240),x=f(o,0.9,0.97);return {p:"2.3",k:"Waarom zou je lenen?",o:o,x:x,t:"Een schuldhulpbureau hielp vorig jaar "+getalNL(o)+" jongeren met betalingsachterstanden. Dit jaar waren het er "+getalNL(x)+"."};}])();
  var ant=rd((c.x-c.o)/c.o*100,1);
  return {p:c.p,k:c.k,v:c.t+BRON+"Bereken met hoeveel procent dit is veranderd."+RO1+" Typ een min-teken als het is gedaald.",ant:ant,soort:"procent",
   formule:"(nieuw − oud) : oud × 100",uitw:"("+getalNL(c.x)+" − "+getalNL(c.o)+") : "+getalNL(c.o)+" × 100 = "+pc(ant)};},
// 1.2 Besteedbaar inkomen per maand
function(){var n=pick(NAMEN),B=cent(2100,3600),lh=dec(18,31,1),gem=rnd(52,96)*10,zp=cent(138,172);
  var net=rd(B*(1-lh/100),2),ant=rd(net-gem/12-zp,2);
  return {p:"1.2",k:"Over welk inkomen heb je het?",v:n+" werkt bij een installatiebedrijf. Over het brutoloon van "+e2(B)+" per maand betaalt "+n+" "+pr(lh)+" loonheffing (loonbelasting en premies). Per jaar betaalt "+n+" "+eu(gem)+" aan gemeentelijke heffingen. De premie voor de zorgverzekering is "+e2(zp)+" per maand."+BRON+"Bereken het besteedbaar inkomen van "+n+" per maand."+RO2,
   ant:ant,soort:"euro",tol:Math.max(0.03,ant*0.0005),formule:"nettoloon = brutoloon − loonheffing; besteedbaar = nettoloon − verplichte uitgaven, alles per maand (jaarbedrag : 12)",
   uitw:getalNL(B,2)+" × "+getalNL(1-lh/100,3)+" = "+e2(net)+"; − "+gem+" : 12 − "+getalNL(zp,2)+" = "+e2(ant)};},
// 1.2 Lorenzcurve: gemiddeld inkomen van een groep
function(){var w=[0];for(var k=0;k<200;k++){w=[0,rnd(6,9)];w.push(w[1]+rnd(10,13));w.push(w[2]+rnd(15,18));w.push(w[3]+rnd(19,23));w.push(100);if(100-w[4]>=32&&100-w[4]<=42)break;}
  var T=rnd(950,1180),N=dec(17.6,18.2,1),g=pick([{t:"de 20% personen met de hoogste inkomens",a:80,b:100},{t:"de 40% personen met de laagste inkomens",a:0,b:40},{t:"de groep personen tussen 40% en 60% (de middengroep)",a:40,b:60},{t:"de 20% personen met de laagste inkomens",a:0,b:20}]);
  var aandeel=w[g.b/20]-w[g.a/20],ant=rd(T*1e9*aandeel/100/(N*1e6*(g.b-g.a)/100),2);
  return {p:"1.2",k:"Hoe zijn de inkomens verdeeld?",v:"Het totale inkomen van alle Nederlanders samen is € "+getalNL(T)+" miljard. Nederland heeft "+getalNL(N,1)+" miljoen inwoners. Hieronder zie je de Lorenzcurve."+BRON+"Bereken het gemiddelde inkomen per persoon van "+g.t+"."+RO2,
   fig:lorenzSvg(w),ant:ant,soort:"euro",tol:Math.max(1,ant*0.001),formule:"aandeel inkomen van de groep aflezen (verschil tussen twee punten op de curve); inkomen groep = aandeel × totaal; aantal personen = groepsprocent × inwoners; inkomen groep : aantal personen",
   uitw:"aandeel "+aandeel+"%; "+aandeel+"% × "+T+" miljard = "+getalNL(T*aandeel/100,2)+" miljard; "+(g.b-g.a)+"% × "+getalNL(N,1)+" miljoen = "+getalNL(N*(g.b-g.a)/100,3)+" miljoen; = "+e2(ant)};},
// 1.1 Primair inkomen per jaar (valkuil: overdrachtsinkomens en uitgaven tellen niet mee)
function(){var fam=pick(["Bakker","De Vries","El Amrani","Visser","Jansen","Öztürk","Mulder","Pinas"]),L=rnd(52,78)*50,vg=rd(L*12*0.08,2),r=cent(35,240),h=rnd(9,16)*10,kb=pick([299.24,598.48]),zt=pick([0,98,123]),hu=rnd(18,32)*50;
  var rij=[["Brutoloon","€ "+getalNL(L)+" per maand"],["Vakantiegeld","€ "+getalNL(vg,2)+" per jaar"],["Rente op de spaarrekening","€ "+getalNL(r,2)+" per jaar"],["Verhuur van een garagebox","€ "+h+" per maand"],["Kinderbijslag","€ "+getalNL(kb,2)+" per kwartaal"]];
  if(zt)rij.push(["Zorgtoeslag","€ "+zt+" per maand"]);rij.push(["Huur van hun eigen woning","€ "+getalNL(hu)+" per maand"]);
  var ant=rd(L*12+vg+r+h*12,2);
  return {p:"1.1",k:"Wat doe jij voor je inkomen?",v:"Hieronder zie je de geldstromen van de familie "+fam+". Let op: niet alle bedragen gaan over dezelfde periode, en niet alles is primair inkomen."+BRON+"Bereken het primaire inkomen van de familie "+fam+" per jaar."+RO2,
   fig:tabelDoc(["Geldstroom familie "+fam,"Bedrag"],rij),ant:ant,soort:"euro",formule:"primair inkomen = inkomen uit arbeid + inkomen uit bezit, alles per jaar; uitkeringen/toeslagen (overdrachten) en uitgaven tellen niet mee",
   uitw:L+" × 12 + "+getalNL(vg,2)+" + "+getalNL(r,2)+" + "+h+" × 12 = "+e2(ant)};},
// 1.1 Secundair inkomen per maand
function(){var n=pick(NAMEN),B=cent(1900,3200),lh=cent(B*0.15,B*0.26),r=cent(24,180),kb=pick([299.24,598.48]),zt=pick([98,112,123]),hu=rnd(16,30)*50;
  var rij=[["Brutoloon","€ "+getalNL(B,2)+" per maand"],["Loonheffing","€ "+getalNL(lh,2)+" per maand"],["Rente op spaargeld","€ "+getalNL(r,2)+" per jaar"],["Kinderbijslag","€ "+getalNL(kb,2)+" per kwartaal"],["Zorgtoeslag","€ "+zt+" per maand"],["Huur van de woning (betaald)","€ "+getalNL(hu)+" per maand"]];
  var ant=rd(B-lh+r/12+kb/3+zt,2);
  return {p:"1.1",k:"Wat doe jij voor je inkomen?",v:n+" is alleenstaande ouder. Hieronder zie je de geldstromen van "+n+". Over de rente betaalt "+n+" geen belasting."+BRON+"Bereken het secundaire inkomen van "+n+" per maand."+RO2,
   fig:tabelDoc(["Geldstroom "+n,"Bedrag"],rij),ant:ant,soort:"euro",tol:Math.max(0.03,ant*0.0005),formule:"secundair inkomen = netto inkomens (brutoloon − loonheffing, rente) + overdrachtsinkomens (kinderbijslag, zorgtoeslag), alles per maand; huur is een uitgave",
   uitw:getalNL(B,2)+" − "+getalNL(lh,2)+" + "+getalNL(r,2)+"/12 + "+getalNL(kb,2)+"/3 + "+zt+" = "+e2(ant)};},
// 1.3/1.4 Prijs uit een indexcijfer (of terug naar het basisjaar)
function(){var c=pick([["een bioscoopkaartje",9.5,13],["een broodje kroket",2.4,3.9],["een liter benzine",1.65,2.1],["een maand sportschool",19.99,32.99],["een festivalkaartje",64,119],["een knipbeurt bij de kapper",18,34]]),p0=cent(c[1],c[2]),I=dec(104,138,1),j=pick([2025,2026]),b=pick([2015,2018,2020,2021]);
  var terug=Math.random()<0.4,p1=rd(p0*I/100,2);
  if(!terug)return {p:"1.3",k:"Samenvatting: indexcijfers",v:"In "+b+" kostte "+c[0]+" "+e2(p0)+". In "+j+" is het indexcijfer van de prijs "+getalNL(I,1)+" ("+b+" = 100)."+BRON+"Bereken hoeveel euro "+c[0]+" in "+j+" kost."+RO2,ant:p1,soort:"euro",
   formule:"prijs nu = prijs basisjaar : 100 × indexcijfer",uitw:getalNL(p0,2)+" : 100 × "+getalNL(I,1)+" = "+e2(p1)};
  var a=rd(p1/I*100,2);
  return {p:"1.3",k:"Samenvatting: indexcijfers",v:"In "+j+" kost "+c[0]+" "+e2(p1)+". Het indexcijfer van de prijs is in "+j+" "+getalNL(I,1)+" ("+b+" = 100)."+BRON+"Bereken hoeveel euro "+c[0]+" in "+b+" kostte."+RO2,ant:a,soort:"euro",tol:0.03,
   formule:"prijs basisjaar = prijs nu : indexcijfer × 100",uitw:getalNL(p1,2)+" : "+getalNL(I,1)+" × 100 = "+e2(a)};},
// 1.3 Indexcijfer berekenen uit een tabel (basisjaar niet altijd het eerste jaar)
function(){var c=pick([["Het aantal verkochte e-bikes",rnd(380,520)*1000,0],["Het aantal bezoekers van een pretpark (× 1.000)",rnd(4200,5600),0],["Het gemiddelde uurloon van een vakkenvuller",dec(11.5,13.5,2),1],["De prijs van een kilo kaas",dec(11.2,14.8,2),1]]);
  var jaren=[2021,2022,2023,2024,2025],w=[c[1]],k;for(k=1;k<5;k++){var x=w[k-1]*dec(0.97,1.09,3);w.push(c[2]?rd(x,2):Math.round(x));}
  var bi=pick([0,1,2]),ji=pick([3,4].concat(bi===0?[2]:[])),ant=rd(w[ji]/w[bi]*100,1);
  return {p:"1.3",k:"Samenvatting: indexcijfers",v:"In de tabel zie je "+c[0].charAt(0).toLowerCase()+c[0].slice(1)+" in vijf jaar."+BRON+"Bereken het indexcijfer van "+jaren[ji]+" met "+jaren[bi]+" als basisjaar ("+jaren[bi]+" = 100)."+RO1,
   fig:tabelJaren(jaren,[[c[0]].concat(w.map(function(v){return c[2]?"€ "+getalNL(v,2):getalNL(v);}))]),ant:ant,soort:"getal",tol:0.051,
   formule:"indexcijfer = waarde in het jaar : waarde in het basisjaar × 100",uitw:getalNL(w[ji])+" : "+getalNL(w[bi])+" × 100 = "+getalNL(ant,1)};},
// 1.4 Inflatie uit het cpi (valkuil: indexpunten zijn geen procenten)
function(){var jaren=[2021,2022,2023,2024,2025],w=[100];for(var k=1;k<5;k++)w.push(rd(w[k-1]*(1+dec(1.2,9.5,1)/100),1));
  var i=pick([2,3,4]),ant=rd((w[i]-w[i-1])/w[i-1]*100,1);
  return {p:"1.4",k:"Hoe wordt de inflatie berekend?",v:"In de grafiek zie je het consumentenprijsindexcijfer (cpi) van Nederland (2021 = 100)."+BRON+"Bereken de inflatie in "+jaren[i]+"."+RO1,
   fig:lijnSvg({jaren:jaren,ymin:95,ymax:Math.ceil((w[4]+4)/5)*5,ystep:5,ylab:"cpi (2021 = 100)",reeksen:[{naam:"cpi",kleur:GK.oranje,w:w,boven:true}]}),ant:ant,soort:"procent",
   formule:"inflatie = (cpi dit jaar − cpi vorig jaar) : cpi vorig jaar × 100",uitw:"("+getalNL(w[i],1)+" − "+getalNL(w[i-1],1)+") : "+getalNL(w[i-1],1)+" × 100 = "+pc(ant)};},
// 1.4 Cpi berekenen met wegingsfactoren
function(){var g=[["Huisvesting",rnd(28,34)],["Voeding",rnd(14,19)],["Vervoer",rnd(11,16)],["Kleding",rnd(5,8)],["Recreatie",rnd(9,13)]],tot=0,som=0;
  g.forEach(function(r){r.push(dec(100.5,112,1));tot+=r[1];som+=r[1]*r[2];});var ant=rd(som/tot,1);
  return {p:"1.4",k:"Hoe wordt de inflatie berekend?",v:"Het CBS berekent het cpi met de prijsindexcijfers en de wegingsfactoren van productgroepen. Hieronder zie je een vereenvoudigd voorbeeld."+BRON+"Bereken het cpi."+RO1,
   fig:'<table class="t"><tr><th style="text-align:left">Productgroep</th><th>Prijsindexcijfer</th><th>Wegingsfactor</th></tr>'+g.map(function(r){return '<tr><td style="text-align:left">'+r[0]+'</td><td>'+getalNL(r[2],1)+'</td><td>'+r[1]+'</td></tr>';}).join("")+'</table>',
   ant:ant,soort:"getal",tol:0.051,formule:"per groep prijsindexcijfer × wegingsfactor; alles optellen; delen door het totaal van de wegingsfactoren",
   uitw:g.map(function(r){return getalNL(r[2],1)+"×"+r[1];}).join(" + ")+" = "+getalNL(som,1)+"; : "+tot+" = "+getalNL(ant,1)};},
// 1.4 Reële verandering van een inkomen
function(){var n=pick(NAMEN),c=pick([["De AOW van opa Henk","stijgt"],["Het loon van "+n,"stijgt"],["De bijstandsuitkering van "+n,"stijgt"],["Het zakgeld van "+n,"stijgt"],["Het brutoloon van "+n+" volgens de cao","stijgt"]]),a=dec(0.8,5.5,1),inf=dec(1.2,5.8,1);
  if(Math.abs(a-inf)<0.3)inf=rd(inf+0.6,1);var ant=rd(a-inf,1),ex=rd(((100+a)/(100+inf)*100-100),1);
  return {p:"1.4",k:"Gevolgen van inflatie",v:c[0]+" "+c[1]+" dit jaar met "+pr(a)+". De inflatie is "+pr(inf)+"."+BRON+"Bereken de reële verandering van dit inkomen in procenten."+RO1+" Typ een min-teken als de koopkracht daalt.",ant:ant,alt:[ex],soort:"procent",
   formule:"reële verandering = nominale verandering − inflatie (of: (100 + nominaal) : (100 + inflatie) × 100 − 100)",uitw:pr(a)+" − "+pr(inf)+" = "+pc(ant)};},
// 1.4 Indexcijfer van het reële inkomen
function(){var n=pick(NAMEN),b=pick([2015,2020,2021]),j=pick([2025,2026]),N=dec(104,128,1),P=dec(104,128,1);if(Math.abs(N-P)<1)P=rd(P+2.4,1);
  var ant=rd(N/P*100,1);
  return {p:"1.4",k:"Gevolgen van inflatie",v:"Het indexcijfer van het nominale inkomen van "+n+" is in "+j+" "+getalNL(N,1)+" ("+b+" = 100). Het cpi is in "+j+" "+getalNL(P,1)+" ("+b+" = 100)."+BRON+"Bereken het indexcijfer van het reële inkomen van "+n+" in "+j+"."+RO1,ant:ant,soort:"getal",tol:0.051,
   formule:"reëel inkomen (index) = indexcijfer nominaal inkomen : cpi × 100; boven 100 = koopkracht gestegen",uitw:getalNL(N,1)+" : "+getalNL(P,1)+" × 100 = "+getalNL(ant,1)};},
// 2.1 Begroting: alles omrekenen naar per maand
function(){var n=pick(NAMEN),w=cent(62,118),z=pick([25,30,40,50]),t=cent(9.5,22.5),s=cent(5.5,8.5),v=rnd(96,198);
  var ant=rd(w*52/12+z-t-s*52/12-v/12,2);
  var rij=[["Loon bijbaan","+ € "+getalNL(w,2)+" per week"],["Zakgeld","+ € "+z+" per maand"],["Telefoonabonnement","− € "+getalNL(t,2)+" per maand"],["Sportschool","− € "+getalNL(s,2)+" per week"],["Verzekering scooter","− € "+getalNL(v)+" per jaar"]];
  return {p:"2.1",k:"Geld genoeg?",v:"Hieronder zie je de inkomsten en uitgaven van "+n+"."+BRON+"Bereken hoeveel euro "+n+" per maand overhoudt."+RO2,fig:tabelDoc(["Begroting "+n,"Bedrag"],rij),ant:ant,soort:"euro",tol:0.05,
   formule:"alles per maand: weekbedrag × 52 : 12, jaarbedrag : 12; inkomsten − uitgaven",uitw:getalNL(w,2)+"×52/12 + "+z+" − "+getalNL(t,2)+" − "+getalNL(s,2)+"×52/12 − "+v+"/12 = "+e2(ant)};},
// 2.1 Abonnementen vergelijken: per vier weken of per maand
function(){var a=cent(18.99,29.99),b=rd(a+cent(1,3.5),2),n=pick(NAMEN),soort=pick(["sportschool","dansschool","boulderhal","zwembad"]);
  var ja=rd(a*13,2),jb=rd(b*12,2),ant=rd(Math.abs(ja-jb),2),goedk=ja<jb?"vier weken":"maand";
  return {p:"2.1",k:"Geld genoeg?",v:n+" twijfelt tussen twee abonnementen van een "+soort+":\n• abonnement A: "+e2(a)+" per vier weken\n• abonnement B: "+e2(b)+" per maand"+BRON+"Bereken hoeveel euro "+n+" per jaar bespaart met het goedkoopste abonnement."+RO2,ant:ant,soort:"euro",
   formule:"een jaar heeft 13 periodes van vier weken (52 : 4) en 12 maanden; jaarbedragen vergelijken",uitw:getalNL(a,2)+" × 13 = "+getalNL(ja,2)+"; "+getalNL(b,2)+" × 12 = "+getalNL(jb,2)+"; verschil "+e2(ant)+" (goedkoopst: per "+goedk+")"};},
// 2.1 Week- en maandbedragen omrekenen
function(){var n=pick(NAMEN);if(Math.random()<0.5){var w=cent(4,18);var ant=rd(w*52/12,2);
   return {p:"2.1",k:"Geld genoeg?",v:n+" krijgt "+e2(w)+" kleedgeld per week. De ouders van "+n+" willen het voortaan per maand betalen, zonder dat "+n+" er iets op vooruit of achteruit gaat."+BRON+"Bereken hoeveel euro kleedgeld "+n+" per maand krijgt."+RO2,ant:ant,soort:"euro",
    formule:"bedrag per maand = weekbedrag × 52 : 12",uitw:getalNL(w,2)+" × 52 : 12 = "+e2(ant)};}
  var m=cent(14,95),c=pick(["de streamingdienst","de zorgverzekering","het telefoonabonnement","de contributie van de voetbalclub"]),a=rd(m*12/52,2);
  return {p:"2.1",k:"Geld genoeg?",v:n+" betaalt "+e2(m)+" per maand voor "+c+". "+n+" wil weten wat dat per week is."+BRON+"Bereken hoeveel euro "+n+" per week betaalt."+RO2,ant:a,soort:"euro",
   formule:"bedrag per week = maandbedrag × 12 : 52",uitw:getalNL(m,2)+" × 12 : 52 = "+e2(a)};},
// 2.1 Reserveren voor een grote uitgave
function(){var n=pick(NAMEN),c=pick([
   {t:"wil rijlessen nemen: ",l:rnd(24,36),pl:cent(56,68),ex:rnd(310,365),x:"lessen"},
   {t:"wil een vakantie naar Spanje: ",l:0,pl:0,ex:rnd(640,1180),x:"reis"}]),mnd=pick([8,10,12,14,15,18]),al=rnd(8,40)*10;
  var tot=c.l?rd(c.l*c.pl+c.ex,2):c.ex,ant=rd((tot-al)/mnd,2);
  var t=c.l?n+" "+c.t+c.l+" lessen van "+e2(c.pl)+" en een examen van "+e2(c.ex)+".":n+" "+c.t+"de reis kost "+e2(c.ex)+".";
  return {p:"2.1",k:"Vooruit kijken",v:t+" "+n+" heeft al "+eu(al)+" gespaard en wil over "+mnd+" maanden genoeg geld hebben."+BRON+"Bereken hoeveel euro "+n+" per maand moet reserveren."+RO2,ant:ant,soort:"euro",
   formule:"benodigd bedrag − al gespaard; reservering per maand = wat nog nodig is : aantal maanden",uitw:"("+getalNL(tot,2)+" − "+al+") : "+mnd+" = "+e2(ant)};},
// 2.1 Nibud-advies vaste lasten
function(){var n=pick(NAMEN),sf=cent(380,520),bb=cent(520,860),huur=cent(420,560),zv=cent(140,165),ab=cent(18,35),tel=cent(12,25);
  var ink=rd(sf+bb,2),vl=rd(huur+zv+ab+tel,2),pct=pick([40,50]);
  var rij=[["Studiefinanciering","€ "+getalNL(sf,2)],["Bijbaan","€ "+getalNL(bb,2)],["Huur kamer","€ "+getalNL(huur,2)],["Zorgverzekering","€ "+getalNL(zv,2)],["Abonnement sportschool","€ "+getalNL(ab,2)],["Telefoonabonnement","€ "+getalNL(tel,2)]];
  if(Math.random()<0.5){var ant=rd(vl-ink*pct/100,2);
   return {p:"2.1",k:"Uitkomen met je geld",v:n+" studeert en woont op kamers. Hieronder zie je de netto inkomsten en de vaste lasten van "+n+" per maand. Stel dat het Nibud adviseert om niet meer dan "+pct+"% van je netto-inkomen aan vaste lasten uit te geven."+BRON+"Bereken hoeveel euro "+n+" per maand meer aan vaste lasten uitgeeft dan het Nibud adviseert."+RO2+(ant<0?" Typ een min-teken als het minder is.":""),
    fig:tabelDoc([n+" per maand","Bedrag"],rij),ant:ant,soort:"euro",formule:"advies = percentage × netto-inkomen; vaste lasten optellen; vaste lasten − advies",uitw:"vaste lasten "+getalNL(vl,2)+"; advies "+pct+"% × "+getalNL(ink,2)+" = "+getalNL(ink*pct/100,2)+"; verschil "+e2(ant)};}
  var a=rd(vl/ink*100,1);
  return {p:"2.1",k:"Uitkomen met je geld",v:n+" studeert en woont op kamers. Hieronder zie je de netto inkomsten en de vaste lasten van "+n+" per maand."+BRON+"Bereken welk percentage van het netto-inkomen "+n+" aan vaste lasten uitgeeft."+RO1,fig:tabelDoc([n+" per maand","Bedrag"],rij),ant:a,soort:"procent",
   formule:"vaste lasten optellen, inkomsten optellen; vaste lasten : inkomen × 100",uitw:getalNL(vl,2)+" : "+getalNL(ink,2)+" × 100 = "+pc(a)};},
// 2.2 Enkelvoudige rente
function(){var n=pick(NAMEN),S=rnd(12,90)*100,r=pick([1.6,1.85,2.1,2.35,2.6,2.75,3.05]),j=rnd(3,7),ant=rd(S*r/100*j,2);
  return {p:"2.2",k:"Hoeveel rente levert het op?",v:"De ouders van "+n+" zetten "+eu(S)+" op een spaardeposito van "+j+" jaar met "+pr(r)+" rente per jaar. Ze krijgen enkelvoudige rente: de rente wordt elk jaar uitbetaald op hun betaalrekening."+BRON+"Bereken hoeveel euro rente ze in "+j+" jaar in totaal ontvangen."+RO2,ant:ant,soort:"euro",
   formule:"enkelvoudige rente = rentepercentage : 100 × spaarbedrag × aantal jaren",uitw:pr(r)+" : 100 × "+S+" × "+j+" = "+e2(ant)};},
// 2.2 Samengestelde rente: eindbedrag of totale rente
function(){var n=pick(NAMEN),S=rnd(15,120)*50+pick([0,0,25]),r=pick([1.25,1.6,1.9,2.2,2.45,2.8,3.15]),j=rnd(2,6),eind=rd(S*Math.pow(1+r/100,j),2),renteV=Math.random()<0.4;
  var ant=renteV?rd(eind-S,2):eind;
  return {p:"2.2",k:"Je spaargeld groeit",v:n+" zet "+eu(S)+" op een internetspaarrekening met "+pr(r)+" rente per jaar. De rente wordt elk jaar bijgeschreven (samengestelde rente). "+n+" neemt "+j+" jaar lang niets op."+BRON+(renteV?"Bereken hoeveel euro rente "+n+" in totaal heeft gekregen na "+j+" jaar.":"Bereken hoeveel euro er na "+j+" jaar op de spaarrekening staat.")+RO2,ant:ant,soort:"euro",tol:Math.max(0.05,ant*0.0004),
   formule:"groeifactor = 1 + rente : 100; eindbedrag = beginbedrag × groeifactor ^ aantal jaren"+(renteV?"; rente = eindbedrag − beginbedrag":""),uitw:S+" × "+getalNL(1+r/100,4)+"^"+j+" = "+e2(eind)+(renteV?"; − "+S+" = "+e2(ant):"")};},
// 2.2 Samengesteld tegenover enkelvoudig
function(){var n=pick(NAMEN),S=rnd(40,200)*100,r1=pick([2.3,2.6,3.1,3.85]),r2=rd(r1+pick([0,0.2,0.3,0.5]),2),j=rnd(4,6);
  var sam=rd(S*Math.pow(1+r1/100,j)-S,2),enk=rd(S*r2/100*j,2),ant=rd(Math.abs(sam-enk),2);
  return {p:"2.2",k:"Je spaargeld groeit",v:n+" heeft een erfenis van "+eu(S)+" gekregen en laat het geld "+j+" jaar staan. Er zijn twee keuzes:\n• spaarrekening met "+pr(r1)+" samengestelde rente\n• spaardeposito met "+pr(r2)+" enkelvoudige rente"+BRON+"Bereken het verschil in euro's tussen de totale rente van beide keuzes."+RO2,ant:ant,soort:"euro",tol:0.06,
   formule:"samengesteld: beginbedrag × groeifactor ^ jaren − beginbedrag; enkelvoudig: rente% : 100 × bedrag × jaren; verschil",uitw:"samengesteld "+e2(sam)+"; enkelvoudig "+e2(enk)+"; verschil "+e2(ant)};},
// 2.2 Reële rente (soms met inflatie uit het cpi)
function(){var n=pick(NAMEN),r=pick([0.8,1.25,1.5,1.75,2.1,2.4,2.9]),viaCpi=Math.random()<0.5;
  if(!viaCpi){var inf=dec(1.1,4.6,1);if(Math.abs(inf-r)<0.2)inf=rd(inf+0.5,1);var ant=rd(r-inf,2);
   return {p:"2.2",k:"De koopkracht van je spaargeld",v:"De bank van "+n+" geeft "+pr(r)+" rente op de spaarrekening. De inflatie is dit jaar "+pr(inf)+"."+BRON+"Bereken de reële rente."+RO1+" Typ een min-teken als de reële rente negatief is.",ant:rd(ant,1),alt:[ant],soort:"procent",
    formule:"reële rente = nominale rente − inflatie",uitw:pr(r)+" − "+pr(inf)+" = "+pc(rd(ant,1))};}
  var c1=dec(108,118,1),c2=rd(c1*(1+dec(1.5,4.8,1)/100),1),inf2=(c2-c1)/c1*100,a=rd(r-rd(inf2,1),1);
  return {p:"2.2",k:"De koopkracht van je spaargeld",v:n+" krijgt "+pr(r)+" rente op de spaarrekening. Het cpi was vorig jaar "+getalNL(c1,1)+" en is dit jaar "+getalNL(c2,1)+" (2021 = 100)."+BRON+"Bereken eerst de inflatie van dit jaar en daarna de reële rente."+RO1+" Typ een min-teken als de reële rente negatief is.",ant:a,alt:[rd(r-inf2,1)],soort:"procent",
   formule:"inflatie = (cpi nieuw − cpi oud) : cpi oud × 100; reële rente = nominale rente − inflatie",uitw:"inflatie ("+getalNL(c2,1)+" − "+getalNL(c1,1)+") : "+getalNL(c1,1)+" × 100 = "+pc(rd(inf2,1))+"; "+pr(r)+" − "+pc(rd(inf2,1))+" = "+pc(a)};},
// 2.2 Rendement op aandelen met een koersgrafiek
function(){var n=pick(NAMEN),bedr=pick(["ASML","Heineken","Philips","Ahold Delhaize","Shell","ING"]),mnd=["jan","feb","mrt","apr","mei","jun","jul"],MND=["januari","februari","maart","april","mei","juni","juli"],k0=pick([18,24,32,48,65,88]),w=[k0];
  for(var i=1;i<7;i++)w.push(rd(w[i-1]*dec(0.9,1.12,3),1));
  var a=rnd(0,2),b=rnd(4,6),st=pick([50,80,100,120,150,200]),dv=dec(0.3,1.6,2),tk=pick([0,0,4.5,7.5]);
  var ant=rd(st*(w[b]-w[a])+st*dv-2*tk,2),lo=Math.floor(Math.min.apply(null,w)/5)*5-5,hi=Math.ceil(Math.max.apply(null,w)/5)*5+5;
  return {p:"2.2",k:"Hoeveel risico wil je lopen?",v:"De vader van "+n+" koopt op 1 "+MND[a]+" "+st+" aandelen "+bedr+". Op 1 "+MND[b]+" verkoopt hij ze allemaal. In de tussentijd ontvangt hij "+e2(dv)+" dividend per aandeel."+(tk?" Hij betaalt bij het kopen én bij het verkopen "+e2(tk)+" transactiekosten.":" Hij betaalt geen transactiekosten.")+" In de grafiek zie je de koers van één aandeel (in euro's, bewerkt)."+BRON+"Bereken het totale rendement in euro's."+RO2+" Typ een min-teken als het rendement negatief is.",
   fig:lijnSvg({jaren:mnd,ymin:Math.max(0,lo),ymax:hi,ystep:stapVoor(hi-lo)<2?2:stapVoor(hi-lo),ylab:"koers (€)",reeksen:[{naam:"koers "+bedr,kleur:GK.blauw,w:w,boven:true}]}),ant:ant,soort:"euro",
   formule:"koersresultaat = aantal × (verkoopkoers − aankoopkoers); + dividend × aantal; − transactiekosten",uitw:st+" × ("+getalNL(w[b],1)+" − "+getalNL(w[a],1)+") + "+st+" × "+getalNL(dv,2)+(tk?" − 2 × "+getalNL(tk,2):"")+" = "+e2(ant)};},
// 2.3 Kredietkosten (in euro of in procenten van het krediet)
function(){var n=pick(NAMEN),c=pick([["een persoonlijke lening voor meubels",4,9],["een persoonlijke lening voor een tweedehands auto",6,15],["een persoonlijke lening voor een nieuwe keuken",8,18]]),K=rnd(c[1],c[2])*500,m=pick([24,36,48,60]),r=dec(6.5,9.9,1);
  var t=rd(K*(r/1200)/(1-Math.pow(1+r/1200,-m)),2),kk=rd(t*m-K,2),pct=Math.random()<0.35;
  if(!pct)return {p:"2.3",k:"Kosten van een lening",v:n+" sluit "+c[0]+" af van "+eu(K)+". "+n+" betaalt "+m+" maanden lang "+e2(t)+" per maand."+BRON+"Bereken de totale kredietkosten."+RO2,ant:kk,soort:"euro",
   formule:"kredietkosten = termijnbedrag × aantal termijnen − krediet",uitw:getalNL(t,2)+" × "+m+" = "+getalNL(t*m,2)+"; − "+K+" = "+e2(kk)};
  var a=rd(kk/K*100,1);
  return {p:"2.3",k:"Kosten van een lening",v:n+" sluit "+c[0]+" af van "+eu(K)+". "+n+" betaalt "+m+" maanden lang "+e2(t)+" per maand."+BRON+"Bereken hoeveel procent van het geleende bedrag "+n+" in totaal aan kredietkosten betaalt."+RO1,ant:a,soort:"procent",
   formule:"kredietkosten = termijn × aantal termijnen − krediet; kredietkosten : krediet × 100",uitw:"kredietkosten "+e2(kk)+"; : "+K+" × 100 = "+pc(a)};},
// 2.3 Koop op afbetaling tegenover contant betalen
function(){var n=pick(NAMEN),c=pick([["een scooter",1899,2899],["een gamelaptop",1099,1899],["een bankstel",1299,2399],["een e-bike",2199,3199]]),P=rnd(c[1],c[2]),a=rnd(5,25)*10,m=pick([12,18,24,30]);
  var t=rd((P-a)*dec(1.06,1.2,3)/m,2),tot=rd(a+t*m,2),pct=Math.random()<0.5,ant=pct?rd((tot-P)/P*100,1):rd(tot-P,2);
  return {p:"2.3",k:"Lenen bij een leverancier",v:"In de winkel kost "+c[0]+" contant "+eu(P)+". "+n+" kiest voor koop op afbetaling: "+eu(a)+" aanbetaling en daarna "+m+" maanden "+e2(t)+" per maand."+BRON+(pct?"Bereken hoeveel procent "+n+" meer betaalt dan bij contant betalen."+RO1:"Bereken hoeveel euro "+n+" meer betaalt dan bij contant betalen."+RO2),ant:ant,soort:pct?"procent":"euro",
   formule:"totaal op afbetaling = aanbetaling + termijn × aantal termijnen; verschil = totaal − contante prijs"+(pct?"; verschil : contante prijs × 100":""),uitw:a+" + "+getalNL(t,2)+" × "+m+" = "+getalNL(tot,2)+"; − "+P+(pct?" → : "+P+" × 100 = "+pc(ant):" = "+e2(ant))};},
// 2.4 Nieuw saldo berekenen (soms rood)
function(){var n=pick(NAMEN),b=cent(-80,240),tr=[["IKEA",-cent(60,260)],["Betaalverzoek ontvangen van een vriend",cent(8,45)],["Albert Heijn",-cent(25,85)],["Loon bijbaan",cent(120,420)],["Ziggo",-cent(30,55)],["Bol",-cent(15,70)],["Spotify",-10.99],["Tikkie aan een vriendin",-cent(6,30)]];
  for(var i=tr.length-1;i>0;i--){var j=rnd(0,i),h=tr[i];tr[i]=tr[j];tr[j]=h;}tr=tr.slice(0,5);
  var ant=rd(tr.reduce(function(s,r){return s+r[1];},b),2);
  var rij=[["Saldo aan het begin van de week",(b<0?"− ":"")+"€ "+getalNL(Math.abs(b),2)]].concat(tr.map(function(r){return [r[0],(r[1]<0?"− ":"+ ")+"€ "+getalNL(Math.abs(r[1]),2)];})).concat([["Saldo aan het einde van de week","…"]]);
  return {p:"2.4",k:"Hoe gebruik jij je geld?",v:"Hieronder zie je de betaalrekening van "+n+" van deze week."+BRON+"Bereken het saldo aan het einde van de week."+RO2+" Typ een min-teken als "+n+" rood staat (debet).",fig:tabelDoc(["Omschrijving","Bedrag"],rij),ant:ant,soort:"euro",
   formule:"nieuw saldo = oud saldo + ontvangsten − betalingen",uitw:getalNL(b,2)+" "+tr.map(function(r){return (r[1]<0?"− ":"+ ")+getalNL(Math.abs(r[1]),2);}).join(" ")+" = "+e2(ant)};},
// 2.4 Hoe verdient een bank aan het renteverschil?
function(){var bank=pick(["Rabobank","ING","ABN AMRO","SNS","ASN Bank"]),H=rnd(1800,4200)*100,d=pick([3.6,3.85,4.1,4.35,4.6]),c=pick([0.9,1.15,1.4,1.75,2.05]),ant=rd(H*(d-c)/100,2),n=pick(NAMEN);
  return {p:"2.4",k:"Banken zijn commercieel",v:n+" en haar vriend hebben een hypotheek van "+eu(H)+" bij de "+bank+". Ze betalen "+pr(d)+" rente per jaar. Het geld voor deze lening komt van spaarders, die "+pr(c)+" rente krijgen."+BRON+"Bereken hoeveel euro de "+bank+" in een jaar aan deze hypotheek verdient door het renteverschil."+RO2,ant:ant,soort:"euro",
   formule:"renteverschil = debetrente − creditrente; verdienste = renteverschil : 100 × bedrag",uitw:"("+pr(d)+" − "+pr(c)+") : 100 × "+H+" = "+e2(ant)};},
// 5.1 Subsidie (met een maximum)
function(){var c=pick([["een warmtepomp",4200,8900],["een zonneboiler",2400,4600],["isolatie van het dak",3100,6800],["een thuisbatterij",3800,7400]]),P=rnd(c[1],c[2]),s=pick([20,25,30,40]),max=rnd(10,24)*100,sub=Math.min(P*s/100,max),ant=rd(P-sub,2);
  return {p:"5.1",k:"Aanmoedigen en ontmoedigen",v:"De overheid wil dat huishoudens minder energie verbruiken. Daarom geeft ze subsidie op "+c[0]+": "+s+"% van de prijs, met een maximum van "+eu(max)+". Familie "+pick(["Smit","Yilmaz","De Boer","Hendriks","Mahabier"])+" koopt "+c[0]+" van "+eu(P)+"."+BRON+"Bereken hoeveel euro de familie zelf betaalt."+RO2,ant:ant,soort:"euro",
   formule:"subsidie = percentage × prijs, maar nooit meer dan het maximum; zelf betalen = prijs − subsidie",uitw:s+"% × "+P+" = "+getalNL(P*s/100,2)+" → subsidie "+e2(sub)+"; "+P+" − "+getalNL(sub,2)+" = "+e2(ant)};},
// 5.1 Accijns: prijsstijging in procenten of opbrengst voor de overheid
function(){var c=pick([["een pakje sigaretten",9.2,11.8,"pakjes",1.4,2.2],["een fles wijn",5.5,9,"flessen",0.25,0.4],["een liter benzine",1.85,2.15,"liter",0.08,0.16]]),oud=cent(c[1],c[2]),acc=cent(c[4],c[5]);
  if(Math.random()<0.5){var nw=rd(oud+acc,2),ant=rd((nw-oud)/oud*100,1);
   return {p:"5.1",k:"Aanmoedigen en ontmoedigen",v:"De overheid wil het gebruik ontmoedigen en verhoogt de accijns. Daardoor stijgt de prijs van "+c[0]+" van "+e2(oud)+" naar "+e2(nw)+"."+BRON+"Bereken met hoeveel procent de prijs is gestegen."+RO1,ant:ant,soort:"procent",
    formule:"(nieuw − oud) : oud × 100",uitw:"("+getalNL(nw,2)+" − "+getalNL(oud,2)+") : "+getalNL(oud,2)+" × 100 = "+pc(ant)};}
  var q1=dec(1.2,9,1),q2=rd(q1*dec(0.85,0.97,3),1),a1=cent(c[4]*2,c[5]*3),a2=rd(a1+acc,2),ant2=rd((q2*a2-q1*a1)*1000,1);
  return {p:"5.1",k:"Aanmoedigen en ontmoedigen",v:"De accijns op "+c[0]+" stijgt van "+e2(a1)+" naar "+e2(a2)+" per stuk. Daardoor daalt de verkoop van "+getalNL(q1,1)+" miljard naar "+getalNL(q2,1)+" miljard "+c[3]+" per jaar."+BRON+"Bereken met hoeveel miljoen euro de accijnsopbrengst voor de overheid verandert."+RO1+" Typ een min-teken als de opbrengst daalt.",ant:ant2,soort:"getal",tol:Math.max(0.051,Math.abs(ant2)*0.0005),
   formule:"opbrengst = aantal × accijns per stuk, voor en na; verschil; miljard → miljoen = × 1.000",uitw:getalNL(q2,1)+" × "+getalNL(a2,2)+" − "+getalNL(q1,1)+" × "+getalNL(a1,2)+" = "+getalNL(q2*a2-q1*a1,4)+" miljard = "+getalNL(ant2,1)+" miljoen"};},
// 5.1 Aanbesteding: welk bod is goedkoper en hoeveel scheelt het?
function(){var prov=pick(["Zeeland","Groningen","Limburg","Utrecht","Gelderland"]),j=pick([8,10,12]),a=dec(18,34,1),ab=dec(6,22,1),b=rd(a+dec(0.4,2.2,1),1);
  var tA=rd(a*j+ab,1),tB=rd(b*j,1),ant=rd(Math.abs(tA-tB),1);
  return {p:"5.1",k:"Voor de beste prijs?",v:"De provincie "+prov+" houdt een aanbesteding voor het busvervoer voor "+j+" jaar. Er zijn twee aanbiedingen:\n• Vervoerder A: € "+getalNL(a,1)+" miljoen per jaar, plus eenmalig € "+getalNL(ab,1)+" miljoen voor nieuwe elektrische bussen\n• Vervoerder B: € "+getalNL(b,1)+" miljoen per jaar, elektrische bussen inbegrepen"+BRON+"Bereken hoeveel miljoen euro de provincie in "+j+" jaar bespaart als ze het goedkoopste aanbod kiest."+RO1,ant:ant,soort:"getal",tol:0.051,
   formule:"totaal A = bedrag per jaar × jaren + eenmalig bedrag; totaal B = bedrag per jaar × jaren; verschil",uitw:"A "+getalNL(tA,1)+"; B "+getalNL(tB,1)+"; verschil "+getalNL(ant,1)+" miljoen"};},
// 5.2 Economische groei uit een bbp-tabel
function(){var jaren=[2021,2022,2023,2024,2025],w=[dec(860,940,1)];for(var k=1;k<5;k++)w.push(rd(w[k-1]*(1+dec(-1.2,4.6,1)/100),1));
  var i=rnd(1,4),ant=rd((w[i]-w[i-1])/w[i-1]*100,1);
  return {p:"5.2",k:"De economie groeit",v:"In de tabel zie je het bbp van een land (in miljarden euro's, prijzen van 2021)."+BRON+"Bereken de economische groei in "+jaren[i]+"."+RO1+" Typ een min-teken als de economie is gekrompen.",
   fig:tabelJaren(jaren,[["bbp (€ miljard)"].concat(w.map(function(v){return getalNL(v,1);}))]),ant:ant,soort:"procent",
   formule:"economische groei = (bbp dit jaar − bbp vorig jaar) : bbp vorig jaar × 100",uitw:"("+getalNL(w[i],1)+" − "+getalNL(w[i-1],1)+") : "+getalNL(w[i-1],1)+" × 100 = "+pc(ant)};},
// 5.2 Bbp uit een indexcijfer-grafiek
function(){var jaren=[2021,2022,2023,2024,2025],w=[100];for(var k=1;k<5;k++)w.push(rd(w[k-1]*(1+dec(-1.5,4.2,1)/100),1));
  var B=dec(820,960,1),i=rnd(2,4);
  if(Math.random()<0.5){var ant=rd(B*w[i]/100,1);
   return {p:"5.2",k:"De economie groeit",v:"In de grafiek zie je het indexcijfer van het bbp van Nederland (2021 = 100). In 2021 was het bbp € "+getalNL(B,1)+" miljard."+BRON+"Bereken het bbp in "+jaren[i]+" in miljarden euro's."+RO1,
    fig:lijnSvg({jaren:jaren,ymin:90,ymax:Math.ceil((Math.max.apply(null,w)+3)/5)*5,ystep:5,ylab:"bbp (2021 = 100)",reeksen:[{naam:"bbp",kleur:GK.groen,w:w,boven:true}]}),ant:ant,soort:"getal",tol:0.051,
    formule:"bbp = bbp basisjaar : 100 × indexcijfer",uitw:getalNL(B,1)+" : 100 × "+getalNL(w[i],1)+" = "+getalNL(ant,1)};}
  var j0=i-1,a=rd((w[i]-w[j0])/w[j0]*100,1);
  return {p:"5.2",k:"De economie groeit",v:"In de grafiek zie je het indexcijfer van het bbp van Nederland (2021 = 100)."+BRON+"Bereken de economische groei in "+jaren[i]+"."+RO1+" Typ een min-teken als de economie is gekrompen. Let op: het verschil in indexpunten is niet hetzelfde als het percentage.",
   fig:lijnSvg({jaren:jaren,ymin:90,ymax:Math.ceil((Math.max.apply(null,w)+3)/5)*5,ystep:5,ylab:"bbp (2021 = 100)",reeksen:[{naam:"bbp",kleur:GK.groen,w:w,boven:true}]}),ant:a,soort:"procent",
   formule:"(index dit jaar − index vorig jaar) : index vorig jaar × 100",uitw:"("+getalNL(w[i],1)+" − "+getalNL(w[j0],1)+") : "+getalNL(w[j0],1)+" × 100 = "+pc(a)};},
// 5.2 Economische groei: minder uitkeringen, besparing voor de overheid
function(){var a=rnd(240,320)*1000,b=a-rnd(12,45)*1000,u=rnd(1650,2150),ant=rd((a-b)*u*12/1e6,1);
  return {p:"5.2",k:"De economie groeit",v:"Door economische groei daalt het aantal mensen met een WW-uitkering van "+getalNL(a)+" naar "+getalNL(b)+". Een WW-uitkering kost de overheid gemiddeld € "+getalNL(u)+" per maand."+BRON+"Bereken hoeveel miljoen euro de overheid hierdoor per jaar minder aan WW-uitkeringen uitgeeft."+RO1,ant:ant,soort:"getal",tol:0.051,
   formule:"aantal minder × uitkering per maand × 12 = bedrag per jaar; omrekenen naar miljoenen (: 1.000.000)",uitw:"("+a+" − "+b+") × "+u+" × 12 = "+getalNL((a-b)*u*12)+" = "+getalNL(ant,1)+" miljoen"};},
// 5.2 Economische groei: meer belastingontvangsten
function(){var c=pick([["btw",58,72],["inkomstenbelasting",72,95],["vennootschapsbelasting",30,42]]),O=dec(c[1],c[2],1),g=dec(1.5,4.5,1),ant=rd(O*(1+g/100),2);
  return {p:"5.2",k:"De economie groeit",v:"De overheid ontving vorig jaar € "+getalNL(O,1)+" miljard aan "+c[0]+". Door economische groei verwacht het CPB dat deze ontvangsten dit jaar met "+pr(g)+" stijgen."+BRON+"Bereken hoeveel miljard euro de overheid dit jaar aan "+c[0]+" verwacht te ontvangen."+RO2,ant:ant,soort:"getal",tol:0.011,
   formule:"groeifactor = 1 + groei : 100; nieuw = oud × groeifactor",uitw:getalNL(O,1)+" × "+getalNL(1+g/100,3)+" = "+getalNL(ant,2)};}
];
