import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
	items: [
		{
			id: nanoid(),
			fullName: 'Ana Costa',
			email: 'ana.costa@email.com',
			phone: '(11)98888-7777',
		},
	],
}

const contactsSlice = createSlice({
	name: 'contacts',
	initialState,
	reducers: {
		addContact: {
			reducer: (state, action) => {
				state.items.push(action.payload)
			},
			prepare: ({ fullName, email, phone }) => ({
				payload: {
					id: nanoid(),
					fullName,
					email,
					phone,
				},
			}),
		},
		removeContact: (state, action) => {
			state.items = state.items.filter((contact) => contact.id !== action.payload)
		},
		updateContact: (state, action) => {
			const { id, fullName, email, phone } = action.payload
			const contactIndex = state.items.findIndex((contact) => contact.id === id)

			if (contactIndex !== -1) {
				state.items[contactIndex] = {
					...state.items[contactIndex],
					fullName,
					email,
					phone,
				}
			}
		},
	},
})

export const { addContact, removeContact, updateContact } = contactsSlice.actions
export default contactsSlice.reducer
