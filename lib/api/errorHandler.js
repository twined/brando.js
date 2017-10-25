
function GraphQLAPIException (error) {
  this.message = error.message
  this.name = 'GraphQLAPIException'
  this.code = error.code
  this.error = parseChangeset(error.changeset)
}

function parseChangeset (changeset) {
  if (!changeset) {
    return ''
  }
  let e = ''
  console.log('parsing changeset')
  console.log(changeset.errors)
  for (let err in changeset.errors) {
    if (changeset.errors.hasOwnProperty(err)) {
      e = `${e}<br>${err} -> ${changeset.errors[err]}`
    }
  }
  return e
}

export function handleErr (err) {
  if (err.graphQLErrors && err.graphQLErrors.length) {
    const error = err.graphQLErrors[0]
    throw new GraphQLAPIException(error)
  } else {
    console.log(err)
  }
}
