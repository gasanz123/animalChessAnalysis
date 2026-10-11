/* Procedural chess figures and a small WebGL renderer. No external assets required. */
(() => {
  "use strict";
  const PI = Math.PI;
  const add = (a, b) => a.map((v, i) => v + b[i]);
  const sub = (a, b) => a.map((v, i) => v - b[i]);
  const dot = (a, b) => a.reduce((n, v, i) => n + v * b[i], 0);
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const norm = (a) => { const n = Math.hypot(...a) || 1; return a.map(v => v / n); };
  const mul = (a, b) => {
    const out = new Float32Array(16);
    for (let c=0; c<4; c++) for (let r=0; r<4; r++) for (let k=0; k<4; k++) out[c*4+r] += a[k*4+r]*b[c*4+k];
    return out;
  };
  const vector = (m, v) => [0,1,2,3].map(r => v.reduce((n,x,c) => n + m[c*4+r]*x, 0));
  const model = (x=0, y=0, z=0, angle=0) => {
    const c=Math.cos(angle), s=Math.sin(angle);
    return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, x,y,z,1]);
  };
  const rotate = (v, angles) => {
    let [x,y,z]=v;
    for (let axis=0; axis<3; axis++) {
      const c=Math.cos(angles[axis]), s=Math.sin(angles[axis]);
      if (axis===0) [y,z]=[y*c-z*s,y*s+z*c];
      if (axis===1) [x,z]=[x*c+z*s,-x*s+z*c];
      if (axis===2) [x,y]=[x*c-y*s,x*s+y*c];
    }
    return [x,y,z];
  };
  function vertex(mesh, p, n) { mesh.push(...p, ...n); }
  function lathe(profile, segments=28) {
    const mesh=[];
    const point=(j,i) => {
      const a=i/segments*2*PI, [r,y]=profile[j];
      const prev=profile[Math.max(0,j-1)], next=profile[Math.min(profile.length-1,j+1)];
      return [[r*Math.cos(a),y,r*Math.sin(a)], norm([(next[1]-prev[1])*Math.cos(a),prev[0]-next[0],(next[1]-prev[1])*Math.sin(a)])];
    };
    for(let j=0;j<profile.length-1;j++) for(let i=0;i<segments;i++) {
      const a=point(j,i), b=point(j,i+1), c=point(j+1,i), d=point(j+1,i+1);
      for(const v of [a,c,b,b,c,d]) vertex(mesh,...v);
    }
    return mesh;
  }
  function sphere(rings=14, segments=24) {
    const mesh=[];
    const p=(j,i) => {
      const a=j/rings*PI, b=i/segments*2*PI;
      const n=[Math.sin(a)*Math.cos(b), Math.cos(a), Math.sin(a)*Math.sin(b)];
      return [n,n];
    };
    for(let j=0;j<rings;j++) for(let i=0;i<segments;i++) for(const v of [p(j,i),p(j+1,i),p(j,i+1),p(j,i+1),p(j+1,i),p(j+1,i+1)]) vertex(mesh,...v);
    return mesh;
  }
  function box() {
    const mesh=[];
    for (const [n,u,v] of [
      [[1,0,0],[0,0,-.5],[0,.5,0]], [[-1,0,0],[0,0,.5],[0,.5,0]],
      [[0,1,0],[.5,0,0],[0,0,-.5]], [[0,-1,0],[.5,0,0],[0,0,.5]],
      [[0,0,1],[.5,0,0],[0,.5,0]], [[0,0,-1],[-.5,0,0],[0,.5,0]]
    ]) {
      const c=n.map(x=>x*.5), corners=[sub(sub(c,u),v),add(sub(c,v),u),add(add(c,u),v),add(sub(c,u),v)];
      for(const i of [0,1,2,0,2,3]) vertex(mesh,corners[i],n);
    }
    return mesh;
  }
  const BALL=sphere(), BOX=box();
  function shape(target, source, p=[0,0,0], scale=[1,1,1], angles=[0,0,0]) {
    for(let i=0;i<source.length;i+=6) {
      const pos=add(rotate(source.slice(i,i+3).map((x,j)=>x*scale[j]),angles),p);
      const normal=norm(rotate(source.slice(i+3,i+6).map((x,j)=>x/scale[j]),angles));
      vertex(target,pos,normal);
    }
  }
  function figure(type, animal) {
    const m={body:[],trim:[],eyes:[]};
    const ball=(p,s,part="body",a=[0,0,0]) => shape(m[part],BALL,p,s,a);
    const cube=(p,s,part="body",a=[0,0,0]) => shape(m[part],BOX,p,s,a);
    const turned=(profile,part="body",p=[0,0,0],a=[0,0,0]) => shape(m[part],lathe(profile),p,[1,1,1],a);
    const cone=(p,r,h,part="body",a=[0,0,0]) => turned([[0,0],[r,0],[r,.025],[0,h]],part,p,a);
    const eyes=(y,z,width=.14) => [-1,1].forEach(s=>ball([s*width,y,z],[.035,.04,.035],"eyes"));
    turned([[0,0],[.32,0],[.39,.035],[.39,.09],[.35,.15],[.3,.19],[.28,.23],[0,.23]]);
    turned([[.32,.125],[.34,.135],[.33,.16],[.31,.17]],"trim");
    if(!animal && type!=="n") {
      const profiles={
        p:[[0,.2],[.25,.2],[.21,.3],[.13,.55],[.17,.63],[.2,.67],[.19,.72],[0,.72]],
        r:[[0,.2],[.27,.2],[.22,.33],[.21,.83],[.29,.88],[.3,.95],[.27,1.08],[0,1.08]],
        b:[[0,.2],[.26,.2],[.19,.32],[.11,.82],[.18,.89],[.21,.96],[.13,1.01],[0,1.01]],
        q:[[0,.2],[.28,.2],[.2,.34],[.13,.9],[.23,1.01],[.25,1.08],[.19,1.12],[.22,1.3],[0,1.3]],
        k:[[0,.2],[.29,.2],[.2,.36],[.14,.99],[.23,1.04],[.23,1.13],[.17,1.18],[0,1.18]]
      };
      turned(profiles[type]);
      if(type==="p") ball([0,.83,0],[.205,.205,.205]);
      if(type==="r") for(let i=0;i<6;i++){const a=i*PI/3;cube([Math.sin(a)*.24,1.15,Math.cos(a)*.24],[.15,.2,.15]);}
      if(type==="b") {
        ball([0,1.15,0],[.18,.28,.18]);
        ball([0,1.43,0],[.055,.06,.055],"trim");
        cube([0,1.23,-.175],[.035,.25,.025],"trim",[0,0,-.4]);
      }
      if(type==="q") for(let i=0;i<8;i++){const a=i*PI/4;cone([Math.sin(a)*.19,1.23,Math.cos(a)*.19],.065,.17);ball([Math.sin(a)*.23,1.42,Math.cos(a)*.23],[.05,.05,.05],"trim");}
      if(type==="k") {ball([0,1.24,0],[.16,.13,.16]);cube([0,1.5,0],[.095,.42,.095],"trim");cube([0,1.55,0],[.31,.08,.095],"trim");}
    } else if(type==="n") {
      // Horse / knight: a sloping neck, long muzzle, upright ears and mane.
      ball([0,.58,.065],[.22,.46,.23],"body",[.25,0,0]);
      ball([0,1.04,-.08],[.235,.26,.25]);
      ball([0,.99,-.31],[.18,.15,.29],"body",[-.25,0,0]);
      for(const x of [-.13,.13]) cone([x,1.15,-.035],.075,.32,"body",[-.18,0,0]);
      ball([0,.78,.245],[.09,.42,.075],"trim",[.35,0,0]);
      ball([0,1.05,-.565],[.145,.035,.023],"trim");
      for(const x of [-.205,.205]) ball([x,1.1,-.21],[.025,.043,.05],"eyes");
    } else if(type==="p") {
      // Wolf: seated haunches, muzzle, pointed ears and a curled tail.
      ball([0,.46,.055],[.25,.3,.23]);
      ball([0,.71,-.035],[.205,.27,.2]);
      ball([0,.97,-.10],[.235,.225,.21]);
      ball([0,.89,-.30],[.135,.105,.17]);
      for(const x of [-.16,.16]) cone([x,1.05,-.055],.11,.28);
      ball([0,.93,-.445],[.065,.045,.045],"eyes");
      eyes(1.01,-.282,.125);
      for(const x of [-.15,.15]) ball([x,.27,-.20],[.105,.08,.16]);
      ball([.20,.34,.20],[.105,.10,.28],"trim",[0,-.6,0]);
    } else if(type==="k") {
      // Lion: mane around the face, small round ears and front paws.
      ball([0,.57,.02],[.29,.36,.27]);
      ball([0,1.05,-.035],[.37,.39,.24],"trim");
      ball([0,1.04,-.19],[.255,.265,.22]);
      for(const x of [-.21,.21]) ball([x,1.26,-.11],[.095,.11,.08]);
      for(const x of [-.10,.10]) ball([x,.95,-.385],[.11,.09,.09]);
      ball([0,1.01,-.453],[.065,.04,.035],"eyes");
      eyes(1.12,-.382);
      for(const x of [-.19,.19]) {ball([x,.47,-.18],[.09,.24,.1]);ball([x,.27,-.22],[.13,.08,.16]);}
      ball([.27,.45,.17],[.065,.24,.07],"trim",[0,0,-.5]);
    } else if(type==="q") {
      // Eagle: raised wings, a hooked golden beak and breast.
      ball([0,.70,0],[.24,.41,.21]);
      ball([0,1.1,-.055],[.185,.195,.18]);
      for(const s of [-1,1]) {
        ball([s*.29,.77,.015],[.11,.43,.22],"trim",[0,0,-s*.55]);
        ball([s*.43,.97,.055],[.065,.31,.17],"body",[0,0,-s*.40]);
        cube([s*.1,.29,-.10],[.1,.06,.22],"trim");
      }
      cone([0,1.10,-.19],.10,.21,"trim",[-PI/2,0,0]);
      ball([0,1.02,-.345],[.055,.09,.045],"trim");
      eyes(1.15,-.19,.11);
    } else if(type==="r") {
      // Elephant: broad ears, curved trunk and ivory tusks.
      ball([0,.61,.065],[.32,.34,.31]);
      ball([0,.86,-.13],[.285,.28,.23]);
      for(const s of [-1,1]) {
        ball([s*.29,.83,-.07],[.16,.25,.075],"trim",[0,s*.25,0]);
        ball([s*.22,.38,-.11],[.11,.22,.11]);
        cone([s*.16,.65,-.31],.045,.18,"trim",[-1.3,0,0]);
      }
      ball([0,.64,-.365],[.10,.26,.10]);
      ball([0,.43,-.44],[.095,.095,.15],"body",[-.45,0,0]);
      eyes(.94,-.326,.18);
    } else if(type==="b") {
      // Giraffe: tall neck, ossicones, ears and a long muzzle.
      ball([0,.48,.03],[.255,.28,.23]);
      ball([0,.91,-.035],[.115,.53,.13],"body",[-.10,0,0]);
      ball([0,1.37,-.15],[.16,.18,.265]);
      for(const s of [-1,1]) {
        ball([s*.19,1.40,-.04],[.15,.045,.075],"trim",[0,0,s*.3]);
        turned([[0,0],[.028,0],[.028,.17],[0,.17]],"trim",[s*.08,1.47,-.02]);
        ball([s*.08,1.64,-.02],[.052,.045,.052],"trim");
        ball([s*.16,1.40,-.18],[.025,.037,.037],"eyes");
      }
      for(let i=0;i<4;i++) ball([.104,.67+i*.16,-.04],[.015,.045,.06],"trim");
      ball([0,1.32,-.385],[.12,.065,.035],"trim");
    }
    return m;
  }
  class ChessScene {
    constructor(canvas, labels, onSquare, onError) {
      this.canvas=canvas; this.labels=labels; this.onSquare=onSquare; this.onError=onError;
      this.azimuth=-.25; this.elevation=53*PI/180; this.focusSquare=null; this.drag=null;
      const gl=canvas.getContext("webgl",{antialias:true,alpha:true});
      if(!gl) throw new Error("WebGL is unavailable");
      this.gl=gl;
      const vs="attribute vec3 position;attribute vec3 normal;uniform mat4 model;uniform mat4 viewProjection;varying vec3 n;varying vec3 world;void main(){vec4 p=model*vec4(position,1.0);world=p.xyz;n=mat3(model)*normal;gl_Position=viewProjection*p;}";
      const fs="precision mediump float;varying vec3 n;varying vec3 world;uniform vec4 color;uniform vec3 eye;uniform float unlit;void main(){vec3 N=normalize(n);vec3 L=normalize(vec3(-0.6,1.0,0.6));float diffuse=max(dot(N,L),0.0);float fill=max(dot(N,normalize(vec3(0.8,0.5,-0.8))),0.0);vec3 H=normalize(L+normalize(eye-world));float spec=pow(max(dot(N,H),0.0),42.0);vec3 shaded=color.rgb*(0.33+0.64*diffuse+0.22*fill)+vec3(0.22)*spec;gl_FragColor=vec4(mix(shaded,color.rgb,unlit),color.a);}";
      const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));return s;};
      this.program=gl.createProgram();
      const vert=shader(gl.VERTEX_SHADER,vs), frag=shader(gl.FRAGMENT_SHADER,fs);
      gl.attachShader(this.program,vert); gl.attachShader(this.program,frag); gl.linkProgram(this.program);
      gl.deleteShader(vert); gl.deleteShader(frag);
      if(!gl.getProgramParameter(this.program,gl.LINK_STATUS)) throw new Error("Could not link the 3D renderer");
      gl.useProgram(this.program);
      this.loc={};
      for(const name of ["model","viewProjection","color","eye","unlit"]) this.loc[name]=gl.getUniformLocation(this.program,name);
      this.pos=gl.getAttribLocation(this.program,"position"); this.normal=gl.getAttribLocation(this.program,"normal");
      gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      this.meshes={};
      const geometry=(source,p,scale) => {const m=[];shape(m,source,p,scale);return this.upload(m);};
      this.tile=geometry(BOX,[0,-.045,0],[.998,.09,.998]);
      this.base=geometry(BOX,[0,-.30,0],[8.8,.52,8.8]);
      this.rim=geometry(BOX,[0,-.07,0],[8.65,.12,8.65]);
      this.shadow=this.upload(lathe([[0,.007],[.32,.007],[.42,.007]],32));
      this.marker=this.upload(lathe([[0,.012],[.13,.012]],24));
      const outline=[]; for(const [p,s] of [
        [[0,.012,-.475],[.97,.025,.05]],[[0,.012,.475],[.97,.025,.05]],
        [[-.475,.012,0],[.05,.025,.97]],[[.475,.012,0],[.05,.025,.97]]
      ]) shape(outline,BOX,p,s);
      this.outline=this.upload(outline);
      for(const set of ["animal","standard"]) for(const type of ["k","q","r","b","n","p"]) {
        const parts=figure(type,set==="animal");
        this.meshes[set+type]=Object.fromEntries(Object.entries(parts).map(([name,data])=>[name,this.upload(data)]));
      }
      this.coordinates=[];
      for(let i=0;i<8;i++) for(const [text,p] of [
        [String.fromCharCode(97+i),[i-3.5,.012,4.18]],
        [String.fromCharCode(97+i),[i-3.5,.012,-4.18]],
        [String(8-i),[-4.18,.012,i-3.5]],
        [String(8-i),[4.18,.012,i-3.5]]
      ]) {const el=document.createElement("span");el.textContent=text;labels.append(el);this.coordinates.push({el,p});}
      this.bindInput();
      this.observer=new ResizeObserver(()=>this.draw()); this.observer.observe(canvas);
      canvas.addEventListener("webglcontextlost",e=>{e.preventDefault();this.lost=true;onError();});
    }
    upload(data) {
      const gl=this.gl, buffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
      return {buffer,count:data.length/6};
    }
    paint(mesh,matrix,color,unlit=0) {
      if(!mesh.count)return;
      const gl=this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffer);
      gl.enableVertexAttribArray(this.pos); gl.enableVertexAttribArray(this.normal);
      gl.vertexAttribPointer(this.pos,3,gl.FLOAT,false,24,0); gl.vertexAttribPointer(this.normal,3,gl.FLOAT,false,24,12);
      gl.uniformMatrix4fv(this.loc.model,false,matrix); gl.uniform4fv(this.loc.color,color);
      gl.uniform1f(this.loc.unlit,unlit); gl.drawArrays(gl.TRIANGLES,0,mesh.count);
    }
    update(state) {this.state=state;this.draw();}
    camera() {
      const angle=this.azimuth+(this.state?.flipped?PI:0), distance=18.5;
      this.eye=[Math.sin(angle)*Math.cos(this.elevation)*distance,Math.sin(this.elevation)*distance,Math.cos(angle)*Math.cos(this.elevation)*distance];
      const z=norm(this.eye), x=norm(cross([0,1,0],z)), y=cross(z,x);
      this.right=x;this.up=y;this.forward=z.map(v=>-v);
      const view=new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,this.eye),-dot(y,this.eye),-dot(z,this.eye),1]);
      const aspect=this.canvas.clientWidth/this.canvas.clientHeight, f=1/Math.tan(40*PI/360);
      this.projectionScale=f;this.aspect=aspect;
      const projection=new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,-1.005,-1,0,0,-.2005,0]);
      this.viewProjection=mul(projection,view);
    }
    draw() {
      if(!this.state||this.lost||!this.canvas.clientWidth||!this.canvas.clientHeight) return;
      const gl=this.gl, width=this.canvas.clientWidth,height=this.canvas.clientHeight,ratio=Math.min(window.devicePixelRatio||1,2);
      if(this.canvas.width!==Math.round(width*ratio)||this.canvas.height!==Math.round(height*ratio)) {
        this.canvas.width=Math.round(width*ratio);this.canvas.height=Math.round(height*ratio);
      }
      gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      this.camera();gl.useProgram(this.program);gl.uniformMatrix4fv(this.loc.viewProjection,false,this.viewProjection);gl.uniform3fv(this.loc.eye,this.eye);
      this.paint(this.base,model(),[.17,.105,.065,1]);
      this.paint(this.rim,model(),[.29,.205,.12,1]);
      for(let r=0;r<8;r++)for(let f=0;f<8;f++) this.paint(this.tile,model(f-3.5,0,r-3.5),(r+f)%2?[.31,.45,.39,1]:[.88,.81,.65,1]);
      const point=s=>[s.charCodeAt(0)-97-3.5,0,8-Number(s[1])-3.5];
      for(const [square,color] of [[this.state.bestFrom,[.8,.61,.22,1]],[this.state.bestTo,[.5,.8,.57,1]],[this.state.selected,[1,.76,.25,1]],[this.focusSquare,[.54,.78,1,1]]]) {
        if(square) this.paint(this.outline,model(...point(square)),color,1);
      }
      for(const square of this.state.targets||[]) this.paint(this.marker,model(...point(square)),[.13,.28,.22,.8],1);
      gl.depthMask(false);
      for(let r=0;r<8;r++)for(let f=0;f<8;f++)if(this.state.board[r][f])this.paint(this.shadow,model(f-3.5,0,r-3.5),[.04,.055,.045,.23],1);
      gl.depthMask(true);
      for(let r=0;r<8;r++)for(let f=0;f<8;f++) {
        const piece=this.state.board[r][f];if(!piece)continue;
        const white=piece.color==="w", m=model(f-3.5,.022,r-3.5,white?0:PI), parts=this.meshes[this.state.pieceSet+piece.type];
        this.paint(parts.body,m,white?[.97,.90,.73,1]:[.12,.19,.22,1]);
        this.paint(parts.trim,m,white?[.60,.37,.12,1]:[.72,.49,.19,1]);
        this.paint(parts.eyes,m,white?[.035,.055,.05,1]:[.97,.77,.39,1]);
      }
      for(const {el,p} of this.coordinates) {
        const q=vector(this.viewProjection,[...p,1]);el.style.left=(q[0]/q[3]*.5+.5)*width+"px";el.style.top=(-q[1]/q[3]*.5+.5)*height+"px";
      }
    }
    rotate(delta) {this.azimuth+=delta;this.draw();}
    tilt(degrees) {this.elevation=Math.max(30,Math.min(72,degrees))*PI/180;this.draw();}
    reset() {this.azimuth=-.25;this.elevation=53*PI/180;this.draw();}
    pick(clientX,clientY) {
      const rect=this.canvas.getBoundingClientRect(), x=((clientX-rect.left)/rect.width*2-1)*this.aspect/this.projectionScale;
      const y=(1-(clientY-rect.top)/rect.height*2)/this.projectionScale;
      const direction=norm(add(this.forward,add(this.right.map(v=>v*x),this.up.map(v=>v*y))));
      // Pick a figure's volume before the board plane so heads remain clickable.
      let nearest=Infinity, picked=null;
      for(let r=0;r<8;r++)for(let f=0;f<8;f++) {
        const piece=this.state.board[r][f];if(!piece)continue;
        const heights={p:this.state.pieceSet==="animal"?1.34:1.04,r:1.25,n:1.5,b:1.74,q:1.51,k:1.75};
        const min=[f-3.84,0,r-3.84],max=[f-3.16,heights[piece.type],r-3.16];
        let near=0,far=Infinity;
        for(let a=0;a<3;a++) {
          if(Math.abs(direction[a])<1e-7){if(this.eye[a]<min[a]||this.eye[a]>max[a])far=-1;}
          else {let t1=(min[a]-this.eye[a])/direction[a],t2=(max[a]-this.eye[a])/direction[a];near=Math.max(near,Math.min(t1,t2));far=Math.min(far,Math.max(t1,t2));}
        }
        if(near<=far&&near<nearest){nearest=near;picked=String.fromCharCode(97+f)+(8-r);}
      }
      if(picked)return picked;
      if(direction[1]>=0)return null;
      const t=-this.eye[1]/direction[1],p=add(this.eye,direction.map(v=>v*t)),f=Math.floor(p[0]+4),r=Math.floor(p[2]+4);
      return f>=0&&f<8&&r>=0&&r<8?String.fromCharCode(97+f)+(8-r):null;
    }
    bindInput() {
      const c=this.canvas;
      c.addEventListener("pointerdown",e=>{
        if(e.button!==0||this.drag)return;
        c.focus();c.setPointerCapture(e.pointerId);
        this.drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};
      });
      c.addEventListener("pointermove",e=>{
        const d=this.drag;if(!d||d.id!==e.pointerId)return;
        if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>6)d.moved=true;
        if(d.moved){this.azimuth-=(e.clientX-d.lastX)*.008;this.elevation=Math.max(30*PI/180,Math.min(72*PI/180,this.elevation+(e.clientY-d.lastY)*.005));this.draw();this.onCameraChange?.(Math.round(this.elevation*180/PI));}
        d.lastX=e.clientX;d.lastY=e.clientY;
      });
      c.addEventListener("pointerup",e=>{
        const d=this.drag;if(!d||d.id!==e.pointerId)return;this.drag=null;c.releasePointerCapture(e.pointerId);
        if(!d.moved){const s=this.pick(e.clientX,e.clientY);if(s)this.onSquare(s);}
      });
      c.addEventListener("pointercancel",()=>{this.drag=null;});
      c.addEventListener("lostpointercapture",()=>{this.drag=null;});
      c.addEventListener("keydown",e=>{
        if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"," "].includes(e.key))return;
        e.preventDefault();
        this.focusSquare=this.focusSquare||"e2";
        if(e.key==="Enter"||e.key===" "){this.onSquare(this.focusSquare);return;}
        let f=this.focusSquare.charCodeAt(0)-97,r=8-Number(this.focusSquare[1]),flip=this.state.flipped?-1:1;
        if(e.key==="ArrowLeft")f-=flip;if(e.key==="ArrowRight")f+=flip;
        if(e.key==="ArrowUp")r-=flip;if(e.key==="ArrowDown")r+=flip;
        f=Math.max(0,Math.min(7,f));r=Math.max(0,Math.min(7,r));
        this.focusSquare=String.fromCharCode(97+f)+(8-r);this.onFocusSquare?.(this.focusSquare);this.draw();
      });
      c.addEventListener("blur",()=>{this.focusSquare=null;this.draw();});
    }
  }
  window.ChessScene=ChessScene;
})();
