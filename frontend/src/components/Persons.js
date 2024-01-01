const Persons = (props) => {
    const personsToShow = props.persons.filter((p) => p.name.toLowerCase().includes(props.filter.toLowerCase()))

    return (
        <div>
            {
                personsToShow.map(x => <p key={x.id}>{x.name} {x.number}
                    <button onClick={() => props.destroy(x.id)}>delete</button></p>)
            }
        </div >
    )
}

export default Persons