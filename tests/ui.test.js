import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
class Element{
 constructor(){this.children=[];this.listeners={};this.dataset={};this.style={};this.classList={add(){},remove(){},toggle(){}};this.value='';this.checked=false;this.disabled=false;this.hidden=false;this._text='';}
 set textContent(value){this._text=String(value);this.children=[];}get textContent(){return this._text;}append(...nodes){this.children.push(...nodes);for(const n of nodes)n.parent=this;}prepend(node){this.children.unshift(node);node.parent=this;}replaceChildren(...nodes){this.children=[];this.append(...nodes);}get firstChild(){return this.children[0];}get lastChild(){return this.children.at(-1);}remove(){this.parent.children=this.parent.children.filter(n=>n!==this);}setAttribute(){}focus(){}addEventListener(event,fn){this.listeners[event]=fn;}fire(event){this.listeners[event]?.({preventDefault(){}});}
}
test('UI consent, playback, notifications, revocation and clearing',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');const elements=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element()]));const get=id=>elements.get(id);get('scenario').value='police';get('family-name').value='家人';
 globalThis.document={getElementById:get,createElement:()=>new Element(),querySelectorAll:()=>[],addEventListener(){},body:new Element()};globalThis.window={addEventListener(){}};
 await import('../dist/app.js');
 get('start').fire('click');assert.equal(get('score').textContent,'');assert.match(get('toast').textContent,/勾選/);
 get('consent').checked=true;get('start').fire('click');assert.equal(get('sentences').textContent,'1');assert.equal(get('scenario').disabled,true);
 get('next').fire('click');get('next').fire('click');assert.equal(get('warning').hidden,false);assert.ok(Number(get('score').textContent)>=55);
 get('notify').fire('click');assert.equal(get('family-notifications').children.length,1);assert.doesNotMatch(get('family-notifications').children[0].children[1].textContent,/地檢署|監管帳戶/);
 get('ack').fire('click');assert.equal(get('warning').hidden,true);get('next').fire('click');assert.equal(get('warning').hidden,false);
 get('custom').value='<img src=x onerror=alert(1)>';get('custom-form').fire('submit');assert.equal(get('transcript').lastChild.children[1].textContent,'<img src=x onerror=alert(1)>');
 get('consent').checked=false;get('consent').fire('change');assert.equal(get('score').textContent,'0');assert.equal(get('custom').disabled,true);assert.equal(get('transcript').children.length,1);
 get('clear').fire('click');assert.equal(get('family-notifications').children.length,0);assert.equal(get('threshold').value,55);assert.equal(get('scenario').disabled,false);
 // Allow pending transient UI toast timers to finish naturally.
});
