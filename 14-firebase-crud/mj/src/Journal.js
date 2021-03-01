import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Select from 'react-select'
import { format } from 'date-fns'

// Firebase
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

if (firebase.apps.length === 0) {
    firebase.initializeApp({
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        databaseUrl: process.env.REACT_APP_DATABASE_URL,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APP_ID
    })
}
const firestore = firebase.firestore()
const auth = firebase.auth()


// const data = require('./sampleData.json')

const categories = [
    { id: 0, name: '-- All --' },
    { id: 1, name: 'Food' },
    { id: 2, name: 'Fun' },
    { id: 3, name: 'Transportation' },
]

export default function Journal() {
    const [records, setRecords] = useState([])
    const [total, setTotal] = useState(0)

    // Firebase stuff
    const moneyRef = firestore.collection('money');
    const query = moneyRef.orderBy('createdAt', 'asc').limitToLast(100);
    const [data] = useCollectionData(query, { idField: 'id' });


    console.log("REACT_APP_PROJECT_ID", process.env.REACT_APP_PROJECT_ID)

    // This will be run when 'data' is changed.
    useEffect(() => {
        console.log('useEffect', data)
        if (data) { // Guard condition
            let t = 0
            let r = data.map((d, i) => {
                console.log('useEffect', format(d.createdAt.toDate(), "yyyy-MM-dd"))
                t += d.amount
                return (
                    <JournalRow data={d} i={i} />
                )
            })

            setRecords(r)
            setTotal(t)
        }
    },
        [data])


    const handleCategoryFilterChange = (obj) => {
        console.log('filter', obj)
        if (data) { // Guard condition      
            let t = 0
            let filteredData = data.filter(d => obj.id == 0 || d.category.id == obj.id)
            let r = filteredData.map((d, i) => {
                console.log('filter', d)
                t += d.amount
                return (
                    <JournalRow data={d} i={i} />
                )
            })

            setRecords(r)
            setTotal(t)
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Journal</h1>
                </Col>
                <Col>
                    Category:
          <Select
                        options={categories}
                        getOptionLabel={x => x.name}
                        getOptionValue={x => x.id}
                        onChange={handleCategoryFilterChange}
                    />
                </Col>

            </Row>

            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date/Time</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {records}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>
                            <h2>Total: {total}</h2>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </Container>
    )
}

function JournalRow(props) {
    let d = props.data
    let i = props.i
    return (
        <tr>
            <td>{i + 1}</td>
            <td>{format(d.createdAt.toDate(), "yyyy-MM-dd")}</td>
            <td>{d.description}</td>
            <td>{d.category.name}</td>
            <td>{d.amount}</td>
        </tr>
    )
}