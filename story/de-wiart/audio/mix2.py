"""Sound design v2 for the De Wiart Story film. Events are timed from the actual scene frames.
usage: python3 mix2.py <out.wav>  (needs numpy + ffmpeg; VO mp3s next to this file)"""
import numpy as np, subprocess, wave, sys, os
D=os.path.dirname(os.path.abspath(__file__))
SR=44100; FPS=24; TOT=2272; N=int((TOT/FPS+0.2)*SR); rng=np.random.default_rng(11)
S=lambda t:int(t*SR)
F=lambda f:f/FPS
def fft_f(x,fc,kind='lp',order=2):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); r=(f/fc)**(2*order)
    X*= (1/(1+r)) if kind=='lp' else (r/(1+r)); return np.fft.irfft(X,len(x))
lp=lambda x,fc:fft_f(x,fc,'lp'); hp=lambda x,fc:fft_f(x,fc,'hp')
def nz(d): return rng.standard_normal(S(d))
def env(n,a,d): t=np.arange(n)/SR; return np.minimum(t/a,1)*np.exp(-t/d)
L=np.zeros(N); R=np.zeros(N); MUS=np.zeros(N); AMB=np.zeros(N); WET=np.zeros((2,N))
def put(x,t,g=1,pan=0,wet=0.25):
    i=S(t)
    if i<0 or i>=N: return
    x=x[:N-i]; gl=g*np.cos((pan+1)*np.pi/4); gr=g*np.sin((pan+1)*np.pi/4)
    L[i:i+len(x)]+=x*gl; R[i:i+len(x)]+=x*gr
    WET[0][i:i+len(x)]+=x*gl*wet; WET[1][i:i+len(x)]+=x*gr*wet
def rifle(far=0,kind=0):
    n=nz(1.0); e=len(n)
    crack=hp(n,1800)*env(e,.0008,.025)*1.0
    body=lp(hp(n,200),2500)*env(e,.001,.08)*0.9
    thump=lp(n,260)*env(e,.002,.10)*1.2
    t=np.arange(e)/SR; sub=np.sin(2*np.pi*(90-50*np.minimum(t*6,1))*t)*env(e,.002,.07)*0.8
    tail=lp(nz(1.0),1200)*env(e,.03,.35)*0.25
    x=crack*(0.8+0.4*kind)+body+thump+sub+tail
    if far: x=lp(x,1800 if far==1 else 900)*(0.55 if far==1 else .35)
    return x*0.55
def bolt():
    n=nz(0.2); return (hp(n,2500)*env(len(n),.001,.01)+ lp(n,800)*env(len(n),.02,.03)*.5)*0.12
def whiz(d=.4):
    n=int(d*SR); t=np.arange(n)/SR; f=3200-2400*(t/d)**.7
    s=np.sin(2*np.pi*np.cumsum(f)/SR); a=np.sin(np.pi*t/d)**1.5
    return (s*0.25+hp(nz(d),2500)*0.2)*a*0.5
def thud(d=.3):
    n=nz(d); return (lp(n,200)*env(len(n),.003,.07)*1.4)*0.6
def boom(d=3.2,big=1.0):
    e=S(d); n=rng.standard_normal(e); t=np.arange(e)/SR
    sub=np.sin(2*np.pi*(48-18*np.minimum(t/1.2,1))*t)*np.exp(-t/0.9)*1.3
    low=lp(n,160)*env(e,.004,.75)*1.6
    mid=lp(hp(n,200),1500)*env(e,.003,.30)*0.9
    crack=hp(n,1500)*env(e,.001,.05)*0.8
    debris=hp(lp(nz(d),6000),800)*env(e,.15,.9)*(rng.random(e)>0.97)*3*0.4
    rub=lp(n,700)*env(e,.2,1.1)*0.35
    return (sub+low+mid+crack+debris+rub)*0.5*big
