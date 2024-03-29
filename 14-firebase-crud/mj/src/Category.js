import React from 'react';
import { useState, useEffect } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { FormText, Table, Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { useForm } from "react-hook-form"
import config from './config';
import { format } from 'date-fns'
import { BsPlus, BsTrash, BsPencil } from "react-icons/bs"
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

if (firebase.apps.length === 0) {
    firebase.initializeApp(config);
}

const firestore = firebase.firestore()
const categoryRef = firestore.collection('category')
const journalRef = firestore.collection('money')

export default function Category() {
    const [categoryState, setCategoryState] = useState([])

    const { register, handleSubmit } = useForm()
    const [showForm, setShowForm] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [tempData, setTempData] = useState({
        id: null,
        createdAt: new Date(),
        description: '',
        name: ''
    })

    const query = categoryRef.orderBy('createdAt', 'asc').limitToLast(100)
    const [data] = useCollectionData(query, { idField: 'id' })

    const journalQuery = journalRef.orderBy('createdAt', 'asc')
    var [isDeleted, setIsDeleted] = useState(false);
    const [journalDatas] = useCollectionData(journalQuery, { idField: 'id' })

    console.log(journalDatas);

    useEffect(() => {
        if (data) {
            let mappedRowData = data.map((queryData, index) => {
                console.log(journalDatas);
                return (
                    <CategoryTableRow
                        data={queryData}
                        key={data[index].id}
                        id={data[index].id}
                        list={data[index]}
                        onDeleteClicked={onItemDeleteListener}
                        onEditClick={handleEditClick}
                    />
                )
            })
            setCategoryState(mappedRowData)
        }
    }, [data, journalDatas])

    const onSubmit = async (data, e) => {
        let preparedData = {
            description: data.description,
            name: data.name,
            createdAt: new Date()
        }
        if (isDeleted) {
        }

        if (editMode) {
            console.log('sss', JSON.stringify(journalDatas))
            console.log(data.id);

            if (journalDatas) {
                console.log('what?');
                console.log('id', data.id);

                journalDatas.forEach(async (x) => {
                    console.log('cate', x.category.id)
                    if (x.category.id === data.id) {
                        const temp = x;
                        console.log('ss', temp);
                        temp.category.name = data.name;
                        await journalRef.doc(x.id)
                            .set(temp)
                            .then(() => console.log("moneyRef has been set"))
                            .catch((error) => {
                                console.error("Error: ", error);
                                alert(error)
                            });
                    }
                })
            }

            await categoryRef.doc(data.id)
                .set(preparedData)
                .then(() => console.log("moneyRef has been set"))
                .catch((error) => {
                    console.error("Error: ", error);
                    alert(error)
                });
        } else {
            await categoryRef
                .add(preparedData)
                .then(() => console.log("New record has been added."))
                .catch((error) => {
                    console.error("Errror:", error)
                    alert(error)
                })
        }
        handleCloseForm()
    }

    const onItemDeleteListener = async (id, list, journals) => {
        if (window.confirm("Are you sure?")) {
            if (journalDatas) {
                journalDatas.forEach(async (x) => {
                    console.log('data id', list.id);
                    console.log('cate id', x.category.id)
                    if (x.category.id === list.id) {
                        const temp2 = x;
                        console.log('journalRef', journalRef);
                        temp2.category.id = "unknown";
                        temp2.category.name = "Uncategorised";
                        await journalRef.doc(x.id)
                            .set(temp2)
                            .then(() => console.log("moneyRef has been set"))
                            .catch((error) => {
                                console.error("Error: ", error);
                                alert(error)
                            });
                    }
                })
            }
            await categoryRef.doc(id).delete()
        }
    }

    const handleEditClick = (id, list) => {
        let preparedData = {
            id: id,
            description: list.description,
            name: list.name,
            createdAt: new Date(list.createdAt.seconds)
        }
        console.log("handleEditClick", preparedData)
        setTempData(preparedData)
        setEditMode(true)
        setShowForm(true)
    }

    const handleshowForm = () => setShowForm(true)
    const handleCloseForm = () => { setShowForm(false) }

    return (
        <div style={{ "marginTop": 1 + '%' }}>
            <Container>
                <Row>
                    <Col>
                        <h1 >Category Management</h1>
                        <Button variant="outline-dark" onClick={handleshowForm}>
                            <BsPlus /> Add
                </Button>
                    </Col>
                </Row>
                <div style={{ "marginTop": 3 + '%' }}>
                    <Table stickyheader="true" aria-label="sticky table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryState}
                        </tbody>
                    </Table>
                </div>

                <Modal
                    show={showForm} onHide={handleCloseForm}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="hidden"
                            placeholder="createdAt"
                            ref={register({ required: false })}
                            name="id"
                            id="id"
                            defaultValue={format(tempData.createdAt, "yyyy-MM-dd")}
                        />
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
                                {editMode ? "Edit Category" : "Add New Category"}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                    <label htmlFor="name">Name</label>
                                </Col>
                                <Col>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        ref={register({ required: true })}
                                        name="name"
                                        id="name"
                                        defaultValue={tempData.name}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label htmlFor="name">Description</label>
                                </Col>
                                <Col>
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        ref={register({ required: true })}
                                        name="description"
                                        id="description"
                                        defaultValue={tempData.description}
                                    />
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseForm}>
                                Close
                        </Button>
                            <Button variant={editMode ? "success" : "primary"} type="submit">
                                {editMode ? "Save Category" : "Add Category"}
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </Container>
        </div>
    )
}

function CategoryTableRow(props) {
    let data = props.data
    let id = props.id
    let list = props.list
    console.log(`props ${data}`)
    return (
        <tr>
            <td>
                <BsTrash onClick={() => props.onDeleteClicked(id, list)} />
                <BsPencil onClick={() => props.onEditClick(id, list)} />
            </td>
            <td>{data.name}</td>
            <td>{data.description}</td>
        </tr>
    )
}