import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import {login} from '../redux/Action'
import { connect } from "react-redux"

class Auth extends Component{
    constructor(props){
        super(props)
        this.state = {
            name : "",
            email : "",
            username : "",
            password : "",
            user_type : "",
            username_login : "",
            password_login : ""
        }
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    signUp = (e) =>{
        e.preventDefault()
        let name = this.state.name
        let email = this.state.email
        let password = this.state.password
        let username = this.state.username
        let user_type = this.state.user_type
        axios.post('http://127.0.0.1:5000/auth/signup',{
                "name" : name,
                "email" : email,
                "password" : password,
                "username" : username,
                "user_type" : user_type
        }).then
            (res =>{
                if(res.data.message === "Email Already exist"){
                    swal(res.data.message,"try again","error")
                }
                else if(res.data.message === "user created"){
                    swal(res.data.message,"welcome","success")
                }
                else{
                    swal(res.data,"try again","error")
                }
            }
        ).catch(error => swal(error))
    
        this.setState({
            name : "",
            email : "",
            password : "",
            username: "",
            user_type : ""
        })
    }

    signIn = (e) =>{
        e.preventDefault()
        let username_login = this.state.username_login
        let password_login = this.state.password_login
        axios.post('http://127.0.0.1:5000/auth/signin',{
                "username" : username_login,
                "password" : password_login
        }).then
            (res =>{
                // console.log(res)
                if(res.data.message === "Login Successful"){
                    localStorage.setItem("token",JSON.stringify(res.data.token))
                    localStorage.setItem("isLoggedIn",true)
                    localStorage.setItem("user",res.data.name)
                    localStorage.setItem("user_type",res.data.user_type)
                    if(res.data.user_type === "Normal"){
                        this.props.login({"isloggedIn":true,"user":res.data.name,"user_type":res.data.user_type,"nav_type":false})
                    }
                    else if(res.data.user_type === "Contributor"){
                        this.props.login({"isloggedIn":true,"user":res.data.name,"user_type":res.data.user_type,"nav_type":true})
                    }

                    swal(res.data.message,"welcome","success")
                    
                }
                else if(res.data.message === "Email Doesn't Exist"){
                    swal(res.data.message,"Make Account","error")
                }
                else if(res.data.message === "Wrong Credentials"){
                    swal(res.data.message,"try again","error")
                }
                else{
                    localStorage.removeItem("token")
                    localStorage.removeItem("isLoggedIn")
                    localStorage.setItem("isLoggedIn",false)
                    swal(res.data,"try again","error")
                }
        }).catch(error => swal(error))

        this.setState({
            username_login : "",
            password_login : ""
        })
    }

    render(){
        return(
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md">
                        <div className="bgLogin mt-5">
                            <h3 className="text-center mt-1">Sign up</h3>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Name</label>
                                <input className="form-control" onChange={this.handleChange} type="text" value={this.state.name} name="name" placeholder="Name" />
                            </div>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Email</label>
                                <input className="form-control" onChange={this.handleChange} type="email" value={this.state.email} name="email" placeholder="Email" />
                            </div>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Username</label>
                                <input className="form-control" onChange={this.handleChange} type="text" value={this.state.username} name="username" placeholder="Username" />
                            </div>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Password</label>
                                <input className="form-control" onChange={this.handleChange} type="password" value={this.state.password} name="password" placeholder="Password" />
                            </div>
                            <div className="mx-3 mt-2">
                                <input type="radio" className="ml-1 mt-2" checked={this.state.user_type === "Normal"} onChange={this.handleChange} name="user_type" value="Normal" />
                                <label for="Normal">Normal User</label><br />
                                <input type="radio" className="ml-1 mt-2" checked={this.state.user_type === "Contributor"} onChange={this.handleChange} name="user_type" value="Contributor" />
                                <label for="Contributor">Contributor</label><br />
                            </div>
                            <button className="btn btn-primary mt-3 ml-3 mb-3" onClick={this.signUp}>Sign Up</button>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="bgLogin mt-5">
                            <h3 className="text-center mt-1">Login</h3>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Username</label>
                                <input className="form-control" onChange={this.handleChange} type="text" value={this.state.username_login} name="username_login" placeholder="Enter username" />
                            </div>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Password</label>
                                <input className="form-control" onChange={this.handleChange} type="password" value={this.state.password_login} name="password_login" placeholder="Enter password" />
                            </div>
                            <button className="btn btn-primary mt-3 ml-3 mb-3" onClick={this.signIn}>Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isloggedIn : state.isloggedIn
});

const mapDispatchToProps = dispatch => ({
    login: payload => dispatch(login(payload)),
})

export default connect(mapStateToProps,mapDispatchToProps) (Auth)