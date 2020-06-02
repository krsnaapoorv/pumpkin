import React, { Component } from 'react'
import axios from 'axios'

class Report extends Component {
    constructor(props){
        super(props)
        this.state = {
            pictures : [],
            duplicate : [],
            pageCount : ""
        }

    }

    componentDidMount = () => {
        let token = localStorage.getItem("token")
        let isLoggedIn = localStorage.getItem("isLoggedIn")
        if(JSON.parse(token) != null && JSON.parse(isLoggedIn) === true){
            const tokenCheck = {
                headers : {Authorization : "Bearer "+JSON.parse(token)}
            }
            axios.post("http://127.0.0.1:5000/myReport",{
                "clickVal" : 0
            },tokenCheck).then(res => {
                let l = res.data.page_count
                let count_page = Math.ceil(l/2)
                this.setState({
                    pictures : res.data.report,
                    duplicate : res.data.report,
                    pageCount : count_page
                })
            }).catch(error => alert(error))
        }
    }

    next = (i) =>{
        let token = localStorage.getItem("token")
        const tokenCheck = {
            headers : {Authorization : "Bearer "+JSON.parse(token)}
        }
        axios.post("http://127.0.0.1:5000/myReport",{
            "clickVal" : i-1
        },tokenCheck).then(res => {
            this.setState({
                duplicate : res.data.report,
            })
        }).catch(error => alert(error))
    }

    render() {
        let pages = []
        for(let i = 0; i < this.state.pageCount; i++){
            pages.push(<li className="page-item"><a className="page-link" onClick={() => this.next(i+1)}>{i+1}</a></li>)
        }
        return (
            <div className="container-fluid">
                <h1 className="text-center">Download Report</h1>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Image Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Total Downloads</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.duplicate.map(ele =>{
                            return(<tr>
                                <td>{ele.iname}</td>
                                <td>{ele.cname}</td>
                                <td>{ele.total_downloads}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
                <br></br>
                <div className="row justify-content-center">
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            {pages}
                        </ul>
                    </nav>
                </div>
            </div>
        )
    }
}

export default Report
