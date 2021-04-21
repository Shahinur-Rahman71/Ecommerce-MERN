import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import Loading from '../../mainPages/utils/loading/Loading'
import { useHistory, useParams } from 'react-router-dom'

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: '',
    content: '',
    category: '',
    _id: ''
}

const CreateProduct = () => {
    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [categories] = state.categoriesAPI.categories
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token;


    const history = useHistory()
    const param = useParams()
    const [products] = state.productsAPI.products
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            products.forEach(product => {
                if (product._id === param.id) {
                    setProduct(product)
                    setImages(product.images)
                }
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)
        }
    }, [param.id, products])

    const uploadStyle = {
        display: images ? "block" : "none"
    }

    const handleUploader = async (e) => {
        e.preventDefault();
        try {
            if (!isAdmin) return alert("You are not an admin");
            const file = e.target.files[0]
            //console.log(file)

            if (!file)
                return alert("File does't exist.")

            if (file.size > 1024 * 1024) // 1mb
                return alert("File size is too large.")

            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return alert("File format is incurrect")

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            setLoading(false)
            setImages(res.data)

        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    const handleDestroy = async () => {
        try {
            if (!isAdmin) return alert("You are not an admin");
            setLoading(true)
            await axios.post('/api/destroy', { public_id: images.public_id }, {
                headers: { Authorization: token }
            })

            setLoading(false)
            setImages(false)
        } catch (error) {
            alert(error.response.data.msg)
        }


    }

    const ChangeInputHandler = async (e) => {
        const { name, value } = e.target;

        setProduct({ ...product, [name]: value })
    }

    const summitHandler = async (e) => {
        e.preventDefault()
        try {
            if (!isAdmin) return alert("You are not an admin");
            if (!images) return alert("No Image Upload");

            if (onEdit) {
                await axios.put(`/api/products/${product._id}`, { ...product, images }, {
                    headers: { Authorization: token }
                })
            } else {
                await axios.post('/api/products', {...product, images}, {
                    headers: {Authorization: token}
                })
            }


            setCallback(!callback)
            history.push('/')

        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUploader} />
                {
                    loading ? <div id="file_img"> <Loading /></div>
                        : <div id="file_img" style={uploadStyle}>
                            <img src={images ? images.url : ''} alt="??" />
                            <span onClick={handleDestroy}>X</span>
                        </div>
                }

            </div>

            <form onSubmit={summitHandler}>
                <div className="row">
                    <label htmlFor="product_id">Product ID</label>
                    <input type="text" name="product_id" id="product_id" required
                        value={product.product_id} onChange={ChangeInputHandler} disabled={onEdit} />
                </div>

                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required value={product.title} onChange={ChangeInputHandler} />
                </div>

                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" required value={product.price} onChange={ChangeInputHandler} />
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                        value={product.description} rows="5" onChange={ChangeInputHandler} />
                </div>

                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name="content" id="content" required
                        value={product.content} rows="5" onChange={ChangeInputHandler} />
                </div>

                <div className="row">
                    <label htmlFor="categories">Categories </label>
                    <select name="category" value={product.category} onChange={ChangeInputHandler}>
                        <option value="">select a category</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <button type="submit" >{onEdit ? "Update" : "Create"}</button>

            </form>
        </div>
    );
};

export default CreateProduct;