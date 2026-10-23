export type Bill = {id:string;name:string;amount:number;day:number;category:string;active:boolean;startDate?:string};
export type Loan = {id:string;name:string;balance:number;apr:number;minimum:number;day:number;priority:number;active:boolean;startDate?:string};
export type Paycheck = {date:string;amount:number};
export type Override = {amount?:number;paid?:boolean};
export type Workspace = {payStart:string;payAmount:number;years:number;payOverrides:Record<string,number>;bills:Bill[];loans:Loan[];occurrenceOverrides:Record<string,Override>;reserve:number;strategy:'avalanche'|'priority'|'snowball';initialCash:number};
export type Item = {key:string;id:string;name:string;date:string;amount:number;type:'bill'|'loan';paid:boolean;category:string};
export type Period = {date:string;nextDate:string;pay:number;items:Item[];allocated:number;remaining:number;running:number};
export const money=(v:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);
export const uid=()=>Math.random().toString(36).slice(2,10);
const pad=(v:number)=>String(v).padStart(2,'0');
export const dateStr=(d:Date)=>`${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
export const parseDate=(s:string)=>new Date(`${s}T12:00:00Z`);
export function plusDays(s:string,n:number){const d=parseDate(s);d.setUTCDate(d.getUTCDate()+n);return dateStr(d);}
export function dueDate(y:number,m:number,day:number){const last=new Date(Date.UTC(y,m+1,0)).getUTCDate();return `${y}-${pad(m+1)}-${pad(Math.min(day,last))}`;}
export const seed:Workspace={payStart:'2026-10-23',payAmount:2800,years:3,payOverrides:{},reserve:200,initialCash:0,strategy:'avalanche',occurrenceOverrides:{},bills:[
{id:'rent',name:'Room Rent',amount:850,day:1,category:'Housing',active:true},
{id:'gas',name:'Gas',amount:150,day:1,category:'Transportation',active:true},
{id:'electricity',name:'Electricity',amount:100,day:17,category:'Utilities',active:true},
{id:'insurance',name:'Insurance',amount:80,day:22,category:'Insurance',active:true},
{id:'phone',name:'Phone + Internet',amount:20,day:30,category:'Utilities',active:true},
{id:'groceries',name:'Groceries',amount:400,day:30,category:'Food',active:true},
{id:'misc',name:'Miscellaneous',amount:177,day:30,category:'Other',active:true}
],loans:[
{id:'personal',name:'Personal Loan',balance:0,apr:0,minimum:610,day:5,priority:1,active:true},
{id:'car',name:'Car Loan',balance:0,apr:0,minimum:551,day:13,priority:2,active:true},
{id:'education',name:'Education Loan',balance:0,apr:0,minimum:562,day:28,priority:3,active:true}
]};
export function buildPeriods(w:Workspace):Period[]{
 const count=Math.round(26*w.years)+1;
 const dates=Array.from({length:count+1},(_,i)=>plusDays(w.payStart,i*14));
 const periods:Period[]=[]; let running=w.initialCash;
 for(let i=0;i<count;i++){
 const start=dates[i],end=dates[i+1]; const items:Item[]=[];
 const date=parseDate(start),endDate=parseDate(end);
 for(let y=date.getUTCFullYear();y<=endDate.getUTCFullYear();y++)for(let m=0;m<12;m++){
  const sources=[...w.bills.filter(b=>b.active).map(b=>({...b,type:'bill' as const,amount:b.amount})),...w.loans.filter(l=>l.active).map(l=>({...l,type:'loan' as const,amount:l.minimum,category:'Loan'}))];
  for(const b of sources){
   const due=dueDate(y,m,b.day);
   if(due>=start&&due<end&&(!b.startDate||due>=b.startDate)){
    const key=`${b.type}:${b.id}:${due}`,ov=w.occurrenceOverrides[key]||{};
    items.push({key,id:b.id,name:b.name,date:due,amount:ov.amount??b.amount,type:b.type,paid:!!ov.paid,category:b.category});
   }
  }
 }
 items.sort((a,b)=>a.date.localeCompare(b.date)||a.name.localeCompare(b.name));
 const pay=w.payOverrides[start]??w.payAmount;
 const allocated=items.reduce((a,b)=>a+b.amount,0);
 const remaining=pay-allocated;running+=remaining;
 periods.push({date:start,nextDate:end,pay,items,allocated,remaining,running});
 }
 return periods;
}
export function recommendedLoan(w:Workspace){const eligible=w.loans.filter(l=>l.active&&l.balance>0);if(!eligible.length)return null;return [...eligible].sort((a,b)=>w.strategy==='priority'?a.priority-b.priority:w.strategy==='snowball'?a.balance-b.balance:b.apr-a.apr)[0];}
export function migrate(input:any):Workspace{
 if(!input||!Array.isArray(input.bills)||!Array.isArray(input.loans))throw Error('Invalid backup file');
 return {...seed,...input,years:3,occurrenceOverrides:input.occurrenceOverrides||{},payOverrides:input.payOverrides||{}};
}
