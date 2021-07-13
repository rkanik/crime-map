import{deepGet,deepSet,isObject}from"../helpers";const mutations={PUSH:(e,[t,s])=>deepGet(e,t).push(s),UNSHIFT:(e,[t,s])=>deepGet(e,t).unshift(s),RESET:(e,t)=>mutations.SET(e,t),SET:(e,t)=>{Object.entries(t).forEach(([t,s])=>e[t]=s)},DELETE:(e,[t,s,i="id"])=>{let n=Array.isArray(s)?s:[s];deepSet(e,t,deepGet(e,t).filter(e=>!n.includes(e[i])))},UPDATE:(e,[t,s,i="id"])=>{deepSet(e,t,deepGet(e,t).map(e=>e[i]===s[i]?s:e))},MERGE:(e,[t,s,i="id"])=>{if(Array.isArray(e[t])){s=Array.isArray(s)?s:[s];const n=e[t].map(e=>e[i]),r=s.filter(e=>!n.includes(e[i]));e[t]=e[t].concat(r)}else isObject(e[t])&&(e[t]={...e[t],...s})}};export const createMutations=(...e)=>e.length?Object.keys(mutations).filter(t=>e.includes(t)).reduce((e,t)=>({...e,[t]:mutations[t]}),{}):{...mutations};export const handle=async(a,t)=>{let e=await a;return!e.err&&t&&await t(e.res),e};