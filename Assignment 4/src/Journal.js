import { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Select from 'react-select'
import { format } from 'date-fns'
import { BsPlus, BsTrash, BsPencil } from "react-icons/bs";
import { useForm } from "react-hook-form"
import config from './config';
import TextField from '@material-ui/core/TextField';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

if (firebase.apps.length === 0) {
    firebase.initializeApp(config);
}
const firestore = firebase.firestore()

export default function Journal() {
    const moneyRef = firestore.collection('money');
    const categoryRef = firestore.collection('category');
    const query = moneyRef.orderBy('createdAt', 'asc').limitToLast(100);

    const categoryQuery = categoryRef.orderBy('createdAt', 'asc').limitToLast(100);
    const [data] = useCollectionData(query, { idField: 'id' });
    const [categories] = useCollectionData(categoryQuery, { idField: 'id' });

    const [categoryOption, setCategoryOption] = useState([]);
    const [category, setCategory] = useState()
    const { register, handleSubmit } = useForm()
    const [showForm, setShowForm] = useState(false)
    const [records, setRecords] = useState([])
    const [total, setTotal] = useState(0)
    const [editMode, setEditMode] = useState(false)
    const [tempData, setTempData] = useState({
        id: null,
        createdAt: new Date(),
        description: '',
        amount: 0,
        category: categoryOption[0]
    })

    useEffect(() => {
        if (categories) { // Guard condition
            const tempCategories = [{ id: 0, name: '-- All -- ' }];
            categories.forEach((x) => {
                tempCategories.push({ id: x.id, name: x.name });
            })
            setCategoryOption(tempCategories);
        }
    }, [categories])

    useEffect(() => {
        if (data) {
            let t = 0
            let r = data.map((d, i) => {
                t += d.amount
                return (
                    <JournalRow
                        data={d}
                        i={i}
                        key={i}
                        onDeleteClick={handleDeleteClick}
                        onEditClick={handleEditClick}
                    />
                )
            })

            setRecords(r)
            setTotal(t)
        }
    }, [data])

    const handleCategoryFilterChange = (obj) => {
        if (data) {
            let t = 0
            let filteredData = data.filter(d => obj.id == 0 || d.category.id == obj.id)
            let r = filteredData.map((d, i) => {
                t += d.amount
                return (
                    <JournalRow data={d} i={i} onDeleteClick={handleDeleteClick}
                        onEditClick={handleEditClick} />
                )
            })

            setRecords(r)
            setTotal(t)
        }
    }

    const handleshowForm = () => setShowForm(true)

    const handleCloseForm = () => {
        setTempData({
            id: null,
            createdAt: new Date(),
            description: '',
            amount: 0,
            category: categoryOption[0]
        })
        setEditMode(false)
        setCategory({})
        setShowForm(false)
    }

    const onSubmit = async (data) => {
        let preparedData = {
            description: data.description,
            amount: parseFloat(data.amount),
            createdAt: new Date(data.createdAt),
            category: category
        }
        if (editMode) {
            await moneyRef.doc(data.id)
                .set(preparedData)
                .then(() => console.log("moneyRef has been set"))
                .catch((error) => {
                    console.error("Error: ", error);
                    alert(error)
                });
        } else {
            await moneyRef
                .add(preparedData)
                .then(() => console.log("New record has been added."))
                .catch((error) => {
                    console.error("Errror:", error)
                    alert(error)
                })
        }
        handleCloseForm()
    }

    const handleCategoryChange = (obj) => {
        setCategory(obj)
    }

    const handleDeleteClick = (id) => {
        if (window.confirm("Are you sure to delete this record?"))
            moneyRef.doc(id).delete()
    }

    const handleEditClick = (data) => {
        let preparedData = {
            id: data.id,
            description: data.description,
            amount: parseFloat(data.amount),
            createdAt: data.createdAt.toDate(),
            category: category
        }
        setEditMode(true)
        setTempData(preparedData)
        setCategory(data.category)
        setShowForm(true)
    }

    return (
        <div style={{"marginTop": 1 + '%'}}>
            <Container>
                <Row>
                    <Col>
                        <h1>Journal</h1>
                        <Button variant="outline-dark" onClick={handleshowForm}>
                            <BsPlus /> Add
                    </Button>
                    </Col>
                    <Col>
                        Category:
          <Select
                            options={categoryOption}
                            getOptionLabel={x => x.name}
                            getOptionValue={x => x.id}
                            onChange={handleCategoryFilterChange}
                        />
                    </Col>

                </Row>
                <div style={{"marginTop": 3 + '%'}}>
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records}
                    </tbody>
                    <tfooter>
                        <td colSpan={5}>
                            <h3>Total: {total}</h3>
                        </td>
                    </tfooter>
                </Table>
                </div>

                <Modal
                    show={showForm} onHide={handleCloseForm}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="hidden"
                            placeholder="ID"
                            ref={register({ required: false })}
                            name="id"
                            id="id"
                            defaultValue={tempData.id}
                        />
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {editMode ? "Edit Record" : "Add New Record"}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                    <label htmlFor="createdAt">Date</label>
                                </Col>
                                <Col>
                                    <input
                                        type="date"
                                        placeholder="Date"
                                        ref={register({ required: true })}
                                        name="createdAt"
                                        id="createdAt"
                                        defaultValue={format(tempData.createdAt, "yyyy-MM-dd")}
                                    />

                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <label htmlFor="category">Category</label>
                                </Col>
                                <Col>
                                    <Select
                                        id="category"
                                        name="category"
                                        value={category}
                                        placeholder="Category"
                                        options={categoryOption.filter(c => c.id != 0)}
                                        onChange={handleCategoryChange}
                                        getOptionLabel={x => x.name}
                                        getOptionValue={x => x.id}
                                        ref={register}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <label htmlFor="description">Description</label>
                                </Col>
                                <Col>
                                    {
                                        
                                    }
                                    <TextField id="standard-basic" label="Standard" inputRef={register({ required: true })} name="description" />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label htmlFor="amount">Amount</label>
                                </Col>
                                <Col>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="Amount"
                                        ref={register({ required: true })}
                                        name="amount"
                                        id="amount"
                                        defaultValue={tempData.amount}
                                    />
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseForm}>
                                Close
                        </Button>
                            <Button onClick={onModalFormSubmit(editMode, handleSubmit, onSubmit)} variant={editMode ? "success" : "primary"} type="submit">
                                {editMode ? "Save Record" : "Add Record"}
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </Container>
        </div>
    )
}

function onModalFormSubmit(editMode, handleSubmit, onSubmit) {
    console.log("modal click", "modal clicked")
    console.log(editMode.toString(), editMode.toString())
    handleSubmit(onSubmit)
}

function JournalRow(props) {
    let d = props.data
    let i = props.i
    return (
        <tr>
            <td>
                <BsTrash onClick={() => props.onDeleteClick(d.id)} />
                <BsPencil onClick={() => props.onEditClick(d)} />
            </td>
            <td>{format(d.createdAt.toDate(), "yyyy-MM-dd")}</td>
            <td>{d.description}</td>
            <td>{d.category.name}</td>
            <td>{d.amount}</td>
        </tr>
    )
}