def shell(d=1.4):
    n=int(d*SR); t=np.arange(n)/SR; f=4200*np.exp(-t/0.6)+400
    s=np.sin(2*np.pi*np.cumsum(f)/SR); return (s*0.25+hp(nz(d),1500)*0.12)*np.minimum(t/.6,1)*(t<d*.98)*0.5
def step(g=1,heavy=0):
    n=nz(.14); return (lp(n,300+heavy*100)*env(len(n),.002,.03)*1.0+hp(n,3000)*env(len(n),.001,.01)*.12)*g*0.35
def gear():
    n=nz(.25); return hp(lp(n,6000),2500)*env(len(n),.004,.05)*(rng.random(len(n))>.6)*0.15
def thump_body(): return thud(.4)
def scream_hit(): return thud(.25)*1.2
def heart(t,n=6,bpm=75,g=0.6):
    for k in range(n):
        tt=t+k*60/bpm*(1+0.0*k); e=S(.25)
        a=np.arange(e)/SR; hb=np.sin(2*np.pi*55*a)*np.exp(-a/.06)
        put(hb*g,tt,1,0,0.05); put(hb*g*.6,tt+.2,1,0,0.05)
def tinnitus(t,d=3.0,g=0.12):
    e=S(d); a=np.arange(e)/SR; x=np.sin(2*np.pi*3150*a)*np.exp(-a/(d/3))*np.minimum(a/.05,1)
    put(x*g,t,1,0,0.0)
def bed(t0,t1,kind,g=1,fade=1.5):
    d=t1-t0; e=S(d); t=np.arange(e)/SR; n=rng.standard_normal(e)
    if kind=='wind': x=lp(n,500)*(0.55+0.45*np.sin(2*np.pi*0.11*t+rng.random()*6))+hp(lp(n,2500),900)*0.15*(0.5+0.5*np.sin(2*np.pi*0.23*t))
    elif kind=='gust': x=lp(n,380)*(0.6+0.4*np.sin(2*np.pi*0.17*t))
    elif kind=='rumble': x=lp(n,95)*(0.8+0.2*np.sin(2*np.pi*0.4*t))*1.4+lp(n,300)*0.2
    elif kind=='sea': x=lp(n,800)*(0.5+0.5*np.sin(2*np.pi*0.16*t)**2)+hp(lp(n,5000),1500)*0.08
    elif kind=='night':
        x=lp(n,250)*0.4
        for k in range(int(d*2)):
            tc=rng.random()*d; i=S(tc); c=np.sin(2*np.pi*(4300+rng.random()*300)*np.arange(S(.05))/SR)*np.hanning(S(.05))*0.05
            if i+len(c)<e: x[i:i+len(c)]+=c
    elif kind=='cave': x=lp(n,160)*0.9
    fd=np.minimum(np.minimum(t/fade,(d-t)/fade),1); AMB[S(t0):S(t0)+e]+=x*fd*g
def fire_seq(a,b,period,t0f,pan,far=0,jit=2,kind=0,g=1):
    f=a
    while f<b:
        tt=F(f)+rng.random()*jit/FPS
        put(rifle(far,kind)*g,tt,1,pan+rng.uniform(-.1,.1),0.3+0.2*far)
        if rng.random()<.55: put(bolt(),tt+.45,.8,pan,.05)
        f+=period+rng.integers(-1,2)
def volleys(a,b,every,pan=0.5,g=.5):
    f=a
    while f<b:
        tt=F(f)
        put(whiz()*g,tt+rng.random()*.2,1,rng.uniform(-.8,.8),0.2)
        if rng.random()<.5: put(thud(.15)*.5*g,tt+.25,1,rng.uniform(-.6,.6),.1)
        f+=every+rng.integers(-2,3)
def die(tf,pan,big=0):
    put(thud(.35)*(1.2 if big else .8),F(tf)+.18,1,pan,.1)
    put(gear()*2,F(tf)+.05,1,pan,.1)
def explode(tf,pan=0,big=1.0,dur=3.2):
    put(boom(dur,big),F(tf),1,pan,0.5)
