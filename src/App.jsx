import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { createGlobalStyle } from 'styled-components'
import { addContact, removeContact, updateContact } from './store/contactsSlice'

const GlobalStyle = createGlobalStyle`
  :root {
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
    line-height: 1.4;
    font-weight: 400;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    color: #192028;
    background:
      radial-gradient(circle at 10% 10%, #f9e8d5 0 16%, transparent 17%),
      radial-gradient(circle at 95% 85%, #f0f7ff 0 16%, transparent 17%),
      linear-gradient(160deg, #fefcf8, #f8f9ff 60%, #fefefe);
  }
`

const Page = styled.main`
  width: min(980px, 100% - 2rem);
  margin: 2rem auto;
`

const Header = styled.header`
  margin-bottom: 1.5rem;

  h1 {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    letter-spacing: 0.02em;
  }

  p {
    margin: 0.25rem 0 0;
    color: #3d4b5b;
  }
`

const Grid = styled.section`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 860px) {
    grid-template-columns: 320px 1fr;
  }
`

const Card = styled.article`
  background: #ffffffcc;
  border: 1px solid #d9e2eb;
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 10px 20px #06193414;
`

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
`

const Field = styled.label`
  display: grid;
  gap: 0.35rem;
  color: #1e2a35;
  font-weight: 600;

  input {
    border: 1px solid #b7c5d3;
    border-radius: 10px;
    padding: 0.65rem 0.75rem;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s ease;
  }

  input:focus {
    border-color: #2e7dd7;
  }
`

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const Button = styled.button`
  border: none;
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  background: #236bb8;

  &:hover {
    filter: brightness(1.08);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const GhostButton = styled(Button)`
  background: #eff4fa;
  color: #223548;
`

const DangerButton = styled(Button)`
  background: #b93145;
`

const ContactList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.7rem;
`

const ContactItem = styled.li`
  border: 1px solid #d8e1eb;
  border-radius: 12px;
  padding: 0.75rem;
  background: #fff;

  h3 {
    margin: 0;
    font-size: 1.05rem;
  }

  p {
    margin: 0.25rem 0;
    color: #3e4d5c;
  }
`

const EmptyState = styled.p`
  margin: 0;
  color: #55697d;
`

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
}

const PHONE_DIGITS_LENGTH = 11
const PHONE_MASK_LENGTH = 14

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, PHONE_DIGITS_LENGTH)

  if (!digits) {
    return ''
  }

  if (digits.length <= 2) {
    return `(${digits}`
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)})${digits.slice(2)}`
  }

  return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`
}

function App() {
  const contacts = useSelector((state) => state.contacts.items)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)

  const isEditing = useMemo(() => editingId !== null, [editingId])

  const onChangeField = (event) => {
    const { name, value } = event.target

    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingId(null)
  }

  const onSubmit = (event) => {
    event.preventDefault()

    const phoneDigits = formData.phone.replace(/\D/g, '')

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formatPhone(phoneDigits),
    }

    if (!payload.fullName || !payload.email || phoneDigits.length !== PHONE_DIGITS_LENGTH) {
      return
    }

    if (isEditing) {
      dispatch(updateContact({ id: editingId, ...payload }))
    } else {
      dispatch(addContact(payload))
    }

    resetForm()
  }

  const onEdit = (contact) => {
    setEditingId(contact.id)
    setFormData({
      fullName: contact.fullName,
      email: contact.email,
      phone: formatPhone(contact.phone),
    })
  }

  return (
    <>
      <GlobalStyle />
      <Page>
        <Header>
          <h1>Lista de Contatos</h1>
        </Header>

        <Grid>
          <Card>
            <Form onSubmit={onSubmit}>
              <Field>
                Nome completo
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={onChangeField}
                  placeholder="Ex.: Maria Silva"
                />
              </Field>

              <Field>
                E-mail
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onChangeField}
                  placeholder="maria@email.com"
                />
              </Field>

              <Field>
                Telefone
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={onChangeField}
                  inputMode="numeric"
                  maxLength={PHONE_MASK_LENGTH}
                  pattern="\([0-9]{2}\)[0-9]{5}-[0-9]{4}"
                  placeholder="(11)99999-9999"
                />
              </Field>

              <ButtonRow>
                <Button type="submit">{isEditing ? 'Salvar edição' : 'Adicionar contato'}</Button>
                {isEditing && (
                  <GhostButton type="button" onClick={resetForm}>
                    Cancelar
                  </GhostButton>
                )}
              </ButtonRow>
            </Form>
          </Card>

          <Card>
            {contacts.length === 0 ? (
              <EmptyState>Nenhum contato cadastrado até o momento.</EmptyState>
            ) : (
              <ContactList>
                {contacts.map((contact) => (
                  <ContactItem key={contact.id}>
                    <h3>{contact.fullName}</h3>
                    <p>{contact.email}</p>
                    <p>{formatPhone(contact.phone)}</p>
                    <ButtonRow>
                      <GhostButton type="button" onClick={() => onEdit(contact)}>
                        Editar
                      </GhostButton>
                      <DangerButton
                        type="button"
                        onClick={() => dispatch(removeContact(contact.id))}
                      >
                        Excluir
                      </DangerButton>
                    </ButtonRow>
                  </ContactItem>
                ))}
              </ContactList>
            )}
          </Card>
        </Grid>
      </Page>
    </>
  )
}

export default App
