import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'

class Upload extends Component {
    constructor(props){
        super(props)
        this.state = {
            category : [],
            cid : "",
            iname : "",
            picture : ""
        }
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handlePicChange = (e) =>{
        this.setState({ picture: e.target.files[0] });
    }

    getCategory = () =>{
        axios.get("http://127.0.0.1:5000/getCategory").then(res => {
            this.setState({
                category : res.data.categories
            })
        }).catch(error => alert(error))
    }

    componentDidMount = () =>{
        this.getCategory()
    }

    upload = (e) =>{
        e.preventDefault()
        let cid = this.state.cid
        let iname = this.state.iname
        let picture = this.state.picture
        const data = new FormData()
        data.append("picture",picture,picture.name)
        data.append("cid",cid)
        data.append("iname", iname)
        let token = localStorage.getItem("token")
        let isLoggedIn = localStorage.getItem("isLoggedIn")
        if(JSON.parse(token) != null && JSON.parse(isLoggedIn) === true){
            const tokenCheck = {
                headers : {Authorization : "Bearer "+JSON.parse(token), "content-type": "multipart/form-data"}
            }
            axios.post('http://127.0.0.1:5000/upload',data,tokenCheck).then
            (res =>{
                if(res.data.message === "Image Uploaded"){
                    swal(res.data.message,"welcome","success")
                }
                else{
                    swal(res.data,"try again","error")
                }
            }
            ).catch(error => swal(error,"try again","error"))
        }

        this.setState({
            cid:"",
            iname : "",
            picture: ""
        })
    }

    render() {
        return (
            <div className="container-fluid row justify-content-center">
                <div className="bgLogin mt-5">
                    <h3 className="text-center mt-1">Upload Image</h3>
                    <div className="mx-3">
                        <label className="ml-1 mt-2">Image Name</label>
                        <input className="form-control" onChange={this.handleChange} type="text" value={this.state.iname} name="iname" placeholder="Image Name" />
                    </div>
                    <div className="mx-3">
                        <label className="ml-1 mt-2">Image</label>
                        <input className="form-control" onChange={this.handlePicChange} type="file"  name="picture" />
                    </div>
                    <div className="mx-3">
                        <label className="ml-1 mt-2">Category</label>
                        <select className="custom-select" id="inputGroupSelect01" name="cid" value={this.state.cid} onChange={this.handleChange} >
                            <option defaultValue>Choose..</option>
                            {this.state.category.map(ele => (
                                <option key={ele.cid} value={ele.cid}>{ele.cname}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn mt-3 ml-3 mb-3" style = {{backgroundColor : "#D5BC3C"}} onClick={this.upload}>Upload</button>
                </div>
            </div>
        )
    }
}

export default Upload