def runfoot(a,b,pan=0,g=1,period=7):
    f=a
    while f<b: put(step(g*rng.uniform(.6,1.1),1),F(f)+rng.random()*.03,1,pan+rng.uniform(-.3,.3),.1); put(gear(),F(f)+.02,.6,pan,.1); f+=period+rng.integers(-1,2)
def whoosh(t,d=1.0,g=.6,up=True):
    e=S(d); a=np.arange(e)/SR; n=rng.standard_normal(e)
    fc=np.linspace(300,5000,e) if up else np.linspace(5000,300,e)
    # time-varying lowpass via mixing 3 static bands
    b1=lp(n,500); b2=lp(hp(n,500),2000); b3=hp(n,2000)
    w=np.clip((np.arange(e)/e),0,1) if up else 1-np.clip((np.arange(e)/e),0,1)
    x=(b1*(1-w)+b2*(1-abs(w-.5)*2)+b3*w)*np.sin(np.pi*a/d)**1.5
    put(x*g,t,1,0,0.3)
# =========== TIMELINE (global frames) ===========
STARTS=[0,400,452,900,952,1412,1488,1540]
# ambience
bed(0,19,'wind',.6); bed(17,40,'wind',.7); bed(39,59,'rumble',.9); bed(39,62,'wind',.2); bed(61,66,'wind',.3)
bed(F(1540)-1,F(1700),'sea',.0)  # placeholder (no-op)
# ---------- BOER ----------
for a,per,pan in [(44,13,-.4),(52,12,-.6),(66,11,-.5)]: fire_seq(a,130,per,0,pan,1)
volleys(6,128,9,g=.7)
fire_seq(6,130,10,0,.5,2,kind=1,g=.5)           # enemy rifles, far
runfoot(10,50,-.3,.6,6)
die(74,-.4); die(92,-.2,1); explode(92,.1,.9,2.8)
# boer front (132-276), HIT 60 -> 192
fire_seq(132+8,192,12,0,-.3,0); fire_seq(132+5,192,11,0,.3,0); fire_seq(132+10,192,12,0,.5,1)
volleys(132,192,10,g=.5)
put(rifle(0,1)*1.6,F(192),1,.2,.6); put(boom(1.6,.45),F(192)+.02,1,0,.4); put(thud(.4)*1.5,F(192)+.1,1,0,.2)
heart(F(194),6,70,.7); tinnitus(F(194),3.2,.12)
volleys(200,276,12,g=.3); fire_seq(214,276,13,0,-.3,1,g=.6)
# shot3 (276-408)
explode(276+38,.5,1.0,3.0); die(276+60,-.2); die(276+84,.5)
for a,per,pan in [(4,11,-.2),(10,12,-.4),(8,13,-.6),(6,12,-.8),(3,13,.6)]: fire_seq(276+a,276+120,per,0,pan,0 if a<9 else 1)
volleys(282,400,10,g=.6)
# ---------- MAP 1 ----------
whoosh(F(396),1.2,.5,True)
for k in range(6): put(hp(lp(nz(.2),5000),1500)*env(S(.2),.01,.05)*.15*(rng.random(S(.2))>.5),F(404)+k*.17,1,0,.05)  # pen scratches
# ---------- SOMALI (452) ----------
O=452
for i in range(5): fire_seq(O+4+i*4,O+104,14,0,.7,2,kind=1,g=.5)    # defenders on the wall
for a,per in [(40,12),(54,11)]: fire_seq(O+a,O+130,per,0,-.5,1)
fire_seq(O+62,O+130,12,0,-.7,0)
volleys(O+6,O+104,8,g=.7)
runfoot(O+0,O+60,.4,.7,6); 
for d in (62,80,96,118): die(O+d,.5)
explode(O+104,.6,1.4,4.2); put(lp(nz(3),300)*env(S(3),.3,1.2)*.5,F(O+106),1,0,.5)  # tower collapse rumble
# somali front (584) HIT 70 -> 654
fire_seq(584+8,654,13,0,-.3,0); fire_seq(584+5,654,11,0,.4,0); fire_seq(584+14,654,12,0,-.1,1)
volleys(584,654,9,g=.5)
put(rifle(0,1)*1.6,F(654),1,.15,.6); put(boom(1.5,.45),F(654)+.02,1,0,.4); put(thud(.35)*1.4,F(654)+.12,1,0,.2)
heart(F(656),6,66,.7); tinnitus(F(656),3.4,.13)
volleys(664,776,11,g=.3); fire_seq(670,776,13,0,.3,1,g=.6)
# somali shot3 (776)
for a,per,pan in [(4,11,-.3),(8,12,-.5),(6,13,-.7),(3,12,.5)]: fire_seq(776+a,776+120,per,0,pan,0)
volleys(776,896,9,g=.6)
die(776+26,.5); die(776+52,.5)
# ---------- MAP 2 ----------
whoosh(F(896),1.2,.5,True)
for k in range(6): put(hp(lp(nz(.2),5000),1500)*env(S(.2),.01,.05)*.15*(rng.random(S(.2))>.5),F(904)+k*.17,1,0,.05)
# ---------- YPRES (952) ----------
O=952
for b in (36,78,112):
    put(shell(1.4),F(O+b)-1.2,1,0,.2); explode(O+b,rng.uniform(-.5,.5),1.1,3.2)
