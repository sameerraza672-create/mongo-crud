import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { data, Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import axios from "axios"
import { useEffect, useState } from 'react';

const Blog = () => {


    const [allBlogs, setAllBlogs] = useState([])
    const [selectedBlog, setSelectedBlog] = useState(null)
    const API_URL = import.meta.env.VITE_NODE_ENV === "development"
        ? import.meta.env.VITE_LOCAL_URL
        : import.meta.env.VITE_LIVE_URL

    const schema = z.object({
        tital: z.string().min(3),
        desc: z.string().min(3, 'Minimum 3 characters'),
        hero: z.string().min(3, 'Minimum 3 characters').url(),
    });

    const { handleSubmit, register, reset, formState: { errors, touchedFields } } = useForm({
        resolver: zodResolver(schema)
    });

    const handleFormSubmit = (blogData) => {
        try {
            console.log(blogData);
            if (selectedBlog) {
                modifyBlog(selectedBlog._id, blogData)
                reset({ title: "", desc: "", hero: "" });
                setSelectedBlog(null)
            } else {
                createBlog(blogData)
                reset();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClasses = (key) => clsx({
        'form-control my-2': true,
        'is-invalid': errors[key],
        'is-valid': touchedFields[key] && !errors[key],
    });

    const createBlog = async blogData => {
        try {
            await axios.post(`${API_URL}/create`, blogData)
            toast.success("Blog create success")
            readBlog()

        } catch (error) {
            console.log(error);
            toast.error("smothing went worong")


        }
    }

    const readBlog = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/blog`)
            console.log(data);
            setAllBlogs(data.result)

            // toast.success("Blog read success")

        } catch (error) {
            console.log(error);
            toast.error("smothing went worong")
        }
    }

    const removeBlog = async id => {
        try {
            await axios.delete(`${API_URL}/remove/${id}`)
            toast.success("Blog remove success")
            readBlog()

        } catch (error) {
            console.log(error);
            toast.error("smothing went worong")
        }
    }

    const modifyBlog = async (id, blogData) => {
        try {
            await axios.put(`${API_URL}/modify/${id}`, blogData)
            toast.success("Blog update success")
            readBlog()

        } catch (error) {
            console.log(error);
            toast.error("smothing went worong")
        }
    }


    useEffect(() => {
        readBlog()
    }, [])
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-6 offset-sm-3">
                    <div className="card">
                        <div className="card-header">Blog CRUD</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit(handleFormSubmit)}>
                                <div>
                                    <label htmlFor="tital" className="form-label">tital</label>
                                    <input
                                        type="text"
                                        {...register('tital')}
                                        className={handleClasses('tital')}
                                        id="tital"
                                        placeholder="Enter Your tital"
                                    />
                                    <div className="invalid-feedback">{errors.tital?.message}</div>
                                </div>

                                <div className="mt-2">
                                    <label htmlFor="desc" className="form-label">desc</label>
                                    <input
                                        type="desc"
                                        {...register('desc')}
                                        className={handleClasses('desc')}
                                        id="desc"
                                        placeholder="Enter Your desc"
                                    />
                                    <div className="invalid-feedback">{errors.desc?.message}</div>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="hero" className="form-label">hero</label>
                                    <input
                                        type="hero"
                                        {...register('hero')}
                                        className={handleClasses('hero')}
                                        id="hero"
                                        placeholder="Enter Your hero"
                                    />
                                    <div className="invalid-feedback">{errors.hero?.message}</div>
                                </div>

                                {
                                    selectedBlog
                                        ? <div>
                                            <button type="submit" className="btn btn-warning w-100 mt-3">
                                                Update BLOG  </button>

                                            <button onClick={() => {
                                                reset({ title: "", desc: "", hero: "" })
                                                setSelectedBlog(null)
                                                //     reset//onClick={() => {
                                                // reset({ title: "", desc: "", hero: "" })
                                                // setSelectedBlog(null)
                                            }} type="submit" className="btn btn-outline-secondary w-100 mt-3">
                                                Cancel  </button>
                                        </div>
                                        : <button type="button" className="btn btn-primary w-100 mt-3">
                                            Create BLOG
                                        </button>
                                }

                            </form>

                            <p className="text-center mt-3">
                                Don't have an account? <Link to="/register">Create Account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {
                allBlogs && <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>title</th>
                            <th>desc</th>
                            <th>hero</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBlogs.map(item => <tr>
                            <td>{item._id}</td>
                            <td>{item.title}</td>
                            <td>{item.desc}</td>
                            <td>
                                <img src={item.hero} height={100} alt="" />
                            </td>
                            <td>
                                <button onClick={() => {
                                    reset(item)
                                    setSelectedBlog(item)

                                }} >Edit</button>
                                <button onClick={() => removeBlog(item._id)} >Remove</button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            }
        </div>
    );
};


export default Blog;