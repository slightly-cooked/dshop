import React, { useEffect } from 'react'

import { formInput, formFeedback } from 'utils/formHelpers'
import useConfig from 'utils/useConfig'
import useSetState from 'utils/useSetState'

import Tabs from './_Tabs'

function validate(state) {
  const newState = {}

  if (!state.name) {
    newState.nameError = 'Enter a name'
  }
  if (!state.email) {
    newState.emailError = 'Enter an email'
  }
  if (!state.password) {
    newState.passwordError = 'Enter a password'
  }
  if (!state.role) {
    newState.roleError = 'Select a role'
  }

  const valid = Object.keys(newState).every((f) => f.indexOf('Error') < 0)

  return { valid, newState: { ...state, ...newState } }
}

const AdminUsers = () => {
  const { config } = useConfig()
  const [state, setState] = useSetState({ loading: false, users: [] })

  const loadUsers = () => {
    fetch(`${config.backend}/shop/users`, {
      headers: {
        authorization: `bearer ${config.backendAuthToken}`,
        'content-type': 'application/json'
      },
      credentials: 'include'
    }).then(async (res) => {
      if (res.ok) {
        const json = await res.json()
        setState({
          loading: false,
          users: json.users,
          name: undefined,
          email: undefined,
          password: undefined
        })
      }
    })
  }

  useEffect(() => {
    setState({ loading: true })
    loadUsers()
  }, [])

  const input = formInput(state, (newState) => setState(newState))
  const Feedback = formFeedback(state)

  return (
    <>
      <h3 className="admin-title">Settings</h3>
      <Tabs />
      {state.loading ? (
        'Loading...'
      ) : (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {state.users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <form
        className="d-flex flex-wrap align-items-start"
        onSubmit={(e) => {
          e.preventDefault()
          const { valid, newState } = validate(state)
          setState(newState)
          if (!valid) {
            return
          }
          fetch(`${config.backend}/shop/add-user`, {
            method: 'POST',
            headers: {
              authorization: `bearer ${config.backendAuthToken}`,
              'content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              name: state.name,
              email: state.email,
              password: state.password,
              role: state.role
            })
          }).then(async (res) => {
            if (res.ok) {
              await res.json()
              loadUsers()
            }
          })
        }}
      >
        <div className="form-group mr-sm-2">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            {...input('name')}
          />
          {Feedback('name')}
        </div>
        <div className="form-group mr-sm-2">
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            {...input('email')}
          />
          {Feedback('email')}
        </div>
        <div className="form-group mr-sm-2">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            {...input('password')}
          />
          {Feedback('password')}
        </div>
        <div className="form-group mr-sm-2">
          <select className="form-control" {...input('role')}>
            <option>Role...</option>
            <option>Admin</option>
            <option>Basic </option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mb-2">
          Add User
        </button>
      </form>
    </>
  )
}

export default AdminUsers
