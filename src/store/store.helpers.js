import { deepGet, deepSet, isObject } from "../helpers"

const mutations = {
	PUSH: (state, [path, item]) => (deepGet(state, path).push(item)),
	CONCAT: (state, [path, items]) => {
		let arr = deepGet(state, path).concat(items)
		deepSet(state, path, arr)
	},
	UNSHIFT: (state, [path, item]) => (deepGet(state, path).unshift(item)),
	RESET: (state, initialState) => mutations.SET(state, initialState),
	SET: (state, payload) => {
		Object.entries(payload).forEach(
			([key, value]) => (state[key] = value)
		)
	},
	DELETE: (state, [path, key, match = 'id']) => {
		let keys = Array.isArray(key) ? key : [key]
		deepSet(state, path, deepGet(state, path).filter(
			el => !keys.includes(el[match])
		))
	},
	UPDATE: (state, [path, data, match = 'id']) => {
		deepSet(state, path, deepGet(state, path).map(el => {
			return el[match] === data[match] ? data : el
		}))
	},
	MERGE: (state, [property, data, match = 'id']) => {
		if (Array.isArray(state[property])) {
			data = Array.isArray(data) ? data : [data];
			const ids = state[property].map(p => p[match])
			const newElements = data.filter(el => !ids.includes(el[match]))
			state[property] = state[property].concat(newElements)
		}
		else if (isObject(state[property])) {
			state[property] = {
				...state[property],
				...data
			}
		}
	}
}

export const createMutations = (...names) => {
	if (!names.length) return { ...mutations }
	return Object
		.keys(mutations)
		.filter(name => names.includes(name))
		.reduce((m, a) => ({ ...m, [a]: mutations[a] }), {})
}

export const handle = async (a, t) => { let e = await a; return !e.err && t && await t(e.res), e };