for a,per,pan in [(5,12,-.5),(12,12,-.7),(9,13,-.3)]: fire_seq(O+a,O+130,per,0,pan,1)
fire_seq(O+4,O+130,10,0,.6,2,kind=1,g=.55); volleys(O+8,O+130,9,g=.7)
runfoot(O+0,O+60,-.3,.5,9); die(O+60,-.3); die(O+84,-.5)
# ypres front (1084) HIT 84 -> 1168
O=1084
for tf in (0,40,60): volleys(O+tf,O+tf+20,6,g=.5)
fire_seq(O+10,O+84,12,0,-.4,1,g=.6); fire_seq(O+6,O+84,13,0,.4,2,kind=1,g=.5)
put(shell(1.6),F(1168)-1.4,1,0,.2)
explode(1168,.05,1.5,4.0); put(thud(.5)*1.6,F(1168)+.15,1,0,.2)
heart(F(1171),10,64,.8); tinnitus(F(1171),4.0,.14)
for fm in (1234,1246,1258,1270): put(shell(1.0),F(fm)-.9,.8,0,.2); explode(fm,rng.uniform(-.7,.7),.5,2.4)
fire_seq(1180,1400,16,0,.3,2,kind=1,g=.4)
# ---------- MEDAL (1412) ----------
for k,fr in enumerate([523.25,659.25,783.99,1046.5]):
    e=S(4.0); a=np.arange(e)/SR
    x=(np.sin(2*np.pi*fr*a)+.3*np.sin(2*np.pi*fr*2*a)+.15*np.sin(2*np.pi*fr*3.01*a))*np.exp(-a/1.6)*np.minimum(a/.01,1)
    put(x*.10,F(1414)+k*.12,1,(k-1.5)*.3,.5)
put(lp(nz(3),800)*np.hanning(S(3))*.2,F(1405),1,0,.5)
# ---------- MAP 3 ----------
whoosh(F(1482),1.2,.5,True)
# ---------- WW2 (1540) ----------
O=1540
e=S(F(84)); t=np.arange(e)/SR
f0=70+30*(t/F(84)); eng=np.zeros(e); ph=2*np.pi*np.cumsum(f0)/SR
eng=(np.sign(np.sin(ph))*.4+np.sin(ph*2)*.3+lp(rng.standard_normal(e),900)*.3)
eng*=(0.8+0.2*np.sin(2*np.pi*(6+4*t/F(84))*t))*np.minimum(t/.5,1)
# sputter near the end
sp=(np.sin(2*np.pi*13*t)>0.2)|(t<F(84)-1.6); eng=eng*np.where(sp,1,0.15)
put(lp(eng,1800)*.55,F(O),1,-.2,.2)
put(boom(3.0,.9),F(1624),1,0,.5); put(lp(hp(nz(3),600),4500)*env(S(3),.05,1.0)*.9,F(1624)+.05,1,0,.5)  # crash + splash
put(lp(nz(2.5),1400)*env(S(2.5),.3,.9)*.5,F(1624)+.4,1,.2,.4)
for k in range(10): 
    b=np.sin(2*np.pi*(300+rng.random()*500)*np.arange(S(.1))/SR)*np.hanning(S(.1))*.07; put(b,F(1628)+rng.random()*2,1,rng.uniform(-.5,.5),.3) # bubbles
bed(F(1620),F(1740),'sea',.55); bed(F(1700),F(1940),'sea',.5,2.5)
# hatch (1660): metal creak + clang
cr=np.sin(2*np.pi*(180+60*np.sin(np.linspace(0,9,S(.9))))*np.arange(S(.9))/SR)*np.hanning(S(.9))*.1
put(cr,F(1664),1,.1,.3)
clang=sum(np.sin(2*np.pi*f*np.arange(S(1.2))/SR)*np.exp(-np.arange(S(1.2))/SR/.5)/(i+1) for i,f in enumerate([420,880,1330,2100]))*.25
put(clang,F(1680),1,.2,.5)
# swim (1720-1900): strokes & breaths
tt=F(1722)
while tt<F(1895):
    st=lp(nz(.55),1300)*np.sin(np.linspace(0,np.pi,S(.55)))**2*.5; put(st,tt,1,rng.uniform(-.2,.2),.25)
    put(lp(hp(nz(.3),500),2500)*env(S(.3),.03,.1)*.3,tt+.35,1,0,.2)  # breath
    tt+=.78+rng.random()*.15
# castle (1900): wind + distant bell
bed(F(1900),F(1965),'gust',.6)
for k in range(3):
    bl=sum(np.sin(2*np.pi*f*np.arange(S(2.5))/SR)*np.exp(-np.arange(S(2.5))/SR/1.0)/(i+1) for i,f in enumerate([330,553,880,1210]))*.12
    put(bl,F(1912)+k*.9,1,.5,.6)
# tunnel (1960-2092): claustrophobic
bed(F(1955),F(2095),'cave',.7)
tt=F(1966)
while tt<F(2088):
    put(lp(hp(nz(.3),300),2200)*env(S(.3),.004,.07)*.4,tt,1,rng.uniform(-.3,.3),.15)  # digging
    tt+=.46+rng.random()*.14
for k in range(5): put(np.sin(2*np.pi*(1800+rng.random()*400)*np.arange(S(.06))/SR)*np.exp(-np.arange(S(.06))/SR/.012)*.12,F(1975)+k*rng.uniform(.9,2.6),1,rng.uniform(-.7,.7),.5) # drips
for fr in (2010,2050): 
    x=np.sin(2*np.pi*(65+10*np.sin(np.linspace(0,12,S(1.0))))*np.arange(S(1.0))/SR)*np.hanning(S(1.0))*.18; put(x,F(fr),1,-.3,.2) # rope creak
heart(F(2030),22,60+0,.45)
# night chase (2092-2272)
bed(F(2090),F(2272),'night',.7)
e=S(7.5); a=np.arange(e)/SR; hum=(np.sin(2*np.pi*100*a)+.5*np.sin(2*np.pi*200*a))*.05*(0.8+.2*np.sin(2*np.pi*.5*a)); put(hum,F(2092),1,.6,.2) # searchlight
# alarm bell + whistles
for k in range(12):
    bl=sum(np.sin(2*np.pi*f*np.arange(S(.7))/SR)*np.exp(-np.arange(S(.7))/SR/.2)/(i+1) for i,f in enumerate([700,1500,2300]))*.18
    put(bl,F(2100)+k*.22,1,.7,.4)
for fr in (2130,2158,2190):
    a2=np.arange(S(.8))/SR; w=np.sin(2*np.pi*(2600+120*np.sin(2*np.pi*35*a2))*a2)*np.hanning(S(.8))*.1; put(w,F(fr),1,-.4,.4)
