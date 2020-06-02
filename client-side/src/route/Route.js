import React,{useEffect} from 'react'
import {Switch, Route,Link} from 'react-router-dom'
import Auth from '../auth/Auth'
import Home from '../components/Home'
import Upload from '../components/Upload'
import {signout,login} from '../redux/Action'
import { connect } from "react-redux"
import Report from '../components/Report'


function Routes(props){
    useEffect(() => {
        let username = localStorage.getItem('user')
        let user_type = localStorage.getItem("user_type")
        // console.log(username)
        if(localStorage.getItem('user') != null){
            if(user_type === "Normal"){
                props.login({"isloggedIn":true,"user":username,"user_type":user_type,"nav_type":false})
            }else{
                props.login({"isloggedIn":true,"user":username,"user_type":user_type,"nav_type":true})
            }
            
        }
    });

    const handleclick = ()=>{
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem("isLoggedIn")
            localStorage.setItem("isLoggedIn",false)
            props.signout(false)
        }

        return (
            <div>
                {props.nav_type ? (
                    <nav className="navbar navbar-expand-lg" style={{backgroundColor : "#D5BC3C"}} >
                        <h3 className="navbar-brand text-white" >Assignment -  {props.user_type} User Login</h3>
                        <button className="navbar-toggler btn-success" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav float-left mr-auto">
                                <li className="nav-item active ml-3 ">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="nav-item active ml-3 ">
                                    <Link to="/downloads">Download Report</Link>
                                </li>
                                <li className="nav-item active ml-3 ">
                                    <Link to="/upload">Upload</Link>
                                </li>
                            </ul>
                            <div className="ml-auto text-white">Hello {props.user}!</div>
                            {props.isloggedIn ? (
                                <div className="ml-auto">
                                    <button className = "btn btn-info m-2" onClick={handleclick}>Sign off</button>
                                </div> 
                                ):(
                                    <div className="ml-auto">
                                        <Link to="/auth" className = "btn btn-info">Sign In</Link>
                                    </div> 
                                )}
                        </div>
                    </nav>
                ):(
                    <nav className="navbar navbar-expand-lg" style={{backgroundColor : "#D5BC3C"}} >
                        <h3 className="navbar-brand text-white" >Assignment -  {props.user_type} User Login</h3>
                        <div className=" navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav float-left">
                                <li className="nav-item active ml-3 ">
                                    <Link to="/">Home</Link>
                                </li>
                            </ul>
                            <div className="ml-auto text-white">Hello {props.user}!</div>
                            {props.isloggedIn ? (
                                <div className="ml-auto">
                                    <button className = "btn btn-info m-2" onClick={handleclick}>Sign off</button>
                                </div> 
                                ):(
                                    <div className="ml-auto">
                                        <Link to="/auth" className = "btn btn-info">Sign In</Link>
                                    </div> 
                                )}
                        </div>
                    </nav>
                )}
                
                <Switch>
                    <Route path="/" exact component = {Home} />
                    <Route path="/auth" exact component = {Auth} />
                    <Route path="/upload" exact component = {Upload} />
                    <Route path="/downloads" exact component = {Report} />
                </Switch>
            </div>
        )
}

const mapStateToProps = state => ({
    user: state.user,
    isloggedIn : state.isloggedIn,
    user_type : state.user_type,
    nav_type : state.nav_type
});
  
const mapDispatchToProps = dispatch => ({
    signout: payload => dispatch(signout(payload)),
    login: payload => dispatch(login(payload))
});

export default connect(mapStateToProps,mapDispatchToProps) (Routes)
