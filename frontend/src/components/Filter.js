const Filter = (props) => {
  return (
    <form>
      filter shown with
      <input value={props.value} onChange={props.onChange}></input>
    </form>
  )
}

export default Filter