runfoot(2092,2200,-.2,.8,6); runfoot(2100,2205,.5,.6,7)
fire_seq(2110,2272,16,0,.4,1,kind=1,g=.7); fire_seq(2120,2272,19,0,-.5,1,kind=1,g=.7); volleys(2110,2272,8,g=.8)
explode(2208,0,.9,3.2); put(rifle(0,1)*1.3,F(2208)-.05,1,0,.5)
# =========== MUSIC (cinematic, minor, builds) ===========
T=np.arange(N)/SR
def pad(freqs,t0,t1,g=1.0,bright=0.5):
    e=S(t1-t0); a=np.arange(e)/SR; x=np.zeros(e)
    for f in freqs:
        for dt in (-.006,0,.006):
            ph=2*np.pi*f*(1+dt)*a; x+=(np.sin(ph)+bright*0.5*np.sin(2*ph)+bright*0.3*np.sin(3*ph))
    x=lp(x,1800)/ (len(freqs)*3)
    fd=np.minimum(np.minimum(a/2.5,(t1-t0-a)/2.5),1); MUS[S(t0):S(t0)+e]+=x*fd*g
def cello(freq,t0,d,g=1):
    e=S(d); a=np.arange(e)/SR; vib=1+0.004*np.sin(2*np.pi*5.5*a)*np.minimum(a/.6,1)
    ph=2*np.pi*freq*np.cumsum(vib)/SR
    x=(np.sin(ph)+.5*np.sin(2*ph)+.35*np.sin(3*ph)+.2*np.sin(4*ph))*np.minimum(a/.25,1)*np.minimum((d-a)/.4,1)
    MUS[S(t0):S(t0)+e]+=lp(x,2500)*.09*g
def timp(t,g=1):
    e=S(1.6); a=np.arange(e)/SR; x=np.sin(2*np.pi*(55-12*np.minimum(a*4,1))*a)*np.exp(-a/.5)+lp(nz(1.6),300)*env(e,.002,.12)*.6
    put(x*g*.9,t,1,0,.5)
# progression (Am - F - C - G ... ), per section
sections=[(0,19,[110,164.8,261.6]),(19,38,[87.3,130.8,220]),(38,59,[98,146.8,233.1]),(59,64,[130.8,196,329.6,523.2]),(64,80,[110,164.8,220,329.6]),(80,87,[98,146.8,233.1]),(87,94.8,[110,164.8,261.6,329.6])]
for a,b,fr in sections: pad(fr,a,b,.55)
mel=[(1,220,2.5),(3.5,261.6,1.5),(5,246.9,3),(8,220,2),(10.5,174.6,2.5),(13.5,164.8,4)]
for t,f,d in mel: cello(f,t,d,1)
for t,f,d in [(20,174.6,3),(23.5,164.8,2.5),(27,146.8,4),(32,174.6,2),(34.5,196,3)]: cello(f,t,d,1.1)
for t,f,d in [(40,146.8,3),(44,130.8,3),(48,123.5,4),(53,146.8,3),(56,164.8,3)]: cello(f,t,d,1.1)
for t,f,d in [(59,523.2,1.2),(60.3,659.3,1.2),(61.6,784,2.4)]: cello(f,t,d,.8)
for t,f,d in [(65,220,3),(69,196,2.5),(73,174.6,4),(78,164.8,3)]: cello(f,t,d,1)
# ostinato strings (pulse) in tension scenes
def pulse(t0,t1,freq,rate=2.0,g=.08):
    t=t0
    while t<t1:
        e=S(.28); a=np.arange(e)/SR; x=(np.sin(2*np.pi*freq*a)+.5*np.sin(4*np.pi*freq*a))*np.exp(-a/.09)*np.minimum(a/.005,1); MUS[S(t):S(t)+e]+=lp(x,2200)*g; t+=1/rate
