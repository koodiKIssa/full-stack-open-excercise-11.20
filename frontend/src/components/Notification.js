const Notification = ({ message }) => {
  const color = () =>
    message === null
      ? null
      : message.includes('remove') || message.includes('failed')
      ? 'red'
      : 'green'

  const style = {
    color: color(),
    background: 'lightgrey',
    fontSize: 20,
    border: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null
  }

  return <div style={style}>{message}</div>
}

export default Notification
