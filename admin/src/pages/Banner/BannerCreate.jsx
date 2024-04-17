import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar'

function BannerCreate() {

    const navigate = useNavigate();

    const url = 'https://localhost:7012';

    const [banner, setBanner] = useState([]);
    const [image, setImage] = useState();
    const [showImage, setShowImage] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isTitleEmpty, setIsTitleEmpty] = useState(false);
    const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);

    //Setting Authorization Token in Request Headers using Bearer Authentication
    let token = JSON.parse(localStorage.getItem("token"));

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };



    //Retrieves all banner data from the API.
    const getAllBanner = async () => {
        try {
            const response = await axios.get(`${url}/api/banner/GetAll`);
            setBanner(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        getAllBanner();
    }, []);

    const newBanner = {
        photo: image,
        title: title,
        description: description
    };


    //Create Banner


    const CreateBanner = async (e) => {
        e.preventDefault();

        if (title.trim() === '') {
            setIsTitleEmpty(true);
            return;
        }

        if (description.trim() === '') {
            setIsDescriptionEmpty(true);
            return;
        }

        const formData = new FormData();
        for (const [key, value] of Object.entries(newBanner)) {
            formData.append(key, value);
        };

        await axios.post(`${url}/api/Banner/Create`, formData, config, {
            headers: {
                Accept: "*/*"
            }
        })
            .then((res) => {
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Banner Created',
                    showConfirmButton: false,
                    timer: 1500
                });
                console.log(res);
                navigate('/banner');
            })
            .catch((err) => {
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: 'Banner not Created',
                    showConfirmButton: false,
                    timer: 1500
                });
                console.log(err);
                navigate('/bannerCreate');
            });


    };

    //File Upload Handler: Setting Image and Displaying Preview
    const fileUploadHandler = async (e) => {
        const files = e.target.files[0];
        setImage(files);
        setShowImage(URL.createObjectURL(files));
    };

    return (
        <>
            <div className='d-flex'>

                <div className='col-2'>

                    <Sidebar />

                </div>


                <div className='col-10'>

                    <div className="create-btn-area container" style={{ maxWidth: "500px" }}>
                        <h2 className='my-5' style={{ textAlign: "center" }}>Create Banner</h2>
                        <Form onSubmit={(e) => CreateBanner(e)}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <p>Image</p>
                                {
                                    showImage !== null ?
                                        <img
                                            style={{
                                                width: "200px",
                                                height: "100px",
                                                marginBottom: "10px",
                                                borderRadius: "unset",
                                            }}
                                            src={showImage}
                                            alt="header image"
                                        /> : null
                                }
                                <Form.Control
                                    type="file"
                                    required
                                    onChange={(e) => fileUploadHandler(e)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Title"
                                    required
                                    onFocus={(e) => e.target.placeholder = ''}
                                    onBlur={(e) => e.target.placeholder = 'Enter Title'}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Description"
                                    required
                                    onFocus={(e) => e.target.placeholder = ''}
                                    onBlur={(e) => e.target.placeholder = 'Enter Description'}

                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>

                            <Button variant="outline-primary" type="submit">
                                Create
                            </Button>
                            <Link to="/banner">
                                <Button variant="outline-dark" type="submit" className='mx-2'>
                                    Cancel
                                </Button>
                            </Link>
                        </Form>
                    </div>



                </div>


            </div>




        </>
    )
}

export default BannerCreate