export const snapShotToArray = snapShot => {
	let data = []
	snapShot.forEach(doc => {
		data.push({
			id: doc.id,
			ref: doc.ref,
			...doc.data()
		})
	})
	return data
}

export const isEmpty = t => !![void 0, null, ""].includes(t) || (!(!Array.isArray(t) || t.length) || !(!isObject(t) || Object.keys(t).length)); export const deepGet = (t, e) => { let r; for (e = e.split("."), r = 0; r < e.length; r++)t = t[e[r]]; return t }; export const deepSet = (t, e, r) => { let o; for (e = e.split("."), o = 0; o < e.length - 1; o++)t = t[e[o]]; t[e[o]] = r }; export const only = (t, e) => e.reduce((e, r) => { if (!r) return e; const o = r.split("."); return has(t, r) ? e[r] = t[r] : o.length > 1 && has(t, o[0]) && (e[o[0]] = only(t[o[0]], o.slice(1).join(".").split(","))), e }, {}); export const has = (t, e) => Object.prototype.hasOwnProperty.call(t, e); export const isObject = t => "[object Object]" === Object.prototype.toString.call(t); export const handle = async (t, e) => { try { let r = await t; return e && (r = await e(r)), { res: r } } catch (t) { return { err: t } } }; export const sleep = (t, e) => new Promise(r => { setTimeout(() => r(), "s" === e ? 1e3 * t : "m" === e ? 60 * t * 1e3 : "h" === e ? 60 * t * 60 * 1e3 : t) });