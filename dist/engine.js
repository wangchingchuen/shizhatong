// Deterministic, local demonstration classifier. No trained model or remote API.
export const rules=[
 {id:'authority',label:'假冒權威／司法機關',re:/地檢署|檢察官|刑警|洗錢案|涉入.*案件|公安/,weight:18},
 {id:'secrecy',label:'要求保密與隔離求助',re:/不能.*(家人|掛斷)|不可.*(家人|掛斷)|不要.*(家人|告訴|掛)|保密|偵查不公開/,weight:22},
 {id:'money',label:'要求移轉資金',re:/監管帳戶|安全帳戶|匯款|轉帳|操作\s*ATM|提款機|保證金/,weight:25},
 {id:'credentials',label:'索取驗證碼或帳戶資料',re:/驗證碼|OTP|密碼|信用卡.*(號|資料)|銀行帳號/,weight:20},
 {id:'pressure',label:'施加時間壓力或威脅',re:/立刻|馬上|十分鐘|凍結|逮捕|拘提|最後機會/,weight:15},
 {id:'investment',label:'保證獲利／投資誘導',re:/穩賺|保證獲利|保證收益|內線|投資群|翻倍|老師帶/,weight:22},
 {id:'link',label:'引導開啟陌生連結',re:/https?:\/\/|點.*連結|點.*網址|下載.*(程式|軟體|APP)/i,weight:12},
 {id:'refund',label:'退款或付款設定異常',re:/重複扣款|分期.*設定|解除分期|退款.*操作/,weight:18}
];
export function analyze(text,previous=[],threshold=55){
 const normalized=String(text).normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g,'');
 const clauses=normalized.split(/[，。！？；\n]/).filter(Boolean);
 const isSafety=clause=>/不會|不需|不必|不要|切勿|勿提供/.test(clause)&&/轉帳|匯款|驗證碼|密碼|連結|ATM/.test(clause)&&!/不會被|不要告訴|不能告訴|必須|還是要/.test(clause);
 const actionable=clauses.filter(clause=>!isSafety(clause)).join('。');
 const safety=clauses.some(isSafety)&&!rules.some(r=>r.re.test(actionable));
 const hits=rules.filter(r=>r.re.test(actionable));
 const signals=[...new Set([...previous,...hits.map(r=>r.id)])];
 let score=signals.reduce((s,id)=>s+(rules.find(r=>r.id===id)?.weight||0),0);
 const combo=(a,b)=>signals.includes(a)&&signals.includes(b);
 if(combo('authority','money')||combo('secrecy','money')||combo('investment','money')||combo('credentials','pressure'))score+=20;
 score=Math.min(98,score);
 return {hits:hits.map(({id,label,weight})=>({id,label,weight})),signals,score,level:score>=threshold?'high':score>=25?'medium':'low',l2:hits.length>0,reasons:signals.map(id=>rules.find(r=>r.id===id)?.label).filter(Boolean),safety};
}
export const scenarios={
 police:{name:'假檢警・監管帳戶',caller:'陌生來電',number:'02-5550-0188',lines:[['0:00','您好，這裡是地檢署，您涉及一起洗錢案。'],['3:00','偵查不公開，不要告訴家人，也不能掛斷。'],['8:00','請立刻到提款機，轉帳到監管帳戶。'],['10:00','配合處理就不會被拘提，馬上操作 ATM。']]},
 refund:{name:'假客服・解除分期',caller:'購物平台客服（自稱）',number:'09-0000-0123',lines:[['0:00','您好，您上週的訂單有付款設定錯誤。'],['2:00','系統重複扣款，需要解除分期設定。'],['4:00','請操作 ATM 進行退款，立刻依照指示轉帳。'],['5:00','請把手機收到的驗證碼提供給我。']]},
 investment:{name:'假投資・保證獲利',caller:'投資顧問（自稱）',number:'09-0000-0456',lines:[['0:00','老師帶您投資，內線消息保證獲利。'],['2:00','這是最後機會，資金一週就能翻倍。'],['4:00','請馬上匯款到老師的銀行帳號。']]},
 normal:{name:'正常通話・家人關心',caller:'家人',number:'聯絡人',lines:[['0:00','媽，我今天六點回家，一起吃晚餐。'],['1:00','我已經買好水果了，你不用出門。'],['2:00','記得休息，等等見。']]},
 education:{name:'正常提醒・防詐宣導',caller:'防詐提醒示例',number:'情境示意',lines:[['0:00','防詐提醒：銀行不會要求您操作 ATM 轉帳。'],['1:00','切勿提供驗證碼或密碼，也不要點陌生連結。'],['2:00','有疑慮請自行查證官方聯絡方式。']]}
};