pulse(F(1960),F(2092),110,1.5+0*1,.10); pulse(F(2092),F(2272),110,3.2,.13); pulse(F(2092),F(2272),146.8,3.2,.08)
# percussion at the key beats
for fr,g in [(192,1.3),(654,1.3),(1168,1.5),(556,1.0),(1624,1.4),(2208,1.3),(92,.9),(314,.9),(2092,1.0)]:
    timp(F(fr)-0.02,g)
for k in range(8): timp(F(2092)+k*.32*1.0+.0,.25+.06*k)  # build into the chase
# risers before chapter changes
def riser(t0,d,g=.4):
    e=S(d); a=np.arange(e)/SR; n=rng.standard_normal(e); x=hp(n,1200)*(a/d)**2+lp(n,400)*(a/d)*.5; MUS[S(t0):S(t0)+e]+=x*g*.35
riser(F(1070)-.5,2.5,.7); riser(F(1590),F(1624)/1.0*0+1.4,.7); riser(F(2040),2.0,.8)
MUS*=np.minimum(1,np.minimum(T/2.5,(TOT/FPS-T)/4)).clip(0,1)
# =========== MIX ===========
def load(f):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f,'-ar',str(SR),'-ac','1','-f','f32le','/tmp/_v.raw'],check=True)
    return np.fromfile('/tmp/_v.raw','<f4').astype(np.float64)
vo=np.zeros(N)
for i,t0 in enumerate([0.6,19.5,40.2,58.6,65.5,78.5]):
    x=load(os.path.join(D,f'v{i+1}.mp3')); vo[S(t0):S(t0)+len(x)]+=x[:N-S(t0)]
# reverb on wet bus (synthetic IR)
ir_n=S(2.4); t=np.arange(ir_n)/SR
irL=rng.standard_normal(ir_n)*np.exp(-t/0.55); irR=rng.standard_normal(ir_n)*np.exp(-t/0.55)
irL=lp(irL,3500); irR=lp(irR,3500); irL/=np.abs(irL).sum()/6; irR/=np.abs(irR).sum()/6
def conv(x,ir):
    n=1<<int(np.ceil(np.log2(len(x)+len(ir)))); return np.fft.irfft(np.fft.rfft(x,n)*np.fft.rfft(ir,n),n)[:len(x)]
rl=conv(WET[0],irL); rr=conv(WET[1],irR)
# dramatic dips: music/ambience duck hard around hits, recover slowly
dip=np.ones(N)
for fr in (192,654,1168):
    t0=F(fr); a=np.arange(N)/SR
    pre=np.clip((a-(t0-.35))/.35,0,1)*(a<t0)         # fade-out just before
    dip*=1-0.9*((a>=t0-.35)&(a<t0+.05))*np.clip((a-(t0-.35))/.3,0,1)
    dip*=1-0.8*((a>=t0+.05)&(a<t0+3.0))*np.exp(-(a-t0)/1.4)
dv=np.convolve(np.abs(vo),np.ones(S(.12))/S(.12),'same'); duck=1-0.5*np.clip(dv/0.05,0,1); duck=np.convolve(duck,np.ones(S(.25))/S(.25),'same')
sfxL=(L+rl*1.0); sfxR=(R+rr*1.0)
outL=vo*1.0+ (sfxL*0.9)*(0.5+0.5*duck) + (MUS*dip+AMB*dip*.9)*duck
outR=vo*1.0+ (sfxR*0.9)*(0.5+0.5*duck) + (MUS*dip+AMB*dip*.9)*duck
# gentle bus compression + limiter
def comp(x):
    y=x.copy(); thr=.35; m=np.abs(y)>thr; y[m]=np.sign(y[m])*(thr+(np.abs(y[m])-thr)*.4); return y
outL=np.tanh(comp(outL)*1.1); outR=np.tanh(comp(outR)*1.1)
pk=max(np.abs(outL).max(),np.abs(outR).max()); outL*=.92/pk; outR*=.92/pk
pcm=(np.stack([outL,outR],1)*32767).astype('<i2')
with wave.open(sys.argv[1],'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok',N/SR)
