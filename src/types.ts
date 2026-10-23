export type Paycheck = {id:string;date:string;amount:number; note?:string};
export type Expense = {id:string;name:string;amount:number;day:number;category:string;active:boolean;kind:'bill'|'loan';loanId?:string};
export type Loan = {id:string;name:string;balance:number;apr:number;priority:number;minimum:number;dueDay:number;active:boolean};
export type Payment = {id:string;loanId:string;date:string;amount:number;extra:boolean;note?:string};
export type Settings = {reserve:number; strategy:'avalanche'|'priority'|'snowball';openingCash:number};
export type AppData = {paychecks:Paycheck[];expenses:Expense[];loans:Loan[];payments:Payment[];settings:Settings};
